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
    Oas20DefinitionSchema,
    Oas20ItemsSchema,
    Oas20PropertySchema,
    Oas20Schema
} from "../models/2.0/schema.model";
import {Oas20Header} from "../models/2.0/header.model";
import {Oas20Example} from "../models/2.0/example.model";
import {Oas20Items} from "../models/2.0/items.model";
import {OasNode} from "../models/node.model";
import {Oas20SecurityDefinitions} from "../models/2.0/security-definitions.model";
import {Oas20SecurityScheme} from "../models/2.0/security-scheme.model";
import {Oas20Scopes} from "../models/2.0/scopes.model";
import {Oas20Definitions} from "../models/2.0/definitions.model";
import {Oas20ParametersDefinitions} from "../models/2.0/parameters-definitions.model";
import {Oas20ResponsesDefinitions} from "../models/2.0/responses-definitions.model";
import {OasDocument} from "../models/document.model";
import {OasInfo} from "../models/common/info.model";
import {OasContact} from "../models/common/contact.model";
import {OasLicense} from "../models/common/license.model";
import {Oas30Document} from "../models/3.0/document.model";
import {Oas30Server} from "../models/3.0/server.model";
import {Oas30ServerVariables} from "../models/3.0/server-variables.model";
import {Oas30ServerVariable} from "../models/3.0/server-variable.model";
import {OasSecurityRequirement} from "../models/common/security-requirement.model";
import {OasTag} from "../models/common/tag.model";
import {OasExternalDocumentation} from "../models/common/external-documentation.model";
import {OasHeaders} from "../models/common/headers.model";
import {OasPaths} from "../models/common/paths.model";
import {Oas30PathItem} from "../models/3.0/path-item.model";
import {Oas30Operation} from "../models/3.0/operation.model";
import {Oas30Parameter, Oas30ParameterBase, Oas30ParameterDefinition} from "../models/3.0/parameter.model";
import {OasResponses} from "../models/common/responses.model";
import {Oas30Response, Oas30ResponseBase, Oas30ResponseDefinition} from "../models/3.0/response.model";
import {
    Oas30AdditionalPropertiesSchema,
    Oas30AllOfSchema,
    Oas30AnyOfSchema,
    Oas30DefinitionSchema,
    Oas30ItemsSchema,
    Oas30NotSchema,
    Oas30OneOfSchema,
    Oas30PropertySchema,
    Oas30Schema
} from "../models/3.0/schema.model";
import {OasXML} from "../models/common/xml.model";
import {Oas30Header} from "../models/3.0/header.model";
import {Oas30RequestBody} from "../models/3.0/request-body.model";
import {Oas30Callbacks} from "../models/3.0/callbacks.model";
import {OasPathItem} from "../models/common/path-item.model";
import {OasOperation} from "../models/common/operation.model";
import {OasHeader} from "../models/common/header.model";
import {OasSchema} from "../models/common/schema.model";
import {Oas30Encoding} from "../models/3.0/encoding.model";
import {Oas30EncodingProperty} from "../models/3.0/encoding-property.model";
import {Oas30Content} from "../models/3.0/content.model";
import {Oas30MediaType} from "../models/3.0/media-type.model";


/**
 * Visitor used to convert from a Model into a JavaScript object.
 */
export abstract class OasModelToJSVisitor implements IOasNodeVisitor {

    private _result: any;
    private _modelIdToJS: any;

    /**
     * Constructor.
     */
    constructor() {
        this.reset();
    }

    /**
     * Resets the visitor for a new run.
     */
    public reset(): void {
        this._result = null;
        this._modelIdToJS = <any>{};
    }

    /**
     * Returns the result that was built up during the visit of the model.
     * @return {any}
     */
    public getResult(): any {
        return this.removeNullProperties(this._result);
    }

    /**
     * Removes any property with a null value from the js object.  This is done recursively.
     * @param object
     */
    private removeNullProperties(object: any): any {
        if (object instanceof Array) {
            for (let item of <Array<any>> object) {
                this.removeNullProperties(item);
            }
        } else if (object instanceof Object) {
            for (let key in <Object> object) {
                if (object[key] == null) {
                    delete object[key];
                } else {
                    this.removeNullProperties(object[key]);
                }
            }
        }
        return object;
    }

