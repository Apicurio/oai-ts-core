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