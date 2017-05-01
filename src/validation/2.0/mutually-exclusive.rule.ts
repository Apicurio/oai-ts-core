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

import {Oas20ValidationRule} from "./common.rule";
import {OasNode} from "../../models/node.model";
import {Oas20PathItem} from "../../models/2.0/path-item.model";
import {Oas20Operation} from "../../models/2.0/operation.model";

/**
 * Implements the Mutually Exclusive validation rule.  This rule is responsible
 * for reporting whenever properties are used together when that is not allowed.
 * In various places in the specification, some properties are mutually exlusive
 * with each other.
 */
export class Oas20MutuallyExclusiveValidationRule extends Oas20ValidationRule {

    /**
     * Reports a validation error if the property is not valid.
     * @param code
     * @param isValid
     * @param node
     * @param message
     */
    private reportIfInvalid(code: string, isValid: boolean, node: OasNode, message: string): void {
        if (!isValid) {
            this.report(code, node, message);
        }
    }

    public visitOperation(node: Oas20Operation): void {
        if (this.hasValue(node.parameters)) {
            let hasBodyParam: boolean = false;
            let hasFormDataParam: boolean = false;
            node.parameters.forEach( param => {
                if (param.in === "body") {
                    hasBodyParam = true;
                }
                if (param.in === "formData") {
                    hasFormDataParam = true;
                }
            });
            this.reportIfInvalid("PATH-001", !(hasBodyParam && hasFormDataParam), node,
                "An operation may not have both a \"body\" and a \"formData\" parameter.");
        }
    }

    public visitPathItem(node: Oas20PathItem): void {
        if (this.hasValue(node.parameters)) {
            let hasBodyParam: boolean = false;
            let hasFormDataParam: boolean = false;
            node.parameters.forEach( param => {
                if (param.in === "body") {
                    hasBodyParam = true;
                }
                if (param.in === "formData") {
                    hasFormDataParam = true;
                }
            });
            this.reportIfInvalid("PATH-001", !(hasBodyParam && hasFormDataParam), node,
                "An operation may not have both a \"body\" and a \"formData\" parameter.");
        }
    }

}