    /**
     * Indexes the javascript object by the ModelId of the model it was created from.  This allows
     * quick lookup (mapping) from the model to the JS object.
     * @param node
     * @param jsObject
     */
    protected updateIndex(node: OasNode, jsObject: any) {
        this._modelIdToJS[node.modelId()] = jsObject;
        // Note: the first JS object created by the visitor is the result (we always traverse top-down).
        if (this._result == null) {
            this._result = jsObject;
        }
    }

    /**
     * Lookup a JS object from the ID of the model it came from.
     * @param modelId
     * @return {any}
     */
    protected lookup(modelId: number): any {
        let rval: any = this._modelIdToJS[modelId];

        // If not found, return a throwaway object (this would happen when doing a partial
        // read of a subsection of a OAS document).
        if (!this.isDefined(rval)) {
            return {};
        }
        return rval;
    }

    /**
     * Lookup a JS object using the model ID of the node's parent.
     * @param node
     * @return {any}
     */
    protected lookupParentJS(node: OasNode): any {
        return this.lookup(node.parent().modelId());
    }

    /**
     * Returns true if the given thing is defined.
     * @param thing
     * @return {boolean}
     */
    protected isDefined(thing: any): boolean {
        if (typeof thing === "undefined" || thing === null) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * Merges multiple objects into a single object.  This is done by iterating through
     * all properties of all objects and assigning them as properties of a new object.  The
     * result is a new object with all the properties of all objects passed to the method.
     * @param objects
     */
    protected merge(...objects: any[]): any {
        let rval: any = <any>new Object();

        for (let object of objects) {
            for (let key in object) {
                let val: any = object[key];
                rval[key] = val;
            }
        }

        return rval;
    }

    abstract visitDocument(node: OasDocument): void;

    /**
     * Visits a node.
     * @param node
     */
    public visitInfo(node: OasInfo): void {
        let parentJS: any = this.lookupParentJS(node);
        let info: any = {
            title: node.title,
            description: node.description,
            termsOfService: node.termsOfService,
            contact: null,
            license: null,
            version: node.version
        };
        parentJS.info = info;
        this.updateIndex(node, info);
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitContact(node: OasContact): void {
        let parentJS: any = this.lookupParentJS(node);
        let contact: any = {
            name: node.name,
            url: node.url,
            email: node.email
        };
        parentJS.contact = contact;
        this.updateIndex(node, contact);
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitLicense(node: OasLicense): void {
        let parentJS: any = this.lookupParentJS(node);
        let license: any = {
            name: node.name,
            url: node.url,
        };
        parentJS.license = license;
        this.updateIndex(node, license);
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitPaths(node: OasPaths): void {
        let paths: any = {};
        let parentJS: any = this.lookupParentJS(node);
        parentJS.paths = paths;
        this.updateIndex(node, paths);
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitHeaders(node: OasHeaders): void {
        if (node.headerNames().length > 0) {
            let parentJS: any = this.lookupParentJS(node);
            let headers: any = {};
            parentJS.headers = headers;
            this.updateIndex(node, headers);
        }
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitResponses(node: OasResponses): void {
        let parentJS: any = this.lookupParentJS(node);
        let responses: any = {
            default: null
        };
        parentJS.responses = responses;
        this.updateIndex(node, responses);
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitXML(node: OasXML): void {
        let parent: any = this.lookupParentJS(node);
        let xml: any = {
            name: node.name,
            namespace: node.namespace,
            prefix: node.prefix,
            attribute: node.attribute,
            wrapped: node.wrapped
        };
        parent.xml = xml;
        this.updateIndex(node, xml);
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitSecurityRequirement(node: OasSecurityRequirement): void {
        let parentJS: any = this.lookupParentJS(node);
        let securityRequirements: any[] = parentJS["security"];
        if (!this.isDefined(securityRequirements)) {
            securityRequirements = [];
            parentJS.security = securityRequirements;
        }
        let securityReq: any = <any>{};
        for (let name of node.securityRequirementNames()) {
            securityReq[name] = node.scopes(name);
        }
        securityRequirements.push(securityReq);
        this.updateIndex(node, securityReq);
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitTag(node: OasTag): void {
        let parentJS: any = this.lookupParentJS(node);
        if (!this.isDefined(parentJS.tags)) {
            parentJS.tags = [];
        }
        let tag: any = {
            name: node.name,
            description: node.description,
            externalDocs: null
        };
        parentJS.tags.push(tag);
        this.updateIndex(node, tag);
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitExternalDocumentation(node: OasExternalDocumentation): void {
        let parentJS: any = this.lookupParentJS(node);
        parentJS.externalDocs = {
            description: node.description,
            url: node.url
        }
        this.updateIndex(node, parentJS.externalDocs);
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitExtension(node: OasExtension): void {
        let jsObject: any = this.lookupParentJS(node);
        jsObject[node.name] = node.value;
    }

    public abstract visitPathItem(node: OasPathItem): void;
    public abstract visitOperation(node: OasOperation): void;
    public abstract visitHeader(node: OasHeader): void;
    public abstract visitSchema(node: OasSchema): void;

}


/**
 * Visitor used to convert from a Model into a JavaScript object that conforms
 * to the OAS 2.0 specification.  The resulting JS object can be stringified and
 * should be a valid OAS 2.0 document.
 */
export class Oas20ModelToJSVisitor extends OasModelToJSVisitor implements IOas20NodeVisitor {

    /**
     * Constructor.
     */
    constructor() {
        super();
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitDocument(node: Oas20Document): void {
        let root: any = {
            swagger: node.swagger,
            info: null,
            host: node.host,
            basePath: node.basePath,
            schemes: node.schemes,
            consumes: node.consumes,
            produces: node.produces,
            paths: null,
            security: null,
            tags: null,
            externalDocs: null
        };
        this.updateIndex(node, root);
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitPathItem(node: Oas20PathItem): void {
        let parentJS: any = this.lookupParentJS(node);
        let pathItem: any = {
            "$ref" : node.$ref,
            "get" : null,
            "put" : null,
            "post" : null,
            "delete" : null,
            "options" : null,
            "head" : null,
            "patch" : null,
            "parameters" : null
        }
        parentJS[node.path()] = pathItem;
        this.updateIndex(node, pathItem);
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitOperation(node: Oas20Operation): void {
        let parentJS: any = this.lookupParentJS(node);
        let operation: any = {
            "tags" : node.tags,
            "summary" : node.summary,
            "description" : node.description,
            "externalDocs" : null,
            "operationId" : node.operationId,
            "consumes" : node.consumes,
            "produces" : node.produces,
            "parameters" : null,
            "responses" : null,
            "schemes" : node.schemes,
            "deprecated" : node.deprecated,
            "security" : null
        }
        parentJS[node.method()] = operation;
        this.updateIndex(node, operation);
    }

    /**
     * Creates a JS object for a Parameter base object.
     * @param node
     */
    private createParameterObject(node: Oas20ParameterBase): any {
        let items: any = this.createItemsObject(node);
        let parameter: any = {
            "name" : node.name,
            "in" : node.in,
            "description" : node.description,
            "required" : node.required,
            "schema" : null,
            "allowEmptyValue" : node.allowEmptyValue
        };
        parameter = this.merge(parameter, items);
        return parameter;
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitParameter(node: Oas20Parameter): void {
        let parentJS: any = this.lookupParentJS(node);
        if (parentJS.parameters == null) {
            parentJS.parameters = [];
        }
        let parameter: any = this.createParameterObject(node);
        let paramRef: any = {
            "$ref" : node.$ref
        };
        parameter = this.merge(paramRef, parameter);
        parentJS.parameters.push(parameter);
        this.updateIndex(node, parameter);
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitParameterDefinition(node: Oas20ParameterDefinition): void {
        let parentJS: any = this.lookupParentJS(node);
        let parameter: any = this.createParameterObject(node);
        parentJS[node.parameterName()] = parameter;
        this.updateIndex(node, parameter);
    }

    /**
     * Creates a JS object for a response base instance.
     * @param node
     */
    private createResponseObject(node: Oas20ResponseBase): any {
        return {
            description: node.description,
            schema: null,
            headers: null,
            examples: null
        };
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitResponse(node: Oas20Response): void {
        let parentJS: any = this.lookupParentJS(node);
        let response: any = this.createResponseObject(node);
        let responseRef: any = {
            $ref: node.$ref
        };
        response = this.merge(responseRef, response);
        if (node.statusCode() === null || node.statusCode() === "default") {
            parentJS.default = response;
        } else {
            parentJS[node.statusCode()] = response;
        }
        this.updateIndex(node, response);
    }

    /**
     * Visits a node.
     * @param node
     */
    visitResponseDefinition(node: Oas20ResponseDefinition): void {
        let parentJS: any = this.lookupParentJS(node);
        let response: any = this.createResponseObject(node);
        parentJS[node.name()] = response;
        this.updateIndex(node, response);
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitSchema(node: Oas20Schema): void {
        let parentJS: any = this.lookupParentJS(node);
        let schema: any = this.createSchemaObject(node);
        parentJS.schema = schema;
        this.updateIndex(node, schema);
    }

    /**
     * Visits a node.
     * @param node
     */
    visitPropertySchema(node: Oas20PropertySchema): void {
        let parentJS: any = this.lookupParentJS(node);
        let schema: any = this.createSchemaObject(node);
        if (!this.isDefined(parentJS.properties)) {
            parentJS.properties = {};
        }
        parentJS.properties[node.propertyName()] = schema;
        this.updateIndex(node, schema);
    }

    /**
     * Visits a node.
     * @param node
     */
    visitDefinitionSchema(node: Oas20DefinitionSchema): void {
        let parentJS: any = this.lookupParentJS(node);
        let schema: any = this.createSchemaObject(node);
        parentJS[node.definitionName()] = schema;
        this.updateIndex(node, schema);
    }

    /**
     * Visits a node.
     * @param node
     */
    visitAdditionalPropertiesSchema(node: Oas20AdditionalPropertiesSchema): void {
        let parentJS: any = this.lookupParentJS(node);
        let schema: any = this.createSchemaObject(node);
        parentJS.additionalProperties = schema;
        this.updateIndex(node, schema);
    }

    /**
     * Visits a node.
     * @param node
     */
    visitAllOfSchema(node: Oas20AllOfSchema): void {
        let parentJS: any = this.lookupParentJS(node);
        let schema: any = this.createSchemaObject(node);
        if (!this.isDefined(parentJS.allOf)) {
            parentJS.allOf = [];
        }
        parentJS.allOf.push(schema);
        this.updateIndex(node, schema);
    }

    /**
     * Visits a node.
     * @param node
     */
    visitItemsSchema(node: Oas20ItemsSchema): void {
        let parentJS: any = this.lookupParentJS(node);
        let schema: any = this.createSchemaObject(node);
        if (!this.isDefined(parentJS.items)) {
            parentJS.items = schema;
        } else if (Array.isArray(parentJS.items)) {
            parentJS.items.push(schema);
        } else {
            parentJS.items = [
                parentJS.items, schema
            ];
        }
        this.updateIndex(node, schema);
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitHeader(node: Oas20Header): void {
        let parentJS: any = this.lookupParentJS(node);
        let headerOnly: any = {
            description: node.description
        };
        let items: any = this.createItemsObject(node);
        let header: any = this.merge(headerOnly, items);
        parentJS[node.headerName()] = header;
        this.updateIndex(node, header);
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitExample(node: Oas20Example): void {
        let parentJS: any = this.lookupParentJS(node);
        let examples: any = {};
        for (let ct of node.exampleContentTypes()) {
            let example: any = node.example(ct);
            examples[ct] = example;
        }
        parentJS.examples = examples;
        this.updateIndex(node, examples);
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitItems(node: Oas20Items): void {
        let parentJS: any = this.lookupParentJS(node);
        let items: any = this.createItemsObject(node);
        parentJS.items = items;
        this.updateIndex(node, items);
    }

    /**
     * Visits a node.
     * @param node
     */
    visitSecurityDefinitions(node: Oas20SecurityDefinitions): void {
        let parent: any = this.lookupParentJS(node);
        let secDefs: any = <any>{};
        for (let name in node.securitySchemeNames()) {
            secDefs[name] = null;
        }
        parent.securityDefinitions = secDefs;
        this.updateIndex(node, secDefs);
    }

    /**
     * Visits a node.
     * @param node
     */
    visitSecurityScheme(node: Oas20SecurityScheme): void {
        let parent: any = this.lookupParentJS(node);
        let scheme: any = {
            type: node.type,
            description: node.description,
            name: node.name,
            in: node.in,
            flow: node.flow,
            authorizationUrl: node.authorizationUrl,
            tokenUrl: node.tokenUrl,
            scopes: null
        };
        parent[node.schemeName()] = scheme;
        this.updateIndex(node, scheme);
    }

    /**
     * Visits a node.
     * @param node
     */
    visitScopes(node: Oas20Scopes): void {
        let parent: any = this.lookupParentJS(node);
        let scopes: any = <any>{};
        for (let scope of node.scopes()) {
            let desc: string = node.getScopeDescription(scope);
            scopes[scope] = desc;
        }
        parent.scopes = scopes;
        this.updateIndex(node, scopes);
    }

    /**
     * Visits a node.
     * @param node
     */
    visitDefinitions(node: Oas20Definitions): void {
        let defNames: string[] = node.definitionNames();
        if (defNames && defNames.length > 0) {
            let parent: any = this.lookupParentJS(node);
            let definitions: any = {};
            parent.definitions = definitions;
            this.updateIndex(node, definitions);
        }
    }

    /**
     * Visits a node.
     * @param node
     */
    visitParametersDefinitions(node: Oas20ParametersDefinitions): void {
        let paramNames: string[] = node.parameterNames();
        if (paramNames && paramNames.length > 0) {
            let parent: any = this.lookupParentJS(node);
            let parameters: any = {};
            parent.parameters = parameters;
            this.updateIndex(node, parameters);
        }
    }

    /**
     * Visits a node.
     * @param node
     */
    visitResponsesDefinitions(node: Oas20ResponsesDefinitions): void {
        let responseNames: string[] = node.responseNames();
        if (responseNames && responseNames.length > 0) {
            let parent: any = this.lookupParentJS(node);
            let responses: any = {};
            parent.responses = responses;
            this.updateIndex(node, responses);
        }
    }

    /**
     * Creates an OAS 2.0 Items javascript object.
     * @param node
     */
    private createItemsObject(node: Oas20Items) {
        return {
            type: node.type,
            format: node.format,
            items: <any>null,
            collectionFormat: node.collectionFormat,
            default: node.default,
            maximum: node.maximum,
            exclusiveMaximum: node.exclusiveMaximum,
            minimum: node.minimum,
            exclusiveMinimum: node.exclusiveMinimum,
            maxLength: node.maxLength,
            minLength: node.minLength,
            pattern: node.pattern,
            maxItems: node.maxItems,
            minItems: node.minItems,
            uniqueItems: node.uniqueItems,
            enum: node.enum,
            multipleOf: node.multipleOf
        };
    }

    /**
     * Shared method used to create a schema JS object.
     * @param node
     * @return {any}
     */
    private createSchemaObject(node: Oas20Schema) {
        let schema: any = {
            $ref: node.$ref,
            format: node.format,
            title: node.title,
            description: node.description,
            default: node.default,

            multipleOf: node.multipleOf,
            maximum: node.maximum,
            exclusiveMaximum: node.exclusiveMaximum,
            minimum: node.minimum,
            exclusiveMinimum: node.exclusiveMinimum,
            maxLength: node.maxLength,
            minLength: node.minLength,
            pattern: node.pattern,
            maxItems: node.maxItems,
            minItems: node.minItems,
            uniqueItems: node.uniqueItems,
            maxProperties: node.maxProperties,
            minProperties: node.minProperties,
            required: node.required,
            enum: node.enum,
            type: node.type,

            items: null,
            allOf: null,
            properties: null,
            additionalProperties: null,

            discriminator: node.discriminator,
            readOnly: node.readOnly,
            xml: null,
            externalDocs: null,
            example: node.example
        };
        if (typeof node.additionalProperties === "boolean") {
            schema.additionalProperties = node.additionalProperties;
        }
        return schema;
    }

}


/**
 * Visitor used to convert from a Model into a JavaScript object that conforms
 * to the OAS 3.0 specification.  The resulting JS object can be stringified and
 * should be a valid OAS 3.0 document.
 */
export class Oas30ModelToJSVisitor extends OasModelToJSVisitor implements IOas30NodeVisitor {

    /**
     * Visits a node.
     * @param node
     */
    visitDocument(node: Oas30Document): void {
        let root: any = {
            openapi: node.openapi,
            info: null,
            servers: null,
            paths: null,
            components: null,
            security: null,
            tags: null,
            externalDocs: null
        };
        this.updateIndex(node, root);
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitPathItem(node: Oas30PathItem): void {
        let parentJS: any = this.lookupParentJS(node);
        let pathItem: any = {
            "$ref" : node.$ref,
            "summary": node.summary,
            "description": node.description,
            "get" : null,
            "put" : null,
            "post" : null,
            "delete" : null,
            "options" : null,
            "head" : null,
            "patch" : null,
            "trace": null,
            "parameters" : null,
            "servers": null
        }
        parentJS[node.path()] = pathItem;
        this.updateIndex(node, pathItem);
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitOperation(node: Oas30Operation): void {
        let parentJS: any = this.lookupParentJS(node);
        let operation: any = {
            "tags" : node.tags,
            "summary" : node.summary,
            "description" : node.description,
            "externalDocs" : null,
            "operationId" : node.operationId,
            "parameters" : null,
            "responses" : null,
            "deprecated" : node.deprecated,
            "security" : null,
            "requestBody": null,
            "callbacks": null,
            "servers": null
        }
        parentJS[node.method()] = operation;
        this.updateIndex(node, operation);
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitHeader(node: Oas30Header): void {
        let parentJS: any = this.lookupParentJS(node);
        let header: any = {
            "description" : node.description,
            "required" : node.required,
            "schema" : null,
            "allowEmptyValue" : node.allowEmptyValue,
            "deprecated" : node.deprecated,
            "style" : node.style,
            "explode" : node.explode,
            "allowReserved" : node.allowReserved,
            "example" : node.example,
            "examples" : null
        };
        parentJS[node.headerName()] = header;
        this.updateIndex(node, header);
    }

    /**
     * Creates a JS object for a Parameter base object.
     * @param node
     */
    private createParameterObject(node: Oas30ParameterBase): any {
        let parameter: any = {
            "name" : node.name,
            "in" : node.in,
            "description" : node.description,
            "required" : node.required,
            "schema" : null,
            "allowEmptyValue" : node.allowEmptyValue,
            "deprecated" : node.deprecated,
            "style" : node.style,
            "explode" : node.explode,
            "allowReserved" : node.allowReserved,
            "example" : node.example,
            "examples" : null,
            "content" : null
        };
        return parameter;
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitParameter(node: Oas30Parameter): void {
        let parentJS: any = this.lookupParentJS(node);
        if (parentJS.parameters == null) {
            parentJS.parameters = [];
        }
        let parameter: any = this.createParameterObject(node);
        let paramRef: any = {
            "$ref" : node.$ref
        };
        parameter = this.merge(paramRef, parameter);
        parentJS.parameters.push(parameter);
        this.updateIndex(node, parameter);
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitParameterDefinition(node: Oas30ParameterDefinition): void {
        let parentJS: any = this.lookupParentJS(node);
        let parameter: any = this.createParameterObject(node);
        parentJS[node.parameterName()] = parameter;
        this.updateIndex(node, parameter);
    }

    /**
     * Creates a JS object for a response base instance.
     * @param node
     */
    private createResponseObject(node: Oas30ResponseBase): any {
        return {
            description: node.description,
            headers: null,
            content: null,
            links: null
        };
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitResponse(node: Oas30Response): void {
        let parentJS: any = this.lookupParentJS(node);
        let response: any = this.createResponseObject(node);
        let responseRef: any = {
            $ref: node.$ref
        };
        response = this.merge(responseRef, response);
        if (node.statusCode() === null || node.statusCode() === "default") {
            parentJS.default = response;
        } else {
            parentJS[node.statusCode()] = response;
        }
        this.updateIndex(node, response);
    }

    /**
     * Visits a node.
     * @param node
     */
    visitResponseDefinition(node: Oas30ResponseDefinition): void {
        let parentJS: any = this.lookupParentJS(node);
        let response: any = this.createResponseObject(node);
        parentJS[node.name()] = response;
        this.updateIndex(node, response);
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitSchema(node: Oas30Schema): void {
        let parentJS: any = this.lookupParentJS(node);
        let schema: any = this.createSchemaObject(node);
        parentJS.schema = schema;
        this.updateIndex(node, schema);
    }

    /**
     * Visits a node.
     * @param node
     */
    visitPropertySchema(node: Oas30PropertySchema): void {
        let parentJS: any = this.lookupParentJS(node);
        let schema: any = this.createSchemaObject(node);
        if (!this.isDefined(parentJS.properties)) {
            parentJS.properties = {};
        }
        parentJS.properties[node.propertyName()] = schema;
        this.updateIndex(node, schema);
    }

    /**
     * Visits a node.
     * @param node
     */
    visitDefinitionSchema(node: Oas30DefinitionSchema): void {
        let parentJS: any = this.lookupParentJS(node);
        let schema: any = this.createSchemaObject(node);
        parentJS[node.definitionName()] = schema;
        this.updateIndex(node, schema);
    }

    /**
     * Visits a node.
     * @param node
     */
    visitAdditionalPropertiesSchema(node: Oas30AdditionalPropertiesSchema): void {
        let parentJS: any = this.lookupParentJS(node);
        let schema: any = this.createSchemaObject(node);
        parentJS.additionalProperties = schema;
        this.updateIndex(node, schema);
    }

    /**
     * Visits a node.
     * @param node
     */
    visitAllOfSchema(node: Oas30AllOfSchema): void {
        let parentJS: any = this.lookupParentJS(node);
        let schema: any = this.createSchemaObject(node);
        if (!this.isDefined(parentJS.allOf)) {
            parentJS.allOf = [];
        }
        parentJS.allOf.push(schema);
        this.updateIndex(node, schema);
    }

    /**
     * Visits a node.
     * @param node
     */
    visitAnyOfSchema(node: Oas30AnyOfSchema): void {
        let parentJS: any = this.lookupParentJS(node);
        let schema: any = this.createSchemaObject(node);
        if (!this.isDefined(parentJS.anyOf)) {
            parentJS.anyOf = [];
        }
        parentJS.anyOf.push(schema);
        this.updateIndex(node, schema);
    }

    /**
     * Visits a node.
     * @param node
     */
    visitOneOfSchema(node: Oas30OneOfSchema): void {
        let parentJS: any = this.lookupParentJS(node);
        let schema: any = this.createSchemaObject(node);
        if (!this.isDefined(parentJS.oneOf)) {
            parentJS.oneOf = [];
        }
        parentJS.oneOf.push(schema);
        this.updateIndex(node, schema);
    }

    /**
     * Visits a node.
     * @param node
     */
    visitNotSchema(node: Oas30NotSchema): void {
        let parentJS: any = this.lookupParentJS(node);
        let schema: any = this.createSchemaObject(node);
        parentJS.not = schema;
        this.updateIndex(node, schema);
    }

    /**
     * Visits a node.
     * @param node
     */
    visitItemsSchema(node: Oas30ItemsSchema): void {
        let parentJS: any = this.lookupParentJS(node);
        let schema: any = this.createSchemaObject(node);
        if (!this.isDefined(parentJS.items)) {
            parentJS.items = schema;
        } else if (Array.isArray(parentJS.items)) {
            parentJS.items.push(schema);
        } else {
            parentJS.items = [
                parentJS.items, schema
            ];
        }
        this.updateIndex(node, schema);
    }

    /**
     * Visits a node.
     * @param node
     */
    visitRequestBody(node: Oas30RequestBody): void {
        let parentJS: any = this.lookupParentJS(node);
        let requestBody: any = {
            "$ref": node.$ref,
            "description": node.description,
            "content": null,
            "required": node.required
        };
        parentJS.requestBody = requestBody;
        this.updateIndex(node, requestBody);
    }

    /**
     * Visits a node.
     * @param node
     */
    visitContent(node: Oas30Content): void {
        let content: any = {};
        let parentJS: any = this.lookupParentJS(node);
        parentJS.content = content;
        this.updateIndex(node, content);
    }

    /**
     * Visits a node.
     * @param node
     */
    visitMediaType(node: Oas30MediaType): void {
        let parentJS: any = this.lookupParentJS(node);
        let mediaType: any = {
            "schema": null,
            "example": node.example,
            "examples": null,
            "encoding": null
        }
        parentJS[node.name()] = mediaType;
        this.updateIndex(node, mediaType);
    }

    /**
     * Visits a node.
     * @param node
     */
    visitEncoding(node: Oas30Encoding): void {
        let encoding: any = {};
        let parentJS: any = this.lookupParentJS(node);
        parentJS.content = encoding;
        this.updateIndex(node, encoding);
    }

    /**
     * Visits a node.
     * @param node
     */
    visitEncodingProperty(node: Oas30EncodingProperty): void {
        let parentJS: any = this.lookupParentJS(node);
        let encodingProperty: any = {
            "contentType": node.contentType,
            "headers": node.headers,
            "style": node.style,
            "explode": node.explode,
            "allowReserved": node.allowReserved
        };
        parentJS[node.name()] = encodingProperty;
        this.updateIndex(node, encodingProperty);
    }

    /**
     * Visits a node.
     * @param node
     */
    visitCallbacks(node: Oas30Callbacks): void {
        // TODO implement visitCallbacks()
    }

    /**
     * Visits a node.
     * @param node
     */
    visitServer(node: Oas30Server): void {
        let parentJS: any = this.lookupParentJS(node);
        if (!this.isDefined(parentJS.servers)) {
            parentJS.servers = [];
        }
        let server: any = {
            url: node.url,
            description: node.description,
            variables: null
        };
        parentJS.servers.push(server);
        this.updateIndex(node, server);
    }

    /**
     * Visits a node.
     * @param node
     */
    visitServerVariables(node: Oas30ServerVariables): void {
        let variableNames: string[] = node.serverVariableNames();
        if (variableNames && variableNames.length > 0) {
            let parent: any = this.lookupParentJS(node);
            let serverVariables: any = {};
            parent.variables = serverVariables;
            this.updateIndex(node, serverVariables);
        }
    }

    /**
     * Visits a node.
     * @param node
     */
    visitServerVariable(node: Oas30ServerVariable): void {
        let parentJS: any = this.lookupParentJS(node);
        let serverVariable: any = {
            "enum" : node.enum,
            "default" : node.default,
            "description" : node.description
        }
        parentJS[node.name()] = serverVariable;
        this.updateIndex(node, serverVariable);
    }

    /**
     * Shared method used to create a schema JS object.
     * @param node
     * @return {any}
     */
    private createSchemaObject(node: Oas30Schema) {
        let schema: any = {
            $ref: node.$ref,
            format: node.format,
            title: node.title,
            description: node.description,
            default: node.default,

            multipleOf: node.multipleOf,
            maximum: node.maximum,
            exclusiveMaximum: node.exclusiveMaximum,
            minimum: node.minimum,
            exclusiveMinimum: node.exclusiveMinimum,
            maxLength: node.maxLength,
            minLength: node.minLength,
            pattern: node.pattern,
            maxItems: node.maxItems,
            minItems: node.minItems,
            uniqueItems: node.uniqueItems,
            maxProperties: node.maxProperties,
            minProperties: node.minProperties,
            required: node.required,
            enum: node.enum,
            type: node.type,

            items: null,
            allOf: null,
            oneOf: null,
            anyOf: null,
            not: null,
            properties: null,
            additionalProperties: null,

            discriminator: node.discriminator,
            nullable: node.nullable,
            readOnly: node.readOnly,
            writeOnly: node.writeOnly,
            deprecated: node.deprecated,
            xml: null,
            externalDocs: null,
            example: node.example
        };
        if (typeof node.additionalProperties === "boolean") {
            schema.additionalProperties = node.additionalProperties;
        }
        return schema;
    }

}
