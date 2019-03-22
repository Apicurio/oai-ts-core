/**
 * @license
 * Copyright 2019 Red Hat
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

import {OasValidationRule} from "./common.rule"
import {Oas20Parameter} from "../../models/2.0/parameter.model";
import {Oas20Document} from "../../models/2.0/document.model";
import {Oas20Operation} from "../../models/2.0/operation.model";
import {Oas20XML} from "../../models/2.0/xml.model";
import {Oas20PathItem} from "../../models/2.0/path-item.model";
import {Oas20Schema} from "../../models/2.0/schema.model";
import {Oas20Scopes} from "../../models/2.0/scopes.model";
import {OasValidationRuleUtil, PathSegment} from "../validation"
import {OasOperation} from "../../models/common/operation.model";
import {Oas30Parameter, Oas30ParameterDefinition} from "../../models/3.0/parameter.model";
import {Oas20Items} from "../../models/2.0/items.model";
import {Oas20Header} from "../../models/2.0/header.model";
import {Oas20SecurityScheme} from "../../models/2.0/security-scheme.model";
import {Oas30SecurityScheme} from "../../models/3.0/security-scheme.model";
import {Oas20SecurityRequirement} from "../../models/2.0/security-requirement.model";
import {Oas20SecurityDefinitions} from "../../models/2.0/security-definitions.model";
import {Oas30XML} from "../../models/3.0/xml.model";
import {Oas30Schema} from "../../models/3.0/schema.model";
import {Oas30Operation} from "../../models/3.0/operation.model";
import {Oas30Encoding} from "../../models/3.0/encoding.model";
import {Oas30MediaType} from "../../models/3.0/media-type.model";
import {Oas30Header, Oas30HeaderDefinition} from "../../models/3.0/header.model";
import {Oas30Link, Oas30LinkDefinition} from "../../models/3.0/link.model";
import {OasVisitorUtil} from "../../visitors/visitor.utils";
import {Oas30PathItem} from "../../models/3.0/path-item.model";
import {ReferenceUtil} from "../../util";
import {Oas30Responses} from "../../models/3.0/responses.model";
import {Oas30Discriminator} from "../../models/3.0/discriminator.model";
import {Oas30SecurityRequirement} from "../../models/3.0/security-requirement.model";
import {Oas30ServerVariable} from "../../models/3.0/server-variable.model";
import {Oas30Server} from "../../models/3.0/server.model";
import {OasDocument} from "../../models/document.model";
import {Oas30Document} from "../../models/3.0/document.model";
import {Oas30NodeVisitorAdapter} from "../../visitors/visitor.base";


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
 * Base class for all Invalid Property Value rules.
 */
export abstract class OasInvalidPropertyValueRule extends OasValidationRule {

    /**
     * Returns true if the given media type name is multipart/* or application/x-www-form-urlencoded
     * @param {string} typeName
     * @return {boolean}
     */
    protected isValidMultipartType(typeName: string): boolean {
        return typeName === "application/x-www-form-urlencoded" || typeName.indexOf("multipart") === 0;
    }

    /**
     * Merges all parameters applicable for an operation - those defined within the operation and those defined at the pathItem level.
     * Resolves parameters that are not defined inline but are referenced from the components/parameters section.
     * @param {Oas30Operation} - Operation for which to merge parameters.
     * @return {Oas30Parameter[]} - array of merged paramters.
     */
    protected mergeParameters(node: Oas30Operation): Oas30Parameter[] {
        const paramsKey = {};
        const parentNode = <Oas30PathItem>node.parent();
        // Get the parameters from pathItem
        if (this.hasValue(parentNode.parameters)) {
            parentNode.parameters.forEach(param => {
                const resolutionResult: Oas30Parameter = <Oas30Parameter>ReferenceUtil.resolveNodeRef(param);
                if (resolutionResult) {
                    const key: string = `${resolutionResult.in}-${resolutionResult.name}`;
                    paramsKey[key] = resolutionResult;
                }
            });
        }
        // Overwrite parameters from parent
        if (this.hasValue(node.parameters)) {
            node.parameters.forEach(param => {
                const resolutionResult: Oas30Parameter = <Oas30Parameter>ReferenceUtil.resolveNodeRef(param);
                if (resolutionResult) {
                    const key: string = `${resolutionResult.in}-${resolutionResult.name}`;
                    paramsKey[key] = resolutionResult;
                }
            });
        }
        const mergedParameters:Oas30Parameter[] = []
        for(let key in paramsKey) {
            mergedParameters.push(paramsKey[key]);
        }
        return mergedParameters;
    }

}

