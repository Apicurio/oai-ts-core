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

import {OasCombinedVisitorAdapter} from "../../visitors/visitor.base"
import {OasNode} from "../../models/node.model"
import {IOasValidationProblemReporter, OasValidationRuleUtil, PathSegment} from "../validation"
import {ValidationRuleMetaData} from "../ruleset";

/**
 * Base class for all validation rules.
 */
export abstract class OasValidationRule extends OasCombinedVisitorAdapter {

    private _reporter: IOasValidationProblemReporter;

    /**
     * C'tor.
     * @param ruleInfo
     */
    protected constructor(private ruleInfo: ValidationRuleMetaData) { super(); }

    /**
     * Sets the reporter to use by this rule.
     * @param reporter
     */
    public setReporter(reporter: IOasValidationProblemReporter): void {
        this._reporter = reporter;
    }

    /**
     * Called by validation rules to report an error.
     * @param node
     * @param property
     * @param messageParams
     */
    protected report(node: OasNode, property: string, messageParams?: {[key:string]: any}): void {
        let message: string = this.ruleInfo.messageTemplate(messageParams || {});
        this._reporter.report(this.ruleInfo, node, property, message);
    }

    /**
     * Utility function to report path related errors.
     * @param node
     * @param messageParams
     */
    protected reportPathError(node: OasNode, messageParams?: {[key:string]: any}) {
        this.report(node, null, messageParams);
    }

    /**
     * Reports a validation error if the property is not valid.
     * @param isValid
     * @param node
     * @param property
     * @param messageParams
     */
    protected reportIfInvalid(isValid: boolean, node: OasNode, property: string, messageParams?: {[key:string]: any}): void {
        if (!isValid) {
            this.report(node, property, messageParams);
        }
    }

    /**
     * Reports a validation error if the given condition is true.
     * @param condition
     * @param node
     * @param property
     * @param messageParams
     */
    protected reportIf(condition: boolean, node: OasNode, property: string, messageParams?: {[key:string]: any}): void {
        if (condition) {
            this.report(node, property, messageParams);
        }
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
     * Check if a value is either null or undefined.
     * @param value
     * @return {boolean}
     */
    protected isNullOrUndefined(value: any): boolean {
        return value === null || value === undefined;
    }

}

