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


import {Oas30ValidationRule} from "./common.rule";
import {Oas30Tag} from "../../models/3.0/tag.model";
import {Oas30Document} from "../../models/3.0/document.model";
import {Oas30Operation} from "../../models/3.0/operation.model";
import {Oas30Parameter} from "../../models/3.0/parameter.model";
import {IOasParameterParent, OasParameterBase} from "../../models/common/parameter.model";

/**
 * Implements the Uniqueness validation rule.  This rule is responsible
 * for reporting whenever properties whose values are required to be unique,
 * fail that test.  Examples are scopes, tags, and operationId.
 */
export class Oas30UniquenessValidationRule extends Oas30ValidationRule {

    private indexedOperations: any = {};

    public visitTag(node: Oas30Tag): void {
        let tags: Oas30Tag[] = (<Oas30Document>node.ownerDocument()).tags;
        let tcount: number = tags.filter( tag => {
            return tag.name === node.name;
        }).length;
        this.reportIfInvalid("TAG-3-003", tcount === 1, node,
            `Duplicate tag "${node.name}" found (every tag must have a unique name).`);
    }

    public visitOperation(node: Oas30Operation): void {
        if (this.hasValue(node.operationId)) {
            let dupes: Oas30Operation[] = this.indexedOperations[node.operationId]
            if (this.hasValue(dupes)) {
                this.reportIfInvalid("OP-3-002", dupes.length > 1, dupes[0],
                    `The "operationId" property value '${node.operationId}' must be unique across ALL operations.`);
                this.report("OP-3-002", node,
                    `The "operationId" property value '${node.operationId}' must be unique across ALL operations.`);
                dupes.push(node);
            } else {
                this.indexedOperations[node.operationId] = [ node ];
            }
        }
    }

    public visitParameter(node: Oas30Parameter): void {
        let params: OasParameterBase[] = (<any>node.parent() as IOasParameterParent).parameters;
        this.reportIfInvalid("PAR-3-001", params.filter(param => {
                return param.in === node.in && param.name === node.name;
            }).length === 1, node, `Duplicate '${node.in}' parameter named '${node.name}' found (parameters must be unique by name and location).`);
    }

}
