/**
 * @license
 * Copyright 2018 Red Hat
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
import {IOas20NodeVisitor} from "../visitors/visitor.iface";
import {Oas20Document} from "../models/2.0/document.model";
import {Oas20Info} from "../models/2.0/info.model";
import {Oas20Contact} from "../models/2.0/contact.model";
import {Oas20License} from "../models/2.0/license.model";
import {Oas20Paths} from "../models/2.0/paths.model";
import {Oas20PathItem} from "../models/2.0/path-item.model";
import {Oas20Operation} from "../models/2.0/operation.model";
import {Oas20Parameter, Oas20ParameterBase, Oas20ParameterDefinition} from "../models/2.0/parameter.model";
import {Oas20ExternalDocumentation} from "../models/2.0/external-documentation.model";
import {Oas20SecurityRequirement} from "../models/2.0/security-requirement.model";
import {Oas20Responses} from "../models/2.0/responses.model";
import {Oas20Response, Oas20ResponseBase, Oas20ResponseDefinition} from "../models/2.0/response.model";
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
import {OasExtension} from "../models/extension.model";
import {OasNode, OasValidationProblem} from "../models/node.model";
import {Oas30Document} from "../models/3.0/document.model";
import {OasLibraryUtils} from "../library.utils";
import {Oas30Contact} from "../models/3.0/contact.model";
import {OasNodePath} from "../models/node-path";
import {Oas30License} from "../models/3.0/license.model";
import {Oas30Info} from "../models/3.0/info.model";
import {OasExtensibleNode} from "../models/enode.model";
import {Oas30Paths} from "../models/3.0/paths.model";
import {Oas30PathItem} from "../models/3.0/path-item.model";
import {Oas30Operation} from "../models/3.0/operation.model";
import {IOasParameterParent} from "../models/common/parameter.model";
import {Oas30Parameter, Oas30ParameterDefinition} from "../models/3.0/parameter.model";
import {
    Oas30AdditionalPropertiesSchema,
    Oas30AllOfSchema,
    Oas30ItemsSchema,
    Oas30PropertySchema,
    Oas30Schema,
    Oas30SchemaDefinition
} from "../models/3.0/schema.model";
import {Oas30Components} from "../models/3.0/components.model";
import {Oas30ExternalDocumentation} from "../models/3.0/external-documentation.model";
import {Oas30SecurityRequirement} from "../models/3.0/security-requirement.model";
import {Oas30Responses} from "../models/3.0/responses.model";
import {Oas30Response, Oas30ResponseBase, Oas30ResponseDefinition} from "../models/3.0/response.model";
import {Oas30Header} from "../models/3.0/header.model";
import {Oas30Tag} from "../models/3.0/tag.model";
import {Oas30SecurityScheme} from "../models/3.0/security-scheme.model";
import {Oas30XML} from "../models/3.0/xml.model";
import {OasTraverserDirection, OasVisitorUtil} from "../visitors/visitor.utils";
import {Oas20NodeVisitorAdapter} from "../visitors/visitor.base";
import {Oas30MediaType} from "../models/3.0/media-type.model";
import {Oas30RequestBody, Oas30RequestBodyDefinition} from "../models/3.0/request-body.model";
import {Oas30Server} from "../models/3.0/server.model";
import {Oas30ServerVariable} from "../models/3.0/server-variable.model";
import {ReferenceUtil} from "../util";

/**
 * A visitor used to transform an OpenAPI 2.0 document into an OpenAPI 3.0.x document.
 */
export class Oas20to30TransformationVisitor implements IOas20NodeVisitor {

    private doc30: Oas30Document;

    private _library: OasLibraryUtils = new OasLibraryUtils();
    private _nodeMap: any = {};

    public getResult(): Oas30Document {
        return this.doc30;
    }

