
import Link from "next/link";

export default function PaymentCancelPage() {
    return (
        <main className="flex min-h-[70vh] items-center justify-center px-4 py-16">
            <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-lg">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-3xl">
                    ↩
                </div>

                <h1 className="mb-3 text-2xl font-bold text-gray-900">
                    Payment Cancelled
                </h1>

                <p className="mb-8 text-gray-600">
                    Your payment was cancelled or you left the checkout page.
                    No payment was completed, and your current plan remains unchanged.
                </p>

                <div className="flex flex-col justify-center gap-3 sm:flex-row">
                    <Link
                        href="/pricing"
                        className="rounded-lg bg-[#087f78] px-6 py-3 font-semibold text-white transition hover:bg-[#066a64]"
                    >
                        Try Again
                    </Link>

                    <Link
                        href="/"
                        className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
                    >
                        Return Home
                    </Link>
                </div>
            </div>
        </main>
    );
}
