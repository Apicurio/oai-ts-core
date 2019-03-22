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

import {OasNode, OasValidationProblem} from "../../models/node.model";
import {
    Oas20AdditionalPropertiesSchema,
    Oas20AllOfSchema,
    Oas20ItemsSchema,
    Oas20PropertySchema,
    Oas20SchemaDefinition
} from "../../models/2.0/schema.model";
import {OasExtension} from "../../models/extension.model";
import {Oas20Parameter, Oas20ParameterDefinition} from "../../models/2.0/parameter.model";
import {Oas20Response, Oas20ResponseDefinition} from "../../models/2.0/response.model";
import {Oas20Headers} from "../../models/2.0/headers.model";
import {Oas20Example} from "../../models/2.0/example.model";
import {Oas20Items} from "../../models/2.0/items.model";
import {Oas20SecurityDefinitions} from "../../models/2.0/security-definitions.model";
import {Oas20Scopes} from "../../models/2.0/scopes.model";
import {Oas20Definitions} from "../../models/2.0/definitions.model";
import {Oas20ParametersDefinitions} from "../../models/2.0/parameters-definitions.model";
import {Oas20ResponsesDefinitions} from "../../models/2.0/responses-definitions.model";
import {OasValidationRule} from "./common.rule";
import {OasDocument} from "../../models/document.model";
import {OasInfo} from "../../models/common/info.model";
import {OasContact} from "../../models/common/contact.model";
import {OasLicense} from "../../models/common/license.model";
import {OasPaths} from "../../models/common/paths.model";
import {OasPathItem} from "../../models/common/path-item.model";
import {OasOperation} from "../../models/common/operation.model";
import {Oas30Parameter, Oas30ParameterDefinition} from "../../models/3.0/parameter.model";
import {OasExternalDocumentation} from "../../models/common/external-documentation.model";
import {OasSecurityRequirement} from "../../models/common/security-requirement.model";
import {OasResponses} from "../../models/common/responses.model";
import {Oas30Response, Oas30ResponseDefinition} from "../../models/3.0/response.model";
import {OasSchema} from "../../models/common/schema.model";
import {OasHeader} from "../../models/common/header.model";
import {Oas30Example, Oas30ExampleDefinition} from "../../models/3.0/example.model";
import {OasTag} from "../../models/common/tag.model";
import {OasSecurityScheme} from "../../models/common/security-scheme.model";
import {OasXML} from "../../models/common/xml.model";
import {
    Oas30AdditionalPropertiesSchema,
    Oas30AllOfSchema,
    Oas30AnyOfSchema,
    Oas30ItemsSchema,
    Oas30NotSchema,
    Oas30OneOfSchema,
    Oas30PropertySchema,
    Oas30SchemaDefinition
} from "../../models/3.0/schema.model";
import {Oas30MediaType} from "../../models/3.0/media-type.model";
import {Oas30Encoding} from "../../models/3.0/encoding.model";
import {Oas30Link, Oas30LinkDefinition} from "../../models/3.0/link.model";
import {Oas30LinkParameterExpression} from "../../models/3.0/link-parameter-expression.model";
import {Oas30LinkRequestBodyExpression} from "../../models/3.0/link-request-body-expression.model";
import {Oas30LinkServer, Oas30Server} from "../../models/3.0/server.model";
import {Oas30RequestBody, Oas30RequestBodyDefinition} from "../../models/3.0/request-body.model";
import {Oas30Callback, Oas30CallbackDefinition} from "../../models/3.0/callback.model";
import {Oas30CallbackPathItem} from "../../models/3.0/path-item.model";
import {Oas30ServerVariable} from "../../models/3.0/server-variable.model";
import {Oas30Components} from "../../models/3.0/components.model";
import {Oas30HeaderDefinition} from "../../models/3.0/header.model";
import {Oas30OAuthFlows} from "../../models/3.0/oauth-flows.model";
import {
    Oas30AuthorizationCodeOAuthFlow,
    Oas30ClientCredentialsOAuthFlow,
    Oas30ImplicitOAuthFlow,
    Oas30PasswordOAuthFlow
} from "../../models/3.0/oauth-flow.model";
import {Oas30Discriminator} from "../../models/3.0/discriminator.model";


/**
 * Implements the Unknown Property rule.
 */
export class OasUnknownPropertyRule extends OasValidationRule {

    protected validateNode(node: OasNode): void {
        if (node.hasExtraProperties()) {
            node.getExtraPropertyNames().forEach( pname => {
                this.report(node, pname, {
                    property: pname
                });
            })
        }
    }