    public visitDocument(node: Oas20Document): void {
        this.doc30 = this._library.createDocument("3.0.2") as Oas30Document;

        if (node.host) {
            let basePath: string = node.basePath;
            if (!basePath) {
                basePath = "";
            }
            let schemes: string[] = node.schemes;
            if (!schemes || schemes.length === 0) {
                schemes = [ "http" ];
            }

            let server30: Oas30Server = this.doc30.createServer();
            this.doc30.servers = [ server30 ];
            if (schemes.length === 1) {
                server30.url = `${ schemes[0] }://${ node.host }${ basePath }`;
            } else {
                server30.url = `{scheme}://${ node.host }${ basePath }`;
                let var30: Oas30ServerVariable = server30.createServerVariable("scheme");
                server30.addServerVariable("scheme", var30);
                var30.default = schemes[0];
                var30.enum = schemes.slice(0);
                var30.description = "The supported protocol schemes.";
            }
        }

        this.mapNode(node, this.doc30);
    }

    public visitInfo(node: Oas20Info): void {
        this.doc30.info = this.doc30.createInfo();
        this.doc30.info.title = node.title;

        this.doc30.info.description = node.description;
        this.doc30.info.termsOfService = node.termsOfService;
        this.doc30.info.version = node.version;

        this.mapNode(node, this.doc30.info);
    }

    public visitContact(node: Oas20Contact): void {
        let info30: Oas30Info = this.lookup(node.parent()) as Oas30Info;
        let contact30: Oas30Contact = info30.createContact();
        info30.contact = contact30;
        contact30.name = node.name;
        contact30.url = node.url;
        contact30.email = node.email;

        this.mapNode(node, contact30);
    }

    public visitLicense(node: Oas20License): void {
        let info30: Oas30Info = this.lookup(node.parent()) as Oas30Info;
        let license30: Oas30License = info30.createLicense();
        license30.name = node.name;
        license30.url = node.url;

        this.mapNode(node, license30);
    }

    public visitPaths(node: Oas20Paths): void {
        this.doc30.paths = this.doc30.createPaths();

        this.mapNode(node, this.doc30.paths);
    }

    public visitPathItem(node: Oas20PathItem): void {
        let paths30: Oas30Paths = this.lookup(node.parent()) as Oas30Paths;
        let pathItem30: Oas30PathItem = paths30.createPathItem(node.path());
        paths30.addPathItem(node.path(), pathItem30);

        pathItem30.$ref = this.updateRef(node.$ref);

        this.mapNode(node, pathItem30);
    }

    public visitOperation(node: Oas20Operation): void {
        let pathItem30: Oas30PathItem = this.lookup(node.parent()) as Oas30PathItem;
        let operation30: Oas30Operation = pathItem30.createOperation(node.method());
        pathItem30[node.method()] = operation30;

        operation30.tags = node.tags;
        operation30.summary = node.summary;
        operation30.description = node.description;
        operation30.operationId = node.operationId;
        operation30.deprecated = node.deprecated;

        if (node.schemes && node.schemes.length > 0 && this.doc30.servers && this.doc30.servers.length > 0) {
            let server30: Oas30Server = operation30.createServer();
            operation30.servers = [ server30 ];

            server30.url = this.doc30.servers[0].url;
            if (node.schemes.length === 1) {
                server30.url = server30.url.replace("{scheme}", node.schemes[0]);
                server30.removeServerVariable("scheme");
            } else {
                server30.url = "{scheme}" + server30.url.substring(server30.url.indexOf("://"));
                let var30: Oas30ServerVariable = server30.createServerVariable("scheme");
                server30.addServerVariable("scheme", var30);
                var30.description = "The supported protocol schemes.";
                var30.default = node.schemes[0];
                var30.enum = node.schemes.slice(0);
            }
        }

        // Note: consumes/produces will be handled elsewhere (when Request Body and Response models are created)

        this.mapNode(node, operation30);
    }

