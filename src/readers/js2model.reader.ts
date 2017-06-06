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

import {Oas20Document} from "../models/2.0/document.model";
import {Oas20Info} from "../models/2.0/info.model";
import {Oas20Contact} from "../models/2.0/contact.model";
import {Oas20License} from "../models/2.0/license.model";
import {OasExtensibleNode} from "../models/enode.model";
import {Oas20Tag} from "../models/2.0/tag.model";
import {Oas20ExternalDocumentation} from "../models/2.0/external-documentation.model";
import {Oas20SecurityRequirement} from "../models/2.0/security-requirement.model";
import {Oas20SecurityDefinitions} from "../models/2.0/security-definitions.model";
import {Oas20SecurityScheme} from "../models/2.0/security-scheme.model";
import {Oas20Scopes} from "../models/2.0/scopes.model";
import {Oas20PathItem} from "../models/2.0/path-item.model";
import {Oas20Paths} from "../models/2.0/paths.model";
import {Oas20Operation} from "../models/2.0/operation.model";
import {Oas20Parameter, Oas20ParameterBase, Oas20ParameterDefinition} from "../models/2.0/parameter.model";
import {
    Oas20AdditionalPropertiesSchema,
    Oas20AllOfSchema,
    Oas20DefinitionSchema,
    Oas20ItemsSchema,
    Oas20PropertySchema,
    Oas20Schema
} from "../models/2.0/schema.model";
import {Oas20Items} from "../models/2.0/items.model";
import {Oas20Responses} from "../models/2.0/responses.model";
import {Oas20Response, Oas20ResponseBase, Oas20ResponseDefinition} from "../models/2.0/response.model";
import {Oas20Headers} from "../models/2.0/headers.model";
import {Oas20Example} from "../models/2.0/example.model";
import {Oas20Header} from "../models/2.0/header.model";
import {Oas20XML} from "../models/2.0/xml.model";
import {Oas20Definitions} from "../models/2.0/definitions.model";
import {Oas20ParametersDefinitions} from "../models/2.0/parameters-definitions.model";
import {Oas20ResponsesDefinitions} from "../models/2.0/responses-definitions.model";
import {IOas20NodeVisitor} from "../visitors/visitor.iface";
import {OasExtension} from "../models/extension.model";
import {OasInfo} from "../models/common/info.model";
import {OasContact} from "../models/common/contact.model";
import {OasLicense} from "../models/common/license.model";
import {Oas30Info} from "../models/3.0/info.model";
import {Oas30Document} from "../models/3.0/document.model";
import {Oas30Server} from "../models/3.0/server.model";
import {Oas30ServerVariables} from "../models/3.0/server-variables.model";
import {Oas30ServerVariable} from "../models/3.0/server-variable.model";
import {OasExternalDocumentation} from "../models/common/external-documentation.model";
import {Oas30SecurityRequirement} from "../models/3.0/security-requirement.model";
import {Oas30ExternalDocumentation} from "../models/3.0/external-documentation.model";
import {OasTag} from "../models/common/tag.model";
import {Oas30Tag} from "../models/3.0/tag.model";
import {OasXML} from "../models/common/xml.model";
import {OasHeaders} from "../models/common/headers.model";
import {OasHeader} from "../models/common/header.model";
import {OasSecurityRequirement} from "../models/common/security-requirement.model";
import {OasOperation} from "../models/common/operation.model";
import {OasParameterBase} from "../models/common/parameter.model";
import {OasResponses} from "../models/common/responses.model";
import {OasResponse} from "../models/common/response.model";
import {OasSchema} from "../models/common/schema.model";
import {OasPaths} from "../models/common/paths.model";
import {OasPathItem} from "../models/common/path-item.model";
import {Oas30Paths} from "../models/3.0/paths.model";
import {Oas30PathItem} from "../models/3.0/path-item.model";
import {Oas30Operation} from "../models/3.0/operation.model";
import {Oas30Parameter, Oas30ParameterBase} from "../models/3.0/parameter.model";
import {Oas30Schema} from "../models/3.0/schema.model";
import {Oas30Response, Oas30ResponseBase} from "../models/3.0/response.model";
import {Oas30Header} from "../models/3.0/header.model";
import {Oas30RequestBody} from "../models/3.0/request-body.model";
import {Oas30Content} from "../models/3.0/content.model";
import {Oas30MediaType} from "../models/3.0/media-type.model";
import {Oas30Encoding} from "../models/3.0/encoding.model";
import {Oas30EncodingProperty} from "../models/3.0/encoding-property.model";
import {Oas30Example} from "../models/3.0/example.model";
import {Oas30Headers} from "../models/3.0/headers.model";
import {Oas30Links} from "../models/3.0/links.model";
import {Oas30Link} from "../models/3.0/link.model";
import {Oas30LinkParameters} from "../models/3.0/link-parameters.model";
import {Oas30LinkParameterExpression} from "../models/3.0/link-parameter-expression.model";
import {Oas30Callbacks} from "../models/3.0/callbacks.model";
import {Oas30Callback} from "../models/3.0/callback.model";
import {OasDocument} from "../models/document.model";


/**
 * This class reads a javascript object and turns it into a OAS model.
 */
export abstract class OasJS2ModelReader {

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
     * Reads an OAS Document object from the given javascript data.
     * @param document
     * @param documentModel
     */
    public readDocument(document: any, documentModel: OasDocument): void {
        let info: any = document["info"];
        let paths: any = document["paths"];
        let security: any[] = document["security"];
        let tags: any = document["tags"];
        let externalDocs: any = document["externalDocs"];

        if (this.isDefined(info)) {
            let infoModel: OasInfo = documentModel.createInfo();
            this.readInfo(info, infoModel);
            documentModel.info = infoModel;
        }

        if (this.isDefined(paths)) {
            let pathsModel: OasPaths = documentModel.createPaths();
            this.readPaths(paths, pathsModel);
            documentModel.paths = pathsModel;
        }
        if (this.isDefined(security)) {
            let securityModels: OasSecurityRequirement[] = [];
            for (let sec of security) {
                let secModel: OasSecurityRequirement = documentModel.createSecurityRequirement();
                this.readSecurityRequirement(sec, secModel);
                securityModels.push(secModel);
            }
            documentModel.security = securityModels;
        }
        if (this.isDefined(tags)) {
            let tagModels: OasTag[] = [];
            for (let tag of tags) {
                let tagModel: OasTag = documentModel.createTag();
                this.readTag(tag, tagModel);
                tagModels.push(tagModel);
            }
            documentModel.tags = tagModels;
        }
        if (this.isDefined(externalDocs)) {
            let externalDocsModel: OasExternalDocumentation = documentModel.createExternalDocumentation();
            this.readExternalDocumentation(externalDocs, externalDocsModel);
            documentModel.externalDocs = externalDocsModel;
        }
        this.readExtensions(document, documentModel);
    }

    /**
     * Reads a OAS Info object from the given javascript data.
     * @param info
     * @param infoModel
     */
    public readInfo(info: any, infoModel: OasInfo): void {
        let title: string = info["title"];
        let description: string = info["description"];
        let termsOfService: string = info["termsOfService"];
        let contact: any = info["contact"];
        let license: any = info["license"];
        let version: string = info["version"];

        if (this.isDefined(title)) { infoModel.title = title; }
        if (this.isDefined(description)) { infoModel.description = description; }
        if (this.isDefined(termsOfService)) { infoModel.termsOfService = termsOfService; }
        if (this.isDefined(contact)) {
            let contactModel: OasContact = infoModel.createContact();
            this.readContact(contact, contactModel);
            infoModel.contact = contactModel;
        }
        if (this.isDefined(license)) {
            let licenseModel: OasLicense = infoModel.createLicense();
            this.readLicense(license, licenseModel);
            infoModel.license = licenseModel;
        }
        if (this.isDefined(version)) { infoModel.version = version; }

        this.readExtensions(info, infoModel);
    }

