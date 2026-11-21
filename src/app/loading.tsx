import { LoaderCircle } from "lucide-react";

export default function Loading() {
    return (
        <main className="flex min-h-[70vh] items-center justify-center bg-[#f7fbf8]">
            <div className="flex flex-col items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e1f2e9]">
                    <LoaderCircle className="h-9 w-9 animate-spin text-[#168653]" />
                </div>

                <h2 className="text-lg font-semibold text-gray-800">
                    Loading MentorLagbe...
                </h2>

                <p className="text-sm text-gray-500">
                    Please wait while we prepare your page.
                </p>
            </div>
        </main>
    );
}