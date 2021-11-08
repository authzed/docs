import React, { createContext, PropsWithChildren } from 'react';
import amplitude, { AmplitudeClient } from 'amplitude-js';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export const AmplitudeContext = createContext<AmplitudeClient | undefined>(undefined);

export function AmplitudeClientProvider(props: PropsWithChildren) {
    const { siteConfig } = useDocusaurusContext();
    const apiKey = siteConfig.customFields?.amplitudeApiKey;

    let client = undefined;
    if (apiKey) {
        client = amplitude.getInstance()
        client.init(apiKey);
    }

    return (
        <AmplitudeContext.Provider value={client}>
            {props.children}
        </AmplitudeContext.Provider>
    );
};