    /**
     * Reads a OAS Contact object from the given javascript data.
     * @param contact
     * @param contactModel
     */
    public readContact(contact: any, contactModel: OasContact): void {
        let name: string = contact["name"];
        let url: string = contact["url"];
        let email: string = contact["email"];

        if (this.isDefined(name)) { contactModel.name = name; }
        if (this.isDefined(url)) { contactModel.url = url; }
        if (this.isDefined(email)) { contactModel.email = email; }

        this.readExtensions(contact, contactModel);
    }

    /**
     * Reads a OAS License object from the given javascript data.
     * @param license
     * @param licenseModel
     */
    public readLicense(license: any, licenseModel: OasLicense): void {
        let name: string = license["name"];
        let url: string = license["url"];

        if (this.isDefined(name)) { licenseModel.name = name; }
        if (this.isDefined(url)) { licenseModel.url = url; }

        this.readExtensions(license, licenseModel);
    }

    /**
     * Reads an OAS Paths object from the given JS data.
     * @param paths
     * @param pathsModel
     */
    public readPaths(paths: any, pathsModel: OasPaths): void {
        for (let path in paths) {
            if (path.indexOf("x-") === 0) { continue; }
            let pathItem: any = paths[path];
            let pathItemModel: OasPathItem = pathsModel.createPathItem(path);
            this.readPathItem(pathItem, pathItemModel);
            pathsModel.addPathItem(path, pathItemModel);
        }
        this.readExtensions(paths, pathsModel);
    }

    /**
     * Reads an OAS PathItem object from the given JS data.
     * @param pathItem
     * @param pathItemModel
     */
    public readPathItem(pathItem: any, pathItemModel: OasPathItem): void {
        let $ref: string = pathItem["$ref"];
        let get: any = pathItem["get"];
        let put: any = pathItem["put"];
        let post: any = pathItem["post"];
        let delete_: any = pathItem["delete"];
        let options: any = pathItem["options"];
        let head: any = pathItem["head"];
        let patch: any = pathItem["patch"];
        let parameters: any[] = pathItem["parameters"];

        if (this.isDefined($ref)) { pathItemModel.$ref = $ref; }
        if (this.isDefined(get)) {
            let opModel: OasOperation = pathItemModel.createOperation("get");
            this.readOperation(get, opModel);
            pathItemModel.get = opModel;
        }
        if (this.isDefined(put)) {
            let opModel: OasOperation = pathItemModel.createOperation("put");
            this.readOperation(put, opModel);
            pathItemModel.put = opModel;
        }
        if (this.isDefined(post)) {
            let opModel: OasOperation = pathItemModel.createOperation("post");
            this.readOperation(post, opModel);
            pathItemModel.post = opModel;
        }
        if (this.isDefined(delete_)) {
            let opModel: OasOperation = pathItemModel.createOperation("delete");
            this.readOperation(delete_, opModel);
            pathItemModel.delete = opModel;
        }
        if (this.isDefined(options)) {
            let opModel: OasOperation = pathItemModel.createOperation("options");
            this.readOperation(options, opModel);
            pathItemModel.options = opModel;
        }
        if (this.isDefined(head)) {
            let opModel: OasOperation = pathItemModel.createOperation("head");
            this.readOperation(head, opModel);
            pathItemModel.head = opModel;
        }
        if (this.isDefined(patch)) {
            let opModel: OasOperation = pathItemModel.createOperation("patch");
            this.readOperation(patch, opModel);
            pathItemModel.patch = opModel;
        }
        if (this.isDefined(parameters)) {
            for (let parameter of parameters) {
                let paramModel: OasParameterBase = pathItemModel.createParameter();
                this.readParameter(parameter, paramModel);
                pathItemModel.addParameter(paramModel);
            }
        }

        this.readExtensions(pathItem, pathItemModel);
    }

    /**
     * Reads an OAS Headers object from the given JS data.
     * @param headers
     * @param headersModel
     */
    public readHeaders(headers: any, headersModel: OasHeaders): void {
        for (let headerName in headers) {
            let header: any = headers[headerName];
            let headerModel: OasHeader = headersModel.createHeader(headerName);
            this.readHeader(header, headerModel);
            headersModel.addHeader(headerName, headerModel);
        }
    }

    /**
     * Reads an OAS Header object from the given JS data.
     * @param header
     * @param headerModel
     */
    protected abstract readHeader(header: any, headerModel: OasHeader): void;

    /**
     * Reads an OAS Operation object from the given JS data.
     * @param operation
     * @param operationModel
     */
    public readOperation(operation: any, operationModel: OasOperation): void {
        let tags: string[] = operation["tags"];
        let summary: string = operation["summary"];
        let description: string = operation["description"];
        let externalDocs: any = operation["externalDocs"];
        let operationId: string = operation["operationId"];
        let parameters: any[] = operation["parameters"];
        let responses: any = operation["responses"];
        let deprecated: boolean = operation["deprecated"];
        let security: any[] = operation["security"];

        if (this.isDefined(tags)) { operationModel.tags = tags; }
        if (this.isDefined(summary)) { operationModel.summary = summary; }
        if (this.isDefined(description)) { operationModel.description = description; }
        if (this.isDefined(externalDocs)) {
            let externalDocsModel: Oas20ExternalDocumentation = operationModel.createExternalDocumentation();
            this.readExternalDocumentation(externalDocs, externalDocsModel);
            operationModel.externalDocs = externalDocsModel;
        }
        if (this.isDefined(operationId)) { operationModel.operationId = operationId; }
        if (this.isDefined(parameters)) {
            for (let parameter of parameters) {
                let paramModel: OasParameterBase = operationModel.createParameter();
                this.readParameter(parameter, paramModel);
                operationModel.addParameter(paramModel);
            }
        }
        if (this.isDefined(responses)) {
            let responsesModel: OasResponses = operationModel.createResponses();
            this.readResponses(responses, responsesModel);
            operationModel.responses = responsesModel;
        }
        if (this.isDefined(deprecated)) { operationModel.deprecated = deprecated; }
        if (this.isDefined(security)) {
            for (let securityRequirement of security) {
                let securityRequirementModel: Oas20SecurityRequirement = operationModel.createSecurityRequirement();
                this.readSecurityRequirement(securityRequirement, securityRequirementModel);
                operationModel.addSecurityRequirement(securityRequirementModel);
            }
        }

        this.readExtensions(operation, operationModel);
    }

    /**
     * Reads an OAS Parameter object from the given JS data.
     * @param parameter
     * @param paramModel
     */
    public abstract readParameter(parameter: any, paramModel: OasParameterBase): void;

    /**
     * Reads an OAS Responses object from the given JS data.
     * @param responses
     * @param responsesModel
     */
    public readResponses(responses: any, responsesModel: OasResponses): void {
        let default_: any = responses["default"];
        if (this.isDefined(default_)) {
            let defaultModel: OasResponse = responsesModel.createResponse();
            this.readResponse(default_, defaultModel);
            responsesModel.default = defaultModel;
        }

        for (let statusCode in responses) {
            if (statusCode.indexOf("x-") === 0) { continue; }
            if (statusCode === "default") { continue; }
            let response: any = responses[statusCode];
            let responseModel: OasResponse = responsesModel.createResponse(statusCode);
            this.readResponse(response, responseModel);
            responsesModel.addResponse(statusCode, responseModel);
        }
        this.readExtensions(responses, responsesModel);
    }

    /**
     * Reads an OAS Response from the given JS data.
     * @param response
     * @param responseModel
     */
    public abstract readResponse(response: any, responseModel: OasResponse): void;

