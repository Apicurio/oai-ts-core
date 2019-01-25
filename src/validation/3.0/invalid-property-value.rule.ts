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

import { Oas30PathValidationRule } from "./common.rule"
import { OasValidationRuleUtil, PathSegment } from "../validation"
import { Oas30XML } from "../../models/3.0/xml.model"
import { Oas30Schema } from "../../models/3.0/schema.model"
import { Oas30Encoding } from "../../models/3.0/encoding.model"
import { Oas30MediaType } from "../../models/3.0/media-type.model"
import { Oas30Header, Oas30HeaderDefinition } from "../../models/3.0/header.model"
import { Oas30Link, Oas30LinkDefinition } from "../../models/3.0/link.model"
import { OasVisitorUtil } from "../../visitors/visitor.utils"
import { Oas30NodeVisitorAdapter } from "../../visitors/visitor.base"
import { Oas30Operation } from "../../models/3.0/operation.model"
import { Oas30Parameter, Oas30ParameterDefinition } from "../../models/3.0/parameter.model"
import { Oas30PathItem } from "../../models/3.0/path-item.model"
import { Oas30Document } from "../../models/3.0/document.model"
import { Oas30SecurityScheme } from "../../models/3.0/security-scheme.model"
import { Oas30Responses } from "../../models/3.0/responses.model"
import { Oas30SecurityRequirement } from "../../models/3.0/security-requirement.model"
import { Oas30Discriminator } from "../../models/3.0/discriminator.model"
import { Oas30ServerVariable } from "../../models/3.0/server-variable.model"
import { Oas30Server } from "../../models/3.0/server.model"
import {OasParameterBase, IOasParameterParent} from "../../models/common/parameter.model";
import {ReferenceUtil} from "../../util";


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
 * *format* of the value is fine (e.g. correct data-type) but the value is somehow
 * invalid.
 */
export class Oas30InvalidPropertyValueValidationRule extends Oas30PathValidationRule {

    /**
     * Holds paths with either invalid pattern or with duplicate parameters.
     */
    private pathItemsWithError: string[] = [];

