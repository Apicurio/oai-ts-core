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

import {Oas30ValidationRule} from "./common.rule";
import {OasValidationRuleUtil} from "../validation";
import {Oas30XML} from "../../models/3.0/xml.model";
import {Oas30Schema} from "../../models/3.0/schema.model";
import {Oas30Encoding} from "../../models/3.0/encoding.model";
import {Oas30MediaType} from "../../models/3.0/media-type.model";
import {Oas30Header, Oas30HeaderDefinition} from "../../models/3.0/header.model";
import {Oas30Link, Oas30LinkDefinition} from "../../models/3.0/link.model";
import {OasVisitorUtil} from "../../visitors/visitor.utils";
import {Oas30NodeVisitorAdapter} from "../../visitors/visitor.base";
import {Oas30Operation} from "../../models/3.0/operation.model";
import {Oas30Parameter, Oas30ParameterDefinition} from "../../models/3.0/parameter.model";
import {Oas30PathItem} from "../../models/3.0/path-item.model";
import {Oas30Document} from "../../models/3.0/document.model";
import {Oas30SecurityScheme} from "../../models/3.0/security-scheme.model";
import {Oas30Responses} from "../../models/3.0/responses.model";
import {Oas30SecurityRequirement} from "../../models/3.0/security-requirement.model";
import {Oas30Discriminator} from "../../models/3.0/discriminator.model";
import {Oas30ServerVariable} from "../../models/3.0/server-variable.model";
import {Oas30Server} from "../../models/3.0/server.model";
import {OasLibraryUtils} from "../../library.utils";


/**
 * Used to find an operation with a given operation id.
 */
export class Oas30OperationFinder extends Oas30NodeVisitorAdapter {

    private foundOp: Oas30Operation;

    constructor(private operationId: string) {
        super();
    }

    public visitOperation(node: Oas30Operation): void {
        if (node.operationId === this.operationId) {
            this.foundOp = node;
        }
    }

    public isFound(): boolean {
        return OasValidationRuleUtil.hasValue(this.foundOp);
    }

}


/**
 * Implements the Invalid Property Value validation rule.  This rule is responsible
 * for reporting whenever the **value** of a property fails to conform to requirements
 * outlined by the specification.  This is typically things like enums, where the
 * *format* of the value is fine (e.g. correct data-type) but the valid is somehow
 * invalid.
 */
export class Oas30InvalidPropertyValueValidationRule extends Oas30ValidationRule {

    /**
     * Returns true if the given value is a valid operationId.
     * @param id
     */
    private isValidOperationId(id: string): boolean {
        // TODO implement a regex for this? should be something like camelCase
        return true;
    }

    /**
     * Parses the given path template for segments.  For example, a path template might be
     *
     * /foo/{fooId}/resources/{resourceId}
     *
     * In this case, this method will return [ "fooId", "resourceId" ]
     *
     * @param pathTemplate
     * @return {Array}
     */
    private parsePathTemplate(pathTemplate: string): string[] {
        let segments: string[] = [];
        let split: string[] = pathTemplate.split('/');
        split.forEach( seg => {
            if (seg.indexOf('{') === 0) {
                let segment: string = seg.substring(1, seg.lastIndexOf('}')).trim();
                segments.push(segment);
            }
        });
        return segments;
    }

    /**
     * Parses the given server template for variable names.  For example, a server template might be
     *
     * https://{username}.gigantic-server.com:{port}/{basePath}
     *
     * In this case, this method will return [ "username", "port", "basePath" ]
     *
     * @param serverTemplate
     * @return {Array}
     */
    private parseServerTemplate(serverTemplate: string): string[] {
        if (!this.hasValue(serverTemplate)) {
            return [];
        }
        let vars: string[] = [];
        let startIdx: number = serverTemplate.indexOf('{');
        let endIdx: number = -1;
        while (startIdx != -1) {
            endIdx = serverTemplate.indexOf('}', startIdx);
            if (endIdx != -1) {
                vars.push(serverTemplate.substring(startIdx + 1, endIdx));
                startIdx = serverTemplate.indexOf('{', endIdx);
            } else {
                startIdx = -1;
            }
        }
        return vars;
    }

