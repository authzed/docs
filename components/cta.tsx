"use client";

import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function TocCTA() {
  const pathname = usePathname();
  const isCommercial = pathname?.startsWith("/authzed/");

  return isCommercial ? (
    <div className="mt-8 border-t pt-8 dark:border-neutral-800 contrast-more:border-neutral-400">
      <div className="text-xs mb-2 font-semibold text-gray-500 dark:text-gray-400">
        Talk to us
      </div>
      <Link href="https://authzed.com/call?utm_source=docs" className="cursor-pointer">
        <Button variant="default" size="sm" className="w-full cursor-pointer">
          Book a demo
        </Button>
      </Link>
    </div>
  ) : (
    <></>
  );
}
