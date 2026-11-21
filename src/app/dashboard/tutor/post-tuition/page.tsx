
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { authClient } from "@/lib/auth-client";
import {
    Upload,
    Image as ImageIcon,
    X,
    Loader2,
    ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type TuitionFormData = {
    title: string;
    subject: string;
    classLevel: string;
    mode: "Online" | "Offline";
    location: string;
    monthlyFee: number;
    daysPerWeek: number;
    description: string;
};

export default function PostTuitionPage() {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();

    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState("");
    const [imageError, setImageError] = useState("");
    const [submitError, setSubmitError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [uploading, setUploading] = useState(false);

    const user = session?.user;
    const role = (user as typeof user & { role?: string })?.role;

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<TuitionFormData>({
        defaultValues: {
            mode: "Online",
            daysPerWeek: 3,
        },
    });

    const handleImageChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        setImageError("");
        setSelectedImage(null);
        setImagePreview("");

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setImageError("Please select a valid image.");
            event.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setImageError("Image size must be 5 MB or less.");
            event.target.value = "";
            return;
        }

        setSelectedImage(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const removeImage = () => {
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }

        setSelectedImage(null);
        setImagePreview("");
        setImageError("");

        const input = document.getElementById(
            "bannerImage"
        ) as HTMLInputElement | null;

        if (input) input.value = "";
    };

    const onSubmit = async (values: TuitionFormData) => {
        setSubmitError("");
        setSuccessMessage("");

        try {
            const { data: tokenData, error: tokenError } =
                await authClient.token();

            const token = tokenData?.token;

            if (tokenError || !token) {
                setSubmitError(
                    "Your session has expired. Please sign in again."
                );
                return;
            }

            let bannerImage = "";

            // Upload the selected image to ImgBB first.
            if (selectedImage) {
                setUploading(true);

                const imageFormData = new FormData();
                imageFormData.append("image", selectedImage);

                const uploadResponse = await fetch(
                    `${API_URL}/tuitions/upload-image`,
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        body: imageFormData,
                    }
                );

                const uploadResult = await uploadResponse.json();

                if (!uploadResponse.ok || !uploadResult.success) {
                    setSubmitError(
                        uploadResult.message || "Image upload failed."
                    );
                    return;
                }

                bannerImage = uploadResult.data.url;
            }

            setUploading(false);

            // Submit the tuition post.
            const response = await fetch(`${API_URL}/tuitions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...values,
                    monthlyFee: Number(values.monthlyFee),
                    daysPerWeek: Number(values.daysPerWeek),
                    bannerImage,
                }),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                setSubmitError(
                    "Something went wrong. Please check your connection and try again."
                );

                toast.error(
                    "Something went wrong. Please check your connection and try again."
                );
                return;
            }

            setSuccessMessage(
                "Tuition submitted successfully! It is now waiting for admin approval."
            );

            toast.success(
                "Tuition submitted successfully! It is now waiting for admin approval."
            );

            setTimeout(() => {
                router.push("/dashboard/tutor/my-tuitions");
            }, 1800);
        } catch (error) {
            console.error("Tuition submission error:", error);
            setSubmitError(
                "Something went wrong. Please check your connection and try again."
            );
        } finally {
            setUploading(false);
        }
    };

    if (isPending) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            </div>
        );
    }

    if (!session || role !== "tutor") {
        return (
            <div className="rounded-2xl border border-red-100 bg-white p-8 text-center">
                <h2 className="text-xl font-bold text-gray-900">
                    Tutor access required
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                    Only registered tutors can post tuition opportunities.
                </p>
                <Link
                    href="/dashboard"
                    className="mt-5 inline-flex rounded-xl bg-emerald-600 px-5 py-2.5 font-semibold text-white hover:bg-emerald-700"
                >
                    Back to Dashboard
                </Link>
            </div>
        );
    }

    const inputClass =
        "mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

    const labelClass = "text-sm font-semibold text-gray-700";

    return (
        <div className="mx-auto max-w-5xl">
            <Link
                href="/dashboard/tutor"
                className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-emerald-600"
            >
                <ArrowLeft size={16} />
                Back to Dashboard
            </Link>

            <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">
                    Tutor Dashboard
                </p>
                <h1 className="mt-2 text-3xl font-bold text-gray-900">
                    Post a New Tuition
                </h1>
                <p className="mt-2 text-gray-500">
                    Share your teaching opportunity with students.
                    Your post will be reviewed by an admin before appearing publicly.
                </p>
            </div>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-8 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8"
            >
                <section>
                    <h2 className="text-lg font-bold text-gray-900">
                        Tuition Information
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Provide the basic details of your tuition.
                    </p>

                    <div className="mt-6 grid gap-5 md:grid-cols-2">
                        <div className="md:col-span-2">
                            <label className={labelClass}>
                                Tuition Title *
                            </label>
                            <input
                                {...register("title", {
                                    required: "Tuition title is required",
                                    maxLength: {
                                        value: 150,
                                        message: "Maximum 150 characters",
                                    },
                                })}
                                placeholder="e.g. Mathematics Tutor for Class 10"
                                className={inputClass}
                            />
                            {errors.title && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.title.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className={labelClass}>Subject *</label>
                            <input
                                {...register("subject", {
                                    required: "Subject is required",
                                    maxLength: 150,
                                })}
                                placeholder="e.g. Mathematics"
                                className={inputClass}
                            />
                            {errors.subject && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.subject.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className={labelClass}>
                                Class / Level *
                            </label>
                            <input
                                {...register("classLevel", {
                                    required: "Class or level is required",
                                    maxLength: 150,
                                })}
                                placeholder="e.g. Class 9-10, HSC, IELTS"
                                className={inputClass}
                            />
                            {errors.classLevel && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.classLevel.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className={labelClass}>
                                Teaching Mode *
                            </label>
                            <select
                                {...register("mode", { required: true })}
                                className={inputClass}
                            >
                                <option value="Online">Online</option>
                                <option value="Offline">Offline</option>
                            </select>
                        </div>

                        <div>
                            <label className={labelClass}>
                                Location *
                            </label>
                            <input
                                {...register("location", {
                                    required: "Location is required",
                                    maxLength: 150,
                                })}
                                placeholder="e.g. Dhaka, Bangladesh"
                                className={inputClass}
                            />
                            {errors.location && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.location.message}
                                </p>
                            )}
                        </div>
                    </div>
                </section>

                <div className="border-t border-gray-100" />

                <section>
                    <h2 className="text-lg font-bold text-gray-900">
                        Schedule and Payment
                    </h2>

                    <div className="mt-5 grid gap-5 md:grid-cols-2">
                        <div>
                            <label className={labelClass}>
                                Monthly Fee (৳) *
                            </label>
                            <input
                                type="number"
                                min="1"
                                {...register("monthlyFee", {
                                    required: "Monthly fee is required",
                                    valueAsNumber: true,
                                    min: {
                                        value: 1,
                                        message: "Fee must be greater than zero",
                                    },
                                })}
                                placeholder="e.g. 5000"
                                className={inputClass}
                            />
                            {errors.monthlyFee && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.monthlyFee.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className={labelClass}>
                                Days Per Week *
                            </label>
                            <select
                                {...register("daysPerWeek", {
                                    required: "Select days per week",
                                    valueAsNumber: true,
                                    min: 1,
                                    max: 7,
                                })}
                                className={inputClass}
                            >
                                {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                                    <option key={day} value={day}>
                                        {day} {day === 1 ? "day" : "days"}
                                    </option>
                                ))}
                            </select>
                            {errors.daysPerWeek && (
                                <p className="mt-1 text-sm text-red-500">
                                    Please select between 1 and 7 days.
                                </p>
                            )}
                        </div>
                    </div>
                </section>

                <div className="border-t border-gray-100" />

                <section>
                    <h2 className="text-lg font-bold text-gray-900">
                        Tuition Description
                    </h2>

                    <label className={`${labelClass} mt-5 block`}>
                        Description *
                    </label>
                    <textarea
                        {...register("description", {
                            required: "Description is required",
                            maxLength: {
                                value: 3000,
                                message: "Maximum 3000 characters",
                            },
                        })}
                        rows={6}
                        placeholder="Describe the tuition, your teaching approach, requirements, and other important details..."
                        className={`${inputClass} resize-y`}
                    />
                    {errors.description && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.description.message}
                        </p>
                    )}
                </section>

                <div className="border-t border-gray-100" />

                <section>
                    <h2 className="text-lg font-bold text-gray-900">
                        Tuition Banner Image
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Optional. Upload an image up to 5 MB.
                    </p>

                    {imagePreview ? (
                        <div className="relative mt-5 max-w-xl overflow-hidden rounded-xl border border-gray-200">
                            <img
                                src={imagePreview}
                                alt="Tuition banner preview"
                                className="h-56 w-full object-cover"
                            />
                            <button
                                type="button"
                                onClick={removeImage}
                                className="absolute right-3 top-3 rounded-full bg-white p-2 text-red-600 shadow hover:bg-red-50"
                                aria-label="Remove image"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    ) : (
                        <label
                            htmlFor="bannerImage"
                            className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-5 py-10 text-center transition hover:border-emerald-400 hover:bg-emerald-50"
                        >
                            <div className="mb-3 rounded-full bg-emerald-100 p-3 text-emerald-700">
                                <Upload size={24} />
                            </div>
                            <span className="font-semibold text-gray-800">
                                Click to upload an image
                            </span>
                            <span className="mt-1 text-xs text-gray-500">
                                PNG, JPG or other image formats · Maximum 5 MB
                            </span>
                        </label>
                    )}

                    <input
                        id="bannerImage"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                    />

                    {imageError && (
                        <p className="mt-2 text-sm text-red-500">
                            {imageError}
                        </p>
                    )}

                    {selectedImage && (
                        <p className="mt-2 flex items-center gap-2 text-sm text-emerald-700">
                            <ImageIcon size={16} />
                            {selectedImage.name}
                        </p>
                    )}
                </section>

                {submitError && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {submitError}

                        {submitError.toLowerCase().includes("free plan") && (
                            <Link
                                href="/pricing"
                                className="ml-2 font-bold underline"
                            >
                                Upgrade to Pro
                            </Link>
                        )}
                    </div>
                )}

                {successMessage && (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                        {successMessage}
                    </div>
                )}

                <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
                    <Link
                        href="/dashboard/tutor"
                        className="rounded-xl border border-gray-200 px-6 py-3 text-center text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                    >
                        Cancel
                    </Link>

                    <button
                        type="submit"
                        disabled={isSubmitting || uploading || !!successMessage}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {(isSubmitting || uploading) && (
                            <Loader2 size={17} className="animate-spin" />
                        )}
                        {uploading
                            ? "Uploading Image..."
                            : isSubmitting
                                ? "Submitting..."
                                : "Submit Tuition"}
                    </button>
                </div>
            </form>
        </div>
    );
}