    /**
     * Reads an OAS Schema object from the given JS data.
     * @param schema
     * @param schemaModel
     */
    public readSchema(schema: any, schemaModel: OasSchema): void {
        let $ref: string = schema["$ref"];
        let format: string = schema["format"];
        let title: string = schema["title"];
        let description: string = schema["description"];
        let default_: any = schema["default"];
        let multipleOf: number = schema["multipleOf"];
        let maximum: number = schema["maximum"];
        let exclusiveMaximum: boolean = schema["exclusiveMaximum"];
        let minimum: number = schema["minimum"];
        let exclusiveMinimum: boolean = schema["exclusiveMinimum"];
        let maxLength: number = schema["maxLength"]; // Require: integer
        let minLength: number = schema["minLength"]; // Require: integer
        let pattern: string = schema["pattern"];
        let maxItems: number = schema["maxItems"]; // Require: integer
        let minItems: number = schema["minItems"]; // Require: integer
        let uniqueItems: boolean = schema["uniqueItems"];
        let maxProperties: number = schema["maxProperties"];
        let minProperties: number = schema["minProperties"];
        let required: boolean = schema["required"];
        let enum_: any[] = schema["enum"];
        let type: string = schema["type"];

        let items: any[] = schema["items"];
        let allOf: any[] = schema["allOf"];
        let properties: any = schema["properties"];
        let additionalProperties: boolean | Oas20Schema = schema["additionalProperties"];

        let discriminator: string = schema["discriminator"];
        let readOnly: boolean = schema["readOnly"];
        let xml: Oas20XML = schema["xml"];
        let externalDocs: any = schema["externalDocs"];
        let example: any = schema["example"];

        if (this.isDefined($ref)) { schemaModel.$ref = $ref; }
        if (this.isDefined(format)) { schemaModel.format = format; }
        if (this.isDefined(title)) { schemaModel.title = title; }
        if (this.isDefined(description)) { schemaModel.description = description; }
        if (this.isDefined(default_)) { schemaModel.default = default_; }
        if (this.isDefined(multipleOf)) { schemaModel.multipleOf = multipleOf; }
        if (this.isDefined(maximum)) { schemaModel.maximum = maximum; }
        if (this.isDefined(exclusiveMaximum)) { schemaModel.exclusiveMaximum = exclusiveMaximum; }
        if (this.isDefined(minimum)) { schemaModel.minimum = minimum; }
        if (this.isDefined(exclusiveMinimum)) { schemaModel.exclusiveMinimum = exclusiveMinimum; }
        if (this.isDefined(maxLength)) { schemaModel.maxLength = maxLength; }
        if (this.isDefined(minLength)) { schemaModel.minLength = minLength; }
        if (this.isDefined(pattern)) { schemaModel.pattern = pattern; }
        if (this.isDefined(maxItems)) { schemaModel.maxItems = maxItems; }
        if (this.isDefined(minItems)) { schemaModel.minItems = minItems; }
        if (this.isDefined(uniqueItems)) { schemaModel.uniqueItems = uniqueItems; }
        if (this.isDefined(maxProperties)) { schemaModel.maxProperties = maxProperties; }
        if (this.isDefined(minProperties)) { schemaModel.minProperties = minProperties; }
        if (this.isDefined(required)) { schemaModel.required = required; }
        if (this.isDefined(enum_)) { schemaModel.enum = enum_; }
        if (this.isDefined(type)) { schemaModel.type = type; }

        if (this.isDefined(items)) {
            if (Array.isArray(items)) {
                // TODO read an array of items schemas here
            } else {
                let itemsSchemaModel: OasSchema = schemaModel.createItemsSchema();
                this.readSchema(items, itemsSchemaModel);
                schemaModel.items = itemsSchemaModel;
            }
        }
        if (this.isDefined(allOf)) {
            let schemaModels: OasSchema[] = [];
            for (let allOfSchema of allOf) {
                let allOfSchemaModel: OasSchema = schemaModel.createAllOfSchema();
                this.readSchema(allOfSchema, allOfSchemaModel);
                schemaModels.push(allOfSchemaModel);
            }
            schemaModel.allOf = schemaModels;
        }
        if (this.isDefined(properties)) {
            for (let propertyName in properties) {
                let propertySchema: any = properties[propertyName];
                let propertySchemaModel: OasSchema = schemaModel.createPropertySchema(propertyName);
                this.readSchema(propertySchema, propertySchemaModel);
                schemaModel.addProperty(propertyName, propertySchemaModel);
            }
        }
        if (this.isDefined(additionalProperties)) {
            if (typeof additionalProperties === "boolean") {
                schemaModel.additionalProperties = <boolean>additionalProperties;
            } else {
                let additionalPropertiesModel: OasSchema = schemaModel.createAdditionalPropertiesSchema();
                this.readSchema(additionalProperties, additionalPropertiesModel);
                schemaModel.additionalProperties = additionalPropertiesModel;
            }
        }

        if (this.isDefined(discriminator)) { schemaModel.discriminator = discriminator; }
        if (this.isDefined(readOnly)) { schemaModel.readOnly = readOnly; }
        if (this.isDefined(xml)) {
            let xmlModel: Oas20XML = schemaModel.createXML();
            this.readXML(xml, xmlModel);
            schemaModel.xml = xmlModel;
        }
        if (this.isDefined(externalDocs)) {
            let externalDocsModel: Oas20ExternalDocumentation = schemaModel.createExternalDocumentation();
            this.readExternalDocumentation(externalDocs, externalDocsModel);
            schemaModel.externalDocs = externalDocsModel;
        }
        if (this.isDefined(example)) { schemaModel.example = example; }

        this.readExtensions(items, schemaModel);
    }

    /**
     * Reads an OAS XML object from the given JS data.
     * @param xml
     * @param xmlModel
     */
    public readXML(xml: any, xmlModel: OasXML): void {
        let name: string = xml["name"];
        let namespace: string = xml["namespace"];
        let prefix: string = xml["prefix"];
        let attribute: boolean = xml["attribute"];
        let wrapped: boolean = xml["wrapped"];

        if (this.isDefined(name)) { xmlModel.name = name; }
        if (this.isDefined(namespace)) { xmlModel.namespace = namespace; }
        if (this.isDefined(prefix)) { xmlModel.prefix = prefix; }
        if (this.isDefined(attribute)) { xmlModel.attribute = attribute; }
        if (this.isDefined(wrapped)) { xmlModel.wrapped = wrapped; }

        this.readExtensions(xml, xmlModel);
    }

    /**
     * Reads an OAS Security Requirement object from the given javascript data.
     * @param sec
     * @param secModel
     */
    public readSecurityRequirement(sec: any, secModel: OasSecurityRequirement): void {
        for (let name in sec) {
            secModel.addSecurityRequirementItem(name, sec[name]);
        }
    }

    /**
     * Reads a OAS Tag object from the given javascript data.
     * @param tag
     * @param tagModel
     */
    public readTag(tag: any, tagModel: OasTag): void {
        let name: string = tag["name"];
        let description: string = tag["description"];
        let externalDocs: any = tag["externalDocs"];

        if (this.isDefined(name)) { tagModel.name = name; }
        if (this.isDefined(description)) { tagModel.description = description; }
        if (this.isDefined(externalDocs)) {
            let externalDocsModel: OasExternalDocumentation = tagModel.createExternalDocumentation();
            this.readExternalDocumentation(externalDocs, externalDocsModel);
            tagModel.externalDocs = externalDocsModel;
        }

        this.readExtensions(tag, tagModel);
    }

    /**
     * Reads an OAS External Documentation object from the given javascript data.
     * @param externalDocs
     * @param externalDocsModel
     */
    public readExternalDocumentation(externalDocs: any, externalDocsModel: OasExternalDocumentation): void {
        let description: string = externalDocs["description"];
        let url: any = externalDocs["url"];

        if (this.isDefined(description)) { externalDocsModel.description = description; }
        if (this.isDefined(url)) { externalDocsModel.url = url; }

        this.readExtensions(externalDocs, externalDocsModel);
    }

    /**
     * Reads all of the extension nodes.  An extension node is characterized by a property
     * that begins with "x-".
     * @param jsData
     * @param model
     */
    public readExtensions(jsData:any, model: OasExtensibleNode): void {
        for (let key in jsData) {
            if (key.indexOf("x-") === 0) {
                let val: any = jsData[key];
                model.addExtension(key, val);
            }
        }
    }

}