    /**
     * Returns true if it's OK to use "wrapped" in the XML node.  It's only OK to do this if
     * the type being defined is an 'array' type.
     * @param xml
     * @return {boolean}
     */
    private isWrappedOK(xml: Oas30XML): boolean {
        let schema: Oas30Schema = <Oas30Schema>xml.parent();
        return schema.type === "array";
    }

    /**
     * Returns true if the given media type name is multipart/* or application/x-www-form-urlencoded
     * @param {string} typeName
     * @return {boolean}
     */
    private isValidMultipartType(typeName: string): boolean {
        return typeName === "application/x-www-form-urlencoded" || typeName.indexOf("multipart") == 0;
    }

    /**
     * Returns true if the given operation is one of:  POST, PUT, OPTIONS
     * @param {Oas30Operation} operation
     * @return {boolean}
     */
    private isValidRequestBodyOperation(operation: Oas30Operation): boolean {
        let method: string = operation.method();
        return method === "put" || method === "post" || method === "options";
    }


    public visitEncoding(node: Oas30Encoding): void {
        if (node.getHeaders().length > 0) {
            let mediaType: Oas30MediaType = node.parent() as Oas30MediaType;
            this.reportIfInvalid("ENC-3-001", mediaType.name().indexOf("multipart") === 0, node,
                `The "headers" property is only allowed for "multipart" request body media type encodings.  Found media type "${mediaType.name()}" instead.`);
        }
        if (this.hasValue(node.style)) {
            let mediaType: Oas30MediaType = node.parent() as Oas30MediaType;
            this.reportIfInvalid("ENC-3-002", mediaType.name().indexOf("application/x-www-form-urlencoded") === 0, node,
                `The "style" property is only allowed for "application/x-www-form-urlencoded" request body media type encodings.  Found media type "${mediaType.name()}" instead.`);

            this.reportIfInvalid("ENC-3-005", OasValidationRuleUtil.isValidEnumItem(node.style, ["form", "spaceDelimited", "pipeDelimited", "deepObject"]), node,
                `The "style" property value must be one of: ["form", "spaceDelimited", "pipeDelimited", "deepObject"]  Found value "${node.style}".`);
        }
        if (this.hasValue(node.explode)) {
            let mediaType: Oas30MediaType = node.parent() as Oas30MediaType;
            this.reportIf("ENC-3-003", mediaType.name() != "application/x-www-form-urlencoded", node,
                `The "explode" property is only allowed for "application/x-www-form-urlencoded" request body media type encodings.`);
        }
        if (this.hasValue(node.allowReserved)) {
            let mediaType: Oas30MediaType = node.parent() as Oas30MediaType;
            this.reportIf("ENC-3-004", mediaType.name() != "application/x-www-form-urlencoded", node,
                `The "allowReserved" property is only allowed for "application/x-www-form-urlencoded" request body media type encodings.`);
        }
    }

    public visitHeader(node: Oas30Header): void {
        if (this.hasValue(node.style)) {
            this.reportIfInvalid("HEAD-3-003", OasValidationRuleUtil.isValidEnumItem(node.style, ["simple"]), node,
                `The "style" property value must be "simple".  Found value "${node.style}".`);
        }

        this.reportIfInvalid("HEAD-3-004", node.getMediaTypes().length < 2, node,
            `The "content" property must contain at most one entry.`);
    }
    public visitHeaderDefinition(node: Oas30HeaderDefinition): void {
        this.visitHeader(node);
    }

    public visitLink(node: Oas30Link): void {
        if (this.hasValue(node.operationId)) {
            let opFinder: Oas30OperationFinder = new Oas30OperationFinder(node.operationId);
            OasVisitorUtil.visitTree(node.ownerDocument(), opFinder);
            this.reportIfInvalid("LINK-3-002", opFinder.isFound(), node,
                `The "operationId" property must refer to an existing Operation.  Cannot find operation with ID "${node.operationId}".`);
        }
    }
    public visitLinkDefinition(node: Oas30LinkDefinition): void {
        this.visitLink(node);
    }

    public visitMediaType(node: Oas30MediaType): void {
        if (node.getEncodings().length > 0) {
            this.reportIfInvalid("MT-3-003", this.isValidMultipartType(node.name()), node,
                `The "encoding" property is only allowed for "multipart" and "application/x-www-form-urlencoded" request body media types.  Found "${node.name()}" instead.`);
        }
    }