/**
 * Implements the XXX rule.
 */
export class OasInvalidApiSchemeRule extends OasInvalidPropertyValueRule {
    public visitDocument(node: Oas20Document): void {
        if (this.hasValue(node.schemes)) {
            node.schemes.forEach(scheme => {
                this.reportIfInvalid(OasValidationRuleUtil.isValidEnumItem(scheme, ["http", "https", "ws", "wss"]), node, "schemes", {
                    scheme: scheme
                });
            });
        }
    }

}

/**
 * Implements the Invalid API 'Consumes' Mime-Type rule.
 */
export class OasInvalidApiConsumesMTRule extends OasInvalidPropertyValueRule {
    public visitDocument(node: Oas20Document): void {
        if (this.hasValue(node.consumes)) {
            this.reportIfInvalid(OasValidationRuleUtil.isValidMimeType(node.consumes), node, "consumes");
        }
    }

}

/**
 * Implements the Invalid API 'Produces' Mime-Type rule.
 */
export class OasInvalidApiProducesMTRule extends OasInvalidPropertyValueRule {
    public visitDocument(node: Oas20Document): void {
        if (this.hasValue(node.produces)) {
            this.reportIfInvalid(OasValidationRuleUtil.isValidMimeType(node.produces), node, "produces");
        }
    }

}

/**
 * Implements the Operation Summary Too Long rule.
 */
export class OasOperationSummaryTooLongRule extends OasInvalidPropertyValueRule {

    public visitOperation(node: OasOperation): void {
        if (this.hasValue(node.summary)) {
            this.reportIfInvalid(node.summary.length < 120, node, "summary");
        }
    }

}

/**
 * Implements the Invalid Operation ID rule.
 */
export class OasInvalidOperationIdRule extends OasInvalidPropertyValueRule {

    /**
     * Returns true if the given value is a valid operationId.
     * @param id
     */
    protected isValidOperationId(id: string): boolean {
        // TODO implement a regex for this? should be something like camelCase
        return true;
    }

    public visitOperation(node: Oas20Operation): void {
        if (this.hasValue(node.operationId)) {
            this.reportIfInvalid(this.isValidOperationId(node.operationId), node, "operationId");
        }
    }

}

/**
 * Implements the Invalid Operation Scheme rule.
 */
export class OasInvalidOperationSchemeRule extends OasInvalidPropertyValueRule {

    public visitOperation(node: Oas20Operation): void {
        if (this.hasValue(node.schemes)) {
            node.schemes.forEach( scheme => {
                this.reportIfInvalid(OasValidationRuleUtil.isValidEnumItem(scheme, ["http", "https", "ws", "wss"]), node, "schemes", {
                    scheme: scheme
                });
            });
        }
    }

}

/**
 * Implements the Path Parameter Not Found rule.
 */
export class OasPathParamNotFoundRule extends OasInvalidPropertyValueRule {

    public visitParameter(node: Oas20Parameter | Oas30Parameter): void {
        let resolvedParam: Oas20Parameter | Oas30Parameter = <Oas20Parameter | Oas30Parameter>ReferenceUtil.resolveNodeRef(node);
        if (this.hasValue(resolvedParam) && resolvedParam.in === "path") {
            // Note: parent may be an operation *or* a path-item.
            let pathItem: Oas20PathItem;
            if (node.parent()["_path"]) {
                pathItem = node.parent() as Oas20PathItem;
            } else {
                pathItem = node.parent().parent() as Oas20PathItem;
            }
            let path: string = pathItem.path();
            let pathSegs: PathSegment[] = this.getPathSegments(path);
            this.reportIfInvalid(pathSegs.filter(pathSeg => pathSeg.formalName === resolvedParam.name).length > 0, node, "name", {
                name: resolvedParam.name
            });
        }
    }

}

/**
 * Implements the Form Data Parameter Not Allowed rule.
 */
export class OasFormDataParamNotAllowedRule extends OasInvalidPropertyValueRule {

    public visitParameter(node: Oas20Parameter): void {
        if (node.in === "formData") {
            let consumes: string[] = (node.ownerDocument() as Oas20Document).consumes;
            if (!node.parent()["_path"]) {
                let operation: Oas20Operation = (node.parent() as Oas20Operation);
                if (this.hasValue(operation.consumes)) {
                    consumes = operation.consumes;
                }
            }
            if (!this.hasValue(consumes)) {
                consumes = [];
            }
            let valid: boolean = consumes.indexOf("application/x-www-form-urlencoded") >= 0 || consumes.indexOf("multipart/form-data") >= 0;
            this.reportIfInvalid(valid, node, "consumes");
        }
    }

}