    public visitParameter(node: Oas20Parameter): void {
        if (node.in === "body") {
            let operation30: Oas30Operation = this.lookup(this.findParentOperation(node)) as Oas30Operation;
            if (operation30) {
                let body30: Oas30RequestBody = operation30.createRequestBody();
                operation30.requestBody = body30;

                body30.description = node.description;
                body30.required = node.required;

                if (node.schema) {
                    let consumes: string[] = this.findConsumes(node);
                    let schema: Oas20Schema = node.schema as Oas20Schema;
                    consumes.forEach( ct => {
                        let mediaType30: Oas30MediaType = body30.createMediaType(ct);
                        body30.addMediaType(ct, mediaType30);

                        let schema30: Oas30Schema = mediaType30.createSchema();
                        mediaType30.schema = this.toSchema(schema, schema30, true);

                        this.mapNode(schema, schema30);
                    });
                }
            }
        } else if (node.in === "formData") {
            let operation30: Oas30Operation = this.lookup(this.findParentOperation(node)) as Oas30Operation;
            if (operation30) {
                let consumes: string[] = this.findConsumes(node);
                if (!this.hasFormDataMimeType(consumes)) {
                    consumes = ["application/x-www-form-urlencoded"];
                }
                consumes.forEach(ct => {
                    if (this.isFormDataMimeType(ct)) {
                        let body30: Oas30RequestBody = operation30.requestBody;
                        if (!body30) {
                            body30 = operation30.createRequestBody();
                            operation30.requestBody = body30;
                            body30.required = true;
                        }
                        let mediaType30: Oas30MediaType = body30.getMediaType(ct);
                        if (!mediaType30) {
                            mediaType30 = body30.createMediaType(ct);
                            body30.addMediaType(ct, mediaType30);
                        }
                        let schema30: Oas30Schema = mediaType30.schema;
                        if (!schema30) {
                            schema30 = mediaType30.createSchema();
                            mediaType30.schema = schema30;
                            schema30.type = "object";
                        }

                        let property30: Oas30PropertySchema = schema30.createPropertySchema(node.name);
                        schema30.addProperty(node.name, property30);
                        property30.description = node.description;
                        this.toSchema(node, property30, false);

                        this.mapNode(node, schema30);
                    }
                });
            }
        } else {
            if (this.isRef(node)) {
                let paramDef: Oas20ParameterDefinition = ReferenceUtil.resolveRef(node.$ref, node) as Oas20ParameterDefinition;

                // Handle the case where there is a parameter $ref to a "body" param.  All body params become
                // Request Bodies.  So a reference to a "body" param should become a reference to a request body.
                if (paramDef && paramDef.in === "body") {
                    let parent30: Oas30Operation = this.lookup(this.findParentOperation(node)) as Oas30Operation;
                    if (parent30) {
                        let body30: Oas30RequestBody = parent30.createRequestBody();
                        parent30.requestBody = body30;

                        body30.$ref = "#/components/requestBodies/" + paramDef.parameterName();

                        this.mapNode(node, body30);
                        return;
                    }
                }

                // Handle the case where the parameter is a $ref to a formData param.  In this case we want to
                // treat the param as though it is inlined (which will result in a requestBody model).
                if (paramDef && paramDef.in === "formData") {
                    // Inline the parameter definition and then re-visit it.
                    this._library.readNode(this._library.writeNode(paramDef), node);
                    node.$ref = null;
                    this.visitParameter(node);
                    return;
                }
            }

            // Now we have normal handling of a parameter, examples include path params, query params, header params, etc.
            let parent30: IOasParameterParent = this.lookup(node.parent()) as any;
            let param30: Oas30Parameter = parent30.createParameter() as Oas30Parameter;
            parent30.addParameter(param30);
            this.transformParam(node, param30);
            this.mapNode(node, param30);
        }
    }

    private transformParam(node: Oas20ParameterBase, param30: Oas30Parameter): Oas30Parameter {
        param30.$ref = this.updateRef(node["$ref"]);
        if (param30.$ref) {
            return param30;
        }
        param30.name = node.name;
        param30.in = node.in;
        param30.description = node.description;
        param30.required = node.required;
        param30.allowEmptyValue = node.allowEmptyValue;
        param30.schema = this.toSchema(node, param30.createSchema(), false);
        this.collectionFormatToStyleAndExplode(node, param30);
        return param30;
    }

