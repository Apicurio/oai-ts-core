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
    Oas20Schema, Oas20PropertySchema, Oas20AdditionalPropertiesSchema,
    Oas20AllOfSchema, Oas20DefinitionSchema, Oas20ItemsSchema
} from "../models/2.0/schema.model";
import {Oas20Headers} from "../models/2.0/headers.model";
import {Oas20Header} from "../models/2.0/header.model";
import {Oas20Example} from "../models/2.0/example.model";
import {Oas20Items} from "../models/2.0/items.model";
import {IOasNodeVisitor, IOas20NodeVisitor, IOas30NodeVisitor} from "./visitor.iface";
import {Oas20Tag} from "../models/2.0/tag.model";
import {Oas20SecurityDefinitions} from "../models/2.0/security-definitions.model";
import {Oas20SecurityScheme} from "../models/2.0/security-scheme.model";
import {Oas20Scopes} from "../models/2.0/scopes.model";
import {Oas20XML} from "../models/2.0/xml.model";
import {Oas20Definitions} from "../models/2.0/definitions.model";
import {Oas20ParametersDefinitions} from "../models/2.0/parameters-definitions.model";
import {Oas20ResponsesDefinitions} from "../models/2.0/responses-definitions.model";
import {Oas20Document} from "../models/2.0/document.model";
import {OasNode} from "../models/node.model";
import {OasInfo} from "../models/common/info.model";
import {OasContact} from "../models/common/contact.model";
import {OasLicense} from "../models/common/license.model";
import {Oas30ServerVariable} from "../models/3.0/server-variable.model";
import {Oas30ServerVariables} from "../models/3.0/server-variables.model";
import {Oas30Server} from "../models/3.0/server.model";

/**
 * Base class for node visitors that are only interested in a subset of the node types
 * that might be visited.  Extending this class means that subclasses can only override
 * the subset of methods desired.
 */
export abstract class OasNodeVisitorAdapter implements IOasNodeVisitor {
    public visitDocument(node: OasDocument) {}
    public visitInfo(node: OasInfo): void {}
    public visitContact(node: OasContact): void {}
    public visitLicense(node: OasLicense): void {}
    public visitSecurityRequirement(node: Oas20SecurityRequirement): void {}
    public visitExtension(node: OasExtension) {}
}


/**
 * Base class for OAS 2.0 node visitors that are only interested in a subset of the node types
 * that might be visited.  Extending this class means that subclasses can only override
 * the subset of methods desired.
 */
export class Oas20NodeVisitorAdapter extends OasNodeVisitorAdapter implements IOas20NodeVisitor {
    public visitPaths(node: Oas20Paths): void {}
    public visitPathItem(node: Oas20PathItem): void {}
    public visitOperation(node: Oas20Operation): void {}
    public visitParameter(node: Oas20Parameter): void {}
    public visitParameterDefinition(node: Oas20ParameterDefinition): void {}
    public visitExternalDocumentation(node: Oas20ExternalDocumentation): void {}
    public visitResponses(node: Oas20Responses): void {}
    public visitResponse(node: Oas20Response): void {}
    public visitResponseDefinition(node: Oas20ResponseDefinition): void {}
    public visitSchema(node: Oas20Schema): void {}
    public visitHeaders(node: Oas20Headers): void {}
    public visitHeader(node: Oas20Header): void {}
    public visitExample(node: Oas20Example): void {}
    public visitItems(node: Oas20Items): void {}
    public visitTag(node: Oas20Tag): void {}
    public visitSecurityDefinitions(node: Oas20SecurityDefinitions): void {}
    public visitSecurityScheme(node: Oas20SecurityScheme): void {}
    public visitScopes(node: Oas20Scopes): void {}
    public visitXML(node: Oas20XML): void {}
    public visitPropertySchema(node: Oas20PropertySchema): void {}
    public visitAdditionalPropertiesSchema(node: Oas20AdditionalPropertiesSchema): void {}
    public visitItemsSchema(node: Oas20ItemsSchema): void {}
    public visitAllOfSchema(node: Oas20AllOfSchema): void {}
    public visitDefinitionSchema(node: Oas20DefinitionSchema): void {}
    public visitDefinitions(node: Oas20Definitions): void {}
    public visitParametersDefinitions(node: Oas20ParametersDefinitions): void {}
    public visitResponsesDefinitions(node: Oas20ResponsesDefinitions): void {}
}


/**
 * Base class for OAS 3.0 node visitors that are only interested in a subset of the node types
 * that might be visited.  Extending this class means that subclasses can only override
 * the subset of methods desired.
 */
export class Oas30NodeVisitorAdapter extends OasNodeVisitorAdapter implements IOas30NodeVisitor {
    public visitServer(node: Oas30Server): void {}
    public visitServerVariables(node: Oas30ServerVariables): void {}
    public visitServerVariable(node: Oas30ServerVariable): void {}
}


/**
 * A composite visitor - this class makes it easy to apply multiple visitors to
 * a node at the same time.  It's basically just an array of visitors.
 */
