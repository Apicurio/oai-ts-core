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

import {OasNode} from "../models/node.model";
import {Oas20Schema} from "../models/2.0/schema.model";
import {Oas20Items} from "../models/2.0/items.model";
import {Oas30Schema} from "../models/3.0/schema.model";
import {ValidationRuleMetaData} from "./ruleset";

export enum OasValidationProblemSeverity {
    ignore, low, medium, high
}

/**
 * Interface used by validation rules to report errors.
 */
export interface IOasValidationProblemReporter {

    report(rule: ValidationRuleMetaData, node: OasNode, property: string, message: string): void;

}

export interface IOasValidationSeverityRegistry {

    lookupSeverity(rule: ValidationRuleMetaData): OasValidationProblemSeverity;

}

/**
 * The default validation severity reqistry simply uses "medium" severity for all spec-mandated
 * validation rules.  Any rules that are not mandated by the OAI spec will be ignored.
 */
export class DefaultValidationSeverityRegistry implements IOasValidationSeverityRegistry {

    public lookupSeverity(rule: ValidationRuleMetaData): OasValidationProblemSeverity {
        if (rule.specMandated) {
            return OasValidationProblemSeverity.medium;
        }
        return OasValidationProblemSeverity.ignore;
    }

}


/**
 * Regular expression to match path - accepts '/', '/1', /abc', '/abc/', /{var}', '/{var}/', '/abc/prefix{var}'
 * Path expressions must not start with numerics.
 */
export const PATH_MATCH_REGEX = /^(\/[^{}\/]*(\{[a-zA-Z_][0-9a-zA-Z_]*\})?)+$/;
export const pathMatchEx: RegExp = new RegExp(PATH_MATCH_REGEX);

/**
 * Regular expression to match path segments.
 */
export const SEG_MATCH_REGEX = /\/([^{}\/]*)(\{([a-zA-Z_][0-9a-zA-Z_]*)\})?/g;


/**
 * Type encapsulating information about a path segment.
 * Consumers of this type should not rely on normalizedName property which is only provided to weed out duplicates.
 */
export type PathSegment = {
    segId: number;
    prefix: string;
    formalName?: string;
    normalizedName?: string;
};


/**
 * Base class for all validation rules.
 */
export class OasValidationRuleUtil {

    /**
     * List of valid HTTP response status codes from:  https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml
     */
    private static HTTP_STATUS_CODES: string[] = [
        "100", "101", "102", "1XX", "10X",
        "200", "201", "202", "203", "204", "205", "206", "207", "208", "226", "2XX", "20X", "21X", "22X",
        "300", "301", "302", "303", "304", "305", "306", "307", "308", "3XX", "30X",
        "400", "401", "402", "403", "404", "405", "406", "407", "408", "409", "410", "411", "412", "413", "414", "415", "416", "417", "4XX", "40X", "41X",
        "421", "422", "423", "424", "426", "427", "428", "429", "431", "451", "42X", "43X", "44X", "45X",
        "500", "501", "502", "503", "504", "505", "506", "507", "508", "510", "511", "5XX", "50X", "51X"
    ];

    /**
     * Check if a property was defined.
     * @param propertyValue
     * @return {boolean}
     */
    public static isDefined(propertyValue: any): boolean {
        if (propertyValue === undefined || propertyValue === null) {
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
     * Returns true only if the given value is a valid URL template.
     * @param {string} propertyValue
     * @return {boolean}
     */
    public static isValidUrlTemplate(propertyValue: string): boolean {
        // TODO is there a regular expression we can use to validate a URL template??
        return true;
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
        return items.indexOf(value) !== -1;
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
    public static isValidForType(value: any, node: Oas20Items | Oas20Schema | Oas30Schema): boolean {
        // TODO validate the value against the schema
        return true;
    }

    /**
     * Returns true if the given status code is a valid HTTP response code.
     * @param statusCode
     * @return {boolean}
     */
    public static isValidHttpCode(statusCode: string): boolean {
        return OasValidationRuleUtil.HTTP_STATUS_CODES.indexOf(statusCode) !== -1;
    }

    /**
     * Checks the path template against the regular expression and returns match result.
     *
     * @param pathTemplate
     * @return {boolean}
     */
    public static isPathWellFormed(pathTemplate: string): boolean {
        return pathMatchEx.test(pathTemplate);
    }

    /**
     * Finds all occurrences of path segment patterns in a path template.
     *
     * @param pathTemplate
     * @return {PathSegment[]}
     */
    public static getPathSegments(pathTemplate: string): PathSegment[] {
        const pathSegments: PathSegment[] = [];
        // If path is root '/', simply return empty segments
        if (pathTemplate === "/") {
            return pathSegments;
        }
        let normalizedPath: string = pathTemplate;
        // Remove the trailing slash if the path ends with slash
        if (pathTemplate.lastIndexOf("/") === pathTemplate.length - 1) {
            normalizedPath = pathTemplate.substring(0, pathTemplate.length - 1);
        }
        // Look for all occurrence of string like {param1}
        let match: RegExpExecArray;
        let segId = 0;

        let segMatchEx: RegExp = new RegExp(SEG_MATCH_REGEX);
        match = segMatchEx.exec(normalizedPath);
        while (match) {
            const pathSegment: PathSegment = {
                segId,
                prefix: match[1],
            };
            // parameter name is inside the curly braces (group 3)
            if (match[3] !== undefined) {
                pathSegment.formalName = match[3];
                pathSegment.normalizedName = `__param__${segId}`;
            }
            pathSegments.push(pathSegment);
            segId = segId + 1;
            match = segMatchEx.exec(normalizedPath);
        }
        return pathSegments;
    }

}
