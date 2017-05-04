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

import {Oas20ValidationRule} from "./common.rule";
import {OasNode} from "../../models/node.model";
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

/**
 * Implements the Invalid Property Value validation rule.  This rule is responsible
 * for reporting whenever the **value** of a property fails to conform to requirements
 * outlined by the specification.  This is typically things like enums, where the
 * *format* of the value is fine (e.g. correct data-type) but the valid is somehow
 * invalid.
 */
export class Oas20InvalidPropertyValueValidationRule extends Oas20ValidationRule {

    /**
     * Reports a validation error if the property is not valid.
     * @param code
     * @param isValid
     * @param node
     * @param message
     */
    private reportIfInvalid(code: string, isValid: boolean, node: OasNode, message: string): void {
        if (!isValid) {
            this.report(code, node, message);
        }
    }

    /**
     * Returns true only if the given value is a valid mime-type.
     * @param propertyValue
     * @return {boolean}
     */
    private isValidMimeType(propertyValue: string[]): boolean {
        let mt: RegExp = /^.*\/.*(;.*)?$/;
        for (let v of propertyValue) {
            if (!mt.test(v)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Returns true if the given value is an item in the enum list.
     * @param value
     * @param items
     */
    private isValidEnumItem(value: string, items: string[]): boolean {
        return items.indexOf(value) != -1;
    }

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
     * Returns true if it's OK to use "wrapped" in the XML node.  It's only OK to do this if
     * the type being defined is an 'array' type.
     * @param xml
     * @return {boolean}
     */
    private isWrappedOK(xml: Oas20XML): boolean {
        let schema: Oas20Schema = <Oas20Schema>xml.parent();
        return schema.type === "array";
    }

    /**
     * Returns true if the given required scopes are all actually defined by the security definition.
     * @param requiredScopes
     * @param definedScopes
     */
    private isValidScopes(requiredScopes: string[], definedScopes: Oas20Scopes) {
        let rval: boolean = true;
        let dscopes: string[] = definedScopes.scopes();
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
                this.reportIfInvalid("R-006", this.isValidEnumItem(scheme, ["http", "https", "ws", "wss"]), node,
                    "Invalid property value.  Each \"schemes\" property value must be one of: http, https, ws, wss (Invalid value found: '" + scheme + "')");
            });
        }
        if (this.hasValue(node.consumes)) {
            this.reportIfInvalid("R-007", this.isValidMimeType(node.consumes), node, "Invalid property value.  The \"consumes\" property value must be a valid mime-type.");
        }
        if (this.hasValue(node.produces)) {
            this.reportIfInvalid("R-008", this.isValidMimeType(node.produces), node, "Invalid property value.  The \"produces\" property value must be a valid mime-type.");
        }
    }

    public visitOperation(node: Oas20Operation): void {
        if (this.hasValue(node.summary)) {
            this.reportIfInvalid("OP-001", node.summary.length < 120, node, "The \"summary\" property value should be less than 120 characters long.");
        }
        if (this.hasValue(node.operationId)) {
            this.reportIfInvalid("OP-004", this.isValidOperationId(node.operationId), node, "The \"operationId\" property value is invalid - it should be simple *camelCase* format.");
        }
        if (this.hasValue(node.schemes)) {
            node.schemes.forEach( scheme => {
                this.reportIfInvalid("OP-010", this.isValidEnumItem(scheme, ["http", "https", "ws", "wss"]), node,
                    "Invalid property value.  Each \"schemes\" property value must be one of: http, https, ws, wss (Invalid value found: '" + scheme + "')");
            });
        }
    }

