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

import {Oas20NodeVisitorAdapter} from "../../visitors/visitor.base";
import {OasNode} from "../../models/node.model";
import {IOasValidationErrorReporter} from "../validation";

/**
 * Base class for all 2.0 validation rules.
 */
export abstract class Oas20ValidationRule extends Oas20NodeVisitorAdapter {

    private _reporter: IOasValidationErrorReporter;

    constructor(reporter: IOasValidationErrorReporter) {
        super();
        this._reporter = reporter;
    }

    /**
     * Check if a property was defined.
     * @param propertyValue
     * @return {boolean}
     */
    protected isDefined(propertyValue: any): boolean {
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
    protected hasValue(propertyValue: any): boolean {
        if (propertyValue === undefined) {
            return false;
        }
        if (propertyValue === null) {
            return false;
        }
        return true;
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