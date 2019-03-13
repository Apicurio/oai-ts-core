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

import { Oas20PathValidationRule, Oas20ValidationRule } from "./common.rule"
import {Oas20Parameter} from "../../models/2.0/parameter.model";
import {Oas20SecurityScheme} from "../../models/2.0/security-scheme.model";
import {Oas20SecurityRequirement} from "../../models/2.0/security-requirement.model";
import {Oas20Document} from "../../models/2.0/document.model";
import {Oas20Operation} from "../../models/2.0/operation.model";
import {Oas20Items} from "../../models/2.0/items.model";
import {Oas20Header} from "../../models/2.0/header.model";
import {Oas20XML} from "../../models/2.0/xml.model";
import {Oas20PathItem} from "../../models/2.0/path-item.model";
import {Oas20Schema} from "../../models/2.0/schema.model";
import {Oas20SecurityDefinitions} from "../../models/2.0/security-definitions.model";
import {Oas20Scopes} from "../../models/2.0/scopes.model";
import { OasValidationRuleUtil, PathSegment } from "../validation"

/**
 * Implements the Invalid Property Value validation rule.  This rule is responsible
 * for reporting whenever the **value** of a property fails to conform to requirements
 * outlined by the specification.  This is typically things like enums, where the
 * *format* of the value is fine (e.g. correct data-type) but the valid is somehow
 * invalid.
 */
