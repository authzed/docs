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

import cn from "clsx";
import type { ComponentProps, ReactNode } from "react";
import { forwardRef } from "react";

type InputProps = ComponentProps<"input"> & { suffix?: ReactNode };

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, suffix, ...props }, forwardedRef) => (
    <div className="_relative _flex _items-center _text-gray-900 contrast-more:_text-gray-800 dark:_text-gray-300 contrast-more:dark:_text-gray-300">
      <input
        ref={forwardedRef}
        spellCheck={false}
        className={cn(
          className,
          "_block _w-full _appearance-none _rounded-lg _px-3 _py-2 _transition-colors",
          "_text-base _leading-tight md:_text-sm",
          "_bg-black/[.05] dark:_bg-gray-50/10",
          "focus:_bg-white dark:focus:_bg-dark",
          "placeholder:_text-gray-500 dark:placeholder:_text-gray-400",
          "contrast-more:_border contrast-more:_border-current",
        )}
        {...props}
      />
      {suffix}
    </div>
  ),
);

Input.displayName = "Input";