    public visitParameterDefinition(node: Oas20ParameterDefinition): void {
        if (node.in === "body") {
            let parent30: Oas30Components = this.getOrCreateComponents();
            let bodyDef30: Oas30RequestBodyDefinition = parent30.createRequestBodyDefinition(node.parameterName());
            parent30.addRequestBodyDefinition(node.parameterName(), bodyDef30);

            bodyDef30.description = node.description;
            bodyDef30.required = node.required;
            if (node.schema) {
                let consumes: string[] = this.findConsumes(node);
                let schema: Oas20Schema = node.schema as Oas20Schema;
                consumes.forEach( ct => {
                    let mediaType30: Oas30MediaType = bodyDef30.createMediaType(ct);
                    bodyDef30.addMediaType(ct, mediaType30);

                    let schema30: Oas30Schema = mediaType30.createSchema();
                    mediaType30.schema = this.toSchema(schema, schema30, true);

                    this.mapNode(schema, schema30);
                });
            }
        } else if (node.in === "formData") {
            // TODO handle a re-usable formData style param definition - not sure what to do with it though :(
        } else {
            let components30: Oas30Components = this.getOrCreateComponents();
            let paramDef30: Oas30ParameterDefinition = components30.createParameterDefinition(node.parameterName());
            components30.addParameterDefinition(node.parameterName(), paramDef30);
            this.transformParam(node, paramDef30);
            this.mapNode(node, paramDef30);
        }
    }

    public visitExternalDocumentation(node: Oas20ExternalDocumentation): void {
        let parent30: Oas30Document | Oas30Operation = this.lookup(node.parent()) as any;
        let externalDocs30: Oas30ExternalDocumentation = parent30.createExternalDocumentation();
        parent30.externalDocs = externalDocs30;

        externalDocs30.description = node.description;
        externalDocs30.url = node.url;

        this.mapNode(node, externalDocs30);
    }

    public visitSecurityRequirement(node: Oas20SecurityRequirement): void {
        let parent30: Oas30Document | Oas30Operation = this.lookup(node.parent()) as any;
        let securityRequirement30: Oas30SecurityRequirement = parent30.createSecurityRequirement();
        if (!parent30.security) {
            parent30.security = [];
        }
        parent30.security.push(securityRequirement30);

        node.securityRequirementNames().forEach( name => {
            securityRequirement30.addSecurityRequirementItem(name, node.scopes(name));
        });

        this.mapNode(node, securityRequirement30);
    }

    public visitResponses(node: Oas20Responses): void {
        let parent30: Oas30Operation = this.lookup(node.parent()) as Oas30Operation;
        let responses30: Oas30Responses = parent30.createResponses();
        parent30.responses = responses30;

        this.mapNode(node, responses30);
    }

    public visitResponse(node: Oas20Response): void {
        let parent30: Oas30Responses = this.lookup(node.parent()) as Oas30Responses;
        let response30: Oas30Response = parent30.createResponse(node.statusCode());
        parent30.addResponse(node.statusCode(), response30);

        response30.$ref = this.updateRef(node.$ref);
        this.transformResponse(node, response30);

        this.mapNode(node, response30);
    }

    public visitResponseDefinition(node: Oas20ResponseDefinition): void {
        let parent30: Oas30Components = this.getOrCreateComponents();
        let responseDef30: Oas30ResponseDefinition = parent30.createResponseDefinition(node.name());
        parent30.addResponseDefinition(node.name(), responseDef30);

        this.transformResponse(node, responseDef30);

        this.mapNode(node, responseDef30);
    }

