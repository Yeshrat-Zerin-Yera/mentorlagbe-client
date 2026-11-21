
"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Loader2,
  Home,
  CreditCard,
  Clock,
  AlertCircle,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { API_URL } from "@/lib/api";

type PaymentStatus = "checking" | "confirmed" | "pending" | "error";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [status, setStatus] = useState<PaymentStatus>("checking");

  useEffect(() => {
    if (!sessionId) return;

    let active = true;
    let timer: ReturnType<typeof setTimeout>;

    const checkPayment = async () => {
      try {
        const tokenResponse = await authClient.token();
        const token = tokenResponse.data?.token;

        if (!token) {
          if (active) setStatus("error");
          return;
        }

        const response = await fetch(
          `${API_URL}/users/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Could not verify account plan");
        }

        const result = await response.json();

        const user =
          result.user ||
          result.data?.user ||
          result.data ||
          result;

        if (!active) return;

        if (user.plan === "pro") {
          setStatus("confirmed");
          return;
        }

        attempts += 1;

        if (attempts < 10) {
          timer = setTimeout(checkPayment, 3000);
        } else {
          setStatus("pending");
        }
      } catch (error) {
        console.error("Payment verification error:", error);

        if (active) {
          attempts += 1;

          if (attempts < 10) {
            timer = setTimeout(checkPayment, 3000);
          } else {
            setStatus("error");
          }
        }
      }
    };

    let attempts = 0;
    checkPayment();

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [sessionId]);

  const confirmed = status === "confirmed";

  return (
    <main className="flex min-h-[75vh] items-center justify-center px-5 py-16">
      <div className="w-full max-w-lg rounded-3xl border border-[#e3ece9] bg-white p-8 text-center shadow-sm sm:p-10">
        {!sessionId ? (
          <>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-500">
              <CreditCard size={40} />
            </div>

            <h1 className="mt-6 text-2xl font-extrabold text-[#142b35]">
              Payment Session Not Found
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#64777d]">
              We couldn't find a Stripe checkout session. Please
              return to pricing and try again.
            </p>
          </>
        ) : (
          <>
            <div
              className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${
                confirmed
                  ? "bg-[#e8f4f1] text-[#087f78]"
                  : status === "error"
                    ? "bg-red-50 text-red-500"
                    : "bg-[#e8f4f1] text-[#087f78]"
              }`}
            >
              {confirmed ? (
                <CheckCircle2 size={44} />
              ) : status === "error" ? (
                <AlertCircle size={40} />
              ) : (
                <Clock size={40} />
              )}
            </div>

            <h1 className="mt-6 text-3xl font-extrabold text-[#142b35]">
              {confirmed ? "Payment Confirmed!" : "Thank You!"}
            </h1>

            <p className="mt-3 text-base leading-7 text-[#64777d]">
              {confirmed
                ? "Your payment was successful. Your Pro plan is now active. Enjoy your MentorLagbe Pro benefits!"
                : "You have returned from Stripe Checkout. We are checking your account to confirm your Pro plan activation."}
            </p>

            <div className="mt-7 rounded-xl bg-[#f8faf9] p-4 text-left">
              <div className="flex items-center gap-3">
                {confirmed ? (
                  <CheckCircle2
                    size={20}
                    className="text-[#087f78]"
                  />
                ) : status === "error" ? (
                  <AlertCircle
                    size={20}
                    className="text-red-500"
                  />
                ) : (
                  <CreditCard
                    size={20}
                    className="text-[#087f78]"
                  />
                )}

                <div>
                  <p className="text-sm font-bold text-[#142b35]">
                    Payment confirmation
                  </p>
                  <p className="text-xs text-[#64777d]">
                    {confirmed
                      ? "Your Pro plan is active"
                      : status === "pending"
                        ? "Payment received. Plan update is still pending."
                        : status === "error"
                          ? "We couldn't verify your account right now."
                          : "Checking your account plan..."}
                  </p>
                </div>

                {!confirmed &&
                  status !== "error" &&
                  status !== "pending" && (
                    <Loader2
                      size={19}
                      className="ml-auto animate-spin text-[#087f78]"
                    />
                  )}
              </div>
            </div>

            <p className="mt-5 text-xs leading-5 text-[#819096]">
              {confirmed
                ? "Your account has been upgraded successfully."
                : "Your account status is checked securely against the backend. You can refresh this page to check again."}
            </p>
          </>
        )}

        <Link
          href="/"
          className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#087f78] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#06645f]"
        >
          <Home size={18} />
          Back to Homepage
        </Link>

        <Link
          href="/pricing"
          className="mt-4 inline-block text-sm font-semibold text-[#087f78] hover:underline"
        >
          View Pricing Plans
        </Link>
      </div>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[75vh] items-center justify-center">
          <Loader2
            size={30}
            className="animate-spin text-[#087f78]"
          />
        </main>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