/**
 * Implements the Unknown Parameter Location rule.
 */
export class OasUnknownParamLocationRule extends OasInvalidPropertyValueRule {

    public visitParameter(node: Oas20Parameter | Oas30Parameter): void {
        if (this.hasValue(node.in)) {
            if (node.ownerDocument().is2xDocument()) {
                this.reportIfInvalid(OasValidationRuleUtil.isValidEnumItem(node.in, [ "query", "header", "path", "formData", "body" ]), node, "in", {
                    options: "query, header, path, formData, body"
                });
            } else {
                this.reportIfInvalid(OasValidationRuleUtil.isValidEnumItem(node.in, [ "query", "header", "path", "cookie" ]), node, "in", {
                    options: "query, header, path, cookie"
                });
            }
        }
    }

}

/**
 * Implements the Unknown Parameter Type rule.
 */
export class OasUnknownParamTypeRule extends OasInvalidPropertyValueRule {

    public visitParameter(node: Oas20Parameter): void {
        if (this.hasValue(node.type)) {
            this.reportIfInvalid(OasValidationRuleUtil.isValidEnumItem(node.type, [ "string", "number", "integer", "boolean", "array", "file" ]), node, "type");
        }
    }

}

/**
 * Implements the Unknown Parameter Format rule.
 */
export class OasUnknownParamFormatRule extends OasInvalidPropertyValueRule {

    public visitParameter(node: Oas20Parameter): void {
        if (this.hasValue(node.format)) {
            this.reportIfInvalid(OasValidationRuleUtil.isValidEnumItem(node.format, [ "int32", "int64", "float", "double", "byte", "binary", "date", "date-time", "password" ]), node, "format");
        }
    }

}

/**
 * Implements the Unexpected Parameter Usage of 'allowEmptyValue' rule.
 */
export class OasUnexpectedParamAllowEmptyValueRule extends OasInvalidPropertyValueRule {

    public visitParameter(node: Oas20Parameter | Oas30Parameter): void {
        if (this.hasValue(node.allowEmptyValue)) {
            if (node.ownerDocument().is2xDocument()) {
                this.reportIfInvalid(OasValidationRuleUtil.isValidEnumItem(node.in, [ "query", "formData" ]), node, "allowEmptyValue", {
                    options: "Query and Form Data"
                });
            } else {
                this.reportIfInvalid(OasValidationRuleUtil.isValidEnumItem(node.in, [ "query" ]), node, "allowEmptyValue", {
                    options: "Query"
                });
            }
        }
    }

}

/**
 * Implements the Unexpected Parameter Usage of 'collectionFormat' rule.
 */
export class OasUnexpectedParamCollectionFormatRule extends OasInvalidPropertyValueRule {

    public visitParameter(node: Oas20Parameter): void {

        if (this.hasValue(node.collectionFormat)) {
            this.reportIfInvalid(node.type === "array", node, "collectionFormat");
        }
    }

}

/**
 * Implements the Unknown Parameter Collection Format rule.
 */
export class OasUnknownParamCollectionFormatRule extends OasInvalidPropertyValueRule {

    public visitParameter(node: Oas20Parameter): void {
        if (this.hasValue(node.collectionFormat)) {
            this.reportIfInvalid(OasValidationRuleUtil.isValidEnumItem(node.collectionFormat, [ "csv", "ssv", "tsv", "pipes", "multi" ]), node, "collectionFormat");
        }
    }

}

/**
 * Implements the Unexpected Parameter Usage of 'multi' rule.
 */
export class OasUnexpectedParamMultiRule extends OasInvalidPropertyValueRule {

    public visitParameter(node: Oas20Parameter): void {
        if (node.collectionFormat === "multi") {
            this.reportIfInvalid(OasValidationRuleUtil.isValidEnumItem(node.in, [ "query", "formData" ]), node, "collectionFormat");
        }
    }

}

/**
 * Implements the Required Parameter With Default Value rule.
 */
export class OasRequiredParamWithDefaultValueRule extends OasInvalidPropertyValueRule {

