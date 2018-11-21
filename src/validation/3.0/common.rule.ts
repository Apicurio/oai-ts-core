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

import {Oas30NodeVisitorAdapter} from "../../visitors/visitor.base";
import {OasNode} from "../../models/node.model";
import {IOasValidationProblemReporter, OasValidationRuleUtil} from "../validation";

/**
 * Base class for all 3.0 validation rules.
 */
export abstract class Oas30ValidationRule extends Oas30NodeVisitorAdapter {

    private _reporter: IOasValidationProblemReporter;

    constructor(reporter: IOasValidationProblemReporter) {
        super();
        this._reporter = reporter;
    }

    /**
     * Reports a validation error if the property is not valid.
     * @param code
     * @param condition
     * @param node
     * @param property
     * @param message
     */
    protected reportIf(code: string, condition: boolean, node: OasNode, property: string, message: string): void {
        if (condition) {
            this.report(code, node, property, message);
        }
    }

    /**
     * Reports a validation error if the property is not valid.
     * @param code
     * @param isValid
     * @param node
     * @param property
     * @param message
     */
    protected reportIfInvalid(code: string, isValid: boolean, node: OasNode, property: string, message: string): void {
        this.reportIf(code, !isValid, node, property, message);
    }

    /**
     * Check if a property was defined.
     * @param propertyValue
     * @return {boolean}
     */
    protected isDefined(propertyValue: any): boolean {
        return OasValidationRuleUtil.isDefined(propertyValue);
    }

    /**
     * Check if a value is either null or undefined.
     * @param value
     * @return {boolean}
     */
    protected isNullOrUndefined(value: any): boolean {
        return value === null || value === undefined;
    }

    /**
     * Check if the property value exists (is not undefined and is not null).
     * @param propertyValue
     * @return {boolean}
     */
    protected hasValue(propertyValue: any): boolean {
        return OasValidationRuleUtil.hasValue(propertyValue);
    }

    /**
     * Called by validation rules to report an error.
     * @param code
     * @param node
     * @param property
     * @param message
     */
    public report(code: string, node: OasNode, property: string, message: string): void {
        this._reporter.report(code, node, property, message);
    }

}

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
 * Base class for all 3.0 validation rules that have to work with paths.
 */
export abstract class Oas30PathValidationRule extends Oas30ValidationRule {

    /**
     * Regular expression to match path - accepts '/', '/1', /abc', '/abc/', /{var}', '/{var}/', '/abc/prefix{var}'
     * Path expressions must not start with numerics.
     */
    private pathMatchEx = new RegExp(/^(\/[^{}\/]*(\{[a-zA-Z_][0-9a-zA-Z_]*\})?)+$/);

    /**
     * Regular expression to match path segments.
     */
    private segMatchEx =  new RegExp(/\/([^{}\/]*)(\{([a-zA-Z_][0-9a-zA-Z_]*)\})?/g);

    /**
     * Checks the path template against the regular expression and returns match result.
     *
     * @param pathTemplate
     * @return {boolean}
     */
    protected isPathWellFormed(pathTemplate: string): boolean {
        return this.pathMatchEx.test(pathTemplate);
    }

    /**
     * Finds all occurences of path segment patterns in a path template.
     *
     * @param pathTemplate
     * @return {PathSegment[]}
     */
    protected getPathSegments(pathTemplate: string): PathSegment[] {
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
        // Look for all occurence of string like {param1}
        let match: RegExpExecArray;
        let segId = 0;
        while ((match = this.segMatchEx.exec(normalizedPath))) {
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
        }
        return pathSegments;
    }

    /**
     * Utility function to report path related errors.
     * @param code
     * @param node
     * @param message
     * @param includeExample
     */
    protected reportPathError(code: string, node: OasNode, message: string, includeExample: boolean = true) {
        this.report(code, node, null, `${message}${includeExample === true ? " Path templates must be of the form '/abc', '/{def}/', '/abc/g{def}'." : ""}`);
    }

}
