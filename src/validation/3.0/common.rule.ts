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
     * @param message
     */
    protected reportIf(code: string, condition: boolean, node: OasNode, message: string): void {
        if (condition) {
            this.report(code, node, message);
        }
    }

    /**
     * Reports a validation error if the property is not valid.
     * @param code
     * @param isValid
     * @param node
     * @param message
     */
    protected reportIfInvalid(code: string, isValid: boolean, node: OasNode, message: string): void {
        this.reportIf(code, !isValid, node, message);
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
     * @param message
     */
    public report(code: string, node: OasNode, message: string): void {
        this._reporter.report(code, node, message);
    }

}