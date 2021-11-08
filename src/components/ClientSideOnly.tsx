import React, { PropsWithChildren, useEffect, useState } from 'react';

/**
 * ClientSideOnly will only render the children element(s) if scripting is enabled on the client.
 */
export function ClientSideOnly(props: PropsWithChildren<{}>) {
    const [isClientSide, setIsClientSide] = useState(false);
    useEffect(() => {
        setIsClientSide(true);
    }, []);
    return !isClientSide ? <span /> : <>{props.children}</>;
}
