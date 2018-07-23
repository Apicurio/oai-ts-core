/**
 * @license
 * Copyright 2017 Red Hat
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {OasNode} from "../../models/node.model";
import {Oas30ValidationRule} from "./common.rule";
import {Oas30Discriminator} from "../../models/3.0/discriminator.model";
import {Oas30ExternalDocumentation} from "../../models/3.0/external-documentation.model";
import {
    Oas30AuthorizationCodeOAuthFlow,
    Oas30ClientCredentialsOAuthFlow, Oas30ImplicitOAuthFlow, Oas30OAuthFlow,
    Oas30PasswordOAuthFlow
} from "../../models/3.0/oauth-flow.model";
import {Oas30Info} from "../../models/3.0/info.model";
import {Oas30License} from "../../models/3.0/license.model";
import {Oas30Operation} from "../../models/3.0/operation.model";
import {Oas30Parameter, Oas30ParameterDefinition} from "../../models/3.0/parameter.model";
import {Oas30Document} from "../../models/3.0/document.model";
import {Oas30RequestBody, Oas30RequestBodyDefinition} from "../../models/3.0/request-body.model";
import {Oas30Server} from "../../models/3.0/server.model";
import {Oas30Tag} from "../../models/3.0/tag.model";
import {Oas30SecurityScheme} from "../../models/3.0/security-scheme.model";
import {Oas30ServerVariable} from "../../models/3.0/server-variable.model";

/**
 * Implements the required property validation rule.  Various model properties are either
 * required or conditionally required.  For example, the "swagger" property MUST exist
 * on the root (document) node.  This rule checks for all required and conditionally
 * required properties on all model types.
 */
export class Oas30RequiredPropertyValidationRule extends Oas30ValidationRule {

    /**
     * Called when a required property is missing.
     * @param code
     * @param node
     * @param propertyName
     * @param message
     */
    private requireProperty(code: string, node: OasNode, propertyName: string, message?: string): void {
        // No properties are required if we're dealing with a $ref
        if (this.hasValue(node["$ref"])) {
            return;
        }
        let propertyValue: any = node[propertyName];
        if (!this.isDefined(propertyValue)) {
            if (message) {
                this.report(code, node, propertyName, message);
            } else {
                this.report(code, node, propertyName, `Property "${propertyName}" is required.`);
            }
        }
    }

    /**
     * Called when a conditionally required property is missing.
     * @param node
     * @param propertyName
     * @param dependentProperty
     * @param dependentValue
     * @param message
     */
    private requirePropertyWhen(code: string, node: OasNode, propertyName: string, dependentProperty: string, dependentValue: string, message?: string): void {
        let actualDependentValue: string = node[dependentProperty] as string;
        let dependentValueMatches: boolean = actualDependentValue == dependentValue;
        if (dependentValueMatches) {
            let propertyValue: any = node[propertyName];
            if (!this.hasValue(propertyValue)) {
                if (message) {
                    this.report(code, node, propertyName, message);
                } else {
                    this.report(code, node, propertyName,
                        `Property "${propertyName}" is required when "${dependentProperty}" property is "${dependentValue}".`);
                }
            }
        }
    }

    public visitDiscriminator(node: Oas30Discriminator): void {
        this.requireProperty("DISC-3-001", node, "propertyName", "Discriminator must indicate a property (by name).");
    }

    public visitExternalDocumentation(node: Oas30ExternalDocumentation): void {
        this.requireProperty("ED-3-002", node, "url", "External Documentation is missing a URL.");
    }

