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
import {Oas20PathItem} from "../models/2.0/path-item.model";
import {Oas20Operation} from "../models/2.0/operation.model";
import {Oas20Parameter, Oas20ParameterBase, Oas20ParameterDefinition} from "../models/2.0/parameter.model";
import {Oas20Response, Oas20ResponseBase, Oas20ResponseDefinition} from "../models/2.0/response.model";
import {
    Oas20AdditionalPropertiesSchema,
    Oas20AllOfSchema,
    Oas20ItemsSchema,
    Oas20PropertySchema,
    Oas20Schema,
    Oas20SchemaDefinition
} from "../models/2.0/schema.model";
import {Oas20Header} from "../models/2.0/header.model";
import {Oas20Example} from "../models/2.0/example.model";
import {Oas20Items} from "../models/2.0/items.model";
import {OasNode} from "../models/node.model";
import {OasExtensibleNode} from "../models/enode.model";
import {Oas20Scopes} from "../models/2.0/scopes.model";
import {Oas20SecurityDefinitions} from "../models/2.0/security-definitions.model";
import {Oas20SecurityScheme} from "../models/2.0/security-scheme.model";
import {Oas20Definitions} from "../models/2.0/definitions.model";
import {Oas20ParametersDefinitions} from "../models/2.0/parameters-definitions.model";
import {Oas20ResponsesDefinitions} from "../models/2.0/responses-definitions.model";
import {OasDocument} from "../models/document.model";
import {OasInfo} from "../models/common/info.model";
import {OasContact} from "../models/common/contact.model";
import {OasLicense} from "../models/common/license.model";
import {Oas30Document} from "../models/3.0/document.model";
import {Oas30ServerVariable} from "../models/3.0/server-variable.model";
import {Oas30LinkServer, Oas30Server} from "../models/3.0/server.model";
import {OasSecurityRequirement} from "../models/common/security-requirement.model";
import {OasExternalDocumentation} from "../models/common/external-documentation.model";
import {OasTag} from "../models/common/tag.model";
import {OasPaths} from "../models/common/paths.model";
import {OasPathItem} from "../models/common/path-item.model";
import {OasResponses} from "../models/common/responses.model";
import {OasHeader} from "../models/common/header.model";
import {OasOperation} from "../models/common/operation.model";
import {OasXML} from "../models/common/xml.model";
import {OasSchema} from "../models/common/schema.model";
import {Oas30Parameter, Oas30ParameterBase, Oas30ParameterDefinition} from "../models/3.0/parameter.model";
import {Oas30Response, Oas30ResponseBase, Oas30ResponseDefinition} from "../models/3.0/response.model";
import {Oas30RequestBody, Oas30RequestBodyDefinition} from "../models/3.0/request-body.model";
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
import {Oas30CallbackPathItem, Oas30PathItem} from "../models/3.0/path-item.model";
import {Oas30Operation} from "../models/3.0/operation.model";
import {Oas30Header, Oas30HeaderDefinition} from "../models/3.0/header.model";
import {Oas30MediaType} from "../models/3.0/media-type.model";
import {Oas30Encoding} from "../models/3.0/encoding.model";
import {IOasIndexedNode} from "../models/inode.model";
import {Oas30Example, Oas30ExampleDefinition} from "../models/3.0/example.model";
import {Oas30Link, Oas30LinkDefinition} from "../models/3.0/link.model";
import {Oas30LinkParameterExpression} from "../models/3.0/link-parameter-expression.model";
import {Oas30Callback, Oas30CallbackDefinition} from "../models/3.0/callback.model";
import {Oas30Components} from "../models/3.0/components.model";
import {Oas30OAuthFlows} from "../models/3.0/oauth-flows.model";
import {
    Oas30AuthorizationCodeOAuthFlow,
    Oas30ClientCredentialsOAuthFlow, Oas30ImplicitOAuthFlow, Oas30OAuthFlow,
    Oas30PasswordOAuthFlow
} from "../models/3.0/oauth-flow.model";
import {OasSecurityScheme} from "../models/common/security-scheme.model";
import {Oas30SecurityScheme} from "../models/3.0/security-scheme.model";
import {Oas20Headers} from "../models/2.0/headers.model";
import {Oas30LinkRequestBodyExpression} from "../models/3.0/link-request-body-expression.model";
import {Oas30Discriminator} from "../models/3.0/discriminator.model";

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
     * Traverse the children of an indexed node.
     * @param indexedNode
     */
    protected traverseIndexedNode(indexedNode: IOasIndexedNode<OasNode>): void {
        let itemNames: string[] = indexedNode.getItemNames();
        if (itemNames && itemNames.length > 0) {
            for (let itemName of itemNames) {
                let item: OasNode = indexedNode.getItem(itemName);
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
     * Visit the paths.
     * @param node
     */
    public visitPaths(node: OasPaths): void {
        node.accept(this.visitor);
        this.traverseIndexedNode(node);
        this.traverseExtensions(node);
    }

    /**
     * Visit the path item.
     * @param node
     */
    public abstract visitPathItem(node: OasPathItem): void;

    /**
     * Visit the operation.
     * @param node
     */
    public abstract visitOperation(node: OasOperation): void;

    /**
     * Visit the header.
     * @param node
     */
    public abstract visitHeader(node: OasHeader): void;

    /**
     * Visit the header.
     * @param node
     */
    public abstract visitSchema(node: OasSchema): void;

        /**
     * Visit the responses.
     * @param node
     */
    public visitResponses(node: OasResponses): void {
        node.accept(this.visitor);
        this.traverseIndexedNode(node);
        this.traverseIfNotNull(node.default);
        this.traverseExtensions(node);
    }

    /**
     * Visit the scopes.
     * @param node
     */
    public visitXML(node: OasXML): void {
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
     * Visit the security scheme.
     * @param node
     */
    public abstract visitSecurityScheme(node: OasSecurityScheme): void;

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

    /**
     * Visit a parameter.
     * @param node
     */
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
     * Visit the headers.
     * @param node
     */
    public visitHeaders(node: Oas20Headers): void {
        node.accept(this.visitor);
        this.traverseIndexedNode(node);
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
                let prop: Oas20Schema = node.property(propName) as Oas20Schema;
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
    public visitSchemaDefinition(node: Oas20SchemaDefinition): void {
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
        this.traverseIndexedNode(node);
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
     * Visit the definitions.
     * @param node
     */
    public visitDefinitions(node: Oas20Definitions): void {
        node.accept(this.visitor);
        this.traverseIndexedNode(node);
    }

    /**
     * Visit the definitions.
     * @param node
     */
    public visitParametersDefinitions(node: Oas20ParametersDefinitions): void {
        node.accept(this.visitor);
        this.traverseIndexedNode(node);
    }

    /**
     * Visit the responses.
     * @param node
     */
    public visitResponsesDefinitions(node: Oas20ResponsesDefinitions): void {
        node.accept(this.visitor);
        this.traverseIndexedNode(node);
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
        this.traverseIfNotNull(node.paths);
        this.traverseIfNotNull(node.components);
        this.traverseArray(node.security);
        this.traverseArray(node.tags);
        this.traverseIfNotNull(node.externalDocs);
        this.traverseExtensions(node);
    }

    /**
     * Visit the node.
     * @param node
     */
    public visitPathItem(node: Oas30PathItem): void {
        node.accept(this.visitor);
        this.traverseIfNotNull(node.get);
        this.traverseIfNotNull(node.put);
        this.traverseIfNotNull(node.post);
        this.traverseIfNotNull(node.delete);
        this.traverseIfNotNull(node.options);
        this.traverseIfNotNull(node.head);
        this.traverseIfNotNull(node.patch);
        this.traverseIfNotNull(node.trace);
        this.traverseArray(node.parameters);
        this.traverseArray(node.servers);
        this.traverseExtensions(node);
    }

    /**
     * Visit the node.
     * @param node
     */
    public visitOperation(node: Oas30Operation): void {
        node.accept(this.visitor);
        this.traverseIfNotNull(node.externalDocs);
        this.traverseArray(node.parameters);
        this.traverseIfNotNull(node.responses);
        this.traverseIfNotNull(node.requestBody);
        this.traverseArray(node.getCallbacks());
        this.traverseArray(node.security);
        this.traverseArray(node.servers);
        this.traverseExtensions(node);
    }

    /**
     * Visit the node.
     * @param node
     */
    public visitHeader(node: Oas30Header): void {
        node.accept(this.visitor);
        this.traverseIfNotNull(node.schema);
        this.traverseArray(node.getExamples());
        this.traverseExtensions(node);
    }

    /**
     * Visit the node.
     * @param node
     */
    public visitSchema(node: Oas30Schema): void {
        node.accept(this.visitor);
        if (Array.isArray(node.items)) {
            this.traverseArray(<Oas20ItemsSchema[]>node.items);
        } else {
            this.traverseIfNotNull(<Oas20ItemsSchema>node.items);
        }
        this.traverseArray(node.allOf);
        let propNames: string[] = node.propertyNames();
        if (propNames && propNames.length > 0) {
            for (let propName of propNames) {
                let prop: Oas20Schema = node.property(propName) as Oas20Schema;
                this.traverseIfNotNull(prop);
            }
        }
        if (typeof node.additionalProperties !== "boolean") {
            this.traverseIfNotNull(<Oas20AdditionalPropertiesSchema>node.additionalProperties);
        }
        this.traverseArray(node.oneOf);
        this.traverseArray(node.anyOf);
        this.traverseIfNotNull(node.not);
        this.traverseIfNotNull(node.xml);
        this.traverseExtensions(node);
    }

    /**
     * Visit the node.
     * @param node
     */
    public visitDiscriminator(node: Oas30Discriminator): void {
        node.accept(this.visitor);
    }

    /**
     * Visit the node.
     * @param node
     */
    public visitParameter(node: Oas30Parameter): void {
        this.visitParameterBase(node);
    }

    /**
     * Visit the node.
     * @param node
     */
    public visitParameterDefinition(node: Oas30ParameterDefinition): void {
        this.visitParameterBase(node);
    }

    /**
     * Visit a parameter.
     * @param node
     */
    private visitParameterBase(node: Oas30ParameterBase): void {
        node.accept(this.visitor);
        this.traverseIfNotNull(node.schema);
        this.traverseArray(node.getExamples());
        this.traverseArray(node.getMediaTypes());
        this.traverseExtensions(node);
    }

    /**
     * Visit the node.
     * @param node
     */
    public visitResponse(node: Oas30Response): void {
        this.visitResponseBase(node);
    }

    /**
     * Visit the node.
     * @param node
     */
    public visitResponseDefinition(node: Oas30ResponseDefinition): void {
        this.visitResponseBase(node);
    }

    /**
     * Visit a response.
     * @param node
     */
    private visitResponseBase(node: Oas30ResponseBase): void {
        node.accept(this.visitor);
        this.traverseArray(node.getMediaTypes());
        this.traverseArray(node.getLinks());
        this.traverseArray(node.getHeaders());
        this.traverseExtensions(node);
    }

    /**
     * Visit the node.
     * @param node
     */
    public visitLink(node: Oas30Link): void {
        node.accept(this.visitor);
        this.traverseArray(node.getLinkParameterExpressions());
        this.traverseIfNotNull(node.requestBody);
        this.traverseIfNotNull(node.server);
        this.traverseExtensions(node);
    }

    /**
     * Visit the node.
     * @param node
     */
    public visitLinkParameterExpression(node: Oas30LinkParameterExpression): void {
        node.accept(this.visitor);
    }

    /**
     * Visit the node.
     * @param node
     */
    public visitLinkRequestBodyExpression(node: Oas30LinkRequestBodyExpression): void {
        node.accept(this.visitor);
    }

    /**
     * Visit the node.
     * @param node
     */
    public visitLinkServer(node: Oas30LinkServer): void {
        this.visitServer(node);
    }

    /**
     * Visit the node.
     * @param node
     */
    public visitRequestBody(node: Oas30RequestBody): void {
        node.accept(this.visitor);
        this.traverseArray(node.getMediaTypes());
        this.traverseExtensions(node);
    }

    /**
     * Visit the node.
     * @param node
     */
    public visitMediaType(node: Oas30MediaType): void {
        node.accept(this.visitor);
        this.traverseIfNotNull(node.schema);
        this.traverseArray(node.getExamples());
        this.traverseArray(node.getEncodings());
        this.traverseExtensions(node);
    }

    /**
     * Visit the node.
     * @param node
     */
    public visitEncoding(node: Oas30Encoding): void {
        node.accept(this.visitor);
        this.traverseArray(node.getHeaders());
        this.traverseExtensions(node);
    }

    /**
     * Visit the node.
     * @param node
     */
    public visitExample(node: Oas30Example): void {
        node.accept(this.visitor);
        this.traverseExtensions(node);
    }

    /**
     * Visit the node.
     * @param node
     */
    public visitCallback(node: Oas30Callback): void {
        node.accept(this.visitor);
        this.traverseIndexedNode(node);
        this.traverseExtensions(node);
    }

    /**
     * Visit the node.
     * @param node
     */
    public visitCallbackPathItem(node: Oas30CallbackPathItem): void {
        this.visitPathItem(node);
    }

    /**
     * Visit the node.
     * @param node
     */
    public visitAllOfSchema(node: Oas30AllOfSchema): void {
        this.visitSchema(node);
    }

    /**
     * Visit the node.
     * @param node
     */
    public visitAnyOfSchema(node: Oas30AnyOfSchema): void {
        this.visitSchema(node);
    }

    /**
     * Visit the node.
     * @param node
     */
    public visitOneOfSchema(node: Oas30OneOfSchema): void {
        this.visitSchema(node);
    }

    /**
     * Visit the node.
     * @param node
     */
    public visitNotSchema(node: Oas30NotSchema): void {
        this.visitSchema(node);
    }

    /**
     * Visit the node.
     * @param node
     */
    public visitPropertySchema(node: Oas30PropertySchema): void {
        this.visitSchema(node);
    }

    /**
     * Visit the node.
     * @param node
     */
    public visitItemsSchema(node: Oas30ItemsSchema): void {
        this.visitSchema(node);
    }

    /**
     * Visit the node.
     * @param node
     */
    public visitAdditionalPropertiesSchema(node: Oas30AdditionalPropertiesSchema): void {
        this.visitSchema(node);
    }

    /**
     * Visit the node.
     * @param node
     */
    public visitComponents(node: Oas30Components): void {
        node.accept(this.visitor);
        this.traverseArray(node.getSchemaDefinitions());
        this.traverseArray(node.getResponseDefinitions());
        this.traverseArray(node.getParameterDefinitions());
        this.traverseArray(node.getExampleDefinitions());
        this.traverseArray(node.getRequestBodyDefinitions());
        this.traverseArray(node.getHeaderDefinitions());
        this.traverseArray(node.getSecuritySchemes());
        this.traverseArray(node.getLinkDefinitions());
        this.traverseArray(node.getCallbackDefinitions());
        this.traverseExtensions(node);
    }

    /**
     * Visit the node.
     * @param node
     */
    public visitExampleDefinition(node: Oas30ExampleDefinition): void {
        this.visitExample(node);
    }

    /**
     * Visit the node.
     * @param node
     */
    public visitRequestBodyDefinition(node: Oas30RequestBodyDefinition): void {
        this.visitRequestBody(node);
    }

    /**
     * Visit the node.
     * @param node
     */
    public visitHeaderDefinition(node: Oas30HeaderDefinition): void {
        this.visitHeader(node);
    }

    /**
     * Visit the node.
     * @param node
     */
    public visitSecurityScheme(node: Oas30SecurityScheme): void {
        node.accept(this.visitor);
        this.traverseIfNotNull(node.flows);
        this.traverseExtensions(node);
    }

    /**
     * Visit the node.
     * @param node
     */
    public visitOAuthFlows(node: Oas30OAuthFlows): void {
        node.accept(this.visitor);
        this.traverseIfNotNull(node.implicit);
        this.traverseIfNotNull(node.password);
        this.traverseIfNotNull(node.clientCredentials);
        this.traverseIfNotNull(node.authorizationCode);
        this.traverseExtensions(node);
    }

    /**
     * Visit the node.
     * @param node
     */
    public visitImplicitOAuthFlow(node: Oas30ImplicitOAuthFlow): void {
        this.visitOAuthFlow(node);
    }

    /**
     * Visit the node.
     * @param node
     */
    public visitPasswordOAuthFlow(node: Oas30PasswordOAuthFlow): void {
        this.visitOAuthFlow(node);
    }

    /**
     * Visit the node.
     * @param node
     */
    public visitClientCredentialsOAuthFlow(node: Oas30ClientCredentialsOAuthFlow): void {
        this.visitOAuthFlow(node);
    }

    /**
     * Visit the node.
     * @param node
     */
    public visitAuthorizationCodeOAuthFlow(node: Oas30AuthorizationCodeOAuthFlow): void {
        this.visitOAuthFlow(node);
    }

    /**
     * Visit the node.
     * @param node
     */
    private visitOAuthFlow(node: Oas30OAuthFlow): void {
        node.accept(this.visitor);
        this.traverseExtensions(node);
    }

    /**
     * Visit the node.
     * @param node
     */
    public visitLinkDefinition(node: Oas30LinkDefinition): void {
        this.visitLink(node);
    }

    /**
     * Visit the node.
     * @param node
     */
    public visitCallbackDefinition(node: Oas30CallbackDefinition): void {
        this.visitCallback(node);
    }

    /**
     * Visit the node.
     * @param node
     */
    public visitSchemaDefinition(node: Oas30SchemaDefinition): void {
        this.visitSchema(node);
    }

    /**
     * Visit the node.
     * @param node
     */
    public visitServer(node: Oas30Server): void {
        node.accept(this.visitor);
        this.traverseArray(node.getServerVariables());
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

    public visitPaths(node: OasPaths): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    public visitPathItem(node: OasPathItem): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    public visitOperation(node: OasOperation): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    public visitResponses(node: OasResponses): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    public visitSchema(node: OasSchema): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    public visitHeader(node: OasHeader): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    public visitXML(node: OasXML): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    public visitSecurityScheme(node: OasSecurityScheme): void {
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

    public visitParameter(node: Oas20Parameter): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    public visitParameterDefinition(node: Oas20ParameterDefinition): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    public visitResponse(node: Oas20Response): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    public visitHeaders(node: Oas20Headers): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    public visitResponseDefinition(node: Oas20ResponseDefinition): void {
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

    public visitScopes(node: Oas20Scopes): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    public visitSchemaDefinition(node: Oas20SchemaDefinition): void {
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

    visitParameter(node: Oas30Parameter): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    visitParameterDefinition(node: Oas30ParameterDefinition): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    visitResponse(node: Oas30Response): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    visitLink(node: Oas30Link): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    visitLinkParameterExpression(node: Oas30LinkParameterExpression): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    visitLinkRequestBodyExpression(node: Oas30LinkRequestBodyExpression): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    visitLinkServer(node: Oas30LinkServer): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    visitResponseDefinition(node: Oas30ResponseDefinition): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    visitRequestBody(node: Oas30RequestBody): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    visitMediaType(node: Oas30MediaType): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    visitEncoding(node: Oas30Encoding): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    visitExample(node: Oas30Example): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    visitCallback(node: Oas30Callback): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    visitCallbackPathItem(node: Oas30CallbackPathItem): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    visitAllOfSchema(node: Oas30AllOfSchema): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    visitAnyOfSchema(node: Oas30AnyOfSchema): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    visitOneOfSchema(node: Oas30OneOfSchema): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    visitNotSchema(node: Oas30NotSchema): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    visitPropertySchema(node: Oas30PropertySchema): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    visitItemsSchema(node: Oas30ItemsSchema): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    visitAdditionalPropertiesSchema(node: Oas30AdditionalPropertiesSchema): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    visitDiscriminator(node: Oas30Discriminator): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    visitComponents(node: Oas30Components): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    visitExampleDefinition(node: Oas30ExampleDefinition): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    visitRequestBodyDefinition(node: Oas30RequestBodyDefinition): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    visitHeaderDefinition(node: Oas30HeaderDefinition): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    visitOAuthFlows(node: Oas30OAuthFlows): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    visitImplicitOAuthFlow(node: Oas30ImplicitOAuthFlow): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    visitPasswordOAuthFlow(node: Oas30PasswordOAuthFlow): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    visitClientCredentialsOAuthFlow(node: Oas30ClientCredentialsOAuthFlow): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    visitAuthorizationCodeOAuthFlow(node: Oas30AuthorizationCodeOAuthFlow): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    visitLinkDefinition(node: Oas30LinkDefinition): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    visitCallbackDefinition(node: Oas30CallbackDefinition): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    visitSchemaDefinition(node: Oas30SchemaDefinition): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    visitServer(node: Oas30Server): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

    visitServerVariable(node: Oas30ServerVariable): void {
        node.accept(this.visitor);
        this.traverse(node.parent());
    }

}