    public visitOperation(node: Oas30Operation): void {
        if (this.hasValue(node.requestBody)) {
            this.reportIfInvalid("OP-3-003", this.isValidRequestBodyOperation(node), node,
                `The "requestBody" property is only supported for POST, PUT, and OPTIONS operations.`);
        }
    }

    public visitResponses(node: Oas30Responses): void {
        this.reportIfInvalid("OP-3-005", node.responses().length > 0, node.parent(),
            `There must be at least one Response documented.`);
    }

    public visitParameter(node: Oas30Parameter): void {
        if (this.hasValue(node.in)) {
            this.reportIfInvalid("PAR-3-002", OasValidationRuleUtil.isValidEnumItem(node.in, ["query", "header", "path", "cookie"]), node,
                `The "in" property value must be one of: ["path", "query", "header", "cookie"] (Found value: '${node.in}')`);
        }

        if (this.hasValue(node.allowEmptyValue)) {
            this.reportIfInvalid("PAR-3-007", OasValidationRuleUtil.isValidEnumItem(node.in, ["query"]), node,
                `The "allowEmptyValue" property is only allowed for "query" parameters.`);
        }

        if (this.hasValue(node.style)) {
            this.reportIfInvalid("PAR-3-009", OasValidationRuleUtil.isValidEnumItem(node.style, ["matrix", "label", "form", "simple", "spaceDelimited", "pipeDelimited", "deepObject"]), node,
                `The "style" property value must be one of: ["matrix", "label", "form", "simple", "spaceDelimited", "pipeDelimited", "deepObject"] (Found value "${node.style}").`);

            if (node.in === "query") {
                this.reportIfInvalid("PAR-3-011", OasValidationRuleUtil.isValidEnumItem(node.style, ["form", "spaceDelimited", "pipeDelimited", "deepObject"]), node,
                    `For "query" parameters, the "style" property value must be one of: ["form", "spaceDelimited", "pipeDelimited", "deepObject"] (Found value "${node.style}").`);
            }

            if (node.in === "cookie") {
                this.reportIfInvalid("PAR-3-012", OasValidationRuleUtil.isValidEnumItem(node.style, ["form"]), node,
                    `For "cookie" parameters, the "style" property value must be "form". (Found value "${node.style}")`);
            }

            if (node.in === "header") {
                this.reportIfInvalid("PAR-3-013", OasValidationRuleUtil.isValidEnumItem(node.style, ["simple"]), node,
                    `For "header" parameters, the "style" property value must be "simple". (Found value "${node.style}").`);
            }
        }

        if (node.in === "path") {
            let pathItem: Oas30PathItem;
            if (node.parent()["_path"]) {
                pathItem = <Oas30PathItem>(node.parent());
            } else {
                pathItem = <Oas30PathItem>(node.parent().parent());
            }
            let path: string = pathItem.path();
            let pathVars: string[] = this.parsePathTemplate(path);
            this.reportIfInvalid("PAR-3-018", OasValidationRuleUtil.isValidEnumItem(node.name, pathVars), node,
                `The "name" property value for a 'path' style parameter must match one of the items in the path template.  Invalid path property name found: "${node.name}"`);

            this.reportIfInvalid("PAR-3-006", node.required === true, node,
                `The "required" property is required for "path" parameters, and must have a value of "true".`);

            if (this.hasValue(node.style)) {
                this.reportIfInvalid("PAR-3-010", OasValidationRuleUtil.isValidEnumItem(node.style, ["matrix", "label", "simple"]), node,
                    `For "path" parameters, the "style" property value must be one of: ["matrix", "label", "simple"]  (Found value "${node.style}").`);
            }
        }

        if (node.in === "header" && this.hasValue(node.name)) {
            let hname: string = node.name.toLowerCase();
            this.reportIf("PAR-3-019", hname === "accept" || hname === "content-type" || hname === "authorization", node,
                `Header parameters "Accept", "Content-Type", and "Authorization" are ignored.`);
        }

        if (this.hasValue(node.allowReserved)) {
            this.reportIfInvalid("PAR-3-014", node.in === "query", node,
                `The "allowReserved" property is only allowed for "query" parameters.`);
        }

        if (this.hasValue(node.content)) {
            this.reportIfInvalid("PAR-3-016", node.getMediaTypes().length < 2, node,
                `The "content" property must contain at most one entry.`);
        }
    }
    public visitParameterDefinition(node: Oas30ParameterDefinition): void {
        this.visitParameter(node);
    }