    /**
     * Returns true if the given value is a valid operationId.
     * @param id
     */
    private isValidOperationId(id: string): boolean {
        // TODO implement a regex for this? should be something like camelCase
        return true;
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
        while (startIdx !== -1) {
            endIdx = serverTemplate.indexOf('}', startIdx);
            if (endIdx !== -1) {
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
        let schema: Oas30Schema = xml.parent() as Oas30Schema;
        return schema.type === "array";
    }

    /**
     * Returns true if the given media type name is multipart/* or application/x-www-form-urlencoded
     * @param {string} typeName
     * @return {boolean}
     */
    private isValidMultipartType(typeName: string): boolean {
        return typeName === "application/x-www-form-urlencoded" || typeName.indexOf("multipart") === 0;
    }

    /**
     * Returns true if the given operation is one of:  POST, PUT, OPTIONS
     * @param {Oas30Operation} operation
     * @return {boolean}
     */
    private isValidRequestBodyOperation(operation: Oas30Operation): boolean {
        let method: string = operation.method();
        return method === "put" || method === "post" || method === "options" || method === "patch";
    }

    /**
     * Returns resolved parameter definition or the address of the reference if parameter can not be resolved
     * (e.g. when the pointer is to a non-existent value within the components).
     * @param node - Parameter definition within a path item or operation
     * @return {Oas30Parameter | string} - Returns (recursively) resolved parameter or a string with invalid ref.
     */
    private resolveParameter(node: Oas30Parameter): Oas30Parameter | string {
        let resolvedParam = node;
        while (resolvedParam.$ref !== undefined) {
            const referencedNode = <Oas30Parameter>ReferenceUtil.resolveRef(resolvedParam.$ref, node.ownerDocument());
            if (referencedNode === undefined || referencedNode === null) {
                return resolvedParam.$ref;
            }
            resolvedParam = referencedNode;
        }
        return resolvedParam
    }

    /**
     * Validates that all parameter name and "in" combinations are unique
     * @param {Oas30Parameter[]} - List of parameters to check
     * @return {boolean} - true if unique, false otherwise
     */
    private ensureUnique(params: Oas30Parameter[]) {
        if (this.hasValue(params) === false) {
            return true;
        }
        const resolvedParams: Oas30Parameter[] = [];
        params.forEach(param => {
            const resolutionResult = this.resolveParameter(param);
            if (typeof resolutionResult === 'string') {
                // No need to report this error - already taken care of by reference checks elsewhere.
                // this.reportIf("PAR-3-019", true, param, "$ref", `Parameter reference ${param.$ref} points to non-existant reference.`);
                return false;
            }
            resolvedParams.push(resolutionResult);
        });
        const paramsKey = {};
        resolvedParams.forEach(param => {
            const key = `${param.in}-${param.name}`;
            if (paramsKey[key] === undefined) {
                paramsKey[key] = {
                    count: 1,
                    in: param.in,
                    name: param.name
                };
            }
            else {
                paramsKey[key]['count'] = paramsKey[key]['count'] + 1;
            }
        });
        let success: boolean = true;
        for(let key in paramsKey) {
            if (paramsKey[key]['count'] > 1) {
                const reportableParam = params.filter(param => {
                    return param.in === paramsKey[key]['in'] && param.name === paramsKey[key]['name'];
                })[0];
                this.reportIf("PAR-3-001", true, reportableParam, "in", `Duplicate parameter named '${paramsKey[key]['name']}' and in '${paramsKey[key]['in']}' found (parameters must be unique by name and location).`);
                success = success && false;
            }
        }
        return success;
    }

    /**
     * Merges all parameters applicable for an operation - those defined within the operation and those defined at the pathItem level.
     * Resolves parameters that are not defined inline but are referenced from the components/parameters section.
     * @param {Oas30Operation} - Operation for which to merge parameters.
     * @return {Oas30Parameter[]} - array of merged paramters.
     */
    private mergeParameters(node: Oas30Operation): Oas30Parameter[] {
        const paramsKey = {};
        const parentNode = <Oas30PathItem>node.parent();
        // Get the parameters from pathItem
        if (this.hasValue(parentNode.parameters)) {
            parentNode.parameters.forEach(param => {
                const resolutionResult = <Oas30Parameter>this.resolveParameter(<Oas30Parameter>param);
                const key = `${resolutionResult.in}-${resolutionResult.name}`;
                paramsKey[key] = resolutionResult;
            });
        }
        // Overwrite parameters from parent
        if (this.hasValue(node.parameters)) {
            node.parameters.forEach(param => {
                const resolutionResult = <Oas30Parameter>this.resolveParameter(<Oas30Parameter>param);
                const key = `${resolutionResult.in}-${resolutionResult.name}`;
                paramsKey[key] = resolutionResult;
            });
        }
        const mergedParameters:Oas30Parameter[] = []
        for(let key in paramsKey) {
            mergedParameters.push(paramsKey[key]);
        }
        return mergedParameters;
    }

    public visitEncoding(node: Oas30Encoding): void {
        if (node.getHeaders().length > 0) {
            let mediaType: Oas30MediaType = node.parent() as Oas30MediaType;
            this.reportIfInvalid("ENC-3-001", mediaType.name().indexOf("multipart") === 0, node, "headers",
                `Headers are not allowed for "${mediaType.name()}" media types.`);
        }
        if (this.hasValue(node.style)) {
            let mediaType: Oas30MediaType = node.parent() as Oas30MediaType;
            this.reportIfInvalid("ENC-3-002", mediaType.name().indexOf("application/x-www-form-urlencoded") === 0, node, "style",
                `Encoding Style is not allowed for "${mediaType.name()}" media types.`);

            this.reportIfInvalid("ENC-3-005", OasValidationRuleUtil.isValidEnumItem(node.style, ["form", "spaceDelimited", "pipeDelimited", "deepObject"]), node, "style",
                `Encoding Style is an invalid value.`);
        }
        if (this.hasValue(node.explode)) {
            let mediaType: Oas30MediaType = node.parent() as Oas30MediaType;
            this.reportIf("ENC-3-003", mediaType.name() !== "application/x-www-form-urlencoded", node, "explode",
                `"Explode" is not allowed for "${mediaType.name()}" media types.`);
        }
        if (this.hasValue(node.allowReserved)) {
            let mediaType: Oas30MediaType = node.parent() as Oas30MediaType;
            this.reportIf("ENC-3-004", mediaType.name() !== "application/x-www-form-urlencoded", node, "allowReserved",
                `"Allow Reserved" is not allowed for "${mediaType.name()}" media types.`);
        }
    }

    public visitHeader(node: Oas30Header): void {
        if (this.hasValue(node.style)) {
            this.reportIfInvalid("HEAD-3-003", OasValidationRuleUtil.isValidEnumItem(node.style, ["simple"]), node, "style",
                `Header Style must be "simple".`);
        }

        this.reportIfInvalid("HEAD-3-004", node.getMediaTypes().length < 2, node, "content",
            `Header content cannot have multiple media types.`);
    }
    public visitHeaderDefinition(node: Oas30HeaderDefinition): void {
        this.visitHeader(node);
    }

    public visitLink(node: Oas30Link): void {
        if (this.hasValue(node.operationId)) {
            let opFinder: Oas30OperationFinder = new Oas30OperationFinder(node.operationId);
            OasVisitorUtil.visitTree(node.ownerDocument(), opFinder);
            this.reportIfInvalid("LINK-3-002", opFinder.isFound(), node, "operationId",
                `The Operation ID does not refer to an existing Operation.`);
        }
    }
    public visitLinkDefinition(node: Oas30LinkDefinition): void {
        this.visitLink(node);
    }

    public visitMediaType(node: Oas30MediaType): void {
        if (node.getEncodings().length > 0) {
            this.reportIfInvalid("MT-3-003", this.isValidMultipartType(node.name()), node, "encoding",
                `Encoding is not allowed for "${node.name()}" media types.`);
        }
    }

    public visitPathItem(node: Oas30PathItem): void {
        let params: Oas30Parameter[] = <Oas30Parameter[]>node.parameters;
        if (this.isPathWellFormed(node.path()) === false || this.ensureUnique(params) === false) {
            this.pathItemsWithError.push(node.path());
        }
    }

    public visitOperation(node: Oas30Operation): void {
        if (this.hasValue(node.requestBody)) {
            this.reportIfInvalid("OP-3-003", this.isValidRequestBodyOperation(node), node, "requestBody",
                `Request Body is not supported for ${node.method().toUpperCase()} operations.`);
        }

        // Perform operation level checks only if there are no issues at the pathItem level.
        if (this.pathItemsWithError.indexOf((<Oas30PathItem>node.parent()).path()) !== -1) {
            return;
        }
        // Check parameters are unique within operation
        let params: Oas30Parameter[] = <Oas30Parameter[]>node.parameters;
        if (this.ensureUnique(params) === false) {
            return;
        }
        const mergedParameters = this.mergeParameters(node);
        let pathItem: Oas30PathItem = node.parent() as Oas30PathItem;
        let path: string = pathItem.path();
        let pathSegs: PathSegment[] = this.getPathSegments(path);
        // Report all the path segments that don't have an associated parameter definition
        pathSegs
        .filter(pathSeg => {
            return pathSeg.formalName !== undefined;
        })
        .forEach(pathSeg => {
            this.reportIfInvalid(
                "OP-3-006",
                mergedParameters.filter((param) => { return pathSeg.formalName === param.name && param.in === 'path'; }).length > 0,
                node,
                null,
                `No definition found for path variable "${pathSeg.formalName}" for path '${path}' and method '${node.method()}'.`
            );
        });
        // Report all path parameter definitions that don't have an associated path segment
        mergedParameters
        .filter(param => {
            return param.in === 'path';
        })
        .forEach(param => {
            this.reportIfInvalid(
                "PAR-3-018",
                pathSegs.filter(pathSeg => { return pathSeg.formalName !== undefined && pathSeg.formalName === param.name; }).length > 0,
                param,
                "name",
                `Path Parameter "${param.name}" not found in path template ${path}.`
            );
        });
    }

    public visitResponses(node: Oas30Responses): void {
        this.reportIfInvalid("OP-3-005", node.responses().length > 0, node.parent(), null,
            `Operation must have at least one Response.`);
    }

    public visitParameter(node: Oas30Parameter): void {
        if (this.hasValue(node.in)) {
            this.reportIfInvalid("PAR-3-002", OasValidationRuleUtil.isValidEnumItem(node.in, ["query", "header", "path", "cookie"]), node, "in",
                `Parameters must be "in" one of: ["path", "query", "header", "cookie"] (Found: '${node.in}')`);
        }

        if (this.hasValue(node.allowEmptyValue)) {
            this.reportIfInvalid("PAR-3-007", OasValidationRuleUtil.isValidEnumItem(node.in, ["query"]), node, "allowEmptyValue",
                `Allow Empty Value is not allowed (only for Query Params).`);
        }

        if (this.hasValue(node.style)) {
            this.reportIfInvalid("PAR-3-009", OasValidationRuleUtil.isValidEnumItem(node.style, ["matrix", "label", "form", "simple", "spaceDelimited", "pipeDelimited", "deepObject"]), node, "style",
                `Parameter Style must be one of: ["matrix", "label", "form", "simple", "spaceDelimited", "pipeDelimited", "deepObject"] (Found "${node.style}").`);

            if (node.in === "query") {
                this.reportIfInvalid("PAR-3-011", OasValidationRuleUtil.isValidEnumItem(node.style, ["form", "spaceDelimited", "pipeDelimited", "deepObject"]), node, "style",
                    `Query Parameter Style must be one of: ["form", "spaceDelimited", "pipeDelimited", "deepObject"] (Found "${node.style}").`);
            }

            if (node.in === "cookie") {
                this.reportIfInvalid("PAR-3-012", OasValidationRuleUtil.isValidEnumItem(node.style, ["form"]), node, "style",
                    `Cookie Parameter style must be "form". (Found "${node.style}")`);
            }

            if (node.in === "header") {
                this.reportIfInvalid("PAR-3-013", OasValidationRuleUtil.isValidEnumItem(node.style, ["simple"]), node, "style",
                    `Header Parameter Style must be "simple". (Found "${node.style}").`);
            }
        }

        if (node.in === "path") {
            this.reportIfInvalid("PAR-3-006", node.required === true, node, "required",
                `Path Parameter "${node.name}" must be marked as "required".`);

            if (this.hasValue(node.style)) {
                this.reportIfInvalid("PAR-3-010", OasValidationRuleUtil.isValidEnumItem(node.style, ["matrix", "label", "simple"]), node, "style",
                    `Path Parameter Style must be one of: ["matrix", "label", "simple"]  (Found "${node.style}").`);
            }
        }

        if (node.in === "header" && this.hasValue(node.name)) {
            let hname: string = node.name.toLowerCase();
            this.reportIf("PAR-3-019", hname === "accept" || hname === "content-type" || hname === "authorization", node, null,
                `Header Parameters "Accept", "Content-Type", and "Authorization" are ignored.`);
        }

        if (this.hasValue(node.allowReserved)) {
            this.reportIfInvalid("PAR-3-014", node.in === "query", node, "allowReserved",
                `Allow Reserved is only allowed for Query Parameters.`);
        }

        if (this.hasValue(node.content)) {
            this.reportIfInvalid("PAR-3-016", node.getMediaTypes().length < 2, node, "content",
                `Parameter content cannot have multiple media types.`);
        }
    }
    public visitParameterDefinition(node: Oas30ParameterDefinition): void {
        this.visitParameter(node);
    }

    public visitXML(node: Oas30XML): void {
        if (this.hasValue(node.wrapped)) {
            this.reportIfInvalid("XML-3-002", this.isWrappedOK(node), node, "wrapped",
                `"Wrapped" is only valid for 'array' property types.`);
        }
    }

    public visitDiscriminator(node: Oas30Discriminator): void {
        let schema: Oas30Schema = node.parent() as Oas30Schema;
        this.reportIfInvalid("SCH-3-001", this.hasValue(schema.oneOf) || this.hasValue(schema.anyOf) || this.hasValue(schema.allOf), node, "discriminator",
            `Schema Discriminator is only allowed when using one of: ["oneOf", "anyOf", "allOf"]`);
    }

    public visitSecurityScheme(node: Oas30SecurityScheme): void {
        if (this.hasValue(node.type)) {
            this.reportIfInvalid("SS-3-008", OasValidationRuleUtil.isValidEnumItem(node.type, ["apiKey", "http", "oauth2", "openIdConnect"]), node, "type",
                `Security Scheme type must be one of: ["apiKey", "http", "oauth2", "openIdConnect"] (Found: '${node.type}')`);
        }

        if (this.hasValue(node.in)) {
            this.reportIfInvalid("SS-3-010", OasValidationRuleUtil.isValidEnumItem(node.in, [ "query", "header", "cookie" ]), node, "in",
                `Security Scheme API Key must be located "in" one of: ["query", "header", "cookie"] (Found: '${node.in}')`);
        }

        if (this.hasValue(node.scheme)) {
            this.reportIfInvalid("SS-3-013", OasValidationRuleUtil.isValidEnumItem(node.scheme, ["basic", "bearer", "digest", "hoba", "mutual", "negotiate", "oauth", "vapid", "scram-sha-1", "scram-sha-256"]), node, "scheme",
                `Security Scheme HTTP security scheme must be one of: ["basic", "bearer", "digest", "hoba", "mutual", "negotiate", "oauth", "vapid", "scram-sha-1", "scram-sha-256"] (Found: '${node.scheme}')`);
        }

        if (this.hasValue(node.bearerFormat)) {
            this.reportIfInvalid("SS-3-011", node.type === "http" && node.scheme === "bearer", node, "bearerFormat",
                `Security Scheme "Bearer Format" only allowed for HTTP Bearer auth scheme.`);
        }
    }

    public visitSecurityRequirement(node: Oas30SecurityRequirement): void {
        let snames: string[] = node.securityRequirementNames();
        snames.forEach( sname => {
            let scopes: string[] = node.scopes(sname);
            this.reportIfInvalid("SREQ-3-003", this.hasValue(scopes) && Array.isArray(scopes), node, sname,
                `Value for Security Requirement "${sname}" must be an array.`);

            // If the security requirement contains some scopes, then it must be pointing to an oauth2 or openIdConnect security scheme!
            if (this.hasValue(scopes) && scopes.length > 0) {
                let scheme: Oas30SecurityScheme = (node.ownerDocument() as Oas30Document).components.getSecurityScheme(sname);
                if (this.hasValue(scheme)) {
                    this.reportIfInvalid("SREQ-3-002", this.hasValue(scheme) && (scheme.type === "oauth2" || scheme.type === "openIdConnect"), node, sname,
                        `Value for Security Requirement "${sname}" must be an empty array.`);
                }
            }
        });
    }

    public visitServerVariable(node: Oas30ServerVariable): void {
        let varName: string = node.name();
        let server: Oas30Server = node.parent() as Oas30Server;
        let vars: string[] = this.parseServerTemplate(server.url);

        this.reportIfInvalid("SVAR-3-003", OasValidationRuleUtil.isValidEnumItem(varName, vars), node, null,
            `Server Variable "${varName}" is not found in the server url template.`);
    }

}