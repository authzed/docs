"use client";

import { usePathname } from "next/navigation";

export default function Banner() {
  const pathname = usePathname();
  const isCommercial = pathname.startsWith("/authzed/");

  return isCommercial ? (
    <a href="https://authzed.com/zanzibar?utm_source=docs">
      📄 Have you read Google's Zanzibar paper? We annotated it with additional
      context and comparisons with SpiceDB ↗
    </a>
  ) : (
    <a href="https://github.com/authzed/spicedb">
      SpiceDB is 100% open source. Please help us by starring our GitHub repo.
      ↗
    </a>
  );
}
