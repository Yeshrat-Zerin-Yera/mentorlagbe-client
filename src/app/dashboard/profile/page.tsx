
"use client";

import { useEffect, useState, type FormEvent, type ChangeEvent } from "react";
import { ImagePlus, LoaderCircle, Save, UserRound } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { API_ORIGIN } from "@/lib/api";

type Profile = {
  id: string;
  name: string;
  email: string;
  image: string;
  role: string;
  phone: string;
  bio: string;
  plan: string;
  createdAt: string;
};

const API_URL = API_ORIGIN;

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");

  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5 MB.");
      return;
    }

    try {
      setError("");
      setSuccess("");
      setUploadingImage(true);

      const tokenResponse = await authClient.token();
      const token = tokenResponse.data?.token;

      if (tokenResponse.error || !token) {
        throw new Error("Your session has expired. Please sign in again.");
      }

      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(
        `${API_URL}/api/users/profile-image`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success || !result.data?.url) {
        throw new Error(result.message || "Image upload failed.");
      }

      const imageUrl = result.data.url;

      // Save the uploaded image URL immediately.
      const saveResponse = await fetch(`${API_URL}/api/users/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ image: imageUrl }),
      });

      const saveResult = await saveResponse.json();

      if (!saveResponse.ok || !saveResult.success) {
        throw new Error(saveResult.message || "Failed to save profile picture.");
      }

      setImage(saveResult.data.image || imageUrl);
      setProfile(saveResult.data);
      setSuccess("Profile picture saved successfully.");
      setSuccess("Image uploaded. Click Save Profile to apply it.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Image upload failed."
      );
    } finally {
      setUploadingImage(false);
      event.target.value = "";
    }
  };

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      setLoading(false);
      return;
    }

    const loadProfile = async () => {
      try {
        setError("");

        const tokenResponse = await authClient.token();
        const token = tokenResponse.data?.token;

        if (tokenResponse.error || !token) {
          throw new Error("Your session has expired. Please sign in again.");
        }

        const response = await fetch(`${API_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Could not load your profile.");
        }

        const userProfile: Profile = result.data;

        setProfile(userProfile);
        setName(userProfile.name || "");
        setPhone(userProfile.phone || "");
        setBio(userProfile.bio || "");
        setImage(userProfile.image || "");
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    };

    void loadProfile();
  }, [isPending, session]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    if (bio.length > 500) {
      setError("Bio cannot be longer than 500 characters.");
      return;
    }

    if (phone.length > 30) {
      setError("Phone number cannot be longer than 30 characters.");
      return;
    }

    if (image.trim()) {
      try {
        const imageUrl = new URL(image.trim());

        if (!["http:", "https:"].includes(imageUrl.protocol)) {
          throw new Error();
        }
      } catch {
        setError("Please enter a valid HTTP or HTTPS image URL.");
        return;
      }
    }

    try {
      setSaving(true);

      const tokenResponse = await authClient.token();
      const token = tokenResponse.data?.token;

      if (tokenResponse.error || !token) {
        throw new Error("Your session has expired. Please sign in again.");
      }

      const updateData: {
        name: string;
        phone: string;
        bio: string;
        image?: string;
      } = {
        name: name.trim(),
        phone: phone.trim(),
        bio: bio.trim(),
      };

      if (image.trim()) {
        updateData.image = image.trim();
      }

      const response = await fetch(`${API_URL}/api/users/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Profile update failed.");
      }

      setProfile(result.data);
      setName(result.data.name || "");
      setPhone(result.data.phone || "");
      setBio(result.data.bio || "");
      setImage(result.data.image || "");

      setSuccess("Your profile has been updated successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  };

  if (isPending || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoaderCircle className="h-8 w-8 animate-spin text-[#267653]" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-16">
        <div className="rounded-2xl border border-red-100 bg-white p-8 text-center">
          <p className="font-semibold text-red-600">
            {error || "Unable to load your profile."}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Please sign in again and try once more.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-semibold text-[#267653]">
          ACCOUNT SETTINGS
        </p>
        <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
          My Profile
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Manage your personal information and account details.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Profile Summary */}
        <div className="h-fit rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-[#e8f3ed] bg-[#e8f3ed] text-[#267653]">
              {image ? (
                <img
                  src={image}
                  alt={profile.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserRound size={42} />
              )}
            </div>

            <h2 className="mt-4 text-lg font-bold text-gray-900">
              {profile.name}
            </h2>

            <p className="mt-1 break-all text-sm text-gray-500">
              {profile.email}
            </p>

            <span className="mt-4 rounded-full bg-[#e8f3ed] px-4 py-1.5 text-xs font-bold capitalize text-[#267653]">
              {profile.role}
            </span>
          </div>

          <div className="mt-6 space-y-4 border-t border-gray-100 pt-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Current Plan</span>
              <span className="text-sm font-bold capitalize text-gray-900">
                {profile.plan || "free"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Account Type</span>
              <span className="text-sm font-semibold capitalize text-gray-900">
                {profile.role}
              </span>
            </div>
          </div>
        </div>

        {/* Edit Profile Form */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-bold text-gray-900">
            Personal Information
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Update the information associated with your account.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#267653] focus:ring-2 focus:ring-[#267653]/10"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                value={profile.email}
                readOnly
                className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500"
              />
              <p className="mt-1 text-xs text-gray-400">
                Email address cannot be changed here.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={30}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#267653] focus:ring-2 focus:ring-[#267653]/10"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Profile Picture
              </label>

              <div className="flex flex-wrap items-center gap-4">
                {image ? (
                  <img
                    src={image}
                    alt="Profile preview"
                    className="h-20 w-20 rounded-full border border-gray-200 object-cover"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                    <UserRound className="h-9 w-9" />
                  </div>
                )}

                <div>
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#267653] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1d6042]">
                    {uploadingImage ? (
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                      <ImagePlus className="h-4 w-4" />
                    )}

                    {uploadingImage ? "Uploading..." : "Choose Image"}

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>

                  <p className="mt-2 text-xs text-gray-400">
                    JPG, PNG or other image formats. Maximum 5 MB.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-700">
                  About Me
                </label>
                <span className="text-xs text-gray-400">
                  {bio.length}/500
                </span>
              </div>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={500}
                rows={5}
                className="w-full resize-y rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#267653] focus:ring-2 focus:ring-[#267653]/10"
                placeholder="Write a short introduction about yourself..."
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {success}
              </div>
            )}

            <div className="flex justify-end border-t border-gray-100 pt-5">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-[#267653] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1d6042] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <LoaderCircle size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