    public visitXML(node: Oas30XML): void {
        if (this.hasValue(node.wrapped)) {
            this.reportIfInvalid("XML-3-002", this.isWrappedOK(node), node,
                `The "wrapped" property is only valid for 'array' types.`);
        }
    }

    public visitDiscriminator(node: Oas30Discriminator): void {
        let schema: Oas30Schema = node.parent() as Oas30Schema;
        this.reportIfInvalid("SCH-3-001", this.hasValue(schema.oneOf) || this.hasValue(schema.anyOf) || this.hasValue(schema.allOf), node,
            `The "discriminator" property is only valid when using one of: ["oneOf", "anyOf", "allOf"]`);
    }

    public visitSecurityScheme(node: Oas30SecurityScheme): void {
        if (this.hasValue(node.type)) {
            this.reportIfInvalid("SS-3-008", OasValidationRuleUtil.isValidEnumItem(node.type, ["apiKey", "http", "oauth2", "openIdConnect"]), node,
                `The "type" property value must be one of: ["apiKey", "http", "oauth2", "openIdConnect"] (Found value: '${node.type}')`);
        }

        if (this.hasValue(node.in)) {
            this.reportIfInvalid("SS-3-010", OasValidationRuleUtil.isValidEnumItem(node.in, [ "query", "header", "cookie" ]), node,
                `The "in" property value must be one of: ["query", "header", "cookie"] (Found value: '${node.in}')`);
        }

        if (this.hasValue(node.scheme)) {
            this.reportIfInvalid("SS-3-013", OasValidationRuleUtil.isValidEnumItem(node.scheme, ["basic", "bearer", "digest", "hoba", "mutual", "negotiate", "oauth", "vapid", "scram-sha-1", "scram-sha-256"]), node,
                `The "scheme" property value must be one of: ["basic", "bearer", "digest", "hoba", "mutual", "negotiate", "oauth", "vapid", "scram-sha-1", "scram-sha-256"] (Found value: '${node.scheme}')`);
        }

        if (this.hasValue(node.bearerFormat)) {
            this.reportIfInvalid("SS-3-011", node.type === "http" && node.scheme === "bearer", node,
                `The "bearerFormat" property is only valid for "http" security schemes of type "bearer".`);
        }
    }

    public visitSecurityRequirement(node: Oas30SecurityRequirement): void {
        let snames: string[] = node.securityRequirementNames();
        snames.forEach( sname => {
            let scopes: string[] = node.scopes(sname);
            this.reportIfInvalid("SREQ-3-003", this.hasValue(scopes) && Array.isArray(scopes), node,
                `The value for security requirement "${sname}" must be an array.`);

            // If the security requirement contains some scopes, then it must be pointing to an oauth2 or openIdConnect security scheme!
            if (this.hasValue(scopes) && scopes.length > 0) {
                let scheme: Oas30SecurityScheme = (node.ownerDocument() as Oas30Document).components.getSecurityScheme(sname);
                if (this.hasValue(scheme)) {
                    this.reportIfInvalid("SREQ-3-002", this.hasValue(scheme) && (scheme.type === "oauth2" || scheme.type === "openIdConnect"), node,
                        `The value for security requirement "${sname}" must be an empty array (required for Security Schemes of type other than "oauth2" and "openIdConnect").`);
                }
            }
        });
    }

    public visitServerVariable(node: Oas30ServerVariable): void {
        let varName: string = node.name();
        let server: Oas30Server = node.parent() as Oas30Server;
        let vars: string[] = this.parseServerTemplate(server.url);

        this.reportIfInvalid("SVAR-3-003", OasValidationRuleUtil.isValidEnumItem(varName, vars), node,
            `The server variable "${varName}" is not found in the server url template.`);
    }

}