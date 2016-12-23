/**
 * @license
 * Copyright 2016 JBoss Inc
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

import {IOas20NodeVisitor} from "./visitor.iface";
import {Oas20Document} from "../models/2.0/document.model";
import {Oas20Info} from "../models/2.0/info.model";
import {Oas20Contact} from "../models/2.0/contact.model";
import {Oas20License} from "../models/2.0/license.model";
import {OasExtension} from "../models/extension.model";
import {Oas20Paths} from "../models/2.0/paths.model";
import {Oas20PathItem} from "../models/2.0/path-item.model";
import {Oas20Operation} from "../models/2.0/operation.model";
import {Oas20Parameter, Oas20ParameterDefinition} from "../models/2.0/parameter.model";
import {Oas20ExternalDocumentation} from "../models/2.0/external-documentation.model";
import {Oas20SecurityRequirement} from "../models/2.0/security-requirement.model";
import {Oas20Responses} from "../models/2.0/responses.model";
import {Oas20Response, Oas20ResponseDefinition} from "../models/2.0/response.model";
import {
    Oas20Schema, Oas20PropertySchema, Oas20AdditionalPropertiesSchema,
    Oas20AllOfSchema, Oas20DefinitionSchema, Oas20ItemsSchema
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
import {OasNodePath} from "../models/node-path";

/**
 * A visitor used to create a node path for any given node.  Here are some examples
 * of node paths:
 *
 * - The root document:
 *   /
 *
 * - An 'Info' object
 *   /info
 *
 * - A GET operation from pet-store:
 *   /paths[/pet/findByStatus]/get
 *
 * - External Documentation for a tag:
 *   /tags[2]/externalDocs
 *
 */
export class Oas20NodePathVisitor implements IOas20NodeVisitor {

    private _path: OasNodePath = new OasNodePath();
    private _index: string | number;

    public path(): OasNodePath {
        return this._path;
    }

    visitDocument(node: Oas20Document): void {
        // Nothing to do for the root
    }

    visitInfo(node: Oas20Info): void {
        this._path.prependSegment("info");
    }

    visitContact(node: Oas20Contact): void {
        this._path.prependSegment("contact");
    }

    visitLicense(node: Oas20License): void {
        this._path.prependSegment("license");
    }

    visitPaths(node: Oas20Paths): void {
        this._path.prependSegment("paths", this._index);
        this._index = undefined;
    }

    visitPathItem(node: Oas20PathItem): void {
        this._index = node.path();
    }

    visitOperation(node: Oas20Operation): void {
        this._path.prependSegment(node.method());
    }

    visitParameter(node: Oas20Parameter): void {
        let params: Oas20Parameter[] = (<any>node.parent()).parameters;
        let idx: number = 0;
        for (let param of params) {
            if (param === node) {
                this._path.prependSegment("parameters", idx);
                break;
            } else {
                idx++;
            }
        }
    }

    visitParameterDefinition(node: Oas20ParameterDefinition): void {
        this._index = node.parameterName();
    }

    visitExternalDocumentation(node: Oas20ExternalDocumentation): void {
        this._path.prependSegment("externalDocs");
    }

    visitSecurityRequirement(node: Oas20SecurityRequirement): void {
        let securityRequirements: Oas20SecurityRequirement[] = (<any>node.parent()).security;
        let idx: number = 0;
        for (let securityRequirement of securityRequirements) {
            if (securityRequirement === node) {
                this._path.prependSegment("security", idx);
                break;
            } else {
                idx++;
            }
        }
    }

    visitResponses(node: Oas20Responses): void {
        this._path.prependSegment("responses", this._index);
        this._index = undefined;
    }

    visitResponse(node: Oas20Response): void {
        this._index = node.statusCode();
    }

    visitResponseDefinition(node: Oas20ResponseDefinition): void {
        this._index = node.name();
    }

    visitSchema(node: Oas20Schema): void {
        this._path.prependSegment("schema");
    }

    visitHeaders(node: Oas20Headers): void {
        this._path.prependSegment("headers", this._index);
        this._index = undefined;
    }

    visitHeader(node: Oas20Header): void {
        this._index = node.headerName();
    }

    visitExample(node: Oas20Example): void {
        this._path.prependSegment("examples");
    }

    visitItems(node: Oas20Items): void {
        this._path.prependSegment("items");
    }

    visitTag(node: Oas20Tag): void {
        let tags: Oas20Tag[] = (<any>node.parent()).tags;
        let idx: number = 0;
        for (let tag of tags) {
            if (tag === node) {
                this._path.prependSegment("tags", idx);
                break;
            } else {
                idx++;
            }
        }
    }

    visitSecurityDefinitions(node: Oas20SecurityDefinitions): void {
        this._path.prependSegment("securityDefinitions", this._index);
        this._index = undefined;
    }

    visitSecurityScheme(node: Oas20SecurityScheme): void {
        this._index = node.name;
    }

    visitScopes(node: Oas20Scopes): void {
        this._path.prependSegment("scopes");
    }

    visitXML(node: Oas20XML): void {
        this._path.prependSegment("xml");
    }

    visitDefinitionSchema(node: Oas20DefinitionSchema): void {
        this._index = node.definitionName();
    }

    visitPropertySchema(node: Oas20PropertySchema): void {
        this._path.prependSegment("properties", node.propertyName());
    }

    visitAdditionalPropertiesSchema(node: Oas20AdditionalPropertiesSchema): void {
        this._path.prependSegment("additionalProperties");
    }

    visitAllOfSchema(node: Oas20AllOfSchema): void {
        let schemas: Oas20AllOfSchema[] = (<any>node.parent()).allOf;
        let idx: number = 0;
        for (let schema of schemas) {
            if (schema === node) {
                this._path.prependSegment("allOf", idx);
                break;
            } else {
                idx++;
            }
        }
    }

    visitItemsSchema(node: Oas20ItemsSchema): void {
        let schemas: Oas20AllOfSchema[] = (<any>node.parent()).items;
        if (Array.isArray(schemas)) {
            let idx: number = 0;
            for (let schema of schemas) {
                if (schema === node) {
                    this._path.prependSegment("items", idx);
                    break;
                } else {
                    idx++;
                }
            }
        } else {
            this._path.prependSegment("items");
        }
    }

    visitDefinitions(node: Oas20Definitions): void {
        this._path.prependSegment("definitions", this._index);
        this._index = undefined;
    }

    visitParametersDefinitions(node: Oas20ParametersDefinitions): void {
        this._path.prependSegment("parameters", this._index);
        this._index = undefined;
    }

    visitResponsesDefinitions(node: Oas20ResponsesDefinitions): void {
        this._path.prependSegment("responses", this._index);
        this._index = undefined;
    }

    visitExtension(node: OasExtension): void {
        this._path.prependSegment(node.name);
    }

}
