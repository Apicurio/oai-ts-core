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
    Oas20SchemaDefinition,
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
import {Oas30LinkServer, Oas30Server} from "../models/3.0/server.model";
import {Oas30ServerVariable} from "../models/3.0/server-variable.model";
import {OasSecurityRequirement} from "../models/common/security-requirement.model";
import {OasTag} from "../models/common/tag.model";
import {OasExternalDocumentation} from "../models/common/external-documentation.model";
import {OasPaths} from "../models/common/paths.model";
import {Oas30CallbackPathItem, Oas30PathItem} from "../models/3.0/path-item.model";
import {Oas30Operation} from "../models/3.0/operation.model";
import {Oas30Parameter, Oas30ParameterBase, Oas30ParameterDefinition} from "../models/3.0/parameter.model";
import {OasResponses} from "../models/common/responses.model";
import {Oas30Response, Oas30ResponseBase, Oas30ResponseDefinition} from "../models/3.0/response.model";
import {
    Oas30AdditionalPropertiesSchema,
    Oas30AllOfSchema,
    Oas30AnyOfSchema,
    Oas30SchemaDefinition,
    Oas30ItemsSchema,
    Oas30NotSchema,
    Oas30OneOfSchema,
    Oas30PropertySchema,
    Oas30Schema
} from "../models/3.0/schema.model";
import {OasXML} from "../models/common/xml.model";
import {Oas30Header, Oas30HeaderDefinition} from "../models/3.0/header.model";
import {Oas30RequestBody, Oas30RequestBodyDefinition} from "../models/3.0/request-body.model";
import {OasPathItem} from "../models/common/path-item.model";
import {OasOperation} from "../models/common/operation.model";
import {OasHeader} from "../models/common/header.model";
import {OasSchema} from "../models/common/schema.model";
import {Oas30Encoding} from "../models/3.0/encoding.model";
import {Oas30MediaType} from "../models/3.0/media-type.model";
import {Oas30Example, Oas30ExampleDefinition} from "../models/3.0/example.model";
import {Oas30Link, Oas30LinkDefinition} from "../models/3.0/link.model";
import {Oas30LinkParameterExpression} from "../models/3.0/link-parameter-expression.model";
import {Oas30Callback, Oas30CallbackDefinition} from "../models/3.0/callback.model";
import {Oas30Components} from "../models/3.0/components.model";
import {Oas30SecurityScheme} from "../models/3.0/security-scheme.model";
import {Oas30OAuthFlows} from "../models/3.0/oauth-flows.model";
import {
    Oas30AuthorizationCodeOAuthFlow,
    Oas30ClientCredentialsOAuthFlow, Oas30ImplicitOAuthFlow, Oas30OAuthFlow,
    Oas30PasswordOAuthFlow
} from "../models/3.0/oauth-flow.model";
import {OasSecurityScheme} from "../models/common/security-scheme.model";
import {Oas20Headers} from "../models/2.0/headers.model";
import {Oas30LinkRequestBodyExpression} from "../models/3.0/link-request-body-expression.model";
import {Oas30Discriminator} from "../models/3.0/discriminator.model";


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
    public abstract visitSecurityScheme(node: OasSecurityScheme): void;

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
            $ref : node.$ref,
            get : null,
            put : null,
            post : null,
            delete : null,
            options : null,
            head : null,
            patch : null,
            parameters : null
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
            tags : node.tags,
            summary : node.summary,
            description : node.description,
            externalDocs : null,
            operationId : node.operationId,
            consumes : node.consumes,
            produces : node.produces,
            parameters : null,
            responses : null,
            schemes : node.schemes,
            deprecated : node.deprecated,
            security : null
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
            name : node.name,
            in : node.in,
            description : node.description,
            required : node.required,
            schema : null,
            allowEmptyValue : node.allowEmptyValue
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
            $ref : node.$ref
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
    public visitHeaders(node: Oas20Headers): void {
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
    public visitResponseDefinition(node: Oas20ResponseDefinition): void {
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
    public visitPropertySchema(node: Oas20PropertySchema): void {
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
    public visitSchemaDefinition(node: Oas20SchemaDefinition): void {
        let parentJS: any = this.lookupParentJS(node);
        let schema: any = this.createSchemaObject(node);
        parentJS[node.definitionName()] = schema;
        this.updateIndex(node, schema);
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitAdditionalPropertiesSchema(node: Oas20AdditionalPropertiesSchema): void {
        let parentJS: any = this.lookupParentJS(node);
        let schema: any = this.createSchemaObject(node);
        parentJS.additionalProperties = schema;
        this.updateIndex(node, schema);
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitAllOfSchema(node: Oas20AllOfSchema): void {
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
    public visitItemsSchema(node: Oas20ItemsSchema): void {
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
    public visitSecurityDefinitions(node: Oas20SecurityDefinitions): void {
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
    public visitSecurityScheme(node: Oas20SecurityScheme): void {
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
    public visitScopes(node: Oas20Scopes): void {
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
    public visitDefinitions(node: Oas20Definitions): void {
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
    public visitParametersDefinitions(node: Oas20ParametersDefinitions): void {
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
    public visitResponsesDefinitions(node: Oas20ResponsesDefinitions): void {
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
    public visitDocument(node: Oas30Document): void {
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
            $ref : node.$ref,
            summary: node.summary,
            description: node.description,
            get : null,
            put : null,
            post : null,
            delete : null,
            options : null,
            head : null,
            patch : null,
            trace: null,
            parameters : null,
            servers: null
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
            tags : node.tags,
            summary : node.summary,
            description : node.description,
            externalDocs : null,
            operationId : node.operationId,
            parameters : null,
            responses : null,
            deprecated : node.deprecated,
            security : null,
            requestBody: null,
            callbacks: null,
            servers: null
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
        let header: any = this.createHeaderObject(node);
        if (!this.isDefined(parentJS["headers"])) {
            parentJS["headers"] = {};
        }
        parentJS["headers"][node.headerName()] = header;
        this.updateIndex(node, header);
    }

    /**
     * Creates a header object.
     * @param node
     */
    private createHeaderObject(node: Oas30Header): any {
        let header: any = {
            $ref: node.$ref,
            description : node.description,
            required : node.required,
            schema : null,
            allowEmptyValue : node.allowEmptyValue,
            deprecated : node.deprecated,
            style : node.style,
            explode : node.explode,
            allowReserved : node.allowReserved,
            example : node.example,
            examples : null
        };
        return header;
    }

    /**
     * Creates a JS object for a Parameter base object.
     * @param node
     */
    private createParameterObject(node: Oas30ParameterBase): any {
        let parameter: any = {
            $ref: node.$ref,
            name : node.name,
            in : node.in,
            description : node.description,
            required : node.required,
            schema : null,
            allowEmptyValue : node.allowEmptyValue,
            deprecated : node.deprecated,
            style : node.style,
            explode : node.explode,
            allowReserved : node.allowReserved,
            example : node.example,
            examples : null,
            content : null
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
        parentJS.parameters.push(parameter);
        this.updateIndex(node, parameter);
    }

    /**
     * Creates a JS object for a response base instance.
     * @param node
     */
    private createResponseObject(node: Oas30ResponseBase): any {
        return {
            $ref: node.$ref,
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
    public visitLink(node: Oas30Link): void {
        let parentJS: any = this.lookupParentJS(node);
        let link: any = this.createLinkObject(node);
        if (!this.isDefined(parentJS["links"])) {
            parentJS["links"] = {};
        }
        parentJS["links"][node.name()] = link;
        this.updateIndex(node, link);
    }

    /**
     * Creates a link object.
     * @param node
     * @return {any}
     */
    private createLinkObject(node: Oas30Link): any {
        let link: any = {
            $ref: node.$ref,
            operationRef: node.operationRef,
            operationId: node.operationId,
            parameters: null,
            requestBody: null,
            description: node.description,
            server: null
        };
        return link;
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitLinkServer(node: Oas30LinkServer): void {
        let parentJS: any = this.lookupParentJS(node);
        let server: any = {
            url: node.url,
            description: node.description,
            variables: null
        };
        parentJS.server = server;
        this.updateIndex(node, server);
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitLinkParameterExpression(node: Oas30LinkParameterExpression): void {
        let parentJS: any = this.lookupParentJS(node);
        let expression: any = node.value();
        if (!this.isDefined(parentJS["parameters"])) {
            parentJS["parameters"] = {};
        }
        parentJS["parameters"][node.name()] = expression;
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitLinkRequestBodyExpression(node: Oas30LinkRequestBodyExpression): void {
        let parentJS: any = this.lookupParentJS(node);
        let expression: any = node.value();
        parentJS.requestBody = expression;
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
    public visitDiscriminator(node: Oas30Discriminator): void {
        let parentJS: any = this.lookupParentJS(node);
        let discriminator: any = {
            propertyName: node.propertyName,
            mapping: node.mapping
        };
        parentJS.discriminator = discriminator;
        this.updateIndex(node, discriminator);
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitPropertySchema(node: Oas30PropertySchema): void {
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
    public visitAdditionalPropertiesSchema(node: Oas30AdditionalPropertiesSchema): void {
        let parentJS: any = this.lookupParentJS(node);
        let schema: any = this.createSchemaObject(node);
        parentJS.additionalProperties = schema;
        this.updateIndex(node, schema);
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitAllOfSchema(node: Oas30AllOfSchema): void {
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
    public visitAnyOfSchema(node: Oas30AnyOfSchema): void {
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
    public visitOneOfSchema(node: Oas30OneOfSchema): void {
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
    public visitNotSchema(node: Oas30NotSchema): void {
        let parentJS: any = this.lookupParentJS(node);
        let schema: any = this.createSchemaObject(node);
        parentJS.not = schema;
        this.updateIndex(node, schema);
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitItemsSchema(node: Oas30ItemsSchema): void {
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
    public visitRequestBody(node: Oas30RequestBody): void {
        let parentJS: any = this.lookupParentJS(node);
        let requestBody: any = this.createRequestBodyObject(node);
        parentJS.requestBody = requestBody;
        this.updateIndex(node, requestBody);
    }

    /**
     * Creates a request body object.
     * @param node
     * @return {any}
     */
    private createRequestBodyObject(node: Oas30RequestBody): any {
        let requestBody: any = {
            $ref: node.$ref,
            description: node.description,
            content: null,
            required: node.required
        };
        return requestBody;
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitMediaType(node: Oas30MediaType): void {
        let parentJS: any = this.lookupParentJS(node);
        let mediaType: any = {
            schema: null,
            example: node.example,
            examples: null,
            encoding: null
        }
        if (!this.isDefined(parentJS["content"])) {
            parentJS["content"] = {};
        }
        parentJS["content"][node.name()] = mediaType;
        this.updateIndex(node, mediaType);
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitEncoding(node: Oas30Encoding): void {
        let parentJS: any = this.lookupParentJS(node);
        let encoding: any = {
            contentType: node.contentType,
            headers: null,
            style: node.style,
            explode: node.explode,
            allowReserved: node.allowReserved
        };
        if (!this.isDefined(parentJS["encoding"])) {
            parentJS["encoding"] = {};
        }
        parentJS["encoding"][node.name()] = encoding;
        this.updateIndex(node, encoding);
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitExample(node: Oas30Example): void {
        let parentJS: any = this.lookupParentJS(node);
        let example: any = this.createExampleObject(node);
        if (!parentJS.examples) {
            parentJS.examples = {};
        }
        parentJS.examples[node.name()] = example;
        this.updateIndex(node, example);
    }

    /**
     * Creates an example.
     * @param node
     */
    private createExampleObject(node: Oas30Example) {
        let example: any = {
            $ref : node.$ref,
            summary : node.summary,
            description : node.description,
            value : node.value,
            externalValue : node.externalValue
        };
        return example;
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitCallback(node: Oas30Callback): void {
        let callback: any = {};
        let parentJS: any = this.lookupParentJS(node);
        if (this.isDefined(node.$ref)) {
            callback.$ref = node.$ref;
        }
        if (!this.isDefined(parentJS["callbacks"])) {
            parentJS["callbacks"] = {};
        }
        parentJS["callbacks"][node.name()] = callback;
        this.updateIndex(node, callback);
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitCallbackPathItem(node: Oas30CallbackPathItem): void {
        this.visitPathItem(node);
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitComponents(node: Oas30Components): void {
        let components: any = {};
        let parentJS: any = this.lookupParentJS(node);
        parentJS.components = components;
        this.updateIndex(node, components);
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitSchemaDefinition(node: Oas30SchemaDefinition): void {
        let parentJS: any = this.lookupParentJS(node);
        let schema: any = this.createSchemaObject(node);
        if (!this.isDefined(parentJS["schemas"])) {
            parentJS["schemas"] = {};
        }
        parentJS["schemas"][node.name()] = schema;
        this.updateIndex(node, schema);
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitResponseDefinition(node: Oas30ResponseDefinition): void {
        let parentJS: any = this.lookupParentJS(node);
        let response: any = this.createResponseObject(node);
        if (!this.isDefined(parentJS["responses"])) {
            parentJS["responses"] = {};
        }
        parentJS["responses"][node.name()] = response;
        this.updateIndex(node, response);
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitParameterDefinition(node: Oas30ParameterDefinition): void {
        let parentJS: any = this.lookupParentJS(node);
        let parameter: any = this.createParameterObject(node);
        if (!this.isDefined(parentJS["parameters"])) {
            parentJS["parameters"] = {};
        }
        parentJS["parameters"][node.parameterName()] = parameter;
        this.updateIndex(node, parameter);
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitExampleDefinition(node: Oas30ExampleDefinition): void {
        let parentJS: any = this.lookupParentJS(node);
        let example: any = this.createExampleObject(node);
        if (!this.isDefined(parentJS["examples"])) {
            parentJS["examples"] = {};
        }
        parentJS["examples"][node.name()] = example;
        this.updateIndex(node, example);
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitRequestBodyDefinition(node: Oas30RequestBodyDefinition): void {
        let parentJS: any = this.lookupParentJS(node);
        let requestBody: any = this.createRequestBodyObject(node);
        if (!this.isDefined(parentJS["requestBodies"])) {
            parentJS["requestBodies"] = {};
        }
        parentJS["requestBodies"][node.name()] = requestBody;
        this.updateIndex(node, requestBody);
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitHeaderDefinition(node: Oas30HeaderDefinition): void {
        let parentJS: any = this.lookupParentJS(node);
        let header: any = this.createHeaderObject(node);
        if (!this.isDefined(parentJS["headers"])) {
            parentJS["headers"] = {};
        }
        parentJS["headers"][node.name()] = header;
        this.updateIndex(node, header);
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitOAuthFlows(node: Oas30OAuthFlows): void {
        let parentJS: any = this.lookupParentJS(node);
        let oauthFlows: any = {
            implicit: null,
            password: null,
            clientCredentials: null,
            authorizationCode: null
        }
        parentJS.flows = oauthFlows;
        this.updateIndex(node, oauthFlows);
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitImplicitOAuthFlow(node: Oas30ImplicitOAuthFlow): void {
        let parentJS: any = this.lookupParentJS(node);
        let flow: any = this.createOAuthFlowObject(node);
        parentJS.implicit = flow;
        this.updateIndex(node, flow);
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitPasswordOAuthFlow(node: Oas30PasswordOAuthFlow): void {
        let parentJS: any = this.lookupParentJS(node);
        let flow: any = this.createOAuthFlowObject(node);
        parentJS.password = flow;
        this.updateIndex(node, flow);
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitClientCredentialsOAuthFlow(node: Oas30ClientCredentialsOAuthFlow): void {
        let parentJS: any = this.lookupParentJS(node);
        let flow: any = this.createOAuthFlowObject(node);
        parentJS.clientCredentials = flow;
        this.updateIndex(node, flow);
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitAuthorizationCodeOAuthFlow(node: Oas30AuthorizationCodeOAuthFlow): void {
        let parentJS: any = this.lookupParentJS(node);
        let flow: any = this.createOAuthFlowObject(node);
        parentJS.authorizationCode = flow;
        this.updateIndex(node, flow);
    }

    /**
     * Creates an OAuth Flow js object.
     * @param node
     * @return {any}
     */
    private createOAuthFlowObject(node: Oas30OAuthFlow): any {
        let flow: any = {
            authorizationUrl: node.authorizationUrl,
            tokenUrl: node.tokenUrl,
            refreshUrl: node.refreshUrl,
            scopes: node.scopes
        };
        return flow;
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitSecurityScheme(node: Oas30SecurityScheme): void {
        let parentJS: any = this.lookupParentJS(node);
        let securityScheme: any = {
            $ref: node.$ref,
            type: node.type,
            description: node.description,
            name: node.name,
            in: node.in,
            scheme: node.scheme,
            bearerFormat: node.bearerFormat,
            flows: null,
            openIdConnectUrl: node.openIdConnectUrl
        };
        if (!this.isDefined(parentJS["securitySchemes"])) {
            parentJS["securitySchemes"] = {};
        }
        parentJS["securitySchemes"][node.schemeName()] = securityScheme;
        this.updateIndex(node, securityScheme);
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitLinkDefinition(node: Oas30LinkDefinition): void {
        let parentJS: any = this.lookupParentJS(node);
        let link: any = this.createLinkObject(node);
        if (!this.isDefined(parentJS["links"])) {
            parentJS["links"] = {};
        }
        parentJS["links"][node.name()] = link;
        this.updateIndex(node, link);
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitCallbackDefinition(node: Oas30CallbackDefinition): void {
        let parentJS: any = this.lookupParentJS(node);
        let callback: any = {};
        if (this.isDefined(node.$ref)) {
            callback.$ref = node.$ref;
        }
        if (!this.isDefined(parentJS["callbacks"])) {
            parentJS["callbacks"] = {};
        }
        parentJS["callbacks"][node.name()] = callback;
        this.updateIndex(node, callback);
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitServer(node: Oas30Server): void {
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
    public visitServerVariable(node: Oas30ServerVariable): void {
        let parentJS: any = this.lookupParentJS(node);
        let serverVariable: any = {
            enum : node.enum,
            default : node.default,
            description : node.description
        }
        if (!this.isDefined(parentJS["variables"])) {
            parentJS["variables"] = {};
        }
        parentJS["variables"][node.name()] = serverVariable;
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
