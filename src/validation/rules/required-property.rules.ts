/**
 * @license
 * Copyright 2019 Red Hat
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

import {Oas20Document} from "../../models/2.0/document.model";
import {OasNode} from "../../models/node.model";
import {Oas20Parameter, Oas20ParameterBase, Oas20ParameterDefinition} from "../../models/2.0/parameter.model";
import {Oas20Items} from "../../models/2.0/items.model";
import {Oas20Response} from "../../models/2.0/response.model";
import {Oas20Header} from "../../models/2.0/header.model";
import {Oas20Tag} from "../../models/2.0/tag.model";
import {Oas20SecurityScheme} from "../../models/2.0/security-scheme.model";
import {OasValidationRule} from "./common.rule";
import {Oas30Document} from "../../models/3.0/document.model";
import {OasInfo} from "../../models/common/info.model";
import {OasLicense} from "../../models/common/license.model";
import {OasOperation} from "../../models/common/operation.model";
import {OasExternalDocumentation} from "../../models/common/external-documentation.model";
import {Oas30Parameter, Oas30ParameterBase, Oas30ParameterDefinition} from "../../models/3.0/parameter.model";
import {Oas30Response} from "../../models/3.0/response.model";
import {Oas30Tag} from "../../models/3.0/tag.model";
import {Oas30SecurityScheme} from "../../models/3.0/security-scheme.model";
import {Oas30Header} from "../../models/3.0/header.model";
import {Oas30Discriminator} from "../../models/3.0/discriminator.model";
import {
    Oas30AuthorizationCodeOAuthFlow,
    Oas30ClientCredentialsOAuthFlow,
    Oas30ImplicitOAuthFlow,
    Oas30OAuthFlow,
    Oas30PasswordOAuthFlow
} from "../../models/3.0/oauth-flow.model";
import {Oas30RequestBody, Oas30RequestBodyDefinition} from "../../models/3.0/request-body.model";
import {Oas30Server} from "../../models/3.0/server.model";
import {Oas30ServerVariable} from "../../models/3.0/server-variable.model";
import {OasSchema} from "../../models/common/schema.model";
import {
    Oas30AdditionalPropertiesSchema,
    Oas30AllOfSchema,
    Oas30AnyOfSchema, Oas30ItemsSchema,
    Oas30NotSchema,
    Oas30OneOfSchema,
    Oas30PropertySchema, Oas30SchemaDefinition
} from "../../models/3.0/schema.model";

/**
 * Base class for all Required Property rules.
 */
export abstract class OasRequiredPropertyValidationRule extends OasValidationRule {

    /**
     * Called when a required property is missing.
     * @param node
     * @param propertyName
     * @param messageProperties
     */
    protected requireProperty(node: OasNode, propertyName: string, messageProperties?: any): void {
        let propertyValue: any = node[propertyName];
        if (!this.isDefined(propertyValue)) {
            this.report(node, propertyName, messageProperties);
        }
    }

    /**
     * Called when a conditionally required property is missing.
     * @param node
     * @param propertyName
     * @param dependentPropertyName
     * @param dependentPropertyExpectedValue
     * @param messageProperties
     */
    protected requirePropertyWhen(node: OasNode, propertyName: string, dependentPropertyName: string,
                                  dependentPropertyExpectedValue: any, messageProperties?: any): void {
        let dependentPropertyActualValue: any = node[dependentPropertyName];
        if (dependentPropertyActualValue === dependentPropertyExpectedValue) {
            this.requireProperty(node, propertyName, messageProperties);
        }
    }

}


/**
 * Implements the Missing Property rule.
 */
export class OasMissingOpenApiPropertyRule extends OasRequiredPropertyValidationRule {

    public visitDocument(node: Oas20Document | Oas30Document): void {
        if (node.is2xDocument()) {
            this.requireProperty(node, "swagger");
        } else {
            this.requireProperty(node, "openapi");
        }
    }

}

/**
 * Implements the Missing Property rule.
 */
export class OasMissingApiInformationRule extends OasRequiredPropertyValidationRule {

    public visitDocument(node: Oas20Document | Oas30Document): void {
        this.requireProperty(node, "info");
    }

}

/**
 * Implements the Missing Property rule.
 */
export class OasMissingApiPathsRule extends OasRequiredPropertyValidationRule {

    public visitDocument(node: Oas20Document | Oas30Document): void {
        this.requireProperty(node, "paths");
    }

}

/**
 * Implements the Missing Property rule.
 */
export class OasMissingApiTitleRule extends OasRequiredPropertyValidationRule {

    public visitInfo(node: OasInfo): void {
        this.requireProperty(node, "title");
    }

}

/**
 * Implements the Missing Property rule.
 */
