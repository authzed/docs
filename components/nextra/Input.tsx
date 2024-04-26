// Forked from https://github.com/shuding/nextra/blob/2e78fe5f52a523399eb491fe525b67c7534f2f0e/packages/nextra-theme-docs/src/components/input.tsx
// MIT License

// Copyright (c) 2020 Shu Ding

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import cn from 'clsx';
import type { ComponentProps, ReactNode } from 'react';
import { forwardRef } from 'react';

type InputProps = ComponentProps<'input'> & { suffix?: ReactNode };

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, suffix, ...props }, forwardedRef) => (
    <div className="nx-relative nx-flex nx-items-center nx-text-gray-900 contrast-more:nx-text-gray-800 dark:nx-text-gray-300 contrast-more:dark:nx-text-gray-300">
      <input
        ref={forwardedRef}
        spellCheck={false}
        className={cn(
          className,
          'nx-block nx-w-full nx-appearance-none nx-rounded-lg nx-px-3 nx-py-2 nx-transition-colors',
          'nx-text-base nx-leading-tight md:nx-text-sm',
          'nx-bg-black/[.05] dark:nx-bg-gray-50/10',
          'focus:nx-bg-white dark:focus:nx-bg-dark',
          'placeholder:nx-text-gray-500 dark:placeholder:nx-text-gray-400',
          'contrast-more:nx-border contrast-more:nx-border-current'
        )}
        {...props}
      />
      {suffix}
    </div>
  )
);

Input.displayName = 'Input';
