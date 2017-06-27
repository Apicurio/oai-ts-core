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

import {OasDocument} from "../models/document.model";
import {OasExtension} from "../models/extension.model";
import {Oas20Document} from "../models/2.0/document.model";
import {Oas20Info} from "../models/2.0/info.model";
import {Oas20Contact} from "../models/2.0/contact.model";
import {Oas20License} from "../models/2.0/license.model";
import {Oas20Paths} from "../models/2.0/paths.model";
import {Oas20PathItem} from "../models/2.0/path-item.model";
import {Oas20Operation} from "../models/2.0/operation.model";
import {Oas20Parameter, Oas20ParameterDefinition} from "../models/2.0/parameter.model";
import {Oas20Responses} from "../models/2.0/responses.model";
import {Oas20Response, Oas20ResponseDefinition} from "../models/2.0/response.model";
import {
    Oas20AdditionalPropertiesSchema,
    Oas20AllOfSchema,
    Oas20ItemsSchema,
    Oas20PropertySchema,
    Oas20Schema,
    Oas20SchemaDefinition
} from "../models/2.0/schema.model";
import {Oas20Headers} from "../models/2.0/headers.model";
import {Oas20Header} from "../models/2.0/header.model";
import {Oas20Example} from "../models/2.0/example.model";
import {Oas20Items} from "../models/2.0/items.model";
import {Oas20Tag} from "../models/2.0/tag.model";
import {Oas20SecurityDefinitions} from "../models/2.0/security-definitions.model";
import {Oas20SecurityScheme} from "../models/2.0/security-scheme.model";
import {Oas20Scopes} from "../models/2.0/scopes.model";
import {Oas20XML} from "../models/2.0/xml.model";
import {Oas20Definitions} from "../models/2.0/definitions.model";
import {Oas20ParametersDefinitions} from "../models/2.0/parameters-definitions.model";
import {Oas20ResponsesDefinitions} from "../models/2.0/responses-definitions.model";
import {OasInfo} from "../models/common/info.model";
import {OasContact} from "../models/common/contact.model";
import {OasLicense} from "../models/common/license.model";
import {Oas30Document} from "../models/3.0/document.model";
import {Oas30Info} from "../models/3.0/info.model";
import {Oas30Contact} from "../models/3.0/contact.model";
import {Oas30License} from "../models/3.0/license.model";
import {Oas30ServerVariable} from "../models/3.0/server-variable.model";
import {Oas30LinkServer, Oas30Server} from "../models/3.0/server.model";
import {OasSecurityRequirement} from "../models/common/security-requirement.model";
import {OasExternalDocumentation} from "../models/common/external-documentation.model";
import {OasTag} from "../models/common/tag.model";
import {Oas20ExternalDocumentation} from "../models/2.0/external-documentation.model";
import {Oas20SecurityRequirement} from "../models/2.0/security-requirement.model";
import {Oas30ExternalDocumentation} from "../models/3.0/external-documentation.model";
import {Oas30SecurityRequirement} from "../models/3.0/security-requirement.model";
import {Oas30Tag} from "../models/3.0/tag.model";
import {OasPaths} from "../models/common/paths.model";
import {OasPathItem} from "../models/common/path-item.model";
import {Oas30Paths} from "../models/3.0/paths.model";
import {Oas30CallbackPathItem, Oas30PathItem} from "../models/3.0/path-item.model";
import {Oas30RequestBody, Oas30RequestBodyDefinition} from "../models/3.0/request-body.model";
import {OasOperation} from "../models/common/operation.model";
import {Oas30Operation} from "../models/3.0/operation.model";
import {OasResponses} from "../models/common/responses.model";
import {Oas30Responses} from "../models/3.0/responses.model";
import {
    Oas30AdditionalPropertiesSchema,
    Oas30AllOfSchema,
    Oas30AnyOfSchema,
    Oas30ItemsSchema,
    Oas30NotSchema,
    Oas30OneOfSchema,
    Oas30PropertySchema,
    Oas30Schema,
    Oas30SchemaDefinition
} from "../models/3.0/schema.model";
import {OasHeader} from "../models/common/header.model";
import {Oas30Response, Oas30ResponseDefinition} from "../models/3.0/response.model";
import {OasSchema} from "../models/common/schema.model";
import {Oas30Parameter, Oas30ParameterDefinition} from "../models/3.0/parameter.model";
import {Oas30Header, Oas30HeaderDefinition} from "../models/3.0/header.model";
import {OasXML} from "../models/common/xml.model";
import {Oas30XML} from "../models/3.0/xml.model";
import {Oas30MediaType} from "../models/3.0/media-type.model";
import {Oas30Example, Oas30ExampleDefinition} from "../models/3.0/example.model";
import {Oas30Link, Oas30LinkDefinition} from "../models/3.0/link.model";
import {Oas30LinkParameterExpression} from "../models/3.0/link-parameter-expression.model";
import {Oas30Callback, Oas30CallbackDefinition} from "../models/3.0/callback.model";
import {Oas30Components} from "../models/3.0/components.model";
import {OasSecurityScheme} from "../models/common/security-scheme.model";
import {Oas30OAuthFlows} from "../models/3.0/oauth-flows.model";
import {
    Oas30AuthorizationCodeOAuthFlow,
    Oas30ClientCredentialsOAuthFlow,
    Oas30ImplicitOAuthFlow,
    Oas30PasswordOAuthFlow
} from "../models/3.0/oauth-flow.model";
import {Oas30SecurityScheme} from "../models/3.0/security-scheme.model";
import {Oas30Encoding} from "../models/3.0/encoding.model";
import {Oas30LinkRequestBodyExpression} from "../models/3.0/link-request-body-expression.model";
import {Oas30Discriminator} from "../models/3.0/discriminator.model";


