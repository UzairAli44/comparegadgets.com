import Link from "next/link";
import { SearchX } from "lucide-react";
import { StateBox } from "@/components/state-box";

export default function NotFound() {
  return (
    <div className="page-body flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-lg">
        <p className="text-center text-7xl font-black text-primary">404</p>
        <div className="mt-6">
          <StateBox icon={SearchX} title="Page not found" text="The page you’re looking for doesn’t exist or has been moved.">
            <Link href="/" className="primary-button">Go home</Link>
            <Link href="/search" className="secondary-button">Search gadgets</Link>
          </StateBox>
        </div>
      </div>
    </div>
  );
}
