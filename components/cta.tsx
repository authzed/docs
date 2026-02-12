"use client";

import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function TocCTA() {
  const pathname = usePathname();
  const isCommercial = pathname?.startsWith("/authzed/");

  return isCommercial ? (
    <div className="pt-4 pb-8">
      <div className="text-sm mb-4 font-semibold">
        Explore your use case
      </div>
      <Link href="https://authzed.com/schedule-demo" className="cursor-pointer">
        <Button variant="default" size="sm" className="w-full cursor-pointer">
          Book a demo
        </Button>
      </Link>
    </div>
  ) : (
    <></>
  );
}