/**
 * This class reads a javascript object and turns it into a OAS 2.0 model.  It is obviously
 * assumed that the javascript data actually does represent an OAS 2.0 document.
 */
export class Oas20JS2ModelReader extends OasJS2ModelReader {

    /**
     * Reads the given javascript data and returns an OAS 2.0 document.  Throws an error if
     * the root 'swagger' property is not found or if its value is not "2.0".
     * @param jsData
     */
    public read(jsData: any): Oas20Document {
        let docModel: Oas20Document = new Oas20Document();
        this.readDocument(jsData, docModel);
        return docModel;
    }

    /**
     * Reads an OAS 2.0 Document object from the given javascript data.
     * @param document
     * @param documentModel
     */
    public readDocument(document: any, documentModel: Oas20Document): void {
        let swagger: string = document["swagger"];
        if (swagger != "2.0") {
            throw Error("Unsupported specification version: " + swagger);
        }

        super.readDocument(document, documentModel);

        let host: string = document["host"];
        let basePath: string = document["basePath"];
        let schemes: string[] = document["schemes"];
        let consumes: string[] = document["consumes"];
        let produces: string[] = document["produces"];
        let definitions: any = document["definitions"];
        let parameters: any = document["parameters"];
        let responses: any = document["responses"];
        let securityDefinitions: any[] = document["securityDefinitions"];

        if (this.isDefined(host)) { documentModel.host = host; }
        if (this.isDefined(basePath)) { documentModel.basePath = basePath; }
        if (this.isDefined(schemes)) { documentModel.schemes = schemes; }
        if (this.isDefined(consumes)) { documentModel.consumes = consumes; }
        if (this.isDefined(produces)) { documentModel.produces = produces; }
        if (this.isDefined(definitions)) {
            let definitionsModel: Oas20Definitions = documentModel.createDefinitions();
            this.readDefinitions(definitions, definitionsModel);
            documentModel.definitions = definitionsModel;
        }

        if (this.isDefined(parameters)) {
            let parametersDefinitionsModel: Oas20ParametersDefinitions = documentModel.createParametersDefinitions();
            this.readParametersDefinitions(parameters, parametersDefinitionsModel);
            documentModel.parameters = parametersDefinitionsModel;
        }
        if (this.isDefined(responses)) {
            let responsesDefinitionsModel: Oas20ResponsesDefinitions = documentModel.createResponsesDefinitions();
            this.readResponsesDefinitions(responses, responsesDefinitionsModel);
            documentModel.responses = responsesDefinitionsModel;
        }
        if (this.isDefined(securityDefinitions)) {
            let securityDefinitionsModel: Oas20SecurityDefinitions = documentModel.createSecurityDefinitions();
            this.readSecurityDefinitions(securityDefinitions, securityDefinitionsModel);
            documentModel.securityDefinitions = securityDefinitionsModel;
        }
    }

    /**
     * Reads an OAS 2.0 Security Definitions object from the given javascript data.
     * @param securityDefinitions
     * @param securityDefinitionsModel
     */
    public readSecurityDefinitions(securityDefinitions: any[], securityDefinitionsModel: Oas20SecurityDefinitions): void {
        for (let name in securityDefinitions) {
            let scheme: any = securityDefinitions[name];
            let schemeModel: Oas20SecurityScheme = securityDefinitionsModel.createSecurityScheme(name);
            this.readSecurityScheme(scheme, schemeModel);
            securityDefinitionsModel.addSecurityScheme(name, schemeModel);
        }
    }

    /**
     * Reads an OAS 2.0 Security Schema object from the given javascript data.
     * @param scheme
     * @param schemeModel
     */
    public readSecurityScheme(scheme: any, schemeModel: Oas20SecurityScheme): void {
        let type: string = scheme["type"];
        let description: string = scheme["description"];
        let name: string = scheme["name"];
        let in_: string = scheme["in"];
        let flow: string = scheme["flow"];
        let authorizationUrl: string = scheme["authorizationUrl"];
        let tokenUrl: string = scheme["tokenUrl"];
        let scopes: any = scheme["scopes"];

        if (this.isDefined(type)) { schemeModel.type = type; }
        if (this.isDefined(description)) { schemeModel.description = description; }
        if (this.isDefined(name)) { schemeModel.name = name; }
        if (this.isDefined(in_)) { schemeModel.in = in_; }
        if (this.isDefined(flow)) { schemeModel.flow = flow; }
        if (this.isDefined(authorizationUrl)) { schemeModel.authorizationUrl = authorizationUrl; }
        if (this.isDefined(tokenUrl)) { schemeModel.tokenUrl = tokenUrl; }
        if (this.isDefined(scopes)) {
            let scopesModel: Oas20Scopes = schemeModel.createScopes();
            this.readScopes(scopes, scopesModel);
            schemeModel.scopes = scopesModel;
        }

        this.readExtensions(scheme, schemeModel);
    }

    /**
     * Reads an OAS 2.0 Scopes object from the given javascript data.
     * @param scopes
     * @param scopesModel
     */
    public readScopes(scopes: any, scopesModel: Oas20Scopes): void {
        for (let scope in scopes) {
            let description: string = scopes[scope];
            scopesModel.addScope(scope, description);
        }
        this.readExtensions(scopes, scopesModel);
    }

    /**
     * Reads an OAS 2.0 Operation object from the given JS data.
     * @param operation
     * @param operationModel
     */
    public readOperation(operation: any, operationModel: Oas20Operation): void {
        super.readOperation(operation, operationModel);

        let consumes: string[] = operation["consumes"];
        let produces: string[] = operation["produces"];
        let schemes: string[] = operation["schemes"];

        if (this.isDefined(consumes)) { operationModel.consumes = consumes; }
        if (this.isDefined(produces)) { operationModel.produces = produces; }
        if (this.isDefined(schemes)) { operationModel.schemes = schemes; }
    }

    /**
     * Reads an OAS 2.0 Parameter object from the given JS data.
     * @param parameter
     * @param paramModel
     */
    public readParameter(parameter: any, paramModel: Oas20Parameter): void {
        let $ref: string = parameter["$ref"];
        if (this.isDefined($ref)) { paramModel.$ref = $ref; }

        this.readParameterBase(parameter, paramModel);
    }

    /**
     * Reads an OAS 2.0 Parameter Definition from the given JS data.
     * @param parameterDef
     * @param paramDefModel
     */
    public readParameterDefinition(parameterDef: any, paramDefModel: Oas20ParameterDefinition): void {
        this.readParameterBase(parameterDef, paramDefModel);
    }

    /**
     * Reads an OAS 2.0 Parameter object from the given JS data.
     * @param parameter
     * @param paramModel
     */
    private readParameterBase(parameter: any, paramModel: Oas20ParameterBase): void {
        this.readItems(parameter, paramModel);

        let name: string = parameter["name"];
        let in_: string = parameter["in"];
        let description: string = parameter["description"];
        let required: boolean = parameter["required"];
        let schema: any = parameter["schema"];
        let allowEmptyValue: boolean = parameter["allowEmptyValue"];

        if (this.isDefined(name)) { paramModel.name = name; }
        if (this.isDefined(in_)) { paramModel.in = in_; }
        if (this.isDefined(description)) { paramModel.description = description; }
        if (this.isDefined(required)) { paramModel.required = required; }
        if (this.isDefined(schema)) {
            let schemaModel: Oas20Schema = paramModel.createSchema();
            this.readSchema(schema, schemaModel);
            paramModel.schema = schemaModel;
        }
        if (this.isDefined(allowEmptyValue)) { paramModel.allowEmptyValue = allowEmptyValue; }

        this.readExtensions(parameter, paramModel);
    }

