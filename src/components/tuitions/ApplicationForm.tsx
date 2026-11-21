
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

type ApplicationFormProps = {
  tuitionId: string;
};

export default function ApplicationForm({
  tuitionId,
}: ApplicationFormProps) {
  const { data: session, isPending } = authClient.useSession();

  const [studentPhone, setStudentPhone] = useState("");
  const [preferredSchedule, setPreferredSchedule] = useState("");
  const [studentNote, setStudentNote] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const user = session?.user;
  const role = (user as typeof user & { role?: string })?.role;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setSuccess(false);
    setLoading(true);

    try {
      const { data: tokenData, error: tokenError } =
        await authClient.token();

      if (tokenError || !tokenData?.token) {
        setMessage("Your session has expired. Please sign in again.");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/applications",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenData.token}`,
          },
          body: JSON.stringify({
            tuitionId,
            studentPhone,
            preferredSchedule,
            studentNote,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.message || "Failed to submit your application.");
        return;
      }

      setSuccess(true);
      setMessage("Your application was submitted successfully!");

      setStudentPhone("");
      setPreferredSchedule("");
      setStudentNote("");
    } catch (error) {
      console.error("Application submission error:", error);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (isPending) {
    return (
      <div className="rounded-xl bg-[#f0f7f4] p-4 text-center text-sm text-[#64777d]">
        Checking your account...
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <Link
          href="/sign-in"
          className="flex w-full items-center justify-center rounded-xl bg-[#087f78] px-5 py-4 font-bold text-white transition hover:bg-[#06645f]"
        >
          Sign In to Apply
        </Link>

        <p className="mt-4 text-center text-xs leading-5 text-[#64777d]">
          Sign in with your student account to apply for this tuition.
        </p>
      </div>
    );
  }

  if (role !== "student") {
    return (
      <div className="rounded-xl bg-[#f0f7f4] p-4 text-center">
        <p className="font-semibold text-[#173d35]">
          Student applications only
        </p>
        <p className="mt-2 text-sm text-[#64777d]">
          Only student accounts can apply for tuition opportunities.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="studentName"
          className="mb-2 block text-sm font-semibold text-[#142b35]"
        >
          Student Name
        </label>
        <input
          id="studentName"
          value={user.name || ""}
          readOnly
          className="w-full rounded-xl border border-[#e3ece9] bg-gray-50 px-4 py-3 text-sm text-gray-600 outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="studentEmail"
          className="mb-2 block text-sm font-semibold text-[#142b35]"
        >
          Email Address
        </label>
        <input
          id="studentEmail"
          value={user.email || ""}
          readOnly
          className="w-full rounded-xl border border-[#e3ece9] bg-gray-50 px-4 py-3 text-sm text-gray-600 outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="studentPhone"
          className="mb-2 block text-sm font-semibold text-[#142b35]"
        >
          Phone Number *
        </label>
        <input
          id="studentPhone"
          type="tel"
          required
          maxLength={30}
          value={studentPhone}
          onChange={(event) => setStudentPhone(event.target.value)}
          placeholder="Enter your phone number"
          className="w-full rounded-xl border border-[#e3ece9] px-4 py-3 text-sm outline-none focus:border-[#087f78]"
        />
      </div>

      <div>
        <label
          htmlFor="preferredSchedule"
          className="mb-2 block text-sm font-semibold text-[#142b35]"
        >
          Preferred Study Schedule *
        </label>
        <textarea
          id="preferredSchedule"
          required
          maxLength={200}
          rows={3}
          value={preferredSchedule}
          onChange={(event) => setPreferredSchedule(event.target.value)}
          placeholder="Example: Saturday to Wednesday, 5 PM to 7 PM"
          className="w-full resize-y rounded-xl border border-[#e3ece9] px-4 py-3 text-sm outline-none focus:border-[#087f78]"
        />
      </div>

      <div>
        <label
          htmlFor="studentNote"
          className="mb-2 block text-sm font-semibold text-[#142b35]"
        >
          Note to Tutor (Optional)
        </label>
        <textarea
          id="studentNote"
          maxLength={1000}
          rows={3}
          value={studentNote}
          onChange={(event) => setStudentNote(event.target.value)}
          placeholder="Tell the tutor about your learning goals..."
          className="w-full resize-y rounded-xl border border-[#e3ece9] px-4 py-3 text-sm outline-none focus:border-[#087f78]"
        />
        <p className="mt-1 text-right text-xs text-gray-400">
          {studentNote.length}/1000
        </p>
      </div>

      {message && (
        <p
          role="alert"
          className={`rounded-xl p-3 text-sm ${
            success
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-[#087f78] px-5 py-4 font-bold text-white transition hover:bg-[#06645f] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Submitting Application..." : "Apply for This Tuition"}
      </button>

      <p className="text-center text-xs leading-5 text-[#64777d]">
        Your application will be sent to the tutor for review.
      </p>
    </form>
  );
}
