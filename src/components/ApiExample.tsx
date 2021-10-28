import CodeBlock from '@theme/CodeBlock';
import TabItem from '@theme/TabItem';
import Tabs from '@theme/Tabs';
import React, { useState } from "react";
import { CookiesProvider, useCookies } from 'react-cookie';
import * as replaceAll from 'string.prototype.replaceall';


export function ApiSample(props: { children: string, language: string }) { /* Just a placeholder */ }

export interface Parameter {
    title: string,
    description: string,
    placeholder: string
}

interface Language {
    id: string
    code: string
}

const LANGUAGES: Record<string, string> = {
    'grpcurl': 'grpcurl',
    'python': 'Python',
    'go': 'Go'
}


// NOTE: The newlines around the ``` in the ApiSample blocks are *required* and
// you MUST use a ``` as the child (and have at least two ApiSample blocks). Also
// note that the <ApiSample>'s are *NOT* indented, and they cannot be.
//
// Example:
//
//  import {ApiExample, ApiSample} from '../../src/components/ApiExample';
//  <ApiExample parameters={{
//          "param1": {
//              "title": "Namespace",
//              "description": "The namespace containing the object to check",
//              "placeholder": "mynamespace",
//          },
//          ...
//      }}>
//  <ApiSample language="python">
//  
//  ```
//  do something with $param1 and the auto-defined $tenantslug
//  ```
//  
//  </ApiSample>
//  ...
//  </ApiExample>

/**
 * ApiExample is a control which displays inline examples for APIs, with automatic
 * parameterization.
 */
export function ApiExample(props: { children: any[], parameters: Record<string, Parameter> }) {
    return <CookiesProvider>
        <ApiExampleDisplay {...props} />
    </CookiesProvider>;
}

function ApiExampleDisplay(props: { children: any[], parameters: Record<string, Parameter> }) {
    const [token, setToken] = useState('t_my_token');
    const [paramValues, setParamValues] = useState<Record<string, string>>({});
    const [cookies, setCookies] = useCookies(['tenantslug']);
    const [tenantSlug, setTenantSlug] = useState(cookies['tenantslug'] || 'someslug');

    const handleParamChange = (paramName: string, newValue: string) => {
        setParamValues({ ...paramValues, [paramName]: newValue });
    };

    const updateTenantSlug = (tenantSlug: string) => {
        setTenantSlug(tenantSlug);
        setCookies('tenantslug', tenantSlug);
    };

    const replaceVars = (code: string) => {
        code = replaceAll(code, '$token', token);
        code = replaceAll(code, '$tenantslug', tenantSlug);

        Object.keys(props.parameters).forEach((paramName: string) => {
            let value = paramValues[paramName] || props.parameters[paramName].placeholder;
            value = replaceAll(value, '$tenantslug', tenantSlug);
            code = replaceAll(code, `$${paramName}`, value);
            code = replaceAll(code, `$CC_${paramName}`, value[0].toUpperCase() + value.substr(1));
        });

        return code;
    };

    let children = props.children;

    // NOTE: will happen if there is a single child.
    if (children && !Array.isArray(children)) {
        children = [children];
    }

    const languages = (children || []).map((child: any) => {
        return {
            'id': child.props.language,
            'code': replaceVars(child.props.children.props.children.props.children)
        }
    });

    return <div>
        <details>
            <summary>Code Sample Parameter Values</summary>
            <div>
                <table>
                    <thead>
                        <th>Parameter Name</th>
                        <th>Value</th>
                        <th>Description</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Tenant Slug</td>
                            <td><input value={tenantSlug} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateTenantSlug(e.target.value)} /></td>
                            <td>The slug for your tenant</td>
                        </tr>
                        <tr>
                            <td>Token</td>
                            <td><input value={token} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setToken(e.target.value)} /></td>
                            <td>Your token</td>
                        </tr>
                        {Object.keys(props.parameters).map((paramName: string) => {
                            return <tr key={paramName}>
                                <td>{props.parameters[paramName].title}</td>
                                <td><input value={paramValues[paramName] || props.parameters[paramName].placeholder} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleParamChange(paramName, e.target.value)} /></td>
                                <td>{props.parameters[paramName].description}</td>
                            </tr>;
                        })}
                    </tbody>
                </table>
            </div>
        </details>
        <Tabs
            groupId="code-samples"
            defaultValue={languages[0].id}
            values={
                languages.map((lang: Language) => {
                    return { label: LANGUAGES[lang.id], value: lang.id };
                })
            }>
            {languages.map((lang: Language) => {
                return <TabItem value={lang.id} key={lang.id}>
                    <CodeBlock className={lang.id}>{lang.code}</CodeBlock>
                </TabItem>;
            })}
        </Tabs>
    </div>;
}