    private transformResponse(node: Oas20ResponseBase, response30: Oas30ResponseBase): void {
        response30.description = node.description;

        if (node.schema) {
            let produces: string[] = this.findProduces(node);
            let schema: Oas20Schema = node.schema;
            produces.forEach( ct => {
                let mediaType30: Oas30MediaType = response30.createMediaType(ct);
                response30.addMediaType(ct, mediaType30);

                let schema30: Oas30Schema = mediaType30.createSchema();
                mediaType30.schema = this.toSchema(schema, schema30, true);

                if (node.examples) {
                    let ctexample: any = node.examples.example(ct);
                    if (ctexample) {
                        mediaType30.example = ctexample;
                    }
                }

                this.mapNode(schema, schema30);
            });
        }
    }

    public visitSchema(node: Oas20Schema): void {
        // In 2.0, Schemas can only be located on responses and parameters.  In both cases, we
        // handle processing and indexing the schema in their respective visit methods - so we
        // can skip doing that here.
    }

    public visitHeaders(node: Oas20Headers): void {
        let parent30: Oas30ResponseBase = this.lookup(node.parent()) as Oas30ResponseBase;
        // No processing to do here, because 3.0 doesn't have a "headers" node.  So instead
        // we'll map the headers node to the 3.0 response node, because that will be the
        // effective parent for any 3.0 Header nodes.
        this.mapNode(node, parent30);
    }

    public visitHeader(node: Oas20Header): void {
        let parent30: Oas30ResponseBase = this.lookup(node.parent()) as Oas30ResponseBase;
        let header30: Oas30Header = parent30.createHeader(node.headerName());
        parent30.addHeader(node.headerName(), header30);

        header30.description = node.description;
        header30.schema = this.toSchema(node, header30.createSchema(), false);

        this.mapNode(node, header30);
    }

    public visitExample(node: Oas20Example): void {
        // Examples are processed as part of "transformResponse"
    }

    public visitItems(node: Oas20Items): void {
        let parent30: Oas30Schema = this.findItemsParent(node);
        let items30: Oas30ItemsSchema = parent30.createItemsSchema();
        parent30.items = items30;

        this.toSchema(node, items30, false);

        this.mapNode(node, items30);
    }

    public visitTag(node: Oas20Tag): void {
        let parent30: Oas30Document = this.doc30;
        if (!parent30.tags) {
            parent30.tags = [];
        }
        let tag30: Oas30Tag = parent30.createTag();
        tag30.name = node.name;
        tag30.description = node.description;
        parent30.tags.push(tag30);

        this.mapNode(node, tag30);
    }

    public visitSecurityDefinitions(node: Oas20SecurityDefinitions): void {
        // OpenAPI has no "Security Definitions" wrapper entity.
    }

    public visitSecurityScheme(node: Oas20SecurityScheme): void {
        let parent30: Oas30Components = this.getOrCreateComponents();
        let scheme30: Oas30SecurityScheme = parent30.createSecurityScheme(node.schemeName());
        parent30.addSecurityScheme(node.schemeName(), scheme30);

        scheme30.type = node.type;
        scheme30.description = node.description;
        scheme30.name = node.name;
        scheme30.in = node.in;

        if (node.type === "oauth2") {
            if (node.flow === "implicit") {
                scheme30.flows = scheme30.createOAuthFlows();
                scheme30.flows.implicit = scheme30.flows.createImplicitOAuthFlow();
                scheme30.flows.implicit.authorizationUrl = node.authorizationUrl;
                if (node.scopes) {
                    node.scopes.scopes().forEach( scopeName => {
                        scheme30.flows.implicit.addScope(scopeName, node.scopes.getScopeDescription(scopeName));
                    })
                }
            }
            if (node.flow === "accessCode") {
                scheme30.flows = scheme30.createOAuthFlows();
                scheme30.flows.authorizationCode = scheme30.flows.createAuthorizationCodeOAuthFlow();
                scheme30.flows.authorizationCode.authorizationUrl = node.authorizationUrl;
                scheme30.flows.authorizationCode.tokenUrl = node.tokenUrl;
                if (node.scopes) {
                    node.scopes.scopes().forEach( scopeName => {
                        scheme30.flows.authorizationCode.addScope(scopeName, node.scopes.getScopeDescription(scopeName));
                    })
                }
            }
            if (node.flow === "password") {
                scheme30.flows = scheme30.createOAuthFlows();
                scheme30.flows.password = scheme30.flows.createPasswordOAuthFlow();
                scheme30.flows.password.tokenUrl = node.tokenUrl;
                if (node.scopes) {
                    node.scopes.scopes().forEach( scopeName => {
                        scheme30.flows.password.addScope(scopeName, node.scopes.getScopeDescription(scopeName));
                    })
                }
            }
            if (node.flow === "application") {
                scheme30.flows = scheme30.createOAuthFlows();
                scheme30.flows.clientCredentials = scheme30.flows.createClientCredentialsOAuthFlow();
                scheme30.flows.clientCredentials.tokenUrl = node.tokenUrl;
                if (node.scopes) {
                    node.scopes.scopes().forEach( scopeName => {
                        scheme30.flows.clientCredentials.addScope(scopeName, node.scopes.getScopeDescription(scopeName));
                    })
                }
            }
        }

        this.mapNode(node, scheme30);
    }

