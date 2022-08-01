import React from "react";

// Example:
//
// (At the top of the page)
// hide_table_of_contents: true
// ---
// import TOCInline from '@theme/TOCInline';
// 
// <TOCInline toc={toc} />
//
// (Later in the page)
// import {InlinePlayground} from '../../src/components/InlinePlayground';
//
// <InlinePlayground reference="some-share-reference"/>

/**
 * Adds an inline playground to the document.
 * 
 * NOTE: It is also highly recommended to add `hide_table_of_contents: true` to the page
 * header where this is used, to prevent clipping with the TOC on smaller resolutions.
 */
export function InlinePlayground(props: { reference: string, children: any[] }) {
    let playgroundUrl = 'https://play.authzed.com';
    return <div>
        <iframe style={{ width: '100%', border: '0px', height: '500px' }} src={`${playgroundUrl}/i/${props.reference}`}></iframe>
    </div>
}