    visitDocument(node: OasDocument): void { this.validateNode(node); }
    visitInfo(node: OasInfo): void { this.validateNode(node); }
    visitContact(node: OasContact): void { this.validateNode(node); }
    visitLicense(node: OasLicense): void { this.validateNode(node); }
    visitPaths(node: OasPaths): void { this.validateNode(node); }
    visitPathItem(node: OasPathItem): void { this.validateNode(node); }
    visitOperation(node: OasOperation): void { this.validateNode(node); }
    visitParameter(node: Oas20Parameter | Oas30Parameter): void { this.validateNode(node); }
    visitParameterDefinition(node: Oas20ParameterDefinition | Oas30ParameterDefinition): void { this.validateNode(node); }
    visitExternalDocumentation(node: OasExternalDocumentation): void { this.validateNode(node); }
    visitSecurityRequirement(node: OasSecurityRequirement): void { this.validateNode(node); }
    visitResponses(node: OasResponses): void { this.validateNode(node); }
    visitResponse(node: Oas20Response | Oas30Response): void { this.validateNode(node); }
    visitResponseDefinition(node: Oas20ResponseDefinition | Oas30ResponseDefinition): void { this.validateNode(node); }
    visitSchema(node: OasSchema): void { this.validateNode(node); }
    visitHeaders(node: Oas20Headers): void { this.validateNode(node); }
    visitHeader(node: OasHeader): void { this.validateNode(node); }
    visitExample(node: Oas20Example | Oas30Example): void { this.validateNode(node); }
    visitItems(node: Oas20Items): void { this.validateNode(node); }
    visitTag(node: OasTag): void { this.validateNode(node); }
    visitSecurityDefinitions(node: Oas20SecurityDefinitions): void { this.validateNode(node); }
    visitSecurityScheme(node: OasSecurityScheme): void { this.validateNode(node); }
    visitScopes(node: Oas20Scopes): void { this.validateNode(node); }
    visitXML(node: OasXML): void { this.validateNode(node); }
    visitSchemaDefinition(node: Oas20SchemaDefinition | Oas30SchemaDefinition): void { this.validateNode(node); }
    visitPropertySchema(node: Oas20PropertySchema | Oas30PropertySchema): void { this.validateNode(node); }
    visitAdditionalPropertiesSchema(node: Oas20AdditionalPropertiesSchema | Oas30AdditionalPropertiesSchema): void { this.validateNode(node); }
    visitAllOfSchema(node: Oas20AllOfSchema | Oas30AllOfSchema): void { this.validateNode(node); }
    visitItemsSchema(node: Oas20ItemsSchema | Oas30ItemsSchema): void { this.validateNode(node); }
    visitDefinitions(node: Oas20Definitions): void { this.validateNode(node); }
    visitParametersDefinitions(node: Oas20ParametersDefinitions): void { this.validateNode(node); }
    visitResponsesDefinitions(node: Oas20ResponsesDefinitions): void { this.validateNode(node); }
    visitExtension(node: OasExtension): void { this.validateNode(node); }
    visitMediaType(node: Oas30MediaType): void { this.validateNode(node); }
    visitEncoding(node: Oas30Encoding): void { this.validateNode(node); }
    visitLink(node: Oas30Link): void { this.validateNode(node); }
    visitLinkParameterExpression(node: Oas30LinkParameterExpression): void { this.validateNode(node); }
    visitLinkRequestBodyExpression(node: Oas30LinkRequestBodyExpression): void { this.validateNode(node); }
    visitLinkServer(node: Oas30LinkServer): void { this.validateNode(node); }
    visitRequestBody(node: Oas30RequestBody): void { this.validateNode(node); }
    visitCallback(node: Oas30Callback): void { this.validateNode(node); }
    visitCallbackPathItem(node: Oas30CallbackPathItem): void { this.validateNode(node); }
    visitServer(node: Oas30Server): void { this.validateNode(node); }
    visitServerVariable(node: Oas30ServerVariable): void { this.validateNode(node); }
    visitAnyOfSchema(node: Oas30AnyOfSchema): void { this.validateNode(node); }
    visitOneOfSchema(node: Oas30OneOfSchema): void { this.validateNode(node); }
    visitNotSchema(node: Oas30NotSchema): void { this.validateNode(node); }
    visitComponents(node: Oas30Components): void { this.validateNode(node); }
    visitExampleDefinition(node: Oas30ExampleDefinition): void { this.validateNode(node); }
    visitRequestBodyDefinition(node: Oas30RequestBodyDefinition): void { this.validateNode(node); }
    visitHeaderDefinition(node: Oas30HeaderDefinition): void { this.validateNode(node); }
    visitOAuthFlows(node: Oas30OAuthFlows): void { this.validateNode(node); }
    visitImplicitOAuthFlow(node: Oas30ImplicitOAuthFlow): void { this.validateNode(node); }
    visitPasswordOAuthFlow(node: Oas30PasswordOAuthFlow): void { this.validateNode(node); }
    visitClientCredentialsOAuthFlow(node: Oas30ClientCredentialsOAuthFlow): void { this.validateNode(node); }
    visitAuthorizationCodeOAuthFlow(node: Oas30AuthorizationCodeOAuthFlow): void { this.validateNode(node); }
    visitLinkDefinition(node: Oas30LinkDefinition): void { this.validateNode(node); }
    visitCallbackDefinition(node: Oas30CallbackDefinition): void { this.validateNode(node); }
    visitDiscriminator(node: Oas30Discriminator): void { this.validateNode(node); }
    visitValidationProblem(node: OasValidationProblem): void { this.validateNode(node); }
}
