
import { Suspense } from "react";
import VerifyPageClient from "./VerifyPageClient";

export default function VerifyPage() {
    return (
        <Suspense
            fallback={
                <section className="flex min-h-screen items-center justify-center bg-[#050711] text-white"> Loading verification... </section>
            }
            >
            <VerifyPageClient />
        </Suspense>
    );
}
