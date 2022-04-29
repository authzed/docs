import React, { createContext, PropsWithChildren, useEffect, useState } from 'react';
import amplitude, { AmplitudeClient } from 'amplitude-js';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export const AmplitudeContext = createContext<AmplitudeClient | undefined>(undefined);

export function AmplitudeClientProvider(props: PropsWithChildren) {
    const { siteConfig } = useDocusaurusContext();
    const apiKey = siteConfig.customFields?.amplitudeApiKey;
    const [client, setClient] = useState<AmplitudeClient | undefined>(undefined)

    useEffect(() => {
        if (apiKey && !client) {
            const amp = amplitude.getInstance()
            amp.init(apiKey);
            setClient(amp);
        }
    }, [apiKey, client]);

    return (
        <AmplitudeContext.Provider value={client}>
            {props.children}
        </AmplitudeContext.Provider>
    );
};