/**
 * Classes that wish to visit a OAS node or tree must implement this interface.  The
 * appropriate method will be called based on the type of node being visited.
 */
export interface IOasNodeVisitor {

    visitDocument(node: OasDocument): void;
    visitInfo(node: OasInfo): void;
    visitContact(node: OasContact): void;
    visitLicense(node: OasLicense): void;
    visitPaths(node: OasPaths): void;
    visitPathItem(node: OasPathItem): void;
    visitOperation(node: OasOperation): void;
    visitResponses(node: OasResponses): void;
    visitHeader(node: OasHeader): void;
    visitSchema(node: OasSchema): void;
    visitXML(node: OasXML): void;
    visitSecurityRequirement(node: OasSecurityRequirement): void;
    visitTag(node: OasTag): void;
    visitExternalDocumentation(node: OasExternalDocumentation): void;
    visitExtension(node: OasExtension): void;
    visitSecurityScheme(node: OasSecurityScheme): void;

}

/**
 * Extends the base node visitor to support visiting an OAS 2.0 document.
 */
export interface IOas20NodeVisitor extends IOasNodeVisitor {

    visitDocument(node: Oas20Document): void;
    visitInfo(node: Oas20Info): void;
    visitContact(node: Oas20Contact): void;
    visitLicense(node: Oas20License): void;
    visitPaths(node: Oas20Paths): void;
    visitPathItem(node: Oas20PathItem): void;
    visitOperation(node: Oas20Operation): void;
    visitParameter(node: Oas20Parameter): void;
    visitParameterDefinition(node: Oas20ParameterDefinition): void;
    visitExternalDocumentation(node: Oas20ExternalDocumentation): void;
    visitSecurityRequirement(node: Oas20SecurityRequirement): void;
    visitResponses(node: Oas20Responses): void;
    visitResponse(node: Oas20Response): void;
    visitResponseDefinition(node: Oas20ResponseDefinition): void;
    visitSchema(node: Oas20Schema): void;
    visitHeaders(node: Oas20Headers): void;
    visitHeader(node: Oas20Header): void;
    visitExample(node: Oas20Example): void;
    visitItems(node: Oas20Items): void;
    visitTag(node: Oas20Tag): void;
    visitSecurityDefinitions(node: Oas20SecurityDefinitions): void;
    visitSecurityScheme(node: Oas20SecurityScheme): void;
    visitScopes(node: Oas20Scopes): void;
    visitXML(node: Oas20XML): void;
    visitSchemaDefinition(node: Oas20SchemaDefinition): void;
    visitPropertySchema(node: Oas20PropertySchema): void;
    visitAdditionalPropertiesSchema(node: Oas20AdditionalPropertiesSchema): void;
    visitAllOfSchema(node: Oas20AllOfSchema): void;
    visitItemsSchema(node: Oas20ItemsSchema): void;
    visitDefinitions(node: Oas20Definitions): void;
    visitParametersDefinitions(node: Oas20ParametersDefinitions): void;
    visitResponsesDefinitions(node: Oas20ResponsesDefinitions): void;

}


