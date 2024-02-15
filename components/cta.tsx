import { Button } from '@/components/ui/button';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function TocCTA() {
  const pathname = usePathname();
  const isCommercial = pathname.startsWith('/authzed/');

  return isCommercial ? (
    <div className="flex flex-wrap w-full nx-mt-8 nx-border-t nx-bg-white nx-pt-8 nx-shadow-[0_-12px_16px_white] dark:nx-bg-dark dark:nx-shadow-[0_-12px_16px_#111] nx-sticky nx-bottom-0 nx-flex nx-flex-col nx-items-start nx-gap-2 nx-pb-8 dark:nx-border-neutral-800 contrast-more:nx-border-t contrast-more:nx-border-neutral-400 contrast-more:nx-shadow-none contrast-more:dark:nx-border-neutral-400">
      <div className="nx-text-xs">Talk to us</div>
      <div>
        <Link href="https://authzed.com/call?utm_source=docs">
          <Button variant="default" size="sm">
            Schedule a Call
            <FontAwesomeIcon className=" ml-2 h-4 w-4" icon={faPhone} />
          </Button>
        </Link>
      </div>
    </div>
  ) : (
    <></>
  );
}

export function NavCTA() {
  const pathname = usePathname();
  const isCommercial = pathname.startsWith('/authzed/');

  // TODO: No-ops for now
  return isCommercial ? <></> : <></>;
}
