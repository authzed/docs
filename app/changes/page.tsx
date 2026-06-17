import Link from "next/link";
import changed from "@/lib/changed-pages.json";

export const metadata = { title: "Changed in this branch" };

type Entry = { status: "new" | "updated" };
const MANIFEST = changed as Record<string, Entry>;

// Title-case the last route segment as a readable label.
function label(route: string): string {
  const seg = route.split("/").filter(Boolean).pop() ?? route;
  return seg.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ChangesPage() {
  const routes = Object.keys(MANIFEST).sort();
  const created = routes.filter((r) => MANIFEST[r].status === "new");
  const updated = routes.filter((r) => MANIFEST[r].status === "updated");

  const Section = ({ title, items }: { title: string; items: string[] }) =>
    items.length === 0 ? null : (
      <section style={{ marginTop: "2rem" }}>
        <h2>{title} <span style={{ opacity: 0.5, fontWeight: 400 }}>({items.length})</span></h2>
        <ul>
          {items.map((r) => (
            <li key={r}>
              <Link href={r}>{label(r)}</Link>{" "}
              <code style={{ opacity: 0.6, fontSize: "0.85em" }}>{r}</code>
            </li>
          ))}
        </ul>
      </section>
    );

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "2rem 0" }}>
      <h1>Changed in this branch</h1>
      <p>
        Content pages that are new or modified versus the published docs
        (<code>origin/main</code>). Styling and component changes are excluded.
        {routes.length === 0 && " No content changes detected."}
      </p>
      <Section title="New pages" items={created} />
      <Section title="Updated content" items={updated} />
    </div>
  );
}
