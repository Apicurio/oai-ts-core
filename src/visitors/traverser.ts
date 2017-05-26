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

import {IOas20NodeVisitor, IOas30NodeVisitor, IOasNodeVisitor} from "./visitor.iface";
import {Oas20Document} from "../models/2.0/document.model";
import {OasExtension} from "../models/extension.model";
import {Oas20Paths} from "../models/2.0/paths.model";
import {Oas20PathItem} from "../models/2.0/path-item.model";
import {Oas20Operation} from "../models/2.0/operation.model";
import {Oas20Parameter, Oas20ParameterBase, Oas20ParameterDefinition} from "../models/2.0/parameter.model";
import {Oas20Responses} from "../models/2.0/responses.model";
import {Oas20Response, Oas20ResponseBase, Oas20ResponseDefinition} from "../models/2.0/response.model";
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
import {OasNode} from "../models/node.model";
import {OasExtensibleNode} from "../models/enode.model";
import {Oas20Scopes} from "../models/2.0/scopes.model";
import {Oas20SecurityDefinitions} from "../models/2.0/security-definitions.model";
import {Oas20SecurityScheme} from "../models/2.0/security-scheme.model";
import {Oas20XML} from "../models/2.0/xml.model";
import {Oas20Definitions} from "../models/2.0/definitions.model";
import {Oas20ParametersDefinitions} from "../models/2.0/parameters-definitions.model";
import {Oas20ResponsesDefinitions} from "../models/2.0/responses-definitions.model";
import {OasDocument} from "../models/document.model";
import {OasInfo} from "../models/common/info.model";
import {OasContact} from "../models/common/contact.model";
import {OasLicense} from "../models/common/license.model";
import {Oas30Document} from "../models/3.0/document.model";
import {Oas30ServerVariable} from "../models/3.0/server-variable.model";
import {Oas30ServerVariables} from "../models/3.0/server-variables.model";
import {Oas30Server} from "../models/3.0/server.model";
import {OasSecurityRequirement} from "../models/common/security-requirement.model";
import {OasExternalDocumentation} from "../models/common/external-documentation.model";
import {OasTag} from "../models/common/tag.model";

/**
 * Interface implemented by all traversers.
 */
export interface IOasTraverser {

    traverse(node: OasNode): void;

}

/**
 * Used to traverse an OAS tree and call an included visitor for each node.
 */
export abstract class OasTraverser implements IOasNodeVisitor, IOasTraverser {

    /**
     * Constructor.
     * @param visitor
     */
    constructor(protected visitor: IOasNodeVisitor) {}

    /**
     * Called to traverse an OAS 2.0 tree starting at the given node and traversing
     * down until this node and all child nodes have been visited.
     * @param node
     */
    public traverse(node: OasNode): void {
        node.accept(this);
    }

    /**
     * Traverse into the given node, unless it's null.
     * @param node
     */
    protected traverseIfNotNull(node: OasNode): void {
        if (node) {
            node.accept(this);
        }
    }

    /**
     * Traverse the items of the given array.
     * @param items
     */
    protected traverseArray(items: OasNode[]): void {
        if (Array.isArray(items)) {
            for (let item of items) {
                this.traverseIfNotNull(item);
            }
        }
    }

    /**
     * Traverse the extension nodes, if any are found.
     * @param node
     */
    protected traverseExtensions(node: OasExtensibleNode): void {
        this.traverseArray(node.extensions());
    }

    /**
     * Visit the document.
     * @param node
     */
    public abstract visitDocument(node: OasDocument): void;

    /**
     * Visit the info object.
     * @param node
     */
    public visitInfo(node: OasInfo): void {
        node.accept(this.visitor);
        this.traverseIfNotNull(node.contact);
        this.traverseIfNotNull(node.license);
        this.traverseExtensions(node);
    }

    /**
     * Visit the contact object.
     * @param node
     */
    public visitContact(node: OasContact): void {
        node.accept(this.visitor);
        this.traverseExtensions(node);
    }

    /**
     * Visit the license object.
     * @param node
     */
    public visitLicense(node: OasLicense): void {
        node.accept(this.visitor);
        this.traverseExtensions(node);
    }

    /**
     * Visit the security requirement.
     * @param node
     */
    public visitSecurityRequirement(node: OasSecurityRequirement): void {
        node.accept(this.visitor);
    }

    /**
     * Visit the tag.
     * @param node
     */
    public visitTag(node: OasTag): void {
        node.accept(this.visitor);
        this.traverseIfNotNull(node.externalDocs);
        this.traverseExtensions(node);
    }

