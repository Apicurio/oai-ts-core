import {IOas20NodeVisitor} from "./visitor.iface";
import {Oas20Document} from "../models/2.0/document.model";
import {Oas20Info} from "../models/2.0/info.model";
import {Oas20Contact} from "../models/2.0/contact.model";
import {Oas20License} from "../models/2.0/license.model";
import {OasExtension} from "../models/extension.model";
import {Oas20Paths} from "../models/2.0/paths.model";
import {Oas20PathItem} from "../models/2.0/path-item.model";
import {Oas20Operation} from "../models/2.0/operation.model";
import {Oas20Parameter, Oas20ParameterDefinition, Oas20ParameterBase} from "../models/2.0/parameter.model";
import {Oas20ExternalDocumentation} from "../models/2.0/external-documentation.model";
import {Oas20SecurityRequirement} from "../models/2.0/security-requirement.model";
import {Oas20Responses} from "../models/2.0/responses.model";
import {Oas20Response, Oas20ResponseDefinition, Oas20ResponseBase} from "../models/2.0/response.model";
import {
    Oas20Schema, Oas20PropertySchema, Oas20AdditionalPropertiesSchema,
    Oas20AllOfSchema, Oas20DefinitionSchema, Oas20ItemsSchema
} from "../models/2.0/schema.model";
import {Oas20Headers} from "../models/2.0/headers.model";
import {Oas20Header} from "../models/2.0/header.model";
import {Oas20Example} from "../models/2.0/example.model";
import {Oas20Items, Oas20ItemsCollectionFormat} from "../models/2.0/items.model";
import {Oas20Tag} from "../models/2.0/tag.model";
import {OasNode} from "../models/node.model";
import {Oas20SecurityDefinitions} from "../models/2.0/security-definitions.model";
import {Oas20SecurityScheme} from "../models/2.0/security-scheme.model";
import {Oas20Scopes} from "../models/2.0/scopes.model";
import {Oas20XML} from "../models/2.0/xml.model";
import {Oas20Definitions} from "../models/2.0/definitions.model";
import {Oas20ParametersDefinitions} from "../models/2.0/parameters-definitions.model";
import {Oas20ResponsesDefinitions} from "../models/2.0/responses-definitions.model";
import {JsonSchemaType} from "../models/json-schema";

/**
 * Visitor used to convert from a Model into a JavaScript object that conforms
 * to the OAS 2.0 specification.  The resulting JS object can be stringified and
 * should be a valid OAS 2.0 document.
 */
export class Oas20ModelToJSVisitor implements IOas20NodeVisitor {

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
    public visitInfo(node: Oas20Info): void {
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
    public visitContact(node: Oas20Contact): void {
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
    public visitLicense(node: Oas20License): void {
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
    public visitExtension(node: OasExtension): void {
        let jsObject: any = this.lookupParentJS(node);
        jsObject[node.name] = node.value;
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitPaths(node: Oas20Paths): void {
        let paths: any = null;
        if ((node.pathItemNames() && node.pathItemNames().length > 0) ||
            (node.extensions() && node.extensions().length > 0) )
        {
            paths = <any>{};
        }
        let parentJS: any = this.lookupParentJS(node);
        parentJS.paths = paths;
        this.updateIndex(node, paths);
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
        parameter = Object.assign({}, parameter, items);
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
        parameter = Object.assign({}, paramRef, parameter);
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
     * Visits a node.
     * @param node
     */
    public visitExternalDocumentation(node: Oas20ExternalDocumentation): void {
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
    public visitSecurityRequirement(node: Oas20SecurityRequirement): void {
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
    public visitResponses(node: Oas20Responses): void {
        let parentJS: any = this.lookupParentJS(node);
        let responses: any = {
            default: null
        };
        parentJS.responses = responses;
        this.updateIndex(node, responses);
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
        response = Object.assign({}, responseRef, response);
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
    public visitHeader(node: Oas20Header): void {
        let parentJS: any = this.lookupParentJS(node);
        let headerOnly: any = {
            description: node.description
        };
        let items: any = this.createItemsObject(node);
        let header: any = Object.assign({}, headerOnly, items);
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
    public visitTag(node: Oas20Tag): void {
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
    visitXML(node: Oas20XML): void {
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
     * Indexes the javascript object by the ModelId of the model it was created from.  This allows
     * quick lookup (mapping) from the model to the JS object.
     * @param node
     * @param jsObject
     */
    private updateIndex(node: OasNode, jsObject: any) {
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
    private lookup(modelId: number): any {
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
    private lookupParentJS(node: OasNode): any {
        if (node === null) {
            console.info("Node is null!!");
        }
        if (!node.parent()) {
            console.info("Node Parent is falsy! " + node);
        }
        return this.lookup(node.parent().modelId());
    }

    /**
     * Creates an OAS 2.0 Items javascript object.
     * @param node
     */
    private createItemsObject(node: Oas20Items) {
        return {
            type: this.fromJsonSchemaType(node.type),
            format: node.format,
            items: null,
            collectionFormat: this.fromOas20ItemsCollectionFormat(node.collectionFormat),
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
     * Converts from an JsonSchemaType to a string.
     * @param type
     * @return {string}
     */
    private fromJsonSchemaType(type: JsonSchemaType): string {
        if (type == null) {
            return null;
        }
        return JsonSchemaType[type];
    }

    /**
     * Converts from an Oas20ItemsCollectionFormat to a string.
     * @param format
     * @return {string}
     */
    private fromOas20ItemsCollectionFormat(format: Oas20ItemsCollectionFormat): string {
        if (format == null) {
            return null;
        }
        return Oas20ItemsCollectionFormat[format];
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
            type: this.fromJsonSchemaType(node.type),

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

    /**
     * Returns true if the given thing is defined.
     * @param thing
     * @return {boolean}
     */
    private isDefined(thing: any): boolean {
        if (typeof thing === "undefined" || thing === null) {
            return false;
        } else {
            return true;
        }
    }

}