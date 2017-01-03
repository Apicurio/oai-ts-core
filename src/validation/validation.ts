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

import {OasNodePath} from "../models/node-path";
import {OasNode} from "../models/node.model";

/**
 * Interface used by validation rules to report errors.
 */
export interface IOasValidationErrorReporter {

    report(node: OasNode, message: string, severity: OasValidationErrorSeverity): void;

}

/**
 * Severity of a validation error.
 */
export enum OasValidationErrorSeverity {
    warning, error
}


/**
 * Represents a single validation error.
 */
export class OasValidationError {

    public nodePath: OasNodePath;
    public severity: OasValidationErrorSeverity;
    public message: string;

    constructor(nodePath: OasNodePath, severity: OasValidationErrorSeverity, message: string) {
        this.nodePath = nodePath;
        this.severity = severity;
        this.message = message;
    }

}
