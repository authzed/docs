// Forked from https://github.com/shuding/nextra/blob/2e78fe5f52a523399eb491fe525b67c7534f2f0e/packages/nextra-theme-docs/src/components/highlight-matches.tsx
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

import escapeStringRegexp from "escape-string-regexp";
import type { ReactElement, ReactNode } from "react";
import { memo } from "react";

type MatchArgs = {
  value?: string;
  match: string;
};

export const HighlightMatches = memo<MatchArgs>(function HighlightMatches({
  value,
  match,
}: MatchArgs): ReactElement | null {
  if (!value) {
    return null;
  }
  const splitText = value.split("");
  const escapedSearch = escapeStringRegexp(match.trim());
  const regexp = new RegExp(escapedSearch.replaceAll(/\s+/g, "|"), "ig");
  let result;
  let index = 0;
  const content: (string | ReactNode)[] = [];

  while ((result = regexp.exec(value))) {
    if (result.index === regexp.lastIndex) {
      regexp.lastIndex++;
    } else {
      const before = splitText.splice(0, result.index - index).join("");
      const after = splitText
        .splice(0, regexp.lastIndex - result.index)
        .join("");
      content.push(
        before,
        <span key={result.index} className="_text-primary-600">
          {after}
        </span>,
      );
      index = regexp.lastIndex;
    }
  }

  return (
    <>
      {content}
      {splitText.join("")}
    </>
  );
});
