import React, { PropsWithChildren, useContext, useMemo, useState } from "react";
import { CookiesProvider, useCookies } from 'react-cookie';
import * as replaceAll from 'string.prototype.replaceall';
import CodeBlock from '@theme/CodeBlock';
import Twig from 'twig';
import { useDebouncedChecker } from "./debouncer";

enum InstanceKind {
    AUTHZED = 'authzed',
    SPICEDB = 'spicedb',
}

type SampleConfigContextValue = {
    readonly defaultTenant: string,
    readonly instanceKind: () => InstanceKind | undefined,
    readonly setInstanceKind: (kind: InstanceKind) => void,
    readonly token: () => string | undefined;
    readonly setToken: (token: string) => void;
    readonly tenant: () => string | undefined;
    readonly setTenant: (token: string) => void;
    readonly endpoint: () => string | undefined;
    readonly setEndpoint: (token: string) => void;
    readonly buildTempalte: (template: string) => any;
};

const SampleConfigContext = React.createContext<SampleConfigContextValue | undefined>(undefined);
const DEFAULT_SAMPLE_TOKEN = 't_your_token_here_1234567deadbeef';
const DEFAULT_ENDPOINT = 'localhost:50051';
const AUTHZED_ENDPOINT = 'grpc.authzed.com:443';

/**
 * SampleConfigProvider is a React context provider which holds state for SampleCodeBlocks.
 */
export function SampleConfigProvider(props: PropsWithChildren<{ defaultTenant: string }>): JSX.Element {
    const [tenant, setTenant] = useState<string | undefined>(undefined);
    const [token, setToken] = useState<string | undefined>(undefined);
    const [endpoint, setEndpoint] = useState<string | undefined>(undefined);
    const [instanceKind, setInstanceKind] = useState<InstanceKind | undefined>(undefined);
    const [templateCache, setTemplateCache] = useState<Record<string, any>>({});

    const contextValue = useMemo(() => {
        return {
            defaultTenant: props.defaultTenant,
            token: () => token,
            setToken: setToken,
            instanceKind: () => instanceKind,
            setInstanceKind: setInstanceKind,
            tenant: () => tenant,
            setTenant: setTenant,
            endpoint: () => endpoint,
            setEndpoint: setEndpoint,
            buildTemplate: (template: string) => {
                if (template in templateCache) {
                    return templateCache[template];
                }

                const built = Twig.twig({
                    data: template
                });
                templateCache[template] = built;
                setTemplateCache(templateCache);
                return built;
            }
        }
    }, [props.defaultTenant, token, setToken, endpoint, setEndpoint, instanceKind, setInstanceKind, tenant, setTenant, templateCache, setTemplateCache]);

    return (
        <SampleConfigContext.Provider value={contextValue}>
            {props.children}
        </SampleConfigContext.Provider>
    );
}

function normalizeContent(children: React.ReactNode[]): string {
    return Array.isArray(children)
        ? children.map((child: React.ReactNode) => {
            if (React.isValidElement(child)) {
                return normalizeContent(child.props.children);
            } else {
                return child.toString()
            }
        }).join('')
        : (children as string);
}

/**
 * SampleCodeBlock is a component which takes as its child a single *twig* template
 * string, to produce a CodeBlock with the values found in the SampleConfigContext.
 * 
 * Exmaple:
 * <SampleCodeBlock lang="java">
 * {`class SomeClass {
 * ·
 * private int someField = 2;
 * ·
 * void DoSomething() { ... }
 * }`}
 * </SampleCodeBlock>
 * 
 * NOTE the use of · on the otherwise blanks lines to ensure MDX properly parses the template
 * string.
 */
export function SampleCodeBlock(props: PropsWithChildren<{ lang: string }>) {
    const context = useContext(SampleConfigContext);
    const token = context.token() ? context.token() : DEFAULT_SAMPLE_TOKEN;
    const endpoint = context.instanceKind() !== InstanceKind.SPICEDB ? AUTHZED_ENDPOINT : (context.endpoint() ?? DEFAULT_ENDPOINT);

    let tenant = context.tenant() ? context.tenant() : context.defaultTenant;
    tenant = tenant.replace('/', '');

    let content = normalizeContent(props.children);

    // NOTE: due to a bug in MDX, a completely blank line is interpreted as breaking up
    // the template string typically passed to SampleCodeBlock. Therefore, we support ·
    // for otherwise blank links, to allow for MDX parsing.
    content = replaceAll(content, '·', '');

    const template = context.buildTemplate(content);
    const processed = template.render({ token: token, endpoint: endpoint, tenant: tenant, authzed: context.instanceKind() !== InstanceKind.SPICEDB });
    return <CodeBlock className={`language-${props.lang}`}>{processed}</CodeBlock>
}

/**
 * SampleConfigEditor is the editor for the values stored in the SampleConfigContext.
 */
export function SampleConfigEditor() {
    const context = useContext(SampleConfigContext);
    const instanceKind = context.instanceKind();
    const [token, setToken] = useState(context.token() ?? '');
    const [tenant, setTenant] = useState(context.tenant() ?? '');
    const [endpoint, setEndpoint] = useState(context.endpoint() ?? '');

    const debouncedUpdateToken = useDebouncedChecker(100, context.setToken);
    const debouncedUpdateTenant = useDebouncedChecker(100, context.setTenant);
    const debouncedUpdateEndpoint = useDebouncedChecker(100, context.setEndpoint);

    const handleChangeToken = (e: React.ChangeEvent) => {
        setToken(e.target.value);
        debouncedUpdateToken.run(e.target.value);
    };

    const handleChangeTenant = (e: React.ChangeEvent) => {
        setTenant(e.target.value);
        debouncedUpdateTenant.run(e.target.value);
    };

    const handleChangeEndpoint = (e: React.ChangeEvent) => {
        setEndpoint(e.target.value);
        debouncedUpdateEndpoint.run(e.target.value);
    };

    return <div className="sample-config-editor">
        <div className="system-options">
            <div className="system-option">
                <input type="radio" id="authzed" name="system" value="authzed"
                    checked={instanceKind === InstanceKind.AUTHZED}
                    onChange={() => context.setInstanceKind(InstanceKind.AUTHZED)} />
                <label for="authzed">I have an <a href="https://app.authzed.com" target="_blank">Authzed permissions system</a> created</label>
            </div>
            <div className="system-option">
                <input type="radio" id="spicedb" name="system" value="spicedb"
                    checked={instanceKind === InstanceKind.SPICEDB}
                    onChange={() => {
                        setTenant(undefined);
                        debouncedUpdateTenant.run('');
                        context.setInstanceKind(InstanceKind.SPICEDB);
                    }} />
                <label for="spicedb">I have a <a href="https://github.com/authzed/spicedb" target="_blank">SpiceDB instance</a> running</label>
            </div>
        </div>
        {instanceKind !== undefined &&
            <div className="system-parameters">
                {instanceKind === InstanceKind.SPICEDB && <div>
                    <label>Endpoint</label>
                    <input type="text" value={endpoint} onChange={handleChangeEndpoint} placeholder="localhost:50051" />
                    <label>Preshared key</label>
                    <input type="text" value={token} onChange={handleChangeToken} placeholder="Enter your preshared key" />
                </div>}
                {instanceKind === InstanceKind.AUTHZED && <div>
                    <label>Permissions System Prefix</label>
                    <input type="text" value={tenant} onChange={handleChangeTenant} placeholder="mypermissionssystem/" />
                    <label>Token</label>
                    <input type="text" value={token} onChange={handleChangeToken} placeholder="tc_some_token" />
                </div>}
            </div>
        }
    </div>;
}