    /**
     * Reads an OAS 2.0 Items object from the given JS data.
     * @param items
     * @param itemsModel
     */
    public readItems(items: any, itemsModel: Oas20Items): void {
        let type: string = items["type"];
        let format: string = items["format"];
        let itemsChild: any = items["items"];
        let collectionFormat: string = items["collectionFormat"];
        let default_: any = items["default"];
        let maximum: number = items["maximum"];
        let exclusiveMaximum: boolean = items["exclusiveMaximum"];
        let minimum: number = items["minimum"];
        let exclusiveMinimum: boolean = items["exclusiveMinimum"];
        let maxLength: number = items["maxLength"]; // Require: integer
        let minLength: number = items["minLength"]; // Require: integer
        let pattern: string = items["pattern"];
        let maxItems: number = items["maxItems"]; // Require: integer
        let minItems: number = items["minItems"]; // Require: integer
        let uniqueItems: boolean = items["uniqueItems"];
        let enum_: any[] = items["enum"];
        let multipleOf: number = items["multipleOf"];

        if (this.isDefined(type)) { itemsModel.type = type; }
        if (this.isDefined(format)) { itemsModel.format = format; }
        if (this.isDefined(itemsChild)) {
            let itemsChildModel: Oas20Items = itemsModel.createItems();
            this.readItems(itemsChild, itemsChildModel);
            itemsModel.items = itemsChildModel;
        }
        if (this.isDefined(collectionFormat)) { itemsModel.collectionFormat = collectionFormat; }
        if (this.isDefined(default_)) { itemsModel.default = default_; }
        if (this.isDefined(maximum)) { itemsModel.maximum = maximum; }
        if (this.isDefined(exclusiveMaximum)) { itemsModel.exclusiveMaximum = exclusiveMaximum; }
        if (this.isDefined(minimum)) { itemsModel.minimum = minimum; }
        if (this.isDefined(exclusiveMinimum)) { itemsModel.exclusiveMinimum = exclusiveMinimum; }
        if (this.isDefined(maxLength)) { itemsModel.maxLength = maxLength; }
        if (this.isDefined(minLength)) { itemsModel.minLength = minLength; }
        if (this.isDefined(pattern)) { itemsModel.pattern = pattern; }
        if (this.isDefined(maxItems)) { itemsModel.maxItems = maxItems; }
        if (this.isDefined(minItems)) { itemsModel.minItems = minItems; }
        if (this.isDefined(uniqueItems)) { itemsModel.uniqueItems = uniqueItems; }
        if (this.isDefined(enum_)) { itemsModel.enum = enum_; }
        if (this.isDefined(multipleOf)) { itemsModel.multipleOf = multipleOf; }

        this.readExtensions(items, itemsModel);
    }

    /**
     * Reads an OAS 2.0 Response object from the given JS data.
     * @param response
     * @param responseModel
     */
    public readResponse(response: any, responseModel: Oas20Response): void {
        let $ref: string = response["$ref"];
        if (this.isDefined($ref)) { responseModel.$ref = $ref; }

        this.readResponseBase(response, responseModel);
    }

    /**
     * Reads an OAS 2.0 Response Definition object from the given JS data.
     * @param response
     * @param responseDefModel
     */
    public readResponseDefinition(response: any, responseDefModel: Oas20ResponseDefinition): void {
        this.readResponseBase(response, responseDefModel);
    }

    /**
     * Reads an OAS 2.0 Response object from the given JS data.
     * @param response
     * @param responseModel
     */
    private readResponseBase(response: any, responseModel: Oas20ResponseBase): void {
        let description: string = response["description"];
        let schema: any = response["schema"];
        let headers: any = response["headers"];
        let examples: any = response["examples"];

        if (this.isDefined(description)) { responseModel.description = description; }
        if (this.isDefined(schema)) {
            let schemaModel: Oas20Schema = responseModel.createSchema();
            this.readSchema(schema, schemaModel);
            responseModel.schema = schemaModel;
        }
        if (this.isDefined(headers)) {
            let headersModel: Oas20Headers = responseModel.createHeaders();
            this.readHeaders(headers, headersModel);
            responseModel.headers = headersModel;
        }
        if (this.isDefined(examples)) {
            let exampleModel: Oas20Example = responseModel.createExample();
            this.readExample(examples, exampleModel);
            responseModel.examples = exampleModel;
        }
        this.readExtensions(response, responseModel);
    }

    /**
     * Reads an OAS 2.0 Example object from the given JS data.
     * @param examples
     * @param exampleModel
     */
    public readExample(examples: any, exampleModel: Oas20Example): void {
        for (let contentType in examples) {
            let example: any = examples[contentType];
            exampleModel.addExample(contentType, example);
        }
    }

    /**
     * Reads an OAS 2.0 Header object from the given JS data.
     * @param header
     * @param headerModel
     */
    public readHeader(header: any, headerModel: Oas20Header): void {
        let description: string = header["description"];

        if (this.isDefined(description)) { headerModel.description = description; }
        this.readItems(header, headerModel);
    }

    /**
     * Reads an OAS 2.0 Definitions object from the given JS data.
     * @param definitions
     * @param definitionsModel
     */
    public readDefinitions(definitions: any, definitionsModel: Oas20Definitions): void {
        for (let definitionName in definitions) {
            let definition: any = definitions[definitionName];
            let definitionSchemaModel: Oas20DefinitionSchema = definitionsModel.createDefinitionSchema(definitionName);
            this.readSchema(definition, definitionSchemaModel);
            definitionsModel.addDefinition(definitionName, definitionSchemaModel);
        }
    }

    /**
     * Reads an OAS 2.0 Parameters Definitions object from the given JS data.
     * @param parameters
     * @param parametersDefinitionsModel
     */
    public readParametersDefinitions(parameters: any, parametersDefinitionsModel: Oas20ParametersDefinitions): void {
        for (let parameterName in parameters) {
            let parameter: any = parameters[parameterName];
            let parameterDefModel: Oas20ParameterDefinition = parametersDefinitionsModel.createParameter(parameterName);
            this.readParameterDefinition(parameter, parameterDefModel);
            parametersDefinitionsModel.addParameter(parameterName, parameterDefModel);
        }
    }

    /**
     * Reads an OAS 2.0 Responses Definitions object from the given JS data.
     * @param responses
     * @param responsesDefinitionsModel
     */
    public readResponsesDefinitions(responses: any, responsesDefinitionsModel: Oas20ResponsesDefinitions): void {
        for (let responseName in responses) {
            let response: any = responses[responseName];
            let responseModel: Oas20ResponseDefinition = responsesDefinitionsModel.createResponse(responseName);
            this.readResponseBase(response, responseModel);
            responsesDefinitionsModel.addResponse(responseName, responseModel);
        }
    }
}


/**
 * A visitor used to invoke the appropriate readXYZ() method on the Oas20JS2ModelReader
 * class.  This is useful when reading a partial (non root) model from a JS object.  The
 * caller still needs to first construct the appropriate model prior to reading into it.
 */
// TODO implement a 3.0.0 version of this visitor
export class Oas20JS2ModelReaderVisitor implements IOas20NodeVisitor {

    /**
     * Constructor.
     * @param reader
     * @param jsData
     */
    constructor(private reader: Oas20JS2ModelReader, private jsData: any) {}


    public visitDocument(node: Oas20Document): void {
        // Not supported - call the reader directly if you want to read a full document.
    }

    public visitInfo(node: Oas20Info): void {
        this.reader.readInfo(this.jsData, node);
    }

    public visitContact(node: Oas20Contact): void {
        this.reader.readContact(this.jsData, node);
    }

    public visitLicense(node: Oas20License): void {
        this.reader.readLicense(this.jsData, node);
    }

    public visitPaths(node: Oas20Paths): void {
        this.reader.readPaths(this.jsData, node);
    }

    public visitPathItem(node: Oas20PathItem): void {
        this.reader.readPathItem(this.jsData, node);
    }

    public visitOperation(node: Oas20Operation): void {
        this.reader.readOperation(this.jsData, node);
    }

    public visitParameter(node: Oas20Parameter): void {
        this.reader.readParameter(this.jsData, node);
    }

    public visitParameterDefinition(node: Oas20ParameterDefinition): void {
        this.reader.readParameterDefinition(this.jsData, node);
    }

    public visitExternalDocumentation(node: Oas20ExternalDocumentation): void {
        this.reader.readExternalDocumentation(this.jsData, node);
    }

