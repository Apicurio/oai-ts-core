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

import {OasNodePath} from "../models/node-path";
import {OasNode} from "../models/node.model";
import {Oas20NodeVisitorAdapter} from "../visitors/visitor.base";
import {Oas20Schema} from "../models/2.0/schema.model";
import {Oas20Items} from "../models/2.0/items.model";
import {Oas20InvalidPropertyNameValidationRule} from "./2.0/invalid-property-name.rule";

/**
 * Interface used by validation rules to report errors.
 */
export interface IOasValidationErrorReporter {

    report(code: string, node: OasNode, message: string): void;

}

/**
 * Represents a single validation error.
 */
export class OasValidationError {

    public errorCode: string;
    public nodePath: OasNodePath;
    public message: string;
    protected _attributes: OasValidationErrorAttributes = new OasValidationErrorAttributes();

    constructor(errorCode: string, nodePath: OasNodePath, message: string) {
        this.errorCode = errorCode;
        this.nodePath = nodePath;
        this.message = message;
    }

    /**
     * Gets or sets a problem attribute.  When setting the attribute, the previous value
     * will be returned. Otherwise the current value is returned.
     * @param name
     * @param value
     * @return {any}
     */
    public attribute(name: string, value?: any): any {
        if (value === undefined) {
            return this._attributes[name];
        } else {
            let pvalue: any = this._attributes[name];
            this._attributes[name] = value;
            return pvalue;
        }
    }
}


export class OasValidationErrorAttributes {

    [key: string]: any;

}



/**
 * Base class for all validation rules.
 */
export class OasValidationRuleUtil {

    /**
     * List of valid HTTP response status codes from:  https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml
     */
    private static HTTP_STATUS_CODES: number[] = [
        100, 101, 102,
        200, 201, 202, 203, 204, 205, 206, 207, 208, 226,
        300, 301, 302, 303, 304, 305, 306, 307, 308,
        400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417,
        421, 422, 423, 424, 426, 427, 428, 429, 431, 451,
        500, 501, 502, 503, 504, 505, 506, 507, 508, 510, 511
    ];

    /**
     * Check if a property was defined.
     * @param propertyValue
     * @return {boolean}
     */
    public static isDefined(propertyValue: any): boolean {
        if (propertyValue === undefined) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * Check if the property value exists (is not undefined and is not null).
     * @param propertyValue
     * @return {boolean}
     */
    public static hasValue(propertyValue: any): boolean {
        if (propertyValue === undefined) {
            return false;
        }
        if (propertyValue === null) {
            return false;
        }
        return true;
    }
    /**
     * Returns true only if the given value is a valid URL.
     * @param propertyValue
     * @return {boolean}
     */
    public static isValidUrl(propertyValue: string): boolean {
        let urlRegex: string = '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';
        let url: RegExp = new RegExp(urlRegex, 'i');
        return propertyValue.length < 2083 && url.test(propertyValue);
    }

    /**
     * Returns true only if the given value is valid GFM style markup.
     * @param propertyValue
     * @return {boolean}
     */
    public static isValidGFM(propertyValue: string): boolean {
        // TODO implement a regexp to test for a valid Github Flavored Markdown string
        return true;
    }

    /**
     * Returns true only if the given value is valid CommonMark style markup.
     * @param propertyValue
     * @return {boolean}
     */
    public static isValidCommonMark(propertyValue: string): boolean {
        // TODO implement a regexp to test for a valid CommonMark string
        return true;
    }

    /**
     * Returns true only if the given value is a valid email address.
     * @param propertyValue
     * @return {boolean}
     */
    public static isValidEmailAddress(propertyValue: string): boolean {
        let email: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return email.test(propertyValue);
    }

    /**
     * Returns true only if the given value is a valid mime-type.
     * @param propertyValue
     * @return {boolean}
     */
    public static isValidMimeType(propertyValue: string[]): boolean {
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
    public static isValidEnumItem(value: string, items: string[]): boolean {
        return items.indexOf(value) != -1;
    }


    /**
     * Resolves a reference from a relative position in the data model.
     * @param $ref
     * @param from
     */
    public static resolveRef($ref: string, from: OasNode): OasNode {
        // TODO implement a proper reference resolver including external file resolution: https://github.com/EricWittmann/oai-ts-core/issues/8
        let split: string[] = $ref.split("/");
        let cnode: OasNode = null;
        split.forEach( seg => {
            if (seg === "#") {
                cnode = from.ownerDocument();
            } else if (this.hasValue(cnode)) {
                if (cnode["__instanceof_IOasIndexedNode"]) {
                    cnode = cnode["getItem"](seg);
                } else {
                    cnode = cnode[seg];
                }
            }
        });
        return cnode;
    }

    /**
     * Returns true only if the given reference can be resolved relative to the given document.  Examples
     * of $ref values include:
     *
     * #/definitions/ExampleDefinition
     * #/parameters/fooId
     * #/responses/NotFoundResponse
     *
     * @param $ref
     * @param oasDocument
     */
    public static canResolveRef($ref: string, from: OasNode): boolean {
        return this.hasValue(OasValidationRuleUtil.resolveRef($ref, from));
    }

    /**
     * Returns true only if the given value is a valid host.
     * @param propertyValue
     * @return {boolean}
     */
    public static isValidHost(propertyValue: string): boolean {
        // TODO implement a regexp to test for a valid host plus optional port
        if (propertyValue.indexOf("http:") === 0 || propertyValue.indexOf("https:") === 0) {
            return false;
        }
        return true;
    }

    /**
     * Returns true if the given value is valid according to the schema provided.
     * @param value
     * @param node
     */
    public static isValidForType(value: any, node: Oas20Items | Oas20Schema): boolean {
        // TODO validate the value against the schema
        return true;
    }

    /**
     * Returns true if the given status code is a valid HTTP response code.
     * @param statusCode
     * @return {boolean}
     */
    public static isValidHttpCode(statusCode: string): boolean {
        return OasValidationRuleUtil.HTTP_STATUS_CODES.indexOf(parseInt(statusCode)) != -1;
    }

}