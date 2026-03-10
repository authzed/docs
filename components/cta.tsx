"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function TocCTA() {
  const pathname = usePathname();
  const isCommercial = pathname?.startsWith("/authzed/");

  return isCommercial ? (
    <div className="mt-10 pt-4 pb-8">
      <div className="text-sm mb-4 font-semibold">Explore your use case</div>
      <Link href="https://authzed.com/schedule-demo" className="cursor-pointer">
        <Button variant="default" size="sm" className="w-full cursor-pointer">
          Book a demo
        </Button>
      </Link>
    </div>
  ) : (
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