    public visitSecurityRequirement(node: Oas20SecurityRequirement): void {
        this.reader.readSecurityRequirement(this.jsData, node);
    }

    public visitResponses(node: Oas20Responses): void {
        this.reader.readResponses(this.jsData, node);
    }

    public visitResponse(node: Oas20Response): void {
        this.reader.readResponse(this.jsData, node);
    }

    public visitResponseDefinition(node: Oas20ResponseDefinition): void {
        this.reader.readResponseDefinition(this.jsData, node);
    }

    public visitSchema(node: Oas20Schema): void {
        this.reader.readSchema(this.jsData, node);
    }

    public visitHeaders(node: Oas20Headers): void {
        this.reader.readHeaders(this.jsData, node);
    }

    public visitHeader(node: Oas20Header): void {
        this.reader.readHeader(this.jsData, node);
    }

    public visitExample(node: Oas20Example): void {
        this.reader.readExample(this.jsData, node);
    }

    public visitItems(node: Oas20Items): void {
        this.reader.readItems(this.jsData, node);
    }

    public visitTag(node: Oas20Tag): void {
        this.reader.readTag(this.jsData, node);
    }

    public visitSecurityDefinitions(node: Oas20SecurityDefinitions): void {
        this.reader.readSecurityDefinitions(this.jsData, node);
    }

    public visitSecurityScheme(node: Oas20SecurityScheme): void {
        this.reader.readSecurityScheme(this.jsData, node);
    }

    public visitScopes(node: Oas20Scopes): void {
        this.reader.readScopes(this.jsData, node);
    }

    public visitXML(node: Oas20XML): void {
        this.reader.readXML(this.jsData, node);
    }

    public visitDefinitionSchema(node: Oas20DefinitionSchema): void {
        this.reader.readSchema(this.jsData, node);
    }

    public visitPropertySchema(node: Oas20PropertySchema): void {
        this.reader.readSchema(this.jsData, node);
    }

    public visitAdditionalPropertiesSchema(node: Oas20AdditionalPropertiesSchema): void {
        this.reader.readSchema(this.jsData, node);
    }

    public visitAllOfSchema(node: Oas20AllOfSchema): void {
        this.reader.readSchema(this.jsData, node);
    }

    public visitItemsSchema(node: Oas20ItemsSchema): void {
        this.reader.readSchema(this.jsData, node);
    }

    public visitDefinitions(node: Oas20Definitions): void {
        this.reader.readDefinitions(this.jsData, node);
    }

    public visitParametersDefinitions(node: Oas20ParametersDefinitions): void {
        this.reader.readParametersDefinitions(this.jsData, node);
    }

    public visitResponsesDefinitions(node: Oas20ResponsesDefinitions): void {
        this.reader.readResponsesDefinitions(this.jsData, node);
    }

    public visitExtension(node: OasExtension): void {
        // Not supported:  cannot read a single extension
    }

}


/**
 * This class reads a javascript object and turns it into a OAS 3.0 model.  It is obviously
 * assumed that the javascript data actually does represent an OAS 3.0 document.
 */
export class Oas30JS2ModelReader extends OasJS2ModelReader {

    /**
     * Reads the given javascript data and returns an OAS 3.0 document.  Throws an error if
     * the root 'openapi' property is not found or if its value is not "3.0.0".
     * @param jsData
     */
    public read(jsData: any): Oas30Document {
        let docModel: Oas30Document = new Oas30Document();
        this.readDocument(jsData, docModel);
        return docModel;
    }

    /**
     * Reads an OAS 3.0 Document object from the given JS data.
     * @param document
     * @param documentModel
     */
    public readDocument(document: any, documentModel: Oas30Document): void {
        let openapi: string = document["openapi"];
        if (openapi != "3.0.0") {
            throw Error("Unsupported specification version: " + openapi);
        }

        super.readDocument(document, documentModel);

        let servers: any = document["servers"];

        documentModel.openapi = openapi;
        if (Array.isArray(servers)) {
            documentModel.servers = [];
            servers.forEach( server => {
                let serverModel: Oas30Server = documentModel.createServer();
                this.readServer(server, serverModel);
                documentModel.servers.push(serverModel);
            })
        }
    }

    /**
     * Reads an OAS 3.0 PathItem object from the given JS data.
     * @param pathItem
     * @param pathItemModel
     */
    public readPathItem(pathItem: any, pathItemModel: Oas30PathItem): void {
        super.readPathItem(pathItem, pathItemModel);

        let summary: any = pathItem["summary"];
        let description: any = pathItem["description"];
        let trace: any = pathItem["trace"];
        let servers: any = pathItem["servers"];

        if (this.isDefined(summary)) {
            pathItemModel.summary = summary;
        }
        if (this.isDefined(description)) {
            pathItemModel.description = description;
        }
        if (this.isDefined(trace)) {
            let opModel: Oas30Operation = pathItemModel.createOperation("trace");
            this.readOperation(trace, opModel);
            pathItemModel.trace = opModel;
        }
        if (Array.isArray(servers)) {
            pathItemModel.servers = [];
            for (let server of servers) {
                let serverModel: Oas30Server = pathItemModel.createServer();
                this.readServer(server, serverModel);
                pathItemModel.servers.push(serverModel);
            }
        }
    }

    /**
     * Reads an OAS 3.0 Header object from the given js data.
     * @param header
     * @param headerModel
     */
    protected readHeader(header: any, headerModel: Oas30Header): void {
        let description: string = header["description"];
        let required: boolean = header["required"];
        let schema: any = header["schema"];
        let allowEmptyValue: boolean = header["allowEmptyValue"];
        let deprecated: boolean = header["deprecated"];
        let style: string = header["style"];
        let explode: boolean = header["explode"];
        let allowReserved: boolean = header["allowReserved"];
        let example: any = header["example"];
        let examples: any = header["examples"];

        if (this.isDefined(description)) { headerModel.description = description; }
        if (this.isDefined(required)) { headerModel.required = required; }
        if (this.isDefined(schema)) {
            let schemaModel: Oas30Schema = headerModel.createSchema();
            this.readSchema(schema, schemaModel);
            headerModel.schema = schemaModel;
        }
        if (this.isDefined(allowEmptyValue)) { headerModel.allowEmptyValue = allowEmptyValue; }
        if (this.isDefined(deprecated)) { headerModel.deprecated = deprecated; }
        if (this.isDefined(style)) { headerModel.style = style; }
        if (this.isDefined(explode)) { headerModel.explode = explode; }
        if (this.isDefined(allowReserved)) { headerModel.allowReserved = allowReserved; }
        if (this.isDefined(example)) { headerModel.example = example; }
        if (this.isDefined(examples)) {
            for (let exampleName in examples) {
                let exx: any = examples[exampleName];
                let exampleModel: Oas30Example = headerModel.createExample(exampleName);
                this.readExample(exx, exampleModel);
                headerModel.addExample(exampleModel);
            }
        }

        this.readExtensions(header, headerModel);
    }