    public visitParameter(node: Oas20Parameter): void {
        if (this.hasValue(node.default)) {
            this.reportIfInvalid(node.required === undefined || node.required === null || node.required === false, node, "default");
        }
    }

}

/**
 * Implements the Unknown Array Type rule.
 */
export class OasUnknownArrayTypeRule extends OasInvalidPropertyValueRule {

    public visitItems(node: Oas20Items): void {
        if (this.hasValue(node.type)) {
            this.reportIfInvalid(OasValidationRuleUtil.isValidEnumItem(node.type, [ "string", "number", "integer", "boolean", "array" ]), node, "type");
        }
    }

}

/**
 * Implements the Unknown Array Format rule.
 */
export class OasUnknownArrayFormatRule extends OasInvalidPropertyValueRule {

    public visitItems(node: Oas20Items): void {
        if (this.hasValue(node.format)) {
            this.reportIfInvalid(OasValidationRuleUtil.isValidEnumItem(node.format, [ "int32", "int64", "float", "double", "byte", "binary", "date", "date-time", "password" ]), node, "format");
        }
    }

}

/**
 * Implements the Unknown Array Collection Format rule.
 */
export class OasUnknownArrayCollectionFormatRule extends OasInvalidPropertyValueRule {

    public visitItems(node: Oas20Items): void {
        if (this.hasValue(node.collectionFormat)) {
            this.reportIfInvalid(OasValidationRuleUtil.isValidEnumItem(node.collectionFormat, [ "csv", "ssv", "tsv", "pipes" ]), node, "collectionFormat");
        }
    }

}

/**
 * Implements the Unexpected Array Usage of 'collectionFormat' rule.
 */
export class OasUnexpectedArrayCollectionFormatRule extends OasInvalidPropertyValueRule {

    public visitItems(node: Oas20Items): void {
        if (this.hasValue(node.collectionFormat)) {
            this.reportIfInvalid(node.type === "array", node, "collectionFormat");
        }
    }

}

/**
 * Implements the Unknown Header Type rule.
 */
export class OasUnknownHeaderTypeRule extends OasInvalidPropertyValueRule {

    public visitHeader(node: Oas20Header): void {
        if (this.hasValue(node.type)) {
            this.reportIfInvalid(OasValidationRuleUtil.isValidEnumItem(node.type, [ "string", "number", "integer", "boolean", "array" ]), node, "type");
        }
    }

}

/**
 * Implements the Unknown Header Format rule.
 */
export class OasUnknownHeaderFormatRule extends OasInvalidPropertyValueRule {

    public visitHeader(node: Oas20Header): void {
        if (this.hasValue(node.format)) {
            this.reportIfInvalid(OasValidationRuleUtil.isValidEnumItem(node.format, [ "int32", "int64", "float", "double", "byte", "binary", "date", "date-time", "password" ]), node, "format");
        }
    }

}

/**
 * Implements the Unexpected Header Usage of 'collectionFormat' rule.
 */
export class OasUnexpectedHeaderCollectionFormatRule extends OasInvalidPropertyValueRule {

    public visitHeader(node: Oas20Header): void {
        if (this.hasValue(node.collectionFormat)) {
            this.reportIfInvalid(node.type === "array", node, "collectionFormat");
        }
    }

}

/**
 * Implements the Unknown Header Collection Format rule.
 */
export class OasUnknownHeaderCollectionFormatRule extends OasInvalidPropertyValueRule {

    public visitHeader(node: Oas20Header): void {
        if (this.hasValue(node.collectionFormat)) {
            this.reportIfInvalid(OasValidationRuleUtil.isValidEnumItem(node.collectionFormat, [ "csv", "ssv", "tsv", "pipes" ]), node, "collectionFormat");
        }
    }

}

/**
 * Implements the Unexpected XML Wrapping rule.
 */
export class OasUnexpectedXmlWrappingRule extends OasInvalidPropertyValueRule {

    /**
     * Returns true if it's OK to use "wrapped" in the XML node.  It's only OK to do this if
     * the type being defined is an 'array' type.
     * @param xml
     * @return {boolean}
     */
    protected isWrappedOK(xml: Oas20XML | Oas30XML): boolean {
        let schema: Oas20Schema | Oas30Schema = xml.parent() as Oas20Schema | Oas30Schema;
        return schema.type === "array";
    }

    public visitXML(node: Oas20XML): void {
        if (this.hasValue(node.wrapped)) {
            this.reportIfInvalid(this.isWrappedOK(node), node, "wrapped");
        }
    }

}