    /**
     * Visit the external doc.
     * @param node
     */
    public visitExternalDocumentation(node: OasExternalDocumentation): void {
        node.accept(this.visitor);
        this.traverseExtensions(node);
    }

    /**
     * Visit the extension.
     * @param node
     */
    public visitExtension(node: OasExtension): void {
        node.accept(this.visitor);
    }

}

/**
 * Used to traverse an OAS 2.0 tree and call an included visitor for each node.
 */
export class Oas20Traverser extends OasTraverser implements IOas20NodeVisitor {

    /**
     * Constructor.
     * @param visitor
     */
    constructor(visitor: IOas20NodeVisitor) {
        super(visitor);
    }

    /**
     * Visit the document.
     * @param node
     */
    public visitDocument(node: Oas20Document): void {
        node.accept(this.visitor);
        this.traverseIfNotNull(node.info);
        this.traverseIfNotNull(node.paths);
        this.traverseIfNotNull(node.definitions);
        this.traverseIfNotNull(node.parameters);
        this.traverseIfNotNull(node.responses);
        this.traverseIfNotNull(node.securityDefinitions);
        this.traverseArray(node.security);
        this.traverseArray(node.tags);
        this.traverseIfNotNull(node.externalDocs);
        this.traverseExtensions(node);
    }

    /**
     * Visit the paths.
     * @param node
     */
    public visitPaths(node: Oas20Paths): void {
        node.accept(this.visitor);
        for (let pathName of node.pathItemNames()) {
            let pathItem: Oas20PathItem = node.pathItem(pathName);
            this.traverseIfNotNull(pathItem);
        }
        this.traverseExtensions(node);
    }

    /**
     * Visit the path item.
     * @param node
     */
    public visitPathItem(node: Oas20PathItem): void {
        node.accept(this.visitor);
        this.traverseIfNotNull(node.get);
        this.traverseIfNotNull(node.put);
        this.traverseIfNotNull(node.post);
        this.traverseIfNotNull(node.delete);
        this.traverseIfNotNull(node.options);
        this.traverseIfNotNull(node.head);
        this.traverseIfNotNull(node.patch);
        this.traverseArray(node.parameters);
        this.traverseExtensions(node);
    }

    /**
     * Visit the operation.
     * @param node
     */
    public visitOperation(node: Oas20Operation): void {
        node.accept(this.visitor);
        this.traverseIfNotNull(node.externalDocs);
        this.traverseArray(node.parameters);
        this.traverseIfNotNull(node.responses);
        this.traverseArray(node.security);
        this.traverseExtensions(node);
    }

    private visitParameterBase(node: Oas20ParameterBase): void {
        node.accept(this.visitor);
        this.traverseIfNotNull(node.schema);
        this.traverseIfNotNull(node.items);
        this.traverseExtensions(node);
    }

    /**
     * Visit the parameter.
     * @param node
     */
    public visitParameter(node: Oas20Parameter): void {
        this.visitParameterBase(node);
    }

    /**
     * Visit the parameter definition.
     * @param node
     */
    public visitParameterDefinition(node: Oas20ParameterDefinition): void {
        this.visitParameterBase(node);
    }

    /**
     * Visit the responses.
     * @param node
     */
    public visitResponses(node: Oas20Responses): void {
        node.accept(this.visitor);
        for (let name of node.responseStatusCodes()) {
            let response: Oas20Response = node.response(name);
            this.traverseIfNotNull(response);
        }
        this.traverseIfNotNull(node.default);
        this.traverseExtensions(node);
    }

    private visitResponseBase(node: Oas20ResponseBase): void {
        node.accept(this.visitor);
        this.traverseIfNotNull(node.schema);
        this.traverseIfNotNull(node.headers);
        this.traverseIfNotNull(node.examples);
        this.traverseExtensions(node);
    }

    /**
     * Visit the response.
     * @param node
     */
    public visitResponse(node: Oas20Response): void {
        this.visitResponseBase(node);
    }

    /**
     * Visit the response definition.
     * @param node
     */
    public visitResponseDefinition(node: Oas20ResponseDefinition): void {
        this.visitResponseBase(node);
    }