    private visitOAuthFlow(node: Oas30OAuthFlow): void {
        this.requireProperty("FLOW-3-006", node, "scopes", "OAuth Flow is missing defined scopes.");
    }
    public visitImplicitOAuthFlow(node: Oas30ImplicitOAuthFlow): void {
        this.visitOAuthFlow(node);
        this.requireProperty("FLOW-3-001", node, "authorizationUrl", "Implicit OAuth Flow is missing an Authorization URL.");
    }
    public visitPasswordOAuthFlow(node: Oas30PasswordOAuthFlow): void {
        this.visitOAuthFlow(node);
        this.requireProperty("FLOW-3-002", node, "tokenUrl", "Password OAuth Flow is missing a Token URL.");
    }
    public visitClientCredentialsOAuthFlow(node: Oas30ClientCredentialsOAuthFlow): void {
        this.visitOAuthFlow(node);
        this.requireProperty("FLOW-3-002", node, "tokenUrl", "Client Credentials OAuth Flow is missing a Token URL.");
    }
    public visitAuthorizationCodeOAuthFlow(node: Oas30AuthorizationCodeOAuthFlow): void {
        this.visitOAuthFlow(node);
        this.requireProperty("FLOW-3-001", node, "authorizationUrl", "Auth Code OAuth Flow is missing an Authorization URL.");
        this.requireProperty("FLOW-3-002", node, "tokenUrl", "Auth Code OAuth Flow is missing a Token URL.");
    }

    public visitInfo(node: Oas30Info): void {
        this.requireProperty("INF-3-001", node, "title", "The API is missing a title.");
        this.requireProperty("INF-3-002", node, "version", "The API is missing a version.");
    }

    public visitLicense(node: Oas30License): void {
        this.requireProperty("LIC-3-001", node, "name", "License must have a name.");
    }

    public visitOperation(node: Oas30Operation): void {
        this.requireProperty("OP-3-004", node, "responses", "Operation must have at least one response.");
    }

    public visitParameter(node: Oas30Parameter): void {
        this.requireProperty("PAR-3-003", node, "name", "Parameter is missing a name.");
        this.requireProperty("PAR-3-004", node, "in", "Parameter location is missing.");
        this.requirePropertyWhen("PAR-3-020", node, "required", "in", "path",
            `Path Parameter must be marked as "required".`);
    }
    public visitParameterDefinition(node: Oas30ParameterDefinition): void {
        this.visitParameter(node);
    }

    public visitDocument(node: Oas30Document): void {
        this.requireProperty("R-3-001", node, "openapi");
        this.requireProperty("R-3-002", node, "info");
        this.requireProperty("R-3-003", node, "paths");
    }

    public visitRequestBody(node: Oas30RequestBody): void {
        this.requireProperty("RB-3-002", node, "content", "Request Body content is missing.");
    }
    public visitRequestBodyDefinition(node: Oas30RequestBodyDefinition): void {
        this.visitRequestBody(node);
    }

    public visitServer(node: Oas30Server): void {
        this.requireProperty("SRV-3-001", node, "url", "Server is missing a template URL.");
    }

    public visitSecurityScheme(node: Oas30SecurityScheme): void {
        this.requireProperty("SS-3-001", node, "type");
        this.requirePropertyWhen("SS-3-002", node, "name", "type", "apiKey",
            "API Key Security Scheme is missing a name (e.g. of a header or query param).");
        this.requirePropertyWhen("SS-3-003", node, "in", "type", "apiKey",
            "API Key Security Scheme must describe where the Key can be found (e.g. header, query param, etc).");
        this.requirePropertyWhen("SS-3-004", node, "scheme", "type", "http",
            "HTTP Security Scheme is missing a scheme (Basic, Digest, etc).");
        this.requirePropertyWhen("SS-3-005", node, "flows", "type", "oauth2",
            "OAuth Security Scheme does not define any OAuth flows.");
        this.requirePropertyWhen("SS-3-006", node, "openIdConnectUrl", "type", "openIdConnect",
            "OpenID Connect Security Scheme is missing a Connect URL.");
    }

    public visitServerVariable(node: Oas30ServerVariable): void {
        this.requireProperty("SVAR-3-001", node, "default", `Server Variable "${node.name()}" is missing a default value.`);
    }

    public visitTag(node: Oas30Tag): void {
        this.requireProperty("TAG-3-001", node, "name", "Tag is missing a name.");
    }

}