/**
 * Implements the Unknown Security Scheme Type rule.
 */
export class OasUnknownSecuritySchemeTypeRule extends OasInvalidPropertyValueRule {

    public visitSecurityScheme(node: Oas20SecurityScheme | Oas30SecurityScheme): void {
        if (this.hasValue(node.type)) {
            if (node.ownerDocument().is2xDocument()) {
                this.reportIfInvalid(OasValidationRuleUtil.isValidEnumItem(node.type, [ "apiKey", "basic", "oauth2" ]), node, "type", {
                    options: "basic, apiKey, oauth2"
                });
            } else {
                this.reportIfInvalid(OasValidationRuleUtil.isValidEnumItem(node.type, [ "apiKey", "http", "oauth2", "openIdConnect" ]), node, "type", {
                    options: "http, apiKey, oauth2, openIdConnect"
                });
            }
        }
    }

}

/**
 * Implements the Unknown API-Key Location rule.
 */
export class OasUnknownApiKeyLocationRule extends OasInvalidPropertyValueRule {

    public visitSecurityScheme(node: Oas20SecurityScheme | Oas30SecurityScheme): void {
        if (this.hasValue(node.in)) {
            if (node.ownerDocument().is2xDocument()) {
                this.reportIfInvalid(OasValidationRuleUtil.isValidEnumItem(node.in, [ "query", "header" ]), node, "in", {
                    options: "query, header"
                });
            } else {
                this.reportIfInvalid(OasValidationRuleUtil.isValidEnumItem(node.in, [ "query", "header", "cookie" ]), node, "in", {
                    options: "query, header, cookie"
                });
            }
        }
    }

}

/**
 * Implements the Unknown OAuth Flow Type rule.
 */
export class OasUnknownOauthFlowTypeRule extends OasInvalidPropertyValueRule {

    public visitSecurityScheme(node: Oas20SecurityScheme): void {
        if (this.hasValue(node.flow)) {
            this.reportIfInvalid(OasValidationRuleUtil.isValidEnumItem(node.flow, [ "implicit", "password", "application", "accessCode" ]), node, "flow");
        }
    }

}

/**
 * Implements the Security Requirement Scopes Must Be Empty rule.
 */
export class OasSecurityRequirementScopesMustBeEmptyRule extends OasInvalidPropertyValueRule {

    private findSecurityScheme(document: OasDocument, schemeName: string): Oas20SecurityScheme | Oas30SecurityScheme {
        if (document.is2xDocument()) {
            let doc20: Oas20Document = <Oas20Document>document;
            if (this.hasValue(doc20.securityDefinitions)) {
                return doc20.securityDefinitions.securityScheme(schemeName);
            }
        } else {
            let doc30: Oas30Document = <Oas30Document>document;
            if (this.hasValue(doc30.components)) {
                return doc30.components.getSecurityScheme(schemeName);
            }
        }

        return null;
    }

    public visitSecurityRequirement(node: Oas20SecurityRequirement | Oas30SecurityRequirement): void {
        let allowedTypes: string[] = [ "oauth2" ];
        let options: string = `"oauth2"`;
        if (node.ownerDocument().is3xDocument()) {
            allowedTypes.push("openIdConnect");
            options = `"oauth2" or "openIdConnect"`;
        }
        let snames: string[] = node.securityRequirementNames();
        snames.forEach( sname => {
            let scheme: Oas20SecurityScheme | Oas30SecurityScheme = this.findSecurityScheme(node.ownerDocument(), sname);
            if (this.hasValue(scheme)) {
                if (allowedTypes.indexOf(scheme.type) === -1) {
                    let scopes: string[] = node.scopes(sname);
                    this.reportIfInvalid(this.hasValue(scopes) && scopes.length === 0, node, null, {
                        sname: sname,
                        options: options
                    });
                }
            }
        });
    }

}

/**
 * Implements the Unexpected Security Requirement Scope(s) rule.
 */
export class OasUnexpectedSecurityRequirementScopesRule extends OasInvalidPropertyValueRule {

    /**
     * Returns true if the given required scopes are all actually defined by the security definition.
     * @param requiredScopes
     * @param definedScopes
     */
    protected isValidScopes(requiredScopes: string[], definedScopes: Oas20Scopes) {
        let rval: boolean = true;
        let dscopes: string[] = [];
        if (definedScopes) {
            dscopes = definedScopes.scopes();
        }
        requiredScopes.forEach( requiredScope => {
            if (dscopes.indexOf(requiredScope) === -1) {
                rval = false;
            }
        });
        return rval;
    }

