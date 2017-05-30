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
import {Oas20Parameter} from "../../models/2.0/parameter.model";
import {Oas20Operation} from "../../models/2.0/operation.model";
import {Oas20Tag} from "../../models/2.0/tag.model";
import {Oas20Document} from "../../models/2.0/document.model";
import {IOasParameterParent, OasParameterBase} from "../../models/common/parameter.model";

/**
 * Implements the Uniqueness validation rule.  This rule is responsible
 * for reporting whenever properties whose values are required to be unique,
 * fail that test.  Examples are scopes, tags, and operationId.
 */
export class Oas20UniquenessValidationRule extends Oas20ValidationRule {

    private indexedOperations: any = {};

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

    public visitTag(node: Oas20Tag): void {
        let tags = (<Oas20Document>node.ownerDocument()).tags;
        let tcount: number = tags.filter( tag => {
            return tag.name === node.name;
        }).length;
        this.reportIfInvalid("TAG-003", tcount === 1, node,
            "Duplicate tag '" + node.name + "' found (every tag must have a unique name).");
    }

    public visitOperation(node: Oas20Operation): void {
        if (this.hasValue(node.operationId)) {
            let dupes: Oas20Operation[] = this.indexedOperations[node.operationId]
            if (this.hasValue(dupes)) {
                this.reportIfInvalid("OP-003", dupes.length > 1, dupes[0], "The \"operationId\" property value '" + node.operationId + "' must be unique across ALL operations.");
                this.reportIfInvalid("OP-003", false, node, "The \"operationId\" property value '" + node.operationId + "' must be unique across ALL operations.");
                dupes.push(node);
            } else {
                this.indexedOperations[node.operationId] = [ node ];
            }
        }
    }

    public visitParameter(node: Oas20Parameter): void {
        let params: OasParameterBase[] = (<any>node.parent() as IOasParameterParent).parameters;
        if (node.in !== "body") {
            this.reportIfInvalid("PAR-019", params.filter(param => {
                    return param.in === node.in && param.name === node.name;
                }).length === 1, node, "Duplicate '" + node.in + "' parameter named '" + node.name + "' found (parameters must be unique by name and location).");
        }

        if (node.in === "body") {
            this.reportIfInvalid("PAR-020", params.filter( param => {
                    return param.in === "body";
                }).length === 1, node, "An operation may have at most one \"body\" parameter.");

        }
    }

}