    /**
     * Visit the schema.
     * @param node
     */
    public visitSchema(node: Oas20Schema): void {
        node.accept(this.visitor);
        if (node.items !== null && Array.isArray(node.items)) {
            this.traverseArray(<Oas20ItemsSchema[]>node.items);
        } else {
            this.traverseIfNotNull(<Oas20ItemsSchema>node.items);
        }
        this.traverseArray(node.allOf);
        let propNames: string[] = node.propertyNames();
        if (propNames && propNames.length > 0) {
            for (let propName of propNames) {
                let prop: Oas20Schema = node.property(propName);
                this.traverseIfNotNull(prop);
            }
        }
        if (typeof node.additionalProperties !== "boolean") {
            this.traverseIfNotNull(<Oas20AdditionalPropertiesSchema>node.additionalProperties);
        }
        this.traverseIfNotNull(node.xml);
        this.traverseIfNotNull(node.externalDocs);
    }

    /**
     * Visit the schema.
     * @param node
     */
    public visitPropertySchema(node: Oas20PropertySchema): void {
        this.visitSchema(node);
    }

    /**
     * Visit the schema.
     * @param node
     */
    public visitDefinitionSchema(node: Oas20DefinitionSchema): void {
        this.visitSchema(node);
    }

    /**
     * Visit the schema.
     * @param node
     */
    public visitAdditionalPropertiesSchema(node: Oas20AdditionalPropertiesSchema): void {
        this.visitSchema(node);
    }

    /**
     * Visit the schema.
     * @param node
     */
    public visitAllOfSchema(node: Oas20AllOfSchema): void {
        this.visitSchema(node);
    }

    /**
     * Visit the schema.
     * @param node
     */
    public visitItemsSchema(node: Oas20ItemsSchema): void {
        this.visitSchema(node);
    }

    /**
     * Visit the headers.
     * @param node
     */
    public visitHeaders(node: Oas20Headers): void {
        node.accept(this.visitor);
        for (let hname of node.headerNames()) {
            let header: Oas20Header = node.header(hname);
            this.traverseIfNotNull(header);
        }
    }

    /**
     * Visit the header.
     * @param node
     */
    public visitHeader(node: Oas20Header): void {
        node.accept(this.visitor);
        this.traverseIfNotNull(node.items);
        this.traverseExtensions(node);
    }

    /**
     * Visit the example.
     * @param node
     */
    public visitExample(node: Oas20Example): void {
        node.accept(this.visitor);
    }

    /**
     * Visit the items.
     * @param node
     */
    public visitItems(node: Oas20Items): void {
        node.accept(this.visitor);
        this.traverseIfNotNull(node.items);
        this.traverseExtensions(node);
    }

    /**
     * Visit the security definitions.
     * @param node
     */
    public visitSecurityDefinitions(node: Oas20SecurityDefinitions): void {
        node.accept(this.visitor);
        for (let schemeName of node.securitySchemeNames()) {
            this.traverse(node.securityScheme(schemeName));
        }
    }

    /**
     * Visit the security scheme.
     * @param node
     */
    public visitSecurityScheme(node: Oas20SecurityScheme): void {
        node.accept(this.visitor);
        this.traverseIfNotNull(node.scopes);
        this.traverseExtensions(node);
    }

    /**
     * Visit the scopes.
     * @param node
     */
    public visitScopes(node: Oas20Scopes): void {
        node.accept(this.visitor);
    }

    /**
     * Visit the scopes.
     * @param node
     */
    public visitXML(node: Oas20XML): void {
        node.accept(this.visitor);
        this.traverseExtensions(node);
    }

    /**
     * Visit the definitions.
     * @param node
     */
    public visitDefinitions(node: Oas20Definitions): void {
        node.accept(this.visitor);
        for (let name of node.definitionNames()) {
            let definition: Oas20DefinitionSchema = node.definition(name);
            this.traverseIfNotNull(definition);
        }
    }

    /**
     * Visit the definitions.
     * @param node
     */
    public visitParametersDefinitions(node: Oas20ParametersDefinitions): void {
        node.accept(this.visitor);
        for (let name of node.parameterNames()) {
            let parameter: Oas20ParameterDefinition = node.parameter(name);
            this.traverseIfNotNull(parameter);
        }
    }

    /**
     * Visit the responses.
     * @param node
     */
    public visitResponsesDefinitions(node: Oas20ResponsesDefinitions): void {
        node.accept(this.visitor);
        for (let name of node.responseNames()) {
            let response: Oas20ResponseDefinition = node.response(name);
            this.traverseIfNotNull(response);
        }
    }

}



/**
 * Used to traverse an OAS 3.0 tree and call an included visitor for each node.
 */
export class Oas30Traverser extends OasTraverser implements IOas30NodeVisitor {

    /**
     * Constructor.
     * @param visitor
     */
    constructor(visitor: IOas30NodeVisitor) {
        super(visitor);
    }