    public visitSecurityRequirement(node: Oas20SecurityRequirement): void {
        let snames: string[] = node.securityRequirementNames();
        snames.forEach( sname => {
            let sdefs: Oas20SecurityDefinitions = (node.ownerDocument() as Oas20Document).securityDefinitions;
            if (this.hasValue(sdefs)) {
                let scheme: Oas20SecurityScheme = (node.ownerDocument() as Oas20Document).securityDefinitions.securityScheme(sname);
                if (this.hasValue(scheme)) {
                    if (scheme.type === "oauth2") {
                        let definedScopes: Oas20Scopes = scheme.scopes;
                        let requiredScopes: string[] = node.scopes(sname);
                        this.reportIfInvalid(this.isValidScopes(requiredScopes, definedScopes), node, null, {
                            sname: sname
                        });
                    }
                }
            }
        });
    }

}


/**
 * Implements the Unexpected Header Usage rule.
 */
export class OasUnexpectedHeaderUsageRule extends OasInvalidPropertyValueRule {

    public visitEncoding(node: Oas30Encoding): void {
        if (node.getHeaders().length > 0) {
            let mediaType: Oas30MediaType = node.parent() as Oas30MediaType;
            this.reportIfInvalid(mediaType.name().indexOf("multipart") === 0, node, "headers", {
                name: mediaType.name()
            });
        }
    }

}

/**
 * Implements the Encoding Style Not Allowed rule.
 */
export class OasEncodingStyleNotAllowedRule extends OasInvalidPropertyValueRule {

    public visitEncoding(node: Oas30Encoding): void {
        if (this.hasValue(node.style)) {
            let mediaType: Oas30MediaType = node.parent() as Oas30MediaType;
            this.reportIfInvalid(mediaType.name().indexOf("application/x-www-form-urlencoded") === 0, node, "style", {
                name: mediaType.name()
            });
        }
    }

}

/**
 * Implements the Explode Not Allowed rule.
 */
export class OasExplodeNotAllowedRule extends OasInvalidPropertyValueRule {

    public visitEncoding(node: Oas30Encoding): void {
        if (this.hasValue(node.explode)) {
            let mediaType: Oas30MediaType = node.parent() as Oas30MediaType;
            this.reportIf(mediaType.name() !== "application/x-www-form-urlencoded", node, "explode", {
                name: mediaType.name()
            });
        }
    }

}

/**
 * Implements the Allow Reserved Not Allowed rule.
 */
export class OasAllowReservedNotAllowedRule extends OasInvalidPropertyValueRule {

    public visitEncoding(node: Oas30Encoding): void {
        if (this.hasValue(node.allowReserved)) {
            let mediaType: Oas30MediaType = node.parent() as Oas30MediaType;
            this.reportIf(mediaType.name() !== "application/x-www-form-urlencoded", node, "allowReserved", {
                name: mediaType.name()
            });
        }
    }

}

/**
 * Implements the Unknown Encoding Style rule.
 */
export class OasUnknownEncodingStyleRule extends OasInvalidPropertyValueRule {

    public visitEncoding(node: Oas30Encoding): void {
        if (this.hasValue(node.style)) {
            let valid = OasValidationRuleUtil.isValidEnumItem(node.style, ["form", "spaceDelimited", "pipeDelimited", "deepObject"]);
            this.reportIfInvalid(valid, node, "style");
        }
    }

}


export class OasInvalidHeaderStyleRule extends OasInvalidPropertyValueRule {

    public visitHeader(node: Oas30Header): void {
        if (this.hasValue(node.style)) {
            this.reportIfInvalid(OasValidationRuleUtil.isValidEnumItem(node.style, ["simple"]), node, "style");
        }
    }
    public visitHeaderDefinition(node: Oas30HeaderDefinition): void {
        this.visitHeader(node);
    }

}

export class OasUnexpectedNumberOfHeaderMTsRule extends OasInvalidPropertyValueRule {

    public visitHeader(node: Oas30Header): void {
        this.reportIfInvalid(node.getMediaTypes().length < 2, node, "content");
    }
    public visitHeaderDefinition(node: Oas30HeaderDefinition): void {
        this.visitHeader(node);
    }

}

export class OasInvalidLinkOperationIdRule extends OasInvalidPropertyValueRule {

