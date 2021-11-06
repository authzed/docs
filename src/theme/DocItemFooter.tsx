import React from 'react';
import OriginalDocItemFooter from '@theme-original/DocItemFooter';
import { Props as DocProps } from '@docusaurus/plugin-content-docs';
import { Feedback } from '../components/Feedback';

export default function DocItemFooter(props: DocProps) {
  const { metadata } = props.content;
  const docId = metadata.id;

  return (
    <>
      <OriginalDocItemFooter {...props} />
      <Feedback docId={docId} />
    </>
  );
}
