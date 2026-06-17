"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

// "Book a demo" now lives in the top nav (app/layout.tsx) so it's persistent
// rather than docked beside a short page TOC. The rail keeps the Cloud
// self-serve prompt, which pairs with the Feedback widget below it.
export function TocCTA() {
  return (
    <div className="mt-10 pt-4 pb-4">
      <div className="text-sm mb-1 font-semibold">AuthZed Cloud</div>
      <div className="text-sm mb-4 font-normal text-gray-400">Hosted, self-service SpiceDB</div>
      <Link href="https://authzed.com/cloud/signup" className="cursor-pointer">
        <Button
          variant="outline"
          size="sm"
          className="w-full cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          Get Started
        </Button>
      </Link>
    </div>
  );
}
