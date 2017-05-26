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
import {Oas20ExternalDocumentation} from "../models/2.0/external-documentation.model";
import {Oas20SecurityRequirement} from "../models/2.0/security-requirement.model";
import {Oas20Responses} from "../models/2.0/responses.model";
import {Oas20Response, Oas20ResponseDefinition} from "../models/2.0/response.model";
import {
    Oas20AdditionalPropertiesSchema,
    Oas20AllOfSchema,
    Oas20DefinitionSchema,
    Oas20ItemsSchema,
    Oas20PropertySchema,
    Oas20Schema
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
import {Oas30ServerVariables} from "../models/3.0/server-variables.model";
import {Oas30Server} from "../models/3.0/server.model";

/**
 * Classes that wish to visit a OAS node or tree must implement this interface.  The
 * appropriate method will be called based on the type of node being visited.
 */
export interface IOasNodeVisitor {

    visitDocument(node: OasDocument): void;

    visitInfo(node: OasInfo): void;

    visitContact(node: OasContact): void;

    visitLicense(node: OasLicense): void;

    visitExtension(node: OasExtension): void;

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

    visitDefinitionSchema(node: Oas20DefinitionSchema): void;

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

    visitServer(node: Oas30Server): void;

    visitServerVariables(node: Oas30ServerVariables): void;

    visitServerVariable(node: Oas30ServerVariable): void;

}