    /**
     * Reads an OAS 3.0 Parameter object from the given JS data.
     * @param parameter
     * @param paramModel
     */
    private readParameterBase(parameter: any, paramModel: Oas30ParameterBase): void {
        let name: string = parameter["name"];
        let in_: string = parameter["in"];
        let description: string = parameter["description"];
        let required: boolean = parameter["required"];
        let schema: any = parameter["schema"];
        let allowEmptyValue: boolean = parameter["allowEmptyValue"];
        let deprecated: boolean = parameter["deprecated"];
        let style: string = parameter["style"];
        let explode: boolean = parameter["explode"];
        let allowReserved: boolean = parameter["allowReserved"];
        let example: any = parameter["example"];
        let examples: any = parameter["examples"];
        let content: any = parameter["content"];

        if (this.isDefined(name)) { paramModel.name = name; }
        if (this.isDefined(in_)) { paramModel.in = in_; }
        if (this.isDefined(description)) { paramModel.description = description; }
        if (this.isDefined(required)) { paramModel.required = required; }
        if (this.isDefined(schema)) {
            let schemaModel: Oas30Schema = paramModel.createSchema();
            this.readSchema(schema, schemaModel);
            paramModel.schema = schemaModel;
        }
        if (this.isDefined(allowEmptyValue)) { paramModel.allowEmptyValue = allowEmptyValue; }
        if (this.isDefined(deprecated)) { paramModel.deprecated = deprecated; }
        if (this.isDefined(style)) { paramModel.style = style; }
        if (this.isDefined(explode)) { paramModel.explode = explode; }
        if (this.isDefined(allowReserved)) { paramModel.allowReserved = allowReserved; }
        if (this.isDefined(example)) { paramModel.example = example; }
        if (this.isDefined(examples)) {
            for (let exampleName in examples) {
                let exx: any = examples[exampleName];
                let exampleModel: Oas30Example = paramModel.createExample(exampleName);
                this.readExample(exx, exampleModel);
                paramModel.addExample(exampleModel);
            }
        }
        if (this.isDefined(content)) {
            let contentModel: Oas30Content = paramModel.createContent();
            this.readContent(content, contentModel);
            paramModel.content = contentModel;
        }

        this.readExtensions(parameter, paramModel);
    }

    /**
     * Reads an OAS 3.0 Parameter object from the given js data.
     * @param parameter
     * @param paramModel
     */
    public readParameter(parameter: any, paramModel: Oas30Parameter): void {
        let $ref: string = parameter["$ref"];
        if (this.isDefined($ref)) { paramModel.$ref = $ref; }

        this.readParameterBase(parameter, paramModel);
    }

    /**
     * Reads an OAS 3.0 Operation object from the given JS data.
     * @param operation
     * @param operationModel
     */
    public readOperation(operation: any, operationModel: Oas30Operation): void {
        super.readOperation(operation, operationModel);

        let requestBody: any = operation["requestBody"];
        let callbacks: any = operation["callbacks"];
        let servers: Oas30Server[] = operation["servers"];

        if (this.isDefined(requestBody)) {
            let requestBodyModel: Oas30RequestBody = operationModel.createRequestBody();
            this.readRequestBody(requestBody, requestBodyModel);
            operationModel.requestBody = requestBodyModel;
        }
        if (this.isDefined(callbacks)) {
            let callbacksModel: Oas30Callbacks = operationModel.createCallbacks();
            this.readCallbacks(callbacks, callbacksModel);
            operationModel.callbacks = callbacksModel;
        }
        if (Array.isArray(servers)) {
            operationModel.servers = [];
            servers.forEach( server => {
                let serverModel: Oas30Server = operationModel.createServer();
                this.readServer(server, serverModel);
                operationModel.servers.push(serverModel);
            })
        }
    }

    /**
     * Reads an OAS 3.0 Callbacks object from the given JS data.
     * @param callbacks
     * @param callbacksModel
     */
    public readCallbacks(callbacks: any, callbacksModel: Oas30Callbacks): void {
        for (let name in callbacks) {
            if (name.indexOf("x-") === 0) { continue; }
            let callback: any = callbacks[name];
            let callbackModel: Oas30Callback = callbacksModel.createCallback(name);
            this.readCallback(callback, callbackModel);
            callbacksModel.addCallback(name, callbackModel);
        }
        this.readExtensions(callbacks, callbacksModel);
    }

    /**
     * Reads an OAS 3.0 Callback object from the given JS data.
     * @param callback
     * @param callbackModel
     */
    public readCallback(callback: any, callbackModel: Oas30Callback): void {
        for (let name in callback) {
            if (name.indexOf("x-") === 0) { continue; }
            if (name === "$ref") {
                callbackModel.$ref = callback[name];
                continue;
            }
            let pathItem: any = callback[name];
            let pathItemModel: Oas30PathItem = callbackModel.createPathItem(name);
            this.readPathItem(pathItem, pathItemModel);
            callbackModel.addPathItem(name, pathItemModel);
        }
        this.readExtensions(callback, callbackModel);
    }

    /**
     * Reads an OAS 3.0 Request Body object from the given JS data.
     * @param requestBody
     * @param requestBodyModel
     */
    public readRequestBody(requestBody: any, requestBodyModel: Oas30RequestBody): void {
        let $ref: string = requestBody["$ref"];
        let description: string = requestBody["description"];
        let content: any = requestBody["content"];
        let required: boolean = requestBody["required"];

        if (this.isDefined($ref)) { requestBodyModel.$ref = $ref; }
        if (this.isDefined(description)) { requestBodyModel.description = description; }
        if (this.isDefined(content)) {
            let contentModel: Oas30Content = requestBodyModel.createContent();
            this.readContent(content, contentModel);
            requestBodyModel.content = contentModel;
        }
        if (this.isDefined(required)) { requestBodyModel.required = required; }

        this.readExtensions(requestBody, requestBodyModel);
    }

    /**
     * Reads an OAS 3.0 Content from the given js data.
     * @param content
     * @param contentModel
     */
    public readContent(content: any, contentModel: Oas30Content): void {
        for (let name in content) {
            let mediaType: any = content[name];
            let mediaTypeModel: Oas30MediaType = contentModel.createMediaType(name);
            this.readMediaType(mediaType, mediaTypeModel);
            contentModel.addMediaType(name, mediaTypeModel);
        }
    }

    /**
     * Reads an OAS 3.0 Media Type from the given js data.
     * @param mediaType
     * @param mediaTypeModel
     */
    public readMediaType(mediaType: any, mediaTypeModel: Oas30MediaType): void {
        let schema: any = mediaType["schema"];
        let example: any = mediaType["example"];
        let examples: any = mediaType["examples"];
        let encoding: any = mediaType["encoding"];

        if (this.isDefined(schema)) {
            let schemaModel: Oas30Schema = mediaTypeModel.createSchema();
            this.readSchema(schema, schemaModel);
            mediaTypeModel.schema = schemaModel;
        }
        if (this.isDefined(example)) { mediaTypeModel.example = example; }
        if (this.isDefined(examples)) {
            for (let exampleName in examples) {
                let exx: any = examples[exampleName];
                let exampleModel: Oas30Example = mediaTypeModel.createExample(exampleName);
                this.readExample(exx, exampleModel);
                mediaTypeModel.addExample(exampleModel);
            }
        }
        if (this.isDefined(encoding)) {
            let encodingModel: Oas30Encoding = mediaTypeModel.createEncoding();
            this.readEncoding(encoding, encodingModel);
            mediaTypeModel.encoding = encodingModel;
        }

        this.readExtensions(mediaType, mediaTypeModel);
    }

    /**
     * Reads an OAS 3.0 Example from the given js data.
     * @param example
     * @param exampleModel
     */
    private readExample(example: any, exampleModel: Oas30Example) {
        let $ref: string = example["$ref"];
        let summary: string = example["summary"];
        let description: string = example["description"];
        let value: any = example["value"];
        let externalValue: string = example["externalValue"];

        if (this.isDefined($ref)) { exampleModel.$ref = $ref; }
        if (this.isDefined(summary)) { exampleModel.summary = summary; }
        if (this.isDefined(description)) { exampleModel.description = description; }
        if (this.isDefined(value)) { exampleModel.value = value; }
        if (this.isDefined(externalValue)) { exampleModel.externalValue = externalValue; }

        this.readExtensions(example, exampleModel);
    }

    /**
     * Reads an OAS 3.0 Encoding from the given js data.
     * @param encoding
     * @param encodingModel
     */
    public readEncoding(encoding: any, encodingModel: Oas30Encoding): void {
        for (let name in encoding) {
            let encodingProperty: any = encoding[name];
            let encodingPropertyModel: Oas30EncodingProperty = encodingModel.createEncodingProperty(name);
            this.readEncodingProperty(encodingProperty, encodingPropertyModel);
            encodingModel.addEncodingProperty(name, encodingPropertyModel);
        }
    }