export abstract class OasCompositeVisitor implements IOasNodeVisitor {

    private _visitors: IOasNodeVisitor[];

    /**
     * Constructor.
     * @param visitors
     */
    constructor(visitors: IOasNodeVisitor[]) {
        this._visitors = visitors;
    }

    /**
     * Adds a single visitor to the list.
     * @param visitor
     */
    public addVisitor(visitor: IOasNodeVisitor): void {
        this._visitors.push(visitor);
    }

    /**
     * Adds multiple visitors to the list.
     * @param visitors
     */
    public addVisitors(visitors: IOasNodeVisitor[]): void {
        for (let visitor of visitors) {
            this._visitors.push(visitor);
        }
    }

    /**
     * Called to accept all of the visitors contained by this composite.  This basically
     * iterates through all the visitors and calls node.accept(visitor) on each.
     * @param node
     * @private
     */
    protected _acceptAll(node: OasNode): void {
        this._visitors.every((visitor) => {
            node.accept(visitor);
            return true;
        });
    }

    visitDocument(node: OasDocument): void { this._acceptAll(node); }
    visitInfo(node: OasInfo): void { this._acceptAll(node); }
    visitContact(node: OasContact): void { this._acceptAll(node); }
    visitLicense(node: OasLicense): void { this._acceptAll(node); }
    visitSecurityRequirement(node: Oas20SecurityRequirement): void { this._acceptAll(node); }
    visitExtension(node: OasExtension): void { this._acceptAll(node); }

}

/**
 * A composite visitor - this class makes it easy to apply multiple visitors to
 * a node at the same time.  It's basically just an array of visitors.
 */
export class Oas20CompositeVisitor extends OasCompositeVisitor implements IOas20NodeVisitor {

    /**
     * Constructor.
     * @param visitors
     */
    constructor(...visitors: IOas20NodeVisitor[]) {
        super(visitors);
    }

    visitPaths(node: Oas20Paths): void { this._acceptAll(node); }
    visitPathItem(node: Oas20PathItem): void { this._acceptAll(node); }
    visitOperation(node: Oas20Operation): void { this._acceptAll(node); }
    visitParameter(node: Oas20Parameter): void { this._acceptAll(node); }
    visitParameterDefinition(node: Oas20ParameterDefinition): void { this._acceptAll(node); }
    visitExternalDocumentation(node: Oas20ExternalDocumentation): void { this._acceptAll(node); }
    visitResponses(node: Oas20Responses): void { this._acceptAll(node); }
    visitResponse(node: Oas20Response): void { this._acceptAll(node); }
    visitResponseDefinition(node: Oas20ResponseDefinition): void { this._acceptAll(node); }
    visitSchema(node: Oas20Schema): void { this._acceptAll(node); }
    visitHeaders(node: Oas20Headers): void { this._acceptAll(node); }
    visitHeader(node: Oas20Header): void { this._acceptAll(node); }
    visitExample(node: Oas20Example): void { this._acceptAll(node); }
    visitItems(node: Oas20Items): void { this._acceptAll(node); }
    visitTag(node: Oas20Tag): void { this._acceptAll(node); }
    visitSecurityDefinitions(node: Oas20SecurityDefinitions): void { this._acceptAll(node); }
    visitSecurityScheme(node: Oas20SecurityScheme): void { this._acceptAll(node); }
    visitScopes(node: Oas20Scopes): void { this._acceptAll(node); }
    visitXML(node: Oas20XML): void { this._acceptAll(node); }
    visitDefinitionSchema(node: Oas20DefinitionSchema): void { this._acceptAll(node); }
    visitPropertySchema(node: Oas20PropertySchema): void { this._acceptAll(node); }
    visitAdditionalPropertiesSchema(node: Oas20AdditionalPropertiesSchema): void { this._acceptAll(node); }
    visitAllOfSchema(node: Oas20AllOfSchema): void { this._acceptAll(node); }
    visitItemsSchema(node: Oas20ItemsSchema): void { this._acceptAll(node); }
    visitDefinitions(node: Oas20Definitions): void { this._acceptAll(node); }
    visitParametersDefinitions(node: Oas20ParametersDefinitions): void { this._acceptAll(node); }
    visitResponsesDefinitions(node: Oas20ResponsesDefinitions): void { this._acceptAll(node); }

}


/**
 * A composite visitor - this class makes it easy to apply multiple visitors to
 * a node at the same time.  It's basically just an array of visitors.
 */
export class Oas30CompositeVisitor extends OasCompositeVisitor implements IOas30NodeVisitor {

    /**
     * Constructor.
     * @param visitors
     */
    constructor(...visitors: IOas30NodeVisitor[]) {
        super(visitors);
    }

    visitServer(node: Oas30Server): void { this._acceptAll(node); }
    visitServerVariables(node: Oas30ServerVariables): void { this._acceptAll(node); }
    visitServerVariable(node: Oas30ServerVariable): void { this._acceptAll(node); }

}