    // TODO move this to the invalid reference section
    public visitLink(node: Oas30Link): void {
        if (this.hasValue(node.operationId)) {
            let opFinder: Oas30OperationFinder = new Oas30OperationFinder(node.operationId);
            OasVisitorUtil.visitTree(node.ownerDocument(), opFinder);
            this.reportIfInvalid(opFinder.isFound(), node, "operationId");
        }
    }
    public visitLinkDefinition(node: Oas30LinkDefinition): void {
        this.visitLink(node);
    }

}

export class OasInvalidEncodingForMPMTRule extends OasInvalidPropertyValueRule {

    public visitMediaType(node: Oas30MediaType): void {
        if (node.getEncodings().length > 0) {
            this.reportIfInvalid(this.isValidMultipartType(node.name()), node, "encoding", {
                name: node.name()
            });
        }
    }

}

export class OasUnexpectedRequestBodyRule extends OasInvalidPropertyValueRule {

    /**
     * Returns true if the given operation is one of:  POST, PUT, OPTIONS
     * @param {Oas30Operation} operation
     * @return {boolean}
     */
    protected isValidRequestBodyOperation(operation: Oas30Operation): boolean {
        let method: string = operation.method();
        return method === "put" || method === "post" || method === "options" || method === "patch";
    }

    public visitOperation(node: Oas30Operation): void {
        if (this.hasValue(node.requestBody)) {
            this.reportIfInvalid(this.isValidRequestBodyOperation(node), node, "requestBody", {
                method: node.method().toUpperCase()
            });
        }
    }

}

export class OasMissingPathParamDefinitionRule extends OasInvalidPropertyValueRule {

    private pathItemsWithError: string[] = [];

    public visitPathItem(node: Oas30PathItem): void {
        if (!this.isPathWellFormed(node.path())) {
            this.pathItemsWithError.push(node.path());
        }
    }
    public visitOperation(node: Oas30Operation): void {
        // Perform operation level checks only if there are no issues at the pathItem level.
        if (this.pathItemsWithError.indexOf((<Oas30PathItem>node.parent()).path()) !== -1) {
            return;
        }
        // Check parameters are unique within operation
        const mergedParameters = this.mergeParameters(node);
        let pathItem: Oas30PathItem = node.parent() as Oas30PathItem;
        let path: string = pathItem.path();
        let pathSegs: PathSegment[] = this.getPathSegments(path);
        // Report all the path segments that don't have an associated parameter definition
        pathSegs.filter(pathSeg => {
            return pathSeg.formalName !== undefined;
        }).forEach(pathSeg => {
            let valid: boolean = mergedParameters.filter((param) => { return pathSeg.formalName === param.name && param.in === 'path'; }).length > 0;
            this.reportIfInvalid(valid, node,null, {
                param: pathSeg.formalName,
                path: path,
                method: node.method().toUpperCase()
            });
        });
    }

}

export class OasMissingResponseForOperationRule extends OasInvalidPropertyValueRule {

    public visitResponses(node: Oas30Responses): void {
        this.reportIfInvalid(node.responses().length > 0, node.parent(), null);
    }

}

export class OasUnknownParamStyleRule extends OasInvalidPropertyValueRule {

    public visitParameter(node: Oas30Parameter): void {
        if (this.hasValue(node.style)) {
            this.reportIfInvalid(OasValidationRuleUtil.isValidEnumItem(node.style, ["matrix", "label", "form", "simple", "spaceDelimited", "pipeDelimited", "deepObject"]), node, "style", {
                style: node.style
            });
        }
    }
    public visitParameterDefinition(node: Oas30ParameterDefinition): void {
        this.visitParameter(node);
    }

}

export class OasUnknownQueryParamStyleRule extends OasInvalidPropertyValueRule {

    public visitParameter(node: Oas30Parameter): void {
        if (this.hasValue(node.style)) {
            if (node.in === "query") {
                this.reportIfInvalid(OasValidationRuleUtil.isValidEnumItem(node.style, ["form", "spaceDelimited", "pipeDelimited", "deepObject"]), node, "style", {
                    style: node.style
                });
            }
        }
    }
    public visitParameterDefinition(node: Oas30ParameterDefinition): void {
        this.visitParameter(node);
    }

}

export class OasUnknownCookieParamStyleRule extends OasInvalidPropertyValueRule {