    public visitParameter(node: Oas20Parameter): void {
        // Note: parent may be an operation *or* a path-item.
        if (node.in === "path") {
            let pathItem: Oas20PathItem;
            if (node.parent()["_path"]) {
                pathItem = <Oas20PathItem>(node.parent());
            } else {
                pathItem = <Oas20PathItem>(node.parent().parent());
            }
            let path: string = pathItem.path();
            let pathVars: string[] = this.parsePathTemplate(path);
            this.reportIfInvalid("PAR-007", this.isValidEnumItem(node.name, pathVars), node,
                "The \"name\" property value for a 'path' style parameter must match one of the items in the path template.  Invalid path property name found: " + node.name);
        }

        if (node.in === "formData") {
            let consumes: string[] = (<Oas20Document>(node.ownerDocument())).consumes;
            if (!node.parent()["_path"]) {
                let operation: Oas20Operation = <Oas20Operation>(node.parent());
                if (this.hasValue(operation.consumes)) {
                    consumes = operation.consumes;
                }
            }
            if (!this.hasValue(consumes)) {
                consumes = [];
            }
            let valid: boolean = consumes.indexOf("application/x-www-form-urlencoded") >= 0 || consumes.indexOf("multipart/form-data") >= 0;
            this.reportIfInvalid("PAR-008", valid, node, "A parameter located in \"formData\" may only be used when the operation @consumes 'application/x-www-form-urlencoded' or 'multipart/form-data' data.");
        }

        if (this.hasValue(node.in)) {
            this.reportIfInvalid("PAR-009", this.isValidEnumItem(node.in, [ "query", "header", "path", "formData", "body" ]), node,
                "Invalid property value.  The \"in\" property value must be one of: query, header, path, formData, body (Found value: '" + node.in + "')");
        }

        if (this.hasValue(node.type)) {
            this.reportIfInvalid("PAR-011", this.isValidEnumItem(node.type, [ "string", "number", "integer", "boolean", "array", "file" ]), node,
                "Invalid property value.  The \"type\" property value must be one of: string, number, integer, boolean, array, file (Found value: '" + node.type + "')");
        }

        if (this.hasValue(node.format)) {
            this.reportIfInvalid("PAR-012", this.isValidEnumItem(node.format, [ "int32", "int64", "float", "double", "byte", "binary", "date", "date-time", "password" ]), node,
                "Invalid property value.  The \"format\" property value must be one of: int32, int64, float, double, byte, binary, date, date-time, password (Found value: '" + node.format + "')");
        }

        if (this.hasValue(node.allowEmptyValue)) {
            this.reportIfInvalid("PAR-013", this.isValidEnumItem(node.in, [ "query", "formData" ]), node,
                "The \"allowEmptyValue\" property is only allowed for 'query' or 'formData' parameters.");
        }

        if (this.hasValue(node.collectionFormat)) {
            this.reportIfInvalid("PAR-014", node.type === "array", node,
                "The \"collectionFormat\" property is only allowed for 'array' type parameters.");
        }

        if (this.hasValue(node.collectionFormat)) {
            this.reportIfInvalid("PAR-015", this.isValidEnumItem(node.collectionFormat, [ "csv", "ssv", "tsv", "pipes", "multi" ]), node,
                "Invalid property value.  The \"collectionFormat\" property value must be one of: csv, ssv, tsv, pipes, multi (Found value: '" + node.collectionFormat + "')");
        }

        if (node.collectionFormat === "multi") {
            this.reportIfInvalid("PAR-016", this.isValidEnumItem(node.in, [ "query", "formData" ]), node,
                "Invalid property value.  The \"collectionFormat\" property value can only be 'multi' for 'query' or 'formData' parameters.");
        }

        if (this.hasValue(node.default)) {
            this.reportIfInvalid("PAR-017", node.required === undefined || node.required === null || node.required === false, node,
                "Invalid property value.  The \"default\" property is not valid when the parameter is required.");
        }

    }

    public visitItems(node: Oas20Items): void {
        if (this.hasValue(node.type)) {
            this.reportIfInvalid("IT-003", this.isValidEnumItem(node.type, [ "string", "number", "integer", "boolean", "array" ]), node,
                "Invalid property value.  The \"type\" property value must be one of: string, number, integer, boolean, array (Found value: '" + node.type + "')");
        }

        if (this.hasValue(node.format)) {
            this.reportIfInvalid("IT-004", this.isValidEnumItem(node.format, [ "int32", "int64", "float", "double", "byte", "binary", "date", "date-time", "password" ]), node,
                "Invalid property value.  The \"format\" property value must be one of: int32, int64, float, double, byte, binary, date, date-time, password (Found value: '" + node.format + "')");
        }

        if (this.hasValue(node.collectionFormat)) {
            this.reportIfInvalid("IT-005", this.isValidEnumItem(node.collectionFormat, [ "csv", "ssv", "tsv", "pipes" ]), node,
                "Invalid property value.  The \"collectionFormat\" property value must be one of: csv, ssv, tsv, pipes (Found value: '" + node.collectionFormat + "')");
        }

        if (this.hasValue(node.collectionFormat)) {
            this.reportIfInvalid("IT-006", node.type === "array", node,
                "The \"collectionFormat\" property is only allowed for 'array' type parameters.");
        }

    }