    public visitScopes(node: Oas20Scopes): void {
        // Note: scopes are handled during the processing of the security scheme.  See `visitSecurityScheme` for details.
    }

    public visitXML(node: Oas20XML): void {
        let parent30: Oas30Schema = this.lookup(node.parent()) as Oas30Schema;
        let xml30: Oas30XML = parent30.createXML();
        parent30.xml = xml30;

        xml30.name = node.name;
        xml30.namespace = node.namespace;
        xml30.prefix = node.prefix;
        xml30.attribute = node.attribute;
        xml30.wrapped = node.wrapped;

        this.mapNode(node, xml30);
    }

    public visitSchemaDefinition(node: Oas20SchemaDefinition): void {
        let parent30: Oas30Components = this.getOrCreateComponents();
        let schemaDef30: Oas30SchemaDefinition = parent30.createSchemaDefinition(node.definitionName());
        parent30.addSchemaDefinition(node.definitionName(), schemaDef30);

        this.toSchema(node, schemaDef30, true);

        this.mapNode(node, schemaDef30);
    }

    public visitPropertySchema(node: Oas20PropertySchema): void {
        let parent30: Oas30Schema = this.lookup(node.parent()) as Oas30Schema;
        let property30: Oas30PropertySchema = parent30.createPropertySchema(node.propertyName());
        parent30.addProperty(node.propertyName(), property30);

        this.toSchema(node, property30, true);

        this.mapNode(node, property30);
    }

    public visitAdditionalPropertiesSchema(node: Oas20AdditionalPropertiesSchema): void {
        let parent30: Oas30Schema = this.lookup(node.parent()) as Oas30Schema;
        let additionalProps30: Oas30AdditionalPropertiesSchema = parent30.createAdditionalPropertiesSchema();
        parent30.additionalProperties = additionalProps30;

        this.toSchema(node, additionalProps30, true);

        this.mapNode(node, additionalProps30);
    }

    public visitAllOfSchema(node: Oas20AllOfSchema): void {
        let parent30: Oas30Schema = this.lookup(node.parent()) as Oas30Schema;
        let allOf30: Oas30AllOfSchema = parent30.createAllOfSchema();
        if (!parent30.allOf) {
            parent30.allOf = [];
        }
        parent30.allOf.push(allOf30);

        this.toSchema(node, allOf30, true);

        this.mapNode(node, allOf30);
    }

    public visitItemsSchema(node: Oas20ItemsSchema): void {
        let parent30: Oas30Schema = this.lookup(node.parent()) as Oas30Schema;
        let items30: Oas30ItemsSchema = parent30.createItemsSchema();
        if (parent30.items && typeof parent30.items === "object") {
            parent30.items = [ parent30.items as Oas30Schema ];
            parent30.items.push(items30);
        } else {
            parent30.items = items30;
        }

        this.toSchema(node, items30, true);

        this.mapNode(node, items30);
    }