export class OasMissingApiVersionRule extends OasRequiredPropertyValidationRule {

    public visitInfo(node: OasInfo): void {
        this.requireProperty(node, "version");
    }

}

/**
 * Implements the Missing Property rule.
 */
export class OasMissingLicenseNameRule extends OasRequiredPropertyValidationRule {

    public visitLicense(node: OasLicense): void {
        this.requireProperty(node, "name");
    }

}

/**
 * Implements the Missing Property rule.
 */
export class OasMissingOperationResponsesRule extends OasRequiredPropertyValidationRule {

    public visitOperation(node: OasOperation): void {
        this.requireProperty(node, "responses");
    }

}

/**
 * Implements the Missing Property rule.
 */
export class OasMissingOperationIdRule extends OasRequiredPropertyValidationRule {

    public visitOperation(node: OasOperation): void {
        this.requireProperty(node, "operationId");
    }

}

/**
 * Implements the Missing Property rule.
 */
export class OasMissingExternalDocumentationUrlRule extends OasRequiredPropertyValidationRule {

    public visitExternalDocumentation(node: OasExternalDocumentation): void {
        this.requireProperty(node, "url");
    }

}

/**
 * Implements the Missing Property rule.
 */
export class OasMissingParameterNameRule extends OasRequiredPropertyValidationRule {

    private validateParameter(node: Oas20ParameterBase | Oas30ParameterBase): void {
        if (this.hasValue(node['$ref'])) {
            return;
        }
        this.requireProperty(node, "name");
    }
    public visitParameter(node: Oas20Parameter | Oas30Parameter): void {
        this.validateParameter(node);
    }
    public visitParameterDefinition(node: Oas20ParameterDefinition | Oas30ParameterDefinition): void {
        this.validateParameter(node);
    }

}

/**
 * Implements the Missing Property rule.
 */
export class OasMissingParameterLocationRule extends OasRequiredPropertyValidationRule {

    private validateParameter(node: Oas20ParameterBase | Oas30ParameterBase): void {
        if (this.hasValue(node['$ref'])) {
            return;
        }
        this.requireProperty(node, "in");
    }
    public visitParameter(node: Oas20Parameter | Oas30Parameter): void {
        this.validateParameter(node);
    }
    public visitParameterDefinition(node: Oas20ParameterDefinition | Oas30ParameterDefinition): void {
        this.validateParameter(node);
    }

}

/**
 * Implements the Missing Property rule.
 */
export class OasPathParamsMustBeRequiredRule extends OasRequiredPropertyValidationRule {

    private validateParameter(node: Oas20ParameterBase | Oas30ParameterBase): void {
        if (node.in === "path" && node.required !== true) {
            this.report(node, "required", {
                name: node.name
            });
        }
    }
    public visitParameter(node: Oas20Parameter | Oas30Parameter): void {
        if (this.hasValue(node.$ref)) {
            return;
        }
        this.validateParameter(node);
    }
    public visitParameterDefinition(node: Oas20ParameterDefinition | Oas30ParameterDefinition): void {
        this.validateParameter(node);
    }

}

/**
 * Implements the Missing Property rule.
 */
export class OasMissingBodyParameterSchemaRule extends OasRequiredPropertyValidationRule {

    public visitParameter(node: Oas20Parameter): void {
        if (this.hasValue(node.$ref)) {
            return;
        }

        this.requirePropertyWhen(node, "schema", "in", "body");
    }

}

/**
 * Implements the Missing Property rule.
 */
export class OasMissingParameterTypeRule extends OasRequiredPropertyValidationRule {

    public visitParameter(node: Oas20Parameter | Oas30Parameter): void {
        if (this.hasValue(node.$ref)) {
            return;
        }
        if (node.in !== "body") {
            this.requireProperty(node, "type", {
                name: node.name
            });
        }
    }

}

/**
 * Implements the Missing Property rule.
 */
export class OasMissingParameterArrayTypeRule extends OasRequiredPropertyValidationRule {

    public visitParameter(node: Oas20Parameter): void {
        if (this.hasValue(node.$ref)) {
            return;
        }
        if (node.in !== "body" && node.type === "array") {
            this.requirePropertyWhen(node, "items", "type", "array", {
                name: node.name
            });
        }
    }

}

/**
 * Implements the Missing Property rule.
 */
export class OasMissingItemsTypeRule extends OasRequiredPropertyValidationRule {

    public visitItems(node: Oas20Items): void {
        this.requireProperty(node, "type");
    }

}

/**
 * Implements the Missing Property rule.
 */
export class OasMissingItemsArrayInformationRule extends OasRequiredPropertyValidationRule {

    public visitItems(node: Oas20Items): void {
        this.requirePropertyWhen(node, "items", "type", "array");
    }

}