    public visitHeader(node: Oas20Header): void {
        if (this.hasValue(node.type)) {
            this.reportIfInvalid("HEAD-003", this.isValidEnumItem(node.type, [ "string", "number", "integer", "boolean", "array" ]), node,
                "Invalid property value.  The \"type\" property value must be one of: string, number, integer, boolean, array (Found value: '" + node.type + "')");
        }

        if (this.hasValue(node.format)) {
            this.reportIfInvalid("HEAD-004", this.isValidEnumItem(node.format, [ "int32", "int64", "float", "double", "byte", "binary", "date", "date-time", "password" ]), node,
                "Invalid property value.  The \"format\" property value must be one of: int32, int64, float, double, byte, binary, date, date-time, password (Found value: '" + node.format + "')");
        }

        if (this.hasValue(node.collectionFormat)) {
            this.reportIfInvalid("HEAD-006", node.type === "array", node,
                "The \"collectionFormat\" property is only allowed for 'array' type headers.");
        }

        if (this.hasValue(node.collectionFormat)) {
            this.reportIfInvalid("HEAD-007", this.isValidEnumItem(node.collectionFormat, [ "csv", "ssv", "tsv", "pipes" ]), node,
                "Invalid property value.  The \"collectionFormat\" property value must be one of: csv, ssv, tsv, pipes (Found value: '" + node.collectionFormat + "')");
        }
    }

    public visitXML(node: Oas20XML): void {
        if (this.hasValue(node.wrapped)) {
            this.reportIfInvalid("XML-002", this.isWrappedOK(node), node,
                "The \"wrapped\" property is only valid for 'array' types.");
        }
    }

    public visitSecurityScheme(node: Oas20SecurityScheme): void {
        if (this.hasValue(node.type)) {
            this.reportIfInvalid("SS-008", this.isValidEnumItem(node.type, [ "apiKey", "basic", "oauth2" ]), node,
                "Invalid property value.  The \"type\" property value must be one of: basic, apiKey, oauth2 (Found value: '" + node.type + "')");
        }

        if (this.hasValue(node.in)) {
            this.reportIfInvalid("SS-009", this.isValidEnumItem(node.in, [ "query", "header" ]), node,
                "Invalid property value.  The \"in\" property value must be one of: query, header (Found value: '" + node.in + "')");
        }

        if (this.hasValue(node.flow)) {
            this.reportIfInvalid("SS-010", this.isValidEnumItem(node.flow, [ "implicit", "password", "application", "accessCode" ]), node,
                "Invalid property value.  The \"flow\" property value must be one of: implicit, password, application, accessCode (Found value: '" + node.flow + "')");
        }
    }

    public visitSecurityRequirement(node: Oas20SecurityRequirement): void {
        let snames: string[] = node.securityRequirementNames();
        snames.forEach( sname => {
            let sdefs: Oas20SecurityDefinitions = (<Oas20Document>node.ownerDocument()).securityDefinitions;
            if (this.hasValue(sdefs)) {
                let scheme: Oas20SecurityScheme = (<Oas20Document>node.ownerDocument()).securityDefinitions.securityScheme(sname);
                if (this.hasValue(scheme)) {
                    if (scheme.type !== "oauth2") {
                        let scopes: string[] = node.scopes(sname);
                        this.reportIfInvalid("SREQ-002", this.hasValue(scopes) && scopes.length === 0, node,
                            "Security Requirement '" + sname + "' field value must be an empty array because the referenced Security Definition \"type\" is not 'oauth2'.");
                    } else {
                        let definedScopes: Oas20Scopes = scheme.scopes;
                        let requiredScopes: string[] = node.scopes(sname);
                        this.reportIfInvalid("SREQ-003", this.isValidScopes(requiredScopes, definedScopes), node,
                            "Security Requirement '" + sname + "' field value must be an array of scopes from the possible scopes defined by the referenced Security Definition.");
                    }
                }
            }
        });
    }

}