    public visitDefinitions(node: Oas20Definitions): void {
        // Note: there is no "definitions" entity in 3.0, so nothing to do here.
    }

    public visitParametersDefinitions(node: Oas20ParametersDefinitions): void {
        // Note: there is no "parameters definitions" entity in 3.0, so nothing to do here.
    }

    public visitResponsesDefinitions(node: Oas20ResponsesDefinitions): void {
        // Note: there is no "responses definitions" entity in 3.0, so nothing to do here.
    }

    public visitExtension(node: OasExtension): void {
        let parent30: OasExtensibleNode = this.lookup(node.parent()) as OasExtensibleNode;
        parent30.addExtension(node.name, node.value);
    }

    public visitValidationProblem(node: OasValidationProblem): void {
        // Note: nothing to do for a validation problem
    }

    private mapNode(from: OasNode, to: OasNode): void {
        let nodePath: OasNodePath = this._library.createNodePath(from);
        let mapIndex: string = nodePath.toString();
        this._nodeMap[mapIndex] = to;
    }

    private lookup(node: OasNode): OasNode {
        let nodePath: OasNodePath = this._library.createNodePath(node);
        let mapIndex: string = nodePath.toString();
        return this._nodeMap[mapIndex] as OasNode;
    }

    private getOrCreateComponents(): Oas30Components {
        if (!this.doc30.components) {
            this.doc30.components = this.doc30.createComponents();
        }
        return this.doc30.components;
    }

    private toSchema(from: Oas20ParameterBase | Oas20Header | Oas20Items | Oas20Schema | Oas20SchemaDefinition,
                     schema30: Oas30Schema, isSchema: boolean): Oas30Schema {
        schema30.type = from.type;
        schema30.format = from.format;
        if (from.items && typeof from.items !== "array") {
            (from.items as OasNode).n_attribute("_transformation_items-parent", schema30);
        } else if (from.items && typeof from.items === "array") {
            // TODO handle the case where "items" is an array of items!!
        }
        // Note: Not sure what to do with the "collectionFormat" of a schema.  Dropping it for now.
        //schema30.collectionFormat = from.collectionFormat;
        schema30.default = from.default;
        schema30.maximum = from.maximum;
        schema30.exclusiveMaximum = from.exclusiveMaximum;
        schema30.minimum = from.minimum;
        schema30.exclusiveMinimum = from.exclusiveMinimum;
        schema30.maxLength = from.maxLength;
        schema30.minLength = from.minLength;
        schema30.pattern = from.pattern;
        schema30.maxItems = from.maxItems;
        schema30.minItems = from.minItems;
        schema30.uniqueItems = from.uniqueItems;
        schema30.enum = from.enum;
        schema30.multipleOf = from.multipleOf;

        if (isSchema) {
            let schema20: Oas20Schema = from as Oas20Schema;
            schema30.$ref = this.updateRef(schema20.$ref);
            if (typeof schema20.additionalProperties === "boolean") {
                schema30.additionalProperties = schema20.additionalProperties as boolean;
            }
            schema30.readOnly = schema20.readOnly;
            schema30.example = schema20.example;
            schema30.title = schema20.title;
            schema30.description = schema20.description;
            schema30.maxProperties = schema20.maxProperties;
            schema30.minProperties = schema20.minProperties;
            schema30.required = schema20.required;

            if (schema20.discriminator) {
                schema30.discriminator = schema30.createDiscriminator();
                schema30.discriminator.propertyName = schema20.discriminator;
            }
        }

        return schema30;
    }

    private findItemsParent(node: Oas20Items): Oas30Schema {
        let itemsParent: Oas30Schema = node.n_attribute("_transformation_items-parent");
        if (!itemsParent) {
            itemsParent = this.lookup(node.parent()) as Oas30Schema;
        }
        return itemsParent;
    }

