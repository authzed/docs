import { getReleases, getWhatsNew } from "@/lib/home-data";
import { DocsHome } from "@/components/docs-home";

/* Server wrapper: fetches the live release + what's-new feeds (ISR-cached in
   lib/home-data.ts) and hands them to the client DocsHome as serializable
   props. Keeps the presentational component free of data-fetching. */
export async function DocsHomeShell() {
  const [releases, whatsNew] = await Promise.all([getReleases(), getWhatsNew()]);
  return <DocsHome releases={releases} whatsNew={whatsNew} />;
}