export class Oas20InvalidPropertyValueValidationRule extends Oas20PathValidationRule {

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
        let segments: string[] = pathTemplate.split("{");
        return segments.filter( (segment, idx) => {
            return idx > 0 && segment.indexOf("}") !== -1;
        }).map( segment => {
            return segment.substring(0, segment.indexOf("}")).trim();
        });
    }

    /**
     * Returns true if it's OK to use "wrapped" in the XML node.  It's only OK to do this if
     * the type being defined is an 'array' type.
     * @param xml
     * @return {boolean}
     */
    private isWrappedOK(xml: Oas20XML): boolean {
        let schema: Oas20Schema = xml.parent() as Oas20Schema;
        return schema.type === "array";
    }

    /**
     * Returns true if the given required scopes are all actually defined by the security definition.
     * @param requiredScopes
     * @param definedScopes
     */
    private isValidScopes(requiredScopes: string[], definedScopes: Oas20Scopes) {
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

    public visitDocument(node: Oas20Document): void {
        if (this.hasValue(node.schemes)) {
            node.schemes.forEach(scheme => {
                this.reportIfInvalid("R-006", OasValidationRuleUtil.isValidEnumItem(scheme, ["http", "https", "ws", "wss"]), node, "schemes",
                    `API scheme "${scheme}" not allowed.  Must be one of: http, https, ws, wss`);
            });
        }
        if (this.hasValue(node.consumes)) {
            this.reportIfInvalid("R-007", OasValidationRuleUtil.isValidMimeType(node.consumes), node, "consumes", 
                `API "consumes" must be a valid mime-type.`);
        }
        if (this.hasValue(node.produces)) {
            this.reportIfInvalid("R-008", OasValidationRuleUtil.isValidMimeType(node.produces), node, "produces",
                `API "produces" must be a valid mime-type.`);
        }
    }

    public visitOperation(node: Oas20Operation): void {
        if (this.hasValue(node.summary)) {
            this.reportIfInvalid("OP-001", node.summary.length < 120, node, "summary",
                `Operation Summary should be less than 120 characters.`);
        }
        if (this.hasValue(node.operationId)) {
            this.reportIfInvalid("OP-004", this.isValidOperationId(node.operationId), node, "operationId", 
                `Operation ID is an invalid format..`);
        }
        if (this.hasValue(node.schemes)) {
            node.schemes.forEach( scheme => {
                this.reportIfInvalid("OP-010", OasValidationRuleUtil.isValidEnumItem(scheme, ["http", "https", "ws", "wss"]), node, "schemes",
                    `Operation scheme "${scheme}" not allowed.  Must be one of: http, https, ws, wss`);
            });
        }
    }

    public visitParameter(node: Oas20Parameter): void {
        // Note: parent may be an operation *or* a path-item.
        if (node.in === "path") {
            let pathItem: Oas20PathItem;
            if (node.parent()["_path"]) {
                pathItem = node.parent() as Oas20PathItem;
            } else {
                pathItem = node.parent().parent() as Oas20PathItem;
            }
            let path: string = pathItem.path();
            let pathSegs: PathSegment[] = this.getPathSegments(path);
            this.reportIfInvalid("PAR-007", pathSegs.filter(pathSeg => pathSeg.formalName === node.name).length > 0, node, "name",
                `Path Parameter "${node.name}" not found in path template.`);
        }

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
            this.reportIfInvalid("PAR-008", valid, node, "consumes",
                `Form Data Parameters are only used in 'application/x-www-form-urlencoded' or 'multipart/form-data' requests.`);
        }

        if (this.hasValue(node.in)) {
            this.reportIfInvalid("PAR-009", OasValidationRuleUtil.isValidEnumItem(node.in, [ "query", "header", "path", "formData", "body" ]), node, "in",
                `Parameters can only be found in one of: query, header, path, formData, body`);
        }

        if (this.hasValue(node.type)) {
            this.reportIfInvalid("PAR-011", OasValidationRuleUtil.isValidEnumItem(node.type, [ "string", "number", "integer", "boolean", "array", "file" ]), node, "type",
                `Parameter types are limited to: string, number, integer, boolean, array, file`);
        }

        if (this.hasValue(node.format)) {
            this.reportIfInvalid("PAR-012", OasValidationRuleUtil.isValidEnumItem(node.format, [ "int32", "int64", "float", "double", "byte", "binary", "date", "date-time", "password" ]), node, "format",
                `Parameter Format must be one of: int32, int64, float, double, byte, binary, date, date-time, password`);
        }

        if (this.hasValue(node.allowEmptyValue)) {
            this.reportIfInvalid("PAR-013", OasValidationRuleUtil.isValidEnumItem(node.in, [ "query", "formData" ]), node, "allowEmptyValue",
                `Allow Empty Value is not allowed (only for Query and Form Data params).`);
        }

        if (this.hasValue(node.collectionFormat)) {
            this.reportIfInvalid("PAR-014", node.type === "array", node, "collectionFormat",
                `The "collectionFormat" property is only allowed for 'array' type parameters.`);
        }

        if (this.hasValue(node.collectionFormat)) {
            this.reportIfInvalid("PAR-015", OasValidationRuleUtil.isValidEnumItem(node.collectionFormat, [ "csv", "ssv", "tsv", "pipes", "multi" ]), node, "collectionFormat",
                `Parameter Collection Format must be one of: csv, ssv, tsv, pipes, multi`);
        }

        if (node.collectionFormat === "multi") {
            this.reportIfInvalid("PAR-016", OasValidationRuleUtil.isValidEnumItem(node.in, [ "query", "formData" ]), node, "collectionFormat",
                `Parameter Collection Format can only be "multi" for Query and Form Data parameters.`);
        }

        if (this.hasValue(node.default)) {
            this.reportIfInvalid("PAR-017", node.required === undefined || node.required === null || node.required === false, node, "default",
                `Required Parameters can not have a default value.`);
        }

    }

    public visitItems(node: Oas20Items): void {
        if (this.hasValue(node.type)) {
            this.reportIfInvalid("IT-003", OasValidationRuleUtil.isValidEnumItem(node.type, [ "string", "number", "integer", "boolean", "array" ]), node, "type",
                `Schema Items Type must be one of: string, number, integer, boolean, array`);
        }

        if (this.hasValue(node.format)) {
            this.reportIfInvalid("IT-004", OasValidationRuleUtil.isValidEnumItem(node.format, [ "int32", "int64", "float", "double", "byte", "binary", "date", "date-time", "password" ]), node, "format",
                `Schema Items Format must be one of: int32, int64, float, double, byte, binary, date, date-time, password`);
        }

        if (this.hasValue(node.collectionFormat)) {
            this.reportIfInvalid("IT-005", OasValidationRuleUtil.isValidEnumItem(node.collectionFormat, [ "csv", "ssv", "tsv", "pipes" ]), node, "collectionFormat",
                `Schema Items Collection Format must be one of: csv, ssv, tsv, pipes`);
        }

        if (this.hasValue(node.collectionFormat)) {
            this.reportIfInvalid("IT-006", node.type === "array", node, "collectionFormat",
                `Schema Items Collection Format is only allowed for Array style parameters.`);
        }

    }

    public visitHeader(node: Oas20Header): void {
        if (this.hasValue(node.type)) {
            this.reportIfInvalid("HEAD-003", OasValidationRuleUtil.isValidEnumItem(node.type, [ "string", "number", "integer", "boolean", "array" ]), node, "type",
                `Header Type must be one of: string, number, integer, boolean, array`);
        }

        if (this.hasValue(node.format)) {
            this.reportIfInvalid("HEAD-004", OasValidationRuleUtil.isValidEnumItem(node.format, [ "int32", "int64", "float", "double", "byte", "binary", "date", "date-time", "password" ]), node, "format",
                `Header Format must be one of: int32, int64, float, double, byte, binary, date, date-time, password`);
        }

        if (this.hasValue(node.collectionFormat)) {
            this.reportIfInvalid("HEAD-006", node.type === "array", node, "collectionFormat",
                `Header Collection Format is only allowed for "array" type headers.`);
        }

        if (this.hasValue(node.collectionFormat)) {
            this.reportIfInvalid("HEAD-007", OasValidationRuleUtil.isValidEnumItem(node.collectionFormat, [ "csv", "ssv", "tsv", "pipes" ]), node, "collectionFormat",
                `Header Collection Format must be one of: csv, ssv, tsv, pipes`);
        }
    }

    public visitXML(node: Oas20XML): void {
        if (this.hasValue(node.wrapped)) {
            this.reportIfInvalid("XML-002", this.isWrappedOK(node), node, "wrapped",
                `XML Wrapped elements can only be used for "array" properties.`);
        }
    }

    public visitSecurityScheme(node: Oas20SecurityScheme): void {
        if (this.hasValue(node.type)) {
            this.reportIfInvalid("SS-008", OasValidationRuleUtil.isValidEnumItem(node.type, [ "apiKey", "basic", "oauth2" ]), node, "type",
                `Security Scheme Type must be one of: basic, apiKey, oauth2`);
        }

        if (this.hasValue(node.in)) {
            this.reportIfInvalid("SS-009", OasValidationRuleUtil.isValidEnumItem(node.in, [ "query", "header" ]), node, "in",
                `API Key Security Scheme must be located "in" one of: query, header`);
        }

        if (this.hasValue(node.flow)) {
            this.reportIfInvalid("SS-010", OasValidationRuleUtil.isValidEnumItem(node.flow, [ "implicit", "password", "application", "accessCode" ]), node, "flow",
                `OAuth Security Scheme "flow" must be one of: implicit, password, application, accessCode`);
        }
    }

    public visitSecurityRequirement(node: Oas20SecurityRequirement): void {
        let snames: string[] = node.securityRequirementNames();
        snames.forEach( sname => {
            let sdefs: Oas20SecurityDefinitions = (node.ownerDocument() as Oas20Document).securityDefinitions;
            if (this.hasValue(sdefs)) {
                let scheme: Oas20SecurityScheme = (node.ownerDocument() as Oas20Document).securityDefinitions.securityScheme(sname);
                if (this.hasValue(scheme)) {
                    if (scheme.type !== "oauth2") {
                        let scopes: string[] = node.scopes(sname);
                        this.reportIfInvalid("SREQ-002", this.hasValue(scopes) && scopes.length === 0, node, null,
                            `Security Requirement '${sname}' scopes must be an empty array because the referenced Security Definition not "oauth2".`);
                    } else {
                        let definedScopes: Oas20Scopes = scheme.scopes;
                        let requiredScopes: string[] = node.scopes(sname);
                        this.reportIfInvalid("SREQ-003", this.isValidScopes(requiredScopes, definedScopes), node, null,
                            `Security Requirement '${sname}' scopes must be an array of values from the possible scopes defined by the referenced Security Definition.`);
                    }
                }
            }
        });
    }

}
