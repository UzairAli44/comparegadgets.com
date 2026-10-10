"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";
import { StateBox } from "@/components/state-box";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="page-body flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-lg">
        <StateBox icon={AlertTriangle} title="This page didn’t load" text="Something went wrong on our end. You can try again or head back home.">
          <button type="button" onClick={reset} className="primary-button">Try again</button>
          <Link href="/" className="secondary-button">Go home</Link>
        </StateBox>
      </div>
    </div>
  );
}
