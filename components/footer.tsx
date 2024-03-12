import Link from 'next/link';
import { LogoIcon } from './logo';
import Scripts from './scripts';

export default function Footer() {
  return (
    // Copied from nextra-theme-docs sidebar container
    <div className="nx-border-t nx-border-neutral-800 dark:nx-border-neutral-800 bg-neutral-100 dark:nx-bg-neutral-900 print:nx-bg-transparent nx-pb-[env(safe-area-inset-bottom)]">
      <div className="nx-mx-auto nx-flex nx-max-w-[90rem] nx-justify-center nx-py-12 nx-text-gray-600 dark:nx-text-gray-400 md:nx-justify-start nx-pl-[max(env(safe-area-inset-left),1.5rem)] nx-pr-[max(env(safe-area-inset-right),1.5rem)]">
        <div className='class="flex w-full flex-col items-center sm:items-start"'>
          <div className="w-[3rem] h-[3rem]">
            {/* TODO: Add footer links here */}
            <Link href="https://authzed.com" title="AuthZed">
              <LogoIcon />
            </Link>
          </div>

          <div className="nx-text-xs">
            &copy; {new Date().getFullYear()} AuthZed.
          </div>
        </div>
      </div>
      <Scripts />
    </div>
  );
}