export interface IOas30NodeVisitor extends IOasNodeVisitor {

    visitDocument(node: Oas30Document): void;
    visitInfo(node: Oas30Info): void;
    visitContact(node: Oas30Contact): void;
    visitLicense(node: Oas30License): void;
    visitPaths(node: Oas30Paths): void;
    visitPathItem(node: Oas30PathItem): void;
    visitOperation(node: Oas30Operation): void;
    visitParameter(node: Oas30Parameter): void;
    visitParameterDefinition(node: Oas30ParameterDefinition): void;
    visitResponses(node: Oas30Responses): void;
    visitResponse(node: Oas30Response): void;
    visitMediaType(node: Oas30MediaType): void;
    visitEncoding(node: Oas30Encoding): void;
    visitExample(node: Oas30Example): void;
    visitLink(node: Oas30Link): void;
    visitLinkParameterExpression(node: Oas30LinkParameterExpression): void;
    visitLinkRequestBodyExpression(node: Oas30LinkRequestBodyExpression): void;
    visitLinkServer(node: Oas30LinkServer): void;
    visitResponseDefinition(node: Oas30ResponseDefinition): void;
    visitSchema(node: Oas30Schema): void;
    visitXML(node: Oas30XML): void;
    visitHeader(node: Oas30Header): void;
    visitRequestBody(node: Oas30RequestBody): void;
    visitCallback(node: Oas30Callback): void;
    visitCallbackPathItem(node: Oas30CallbackPathItem): void;
    visitServer(node: Oas30Server): void;
    visitServerVariable(node: Oas30ServerVariable): void;
    visitSecurityRequirement(node: Oas30SecurityRequirement): void;
    visitTag(node: Oas30Tag): void;
    visitExternalDocumentation(node: Oas30ExternalDocumentation): void;
    visitAllOfSchema(node: Oas30AllOfSchema): void;
    visitAnyOfSchema(node: Oas30AnyOfSchema): void;
    visitOneOfSchema(node: Oas30OneOfSchema): void;
    visitNotSchema(node: Oas30NotSchema): void;
    visitPropertySchema(node: Oas30PropertySchema): void;
    visitItemsSchema(node: Oas30ItemsSchema): void;
    visitAdditionalPropertiesSchema(node: Oas30AdditionalPropertiesSchema): void;
    visitComponents(node: Oas30Components): void;
    visitSchemaDefinition(node: Oas30SchemaDefinition): void;
    visitExampleDefinition(node: Oas30ExampleDefinition): void;
    visitRequestBodyDefinition(node: Oas30RequestBodyDefinition): void;
    visitHeaderDefinition(node: Oas30HeaderDefinition): void;
    visitOAuthFlows(node: Oas30OAuthFlows): void;
    visitImplicitOAuthFlow(node: Oas30ImplicitOAuthFlow): void;
    visitPasswordOAuthFlow(node: Oas30PasswordOAuthFlow): void;
    visitClientCredentialsOAuthFlow(node: Oas30ClientCredentialsOAuthFlow): void;
    visitAuthorizationCodeOAuthFlow(node: Oas30AuthorizationCodeOAuthFlow): void;
    visitSecurityScheme(node: Oas30SecurityScheme): void;
    visitLinkDefinition(node: Oas30LinkDefinition): void;
    visitCallbackDefinition(node: Oas30CallbackDefinition): void;
    visitDiscriminator(node: Oas30Discriminator): void;

}