    private findParentOperation(node: Oas20Parameter): Oas20Operation {
        let visitor: ParentOperationFinderVisitor = new ParentOperationFinderVisitor();
        OasVisitorUtil.visitTree(node, visitor, OasTraverserDirection.up);
        return visitor.operation;
    }

    private findProduces(node: OasNode): string[] {
        let visitor: ProducesFinderVisitor = new ProducesFinderVisitor();
        OasVisitorUtil.visitTree(node, visitor, OasTraverserDirection.up);
        return visitor.produces;
    }

    private findConsumes(node: OasNode): string[] {
        let visitor: ConsumesFinderVisitor = new ConsumesFinderVisitor();
        OasVisitorUtil.visitTree(node, visitor, OasTraverserDirection.up);
        return visitor.consumes;
    }

    private collectionFormatToStyleAndExplode(node: Oas20ParameterBase, param30: Oas30Parameter): void {
        if (node.type === "array" && node.collectionFormat === "multi" && (node.in === "query" || node.in === "cookie")) {
            param30.style = "form";
            param30.explode = true;
            return;
        }
        if (node.type === "array" && node.collectionFormat === "csv" && (node.in === "query" || node.in === "cookie")) {
            param30.style = "form";
            param30.explode = false;
            return;
        }
        if (node.type === "array" && node.collectionFormat === "csv" && (node.in === "path" || node.in === "header")) {
            param30.style = "simple";
            return;
        }
        if (node.type === "array" && node.collectionFormat === "ssv" && node.in === "query") {
            param30.style = "spaceDelimited";
            return;
        }
        if (node.type === "array" && node.collectionFormat === "pipes" && node.in === "query") {
            param30.style = "pipeDelimited";
            return;
        }
    }

    private isFormDataMimeType(mimetype: string): boolean {
        return mimetype && (mimetype === "multipart/form-data" || mimetype === "application/x-www-form-urlencoded");
    }

    private hasFormDataMimeType(mimetypes: string[]): boolean {
        if (mimetypes) {
            for (let mt of mimetypes) {
                if (this.isFormDataMimeType(mt)) {
                    return true;
                }
            }
        }
        return false;
    }

    private isRef(node: Oas20Schema | Oas20Response | Oas20Parameter): boolean {
        return node.$ref && node.$ref.length > 0;
    }

    private updateRef($ref: string): string {
        if (!$ref || $ref.length === 0) {
            return $ref;
        }
        let split: string[] = $ref.split("/");
        if (split[0] === "#") {
            if (split[1] === "definitions") {
                split.splice(1, 1, "components", "schemas");
            } else if (split[1] === "parameters") {
                split.splice(1, 1, "components", "parameters");
            } else if (split[1] === "responses") {
                split.splice(1, 1, "components", "responses");
            }
        }
        return split.join("/");
    }

}

export class ProducesFinderVisitor extends Oas20NodeVisitorAdapter {

    public produces: string[] = [ "*/*" ];

    public visitDocument(node: Oas20Document) {
        if (node.produces && node.produces.length > 0) {
            this.produces = node.produces;
        }
    }

    public visitOperation(node: Oas20Operation): void {
        if (node.produces && node.produces.length > 0) {
            this.produces = node.produces;
        }
    }

}


export class ConsumesFinderVisitor extends Oas20NodeVisitorAdapter {

    public consumes: string[] = [ "*/*" ];

    public visitDocument(node: Oas20Document) {
        if (node.consumes && node.consumes.length > 0) {
            this.consumes = node.consumes;
        }
    }

    public visitOperation(node: Oas20Operation): void {
        if (node.consumes && node.consumes.length > 0) {
            this.consumes = node.consumes;
        }
    }

}


export class ParentOperationFinderVisitor extends Oas20NodeVisitorAdapter {

    public operation: Oas20Operation = null;

    public visitOperation(node: Oas20Operation): void {
        this.operation = node;
    }

}