    /**
     * Visit the document.
     * @param node
     */
    public visitDocument(node: Oas30Document): void {
        node.accept(this.visitor);
        this.traverseIfNotNull(node.info);
        this.traverseArray(node.servers);
        this.traverseArray(node.security);
        this.traverseArray(node.tags);
        this.traverseIfNotNull(node.externalDocs);
        this.traverseExtensions(node);
    }

    /**
     * Visit the node.
     * @param node
     */
    public visitServer(node: Oas30Server): void {
        node.accept(this.visitor);
        this.traverseIfNotNull(node.variables);
        this.traverseExtensions(node);
    }

    /**
     * Visit the node.
     * @param node
     */
    public visitServerVariables(node: Oas30ServerVariables): void {
        node.accept(this.visitor);
        for (let serverVariableName of node.serverVariableNames()) {
            let serverVariable: Oas30ServerVariable = node.serverVariable(serverVariableName);
            this.traverseIfNotNull(serverVariable);
        }
        this.traverseExtensions(node);
    }

    /**
     * Visit the node.
     * @param node
     */
    public visitServerVariable(node: Oas30ServerVariable): void {
        node.accept(this.visitor);
        this.traverseExtensions(node);
    }

}



/**
 * Used to traverse up an OAS tree and call an included visitor for each node.
 */
export abstract class OasReverseTraverser implements IOasNodeVisitor, IOasTraverser {

    /**
     * Constructor.
     * @param visitor
     */
    constructor(protected visitor: IOasNodeVisitor) {}

    /**
     * Traverse the given node.
     * @param node
     */
    public traverse(node: OasNode): void {
        node.accept(this);
    }

    public visitDocument(node: OasDocument): void {
        node.accept(this.visitor);
    }

    public visitInfo(node: OasInfo): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    public visitContact(node: OasContact): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    public visitLicense(node: OasLicense): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    public visitSecurityRequirement(node: OasSecurityRequirement): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    public visitTag(node: OasTag): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    public visitExternalDocumentation(node: OasExternalDocumentation): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    public visitExtension(node: OasExtension): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

}


/**
 * Used to traverse up an OAS 2.0 tree and call an included visitor for each node.
 */
export class Oas20ReverseTraverser extends OasReverseTraverser implements IOas20NodeVisitor, IOasTraverser {

    /**
     * Constructor.
     * @param visitor
     */
    constructor(visitor: IOas20NodeVisitor) {
        super(visitor);
    }

    public visitPaths(node: Oas20Paths): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    public visitPathItem(node: Oas20PathItem): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    public visitOperation(node: Oas20Operation): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    public visitParameter(node: Oas20Parameter): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    public visitParameterDefinition(node: Oas20ParameterDefinition): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    public visitResponses(node: Oas20Responses): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    public visitResponse(node: Oas20Response): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    public visitResponseDefinition(node: Oas20ResponseDefinition): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    public visitSchema(node: Oas20Schema): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    public visitHeaders(node: Oas20Headers): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    public visitHeader(node: Oas20Header): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    public visitExample(node: Oas20Example): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    public visitItems(node: Oas20Items): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    public visitSecurityDefinitions(node: Oas20SecurityDefinitions): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    public visitSecurityScheme(node: Oas20SecurityScheme): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    public visitScopes(node: Oas20Scopes): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    public visitXML(node: Oas20XML): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    public visitDefinitionSchema(node: Oas20DefinitionSchema): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    public visitPropertySchema(node: Oas20PropertySchema): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    public visitAdditionalPropertiesSchema(node: Oas20AdditionalPropertiesSchema): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    public visitAllOfSchema(node: Oas20AllOfSchema): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    public visitItemsSchema(node: Oas20ItemsSchema): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    public visitDefinitions(node: Oas20Definitions): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    public visitParametersDefinitions(node: Oas20ParametersDefinitions): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    public visitResponsesDefinitions(node: Oas20ResponsesDefinitions): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

}


/**
 * Used to traverse up an OAS 3.0 tree and call an included visitor for each node.
 */
export class Oas30ReverseTraverser extends OasReverseTraverser implements IOas30NodeVisitor, IOasTraverser {

    /**
     * Constructor.
     * @param visitor
     */
    constructor(visitor: IOas30NodeVisitor) {
        super(visitor);
    }

    /**
     * Visit the node.
     * @param node
     */
    public visitServer(node: Oas30Server): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    /**
     * Visit the node.
     * @param node
     */
    public visitServerVariables(node: Oas30ServerVariables): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    /**
     * Visit the node.
     * @param node
     */
    public visitServerVariable(node: Oas30ServerVariable): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

}