    /**
     * Reads an OAS 3.0 Encoding Property from the given js data.
     * @param encodingProperty
     * @param encodingPropertyModel
     */
    public readEncodingProperty(encodingProperty: any, encodingPropertyModel: Oas30EncodingProperty): void {
        let contentType: string = encodingProperty["contentType"];
        let headers: any = encodingProperty["headers"];
        let style: string = encodingProperty["style"];
        let explode: boolean = encodingProperty["explode"];
        let allowReserved: boolean = encodingProperty["allowReserved"];

        if (this.isDefined(contentType)) { encodingPropertyModel.contentType = contentType; }
        if (this.isDefined(headers)) { encodingPropertyModel.headers = headers; }
        if (this.isDefined(style)) { encodingPropertyModel.style = style; }
        if (this.isDefined(explode)) { encodingPropertyModel.explode = explode; }
        if (this.isDefined(allowReserved)) { encodingPropertyModel.allowReserved = allowReserved; }

        this.readExtensions(encodingProperty, encodingPropertyModel);
    }

    /**
     * Reads an OAS 3.0 Response object from the given js data.
     * @param response
     * @param responseModel
     */
    public readResponse(response: any, responseModel: Oas30Response): void {
        let $ref: string = response["$ref"];
        if (this.isDefined($ref)) { responseModel.$ref = $ref; }

        this.readResponseBase(response, responseModel);
    }
    /**
     * Reads an OAS 3.0 Response object from the given JS data.
     * @param response
     * @param responseModel
     */
    private readResponseBase(response: any, responseModel: Oas30ResponseBase): void {
        let description: string = response["description"];
        let headers: any = response["headers"];
        let content: any = response["content"];
        let links: any = response["links"];

        if (this.isDefined(description)) { responseModel.description = description; }
        if (this.isDefined(headers)) {
            let headersModel: Oas30Headers = responseModel.createHeaders();
            this.readHeaders(headers, headersModel);
            responseModel.headers = headersModel;
        }
        if (this.isDefined(content)) {
            let contentModel: Oas30Content = responseModel.createContent();
            this.readContent(content, contentModel);
            responseModel.content = contentModel;
        }
        if (this.isDefined(links)) {
            let linksModel: Oas30Links = responseModel.createLinks();
            this.readLinks(links, linksModel);
            responseModel.links = linksModel;
        }
        this.readExtensions(response, responseModel);
    }

    /**
     * Reads an OAS 3.0 Links object from the given js data.
     * @param links
     * @param linksModel
     */
    public readLinks(links: any, linksModel: Oas30Links): void {
        for (let name in links) {
            let link: any = links[name];
            let linkModel: Oas30Link = linksModel.createLink(name);
            this.readLink(link, linkModel);
            linksModel.addLink(name, linkModel);
        }
    }

    /**
     * Reads an OAS 3.0 Link object from the given js data.
     * @param link
     * @param linkModel
     */
    public readLink(link: any, linkModel: Oas30Link): void {
        let $ref: string = link["$ref"];
        let operationRef: string = link["operationRef"];
        let operationId: string = link["operationId"];
        let parameters: any = link["parameters"];
        let headers: any = link["headers"];
        let description: string = link["description"];
        let server: any = link["server"];

        if (this.isDefined($ref)) { linkModel.$ref = $ref; }
        if (this.isDefined(operationRef)) { linkModel.operationRef = operationRef; }
        if (this.isDefined(operationId)) { linkModel.operationId = operationId; }
        if (this.isDefined(parameters)) {
            let linkParametersModel: Oas30LinkParameters = linkModel.createLinkParameters();
            this.readLinkParameters(parameters, linkParametersModel);
            linkModel.parameters = linkParametersModel;
        }
        if (this.isDefined(headers)) {
            let headersModel: Oas30Headers = linkModel.createHeaders();
            this.readHeaders(headers, headersModel);
            linkModel.headers = headersModel;
        }
        if (this.isDefined(description)) { linkModel.description = description; }
        if (this.isDefined(server)) {
            let serverModel: Oas30Server = linkModel.createServer();
            this.readServer(server, serverModel);
            linkModel.server = serverModel;
        }

        this.readExtensions(link, linkModel);
    }

    /**
     * Reads the link parameters.
     * @param linkParameters
     * @param linkParametersModel
     */
    public readLinkParameters(linkParameters: any, linkParametersModel: Oas30LinkParameters): void {
        for (let name in linkParameters) {
            let value: any = linkParameters[name];
            let expression: Oas30LinkParameterExpression = linkParametersModel.createExpression(name, value);
            linkParametersModel.addExpression(name, expression);
        }
    }

    /**
     * Reads an OAS 3.0 Schema object from the given js data.
     * @param schema
     * @param schemaModel
     */
    public readSchema(schema: any, schemaModel: Oas30Schema): void {
        super.readSchema(schema, schemaModel);

        let oneOf: any[] = schema["oneOf"];
        let anyOf: any[] = schema["anyOf"];
        let not: any = schema["not"];

        let nullable: boolean = schema["nullable"];
        let writeOnly: boolean = schema["writeOnly"];
        let deprecated: boolean = schema["deprecated"];

        if (this.isDefined(oneOf)) {
            let schemaModels: OasSchema[] = [];
            for (let oneOfSchema of oneOf) {
                let oneOfSchemaModel: OasSchema = schemaModel.createOneOfSchema();
                this.readSchema(oneOfSchema, oneOfSchemaModel as Oas30Schema);
                schemaModels.push(oneOfSchemaModel);
            }
            schemaModel.oneOf = schemaModels;
        }
        if (this.isDefined(anyOf)) {
            let schemaModels: OasSchema[] = [];
            for (let anyOfSchema of anyOf) {
                let anyOfSchemaModel: OasSchema = schemaModel.createAnyOfSchema();
                this.readSchema(anyOfSchema, anyOfSchemaModel as Oas30Schema);
                schemaModels.push(anyOfSchemaModel);
            }
            schemaModel.anyOf = schemaModels;
        }

    }

    /**
     * Reads a OAS 3.0 Server object from the given javascript data.
     * @param server
     * @param serverModel
     */
    public readServer(server: any, serverModel: Oas30Server): void {
        let url: string = server["url"];
        let description: string = server["description"];
        let variables: any = server["variables"];

        if (this.isDefined(url)) { serverModel.url = url; }
        if (this.isDefined(description)) { serverModel.description = description; }
        if (this.isDefined(variables)) {
            let serverVariablesModel: Oas30ServerVariables = serverModel.createServerVariables();
            this.readServerVariables(variables, serverVariablesModel);
            serverModel.variables = serverVariablesModel;
        }

        this.readExtensions(server, serverModel);
    }

    /**
     * Reads an OAS 3.0 Server Variables object from the given JS data.
     * @param variables
     * @param serverVariablesModel
     */
    public readServerVariables(serverVariables: any, serverVariablesModel: Oas30ServerVariables): void {
        for (let serverVariableName in serverVariables) {
            if (serverVariableName.indexOf("x-") === 0) { continue; }
            let serverVariable: any = serverVariables[serverVariableName];
            let serverVariableModel: Oas30ServerVariable = serverVariablesModel.createServerVariable(serverVariableName);
            this.readServerVariable(serverVariable, serverVariableModel);
            serverVariablesModel.addServerVariable(serverVariableName, serverVariableModel);
        }
        this.readExtensions(serverVariables, serverVariablesModel);
    }

    /**
     * Reads an OAD 3.0 Server Variable object from the given JS data.
     * @param serverVariable
     * @param serverVariableModel
     */
    public readServerVariable(serverVariable: any, serverVariableModel: Oas30ServerVariable): void {
        let _enum: string[] = serverVariable["enum"];
        let _default: string = serverVariable["default"];
        let description: any = serverVariable["description"];

        if (Array.isArray(_enum)) { serverVariableModel.enum = _enum; }
        if (this.isDefined(_default)) { serverVariableModel.default = _default; }
        if (this.isDefined(description)) { serverVariableModel.description = description; }

        this.readExtensions(serverVariable, serverVariableModel);
    }

}