/**
 * Implements the Missing Property rule.
 */
export class OasMissingResponseDescriptionRule extends OasRequiredPropertyValidationRule {

    public visitResponse(node: Oas20Response | Oas30Response): void {
        if (this.hasValue(node.$ref)) {
            return;
        }
        this.requireProperty(node, "description", {
            statusCode: node.statusCode()
        });
    }

}

/**
 * Implements the Missing Property rule.
 */
export class OasMissingHeaderTypeRule extends OasRequiredPropertyValidationRule {

    public visitHeader(node: Oas20Header | Oas30Header): void {
        if (this.hasValue(node['$ref'])) {
            return;
        }
        this.requireProperty(node, "type");
    }

}

/**
 * Implements the Missing Property rule.
 */
export class OasMissingHeaderArrayInformationRule extends OasRequiredPropertyValidationRule {

    public visitHeader(node: Oas20Header): void {
        this.requirePropertyWhen(node, "items", "type", "array");
    }

}


/**
 * Implements the Missing Property rule.
 */
export class OasMissingTagNameRule extends OasRequiredPropertyValidationRule {

    public visitTag(node: Oas20Tag | Oas30Tag): void {
        this.requireProperty(node, "name");
    }

}

/**
 * Implements the Missing Property rule.
 */
export class OasMissingSecuritySchemeTypeRule extends OasRequiredPropertyValidationRule {

    public visitSecurityScheme(node: Oas20SecurityScheme | Oas30SecurityScheme): void {
        if (this.hasValue(node['$ref'])) {
            return;
        }
        this.requireProperty(node, "type");
    }

}

/**
 * Implements the Missing Property rule.
 */
export class OasMissingApiKeySchemeParamNameRule extends OasRequiredPropertyValidationRule {

    public visitSecurityScheme(node: Oas20SecurityScheme | Oas30SecurityScheme): void {
        this.requirePropertyWhen(node, "name", "type", "apiKey");
    }

}

/**
 * Implements the Missing Property rule.
 */
export class OasMissingApiKeySchemeParamLocationRule extends OasRequiredPropertyValidationRule {

    public visitSecurityScheme(node: Oas20SecurityScheme | Oas30SecurityScheme): void {
        this.requirePropertyWhen(node, "in", "type", "apiKey");
    }

}

/**
 * Implements the Missing Property rule.
 */
export class OasMissingOAuthSchemeFlowTypeRule extends OasRequiredPropertyValidationRule {

    public visitSecurityScheme(node: Oas20SecurityScheme): void {
        this.requirePropertyWhen(node, "flow", "type", "oauth2");
    }

}

/**
 * Implements the Missing Property rule.
 */
export class OasMissingOAuthSchemeAuthUrlRule extends OasRequiredPropertyValidationRule {

    public visitSecurityScheme(node: Oas20SecurityScheme): void {
        if (node.type === "oauth2") {
            if ((node.flow === "implicit" || node.flow === "accessCode") && !this.isDefined(node.authorizationUrl)) {
                this.report(node, "authorizationUrl");
            }
        }
    }

}

/**
 * Implements the Missing Property rule.
 */
export class OasMissingOAuthSchemeTokenUrlRule extends OasRequiredPropertyValidationRule {

    public visitSecurityScheme(node: Oas20SecurityScheme): void {
        if (node.type === "oauth2") {
            if ((node.flow === "password" || node.flow === "application" || node.flow === "accessCode") && !this.isDefined(node.tokenUrl)) {
                this.report(node, "tokenUrl");
            }
        }
    }

}

/**
 * Implements the Missing Property rule.
 */
export class OasMissingOAuthSchemeScopesRule extends OasRequiredPropertyValidationRule {

    public visitSecurityScheme(node: Oas20SecurityScheme): void {
        if (node.type === "oauth2") {
            this.requirePropertyWhen(node, "scopes", "type", "oauth2");
        }
    }

}

/**
 * Implements the Missing Property rule.
 */
export class OasMissingDiscriminatorPropertyNameRule extends OasRequiredPropertyValidationRule {

    public visitDiscriminator(node: Oas30Discriminator): void {
        this.requireProperty(node, "propertyName");
    }

}

/**
 * Implements the Missing Property rule.
 */
export class OasMissingOAuthFlowScopesRule extends OasRequiredPropertyValidationRule {
    private visitOAuthFlow(node: Oas30OAuthFlow): void {
        this.requireProperty(node, "scopes", );
    }
    public visitImplicitOAuthFlow(node: Oas30ImplicitOAuthFlow): void {
        this.visitOAuthFlow(node);
    }
    public visitPasswordOAuthFlow(node: Oas30PasswordOAuthFlow): void {
        this.visitOAuthFlow(node);
    }
    public visitClientCredentialsOAuthFlow(node: Oas30ClientCredentialsOAuthFlow): void {
        this.visitOAuthFlow(node);
    }
    public visitAuthorizationCodeOAuthFlow(node: Oas30AuthorizationCodeOAuthFlow): void {
        this.visitOAuthFlow(node);
    }

}