    public visitParameter(node: Oas30Parameter): void {
        if (this.hasValue(node.style)) {
            if (node.in === "cookie") {
                this.reportIfInvalid(OasValidationRuleUtil.isValidEnumItem(node.style, ["form"]), node, "style", {
                    style: node.style
                });
            }
        }
    }
    public visitParameterDefinition(node: Oas30ParameterDefinition): void {
        this.visitParameter(node);
    }

}

export class OasUnknownHeaderParamStyleRule extends OasInvalidPropertyValueRule {

    public visitParameter(node: Oas30Parameter): void {
        if (this.hasValue(node.style)) {
            if (node.in === "header") {
                this.reportIfInvalid(OasValidationRuleUtil.isValidEnumItem(node.style, ["simple"]), node, "style", {
                    style: node.style
                });
            }
        }
    }
    public visitParameterDefinition(node: Oas30ParameterDefinition): void {
        this.visitParameter(node);
    }

}

export class OasUnknownPathParamStyleRule extends OasInvalidPropertyValueRule {

    public visitParameter(node: Oas30Parameter): void {
        if (node.in === "path") {
            if (this.hasValue(node.style)) {
                this.reportIfInvalid(OasValidationRuleUtil.isValidEnumItem(node.style, ["matrix", "label", "simple"]), node, "style", {
                    style: node.style
                });
            }
        }
    }
    public visitParameterDefinition(node: Oas30ParameterDefinition): void {
        this.visitParameter(node);
    }

}

export class OasAllowReservedNotAllowedForParamRule extends OasInvalidPropertyValueRule {

    public visitParameter(node: Oas30Parameter): void {
        if (this.hasValue(node.allowReserved)) {
            this.reportIfInvalid(node.in === "query", node, "allowReserved");
        }
    }
    public visitParameterDefinition(node: Oas30ParameterDefinition): void {
        this.visitParameter(node);
    }

}

export class OasUnexpectedNumOfParamMTsRule extends OasInvalidPropertyValueRule {

    public visitParameter(node: Oas30Parameter): void {
        if (this.hasValue(node.content)) {
            this.reportIfInvalid(node.getMediaTypes().length < 2, node, "content");
        }
    }
    public visitParameterDefinition(node: Oas30ParameterDefinition): void {
        this.visitParameter(node);
    }

}

export class OasUnexpectedUsageOfDiscriminatorRule extends OasInvalidPropertyValueRule {

    public visitDiscriminator(node: Oas30Discriminator): void {
        let schema: Oas30Schema = node.parent() as Oas30Schema;
        let valid: boolean = this.hasValue(schema.oneOf) || this.hasValue(schema.anyOf) || this.hasValue(schema.allOf);
        this.reportIfInvalid(valid, node, "discriminator");
    }

}

export class OasInvalidHttpSecuritySchemeTypeRule extends OasInvalidPropertyValueRule {

    public visitSecurityScheme(node: Oas30SecurityScheme): void {
        if (this.hasValue(node.scheme)) {
            this.reportIfInvalid(OasValidationRuleUtil.isValidEnumItem(node.scheme, ["basic", "bearer", "digest", "hoba", "mutual", "negotiate", "oauth", "vapid", "scram-sha-1", "scram-sha-256"]), node, "scheme", {
                scheme: node.scheme
            });
        }
    }

}

export class OasUnexpectedUsageOfBearerTokenRule extends OasInvalidPropertyValueRule {

    public visitSecurityScheme(node: Oas30SecurityScheme): void {
        if (this.hasValue(node.bearerFormat)) {
            this.reportIfInvalid(node.type === "http" && node.scheme === "bearer", node, "bearerFormat");
        }
    }

}

export class OasInvalidSecurityReqScopesRule extends OasInvalidPropertyValueRule {

    public visitSecurityRequirement(node: Oas30SecurityRequirement): void {
        let snames: string[] = node.securityRequirementNames();
        snames.forEach( sname => {
            let scopes: string[] = node.scopes(sname);
            this.reportIfInvalid(this.hasValue(scopes) && Array.isArray(scopes), node, sname, {
                name: sname
            });
        });
    }

}

export class OasServerVarNotFoundInTemplateRule extends OasInvalidPropertyValueRule {

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

    public visitServerVariable(node: Oas30ServerVariable): void {
        let varName: string = node.name();
        let server: Oas30Server = node.parent() as Oas30Server;
        let vars: string[] = this.parseServerTemplate(server.url);

        this.reportIfInvalid(OasValidationRuleUtil.isValidEnumItem(varName, vars), node, null, {
            name: varName
        });
    }

}
