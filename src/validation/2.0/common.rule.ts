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

import { Oas20NodeVisitorAdapter } from "../../visitors/visitor.base"
import { OasNode } from "../../models/node.model"
import { IOasValidationProblemReporter, OasValidationRuleUtil, PathSegment } from "../validation"

/**
 * Base class for all 2.0 validation rules.
 */
export abstract class Oas20ValidationRule extends Oas20NodeVisitorAdapter {

    private _reporter: IOasValidationProblemReporter;

    constructor(reporter: IOasValidationProblemReporter) {
        super();
        this._reporter = reporter;
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

    /**
     * Reports a validation error if the property is not valid.
     * @param code
     * @param isValid
     * @param node
     * @param message
     */
    protected reportIfInvalid(code: string, isValid: boolean, node: OasNode, property: string, message: string): void {
        if (!isValid) {
            this.report(code, node, property, message);
        }
    }

}


/**
 * Base class for all 2.0 validation rules that have to work with paths.
 */
export abstract class Oas20PathValidationRule extends Oas20ValidationRule {

    /**
     * Checks the path template against the regular expression and returns match result.
     *
     * @param pathTemplate
     * @return {boolean}
     */
    protected isPathWellFormed(pathTemplate: string): boolean {
        return OasValidationRuleUtil.isPathWellFormed(pathTemplate);
    }

    /**
     * Finds all occurences of path segment patterns in a path template.
     *
     * @param pathTemplate
     * @return {PathSegment[]}
     */
    protected getPathSegments(pathTemplate: string): PathSegment[] {
        return OasValidationRuleUtil.getPathSegments(pathTemplate);
    }

    /**
     * Utility function to report path related errors.
     * @param code
     * @param node
     * @param message
     */
    protected reportPathError(code: string, node: OasNode, message: string) {
        this.report(code, node, null, message);
    }

}