/**
 * Implements the Missing Property rule.
 */
export class OasMissingOAuthFlowAuthUrlRule extends OasRequiredPropertyValidationRule {

    public visitImplicitOAuthFlow(node: Oas30ImplicitOAuthFlow): void {
        this.requireProperty(node, "authorizationUrl", {
            flowType: "Implicit"
        });
    }
    public visitAuthorizationCodeOAuthFlow(node: Oas30AuthorizationCodeOAuthFlow): void {
        this.requireProperty(node, "authorizationUrl", {
            flowType: "Auth Code"
        });
    }

}

/**
 * Implements the Missing Property rule.
 */
export class OasMissingOAuthFlowRokenUrlRule extends OasRequiredPropertyValidationRule {

    public visitPasswordOAuthFlow(node: Oas30PasswordOAuthFlow): void {
        this.requireProperty(node, "tokenUrl", {
            flowType: "Password"
        });
    }
    public visitClientCredentialsOAuthFlow(node: Oas30ClientCredentialsOAuthFlow): void {
        this.requireProperty(node, "tokenUrl", {
            flowType: "Client Credentials"
        });
    }
    public visitAuthorizationCodeOAuthFlow(node: Oas30AuthorizationCodeOAuthFlow): void {
        this.requireProperty(node, "tokenUrl", {
            flowType: "Auth Code"
        });
    }

}


/**
 * Implements the Missing Property rule.
 */
export class OasMissingRequestBodyContentRule extends OasRequiredPropertyValidationRule {

    public visitRequestBody(node: Oas30RequestBody): void {
        this.requireProperty(node, "content");
    }
    public visitRequestBodyDefinition(node: Oas30RequestBodyDefinition): void {
        this.visitRequestBody(node);
    }

}

/**
 * Implements the Missing Property rule.
 */
export class OasMissingServerTemplateUrlRule extends OasRequiredPropertyValidationRule {

    public visitServer(node: Oas30Server): void {
        this.requireProperty(node, "url");
    }

}

/**
 * Implements the Missing Property rule.
 */
export class OasMissingHttpSecuritySchemeTypeRule extends OasRequiredPropertyValidationRule {

    public visitSecurityScheme(node: Oas30SecurityScheme): void {
        this.requirePropertyWhen(node, "scheme", "type", "http");
    }

}

/**
 * Implements the Missing Property rule.
 */
export class OasMissingOAuthSecuritySchemeFlowsRule extends OasRequiredPropertyValidationRule {

    public visitSecurityScheme(node: Oas30SecurityScheme): void {
        this.requirePropertyWhen(node, "flows", "type", "oauth2");
    }

}

/**
 * Implements the Missing Property rule.
 */
export class OasMissingOpenIdConnectSecuritySchemeConnectUrlRule extends OasRequiredPropertyValidationRule {

    public visitSecurityScheme(node: Oas30SecurityScheme): void {
        this.requirePropertyWhen(node, "openIdConnectUrl", "type", "openIdConnect");
    }

}

/**
 * Implements the Missing Property rule.
 */
export class OasMissingServerVarDefaultValueRule extends OasRequiredPropertyValidationRule {

    public visitServerVariable(node: Oas30ServerVariable): void {
        this.requireProperty(node, "default", {
            name: node.name()
        });
    }

}


/**
 * Implements the Missing Property rule.
 */
export class OasMissingSchemaArrayInformationRule extends OasRequiredPropertyValidationRule {

    public visitSchema(node: OasSchema): void {
        this.requirePropertyWhen(node, "items", "type", "array");
    }

    public visitAllOfSchema(node: Oas30AllOfSchema): void { this.visitSchema(node); }
    public visitAnyOfSchema(node: Oas30AnyOfSchema): void { this.visitSchema(node); }
    public visitOneOfSchema(node: Oas30OneOfSchema): void { this.visitSchema(node); }
    public visitNotSchema(node: Oas30NotSchema): void { this.visitSchema(node); }
    public visitPropertySchema(node: Oas30PropertySchema): void { this.visitSchema(node); }
    public visitItemsSchema(node: Oas30ItemsSchema): void { this.visitSchema(node); }
    public visitAdditionalPropertiesSchema(node: Oas30AdditionalPropertiesSchema): void { this.visitSchema(node); }
    public visitSchemaDefinition(node: Oas30SchemaDefinition): void { this.visitSchema(node); }

}
