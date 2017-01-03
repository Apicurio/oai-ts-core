/**
 * @license
 * Copyright 2016 JBoss Inc
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
import {OasValidationErrorSeverity, IOasValidationErrorReporter, OasValidationError} from "../validation";

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
     * Called by validation rules to report an error.
     * @param node
     * @param message
     * @param severity
     */
    public report(node: OasNode, message: string, severity: OasValidationErrorSeverity = OasValidationErrorSeverity.error): void {
        this._reporter.report(node, message, severity);
    }

}