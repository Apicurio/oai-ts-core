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

import {Oas20Tag} from "../../models/2.0/tag.model";
import {Oas20Document} from "../../models/2.0/document.model";
import {OasValidationRule} from "./common.rule";
import {OasOperation} from "../../models/common/operation.model";
import {IOasParameterParent, OasParameterBase} from "../../models/common/parameter.model";
import {Oas20Parameter} from "../../models/2.0/parameter.model";
import {Oas30Parameter} from "../../models/3.0/parameter.model";
import {ReferenceUtil} from "../../util";
import {Oas30PathItem} from "../../models/3.0/path-item.model";
import {Oas20PathItem} from "../../models/2.0/path-item.model";
import {Oas20Operation} from "../../models/2.0/operation.model";
import {Oas30Operation} from "../../models/3.0/operation.model";
import {OasPathItem} from "../../models/common/path-item.model";


/**
 * Implements the Tag Name Uniqueness validation rule.
 */
export class OasTagUniquenessValidationRule extends OasValidationRule {

    public visitTag(node: Oas20Tag): void {
        let tags = (<Oas20Document>node.ownerDocument()).tags;
        let tcount: number = tags.filter( tag => {
            return tag.name === node.name;
        }).length;
        this.reportIfInvalid(tcount === 1, node, node.name, {
            tagName: node.name
        });
    }

}


/**
 * Implements the Operation ID Uniqueness validation rule.
 */
export class OasOperationIdUniquenessValidationRule extends OasValidationRule {

    private indexedOperations: any = {};

    public visitOperation(node: OasOperation): void {
        if (this.hasValue(node.operationId)) {
            let dupes: OasOperation[] = this.indexedOperations[node.operationId]
            if (this.hasValue(dupes)) {
                this.reportIfInvalid(dupes.length > 1, dupes[0], "operationId", {
                    operationId: node.operationId
                });
                this.report(node, "operationId", {
                    operationId: node.operationId
                });
                dupes.push(node);
            } else {
                this.indexedOperations[node.operationId] = [ node ];
            }
        }
    }

}


/**
 * Implements the Parameter Uniqueness validation rule.
 */
export class OasParameterUniquenessValidationRule extends OasValidationRule {

    /**
     * Given a 'in' and a 'name' for a parameter, return the # of parameters in the list
     * of parameters that match.
     */
    private getParamCount(params: (Oas20Parameter | Oas30Parameter)[], paramName: string, paramIn: string): number {
        return params.filter( param => {
            return this.hasValue(param) && param.name === paramName && param.in === paramIn;
        }).length;
    }

    /**
     * Validates that all parameter name and "in" combinations are unique
     * @param params
     */
    private ensureUnique(params: (Oas20Parameter | Oas30Parameter)[]): void {
        if (!this.hasValue(params)) {
            return;
        }

        // Must validate against resolved params in the case where we're using $ref
        const resolvedParams: (Oas20Parameter | Oas30Parameter)[] = params.map( param => {
            return <Oas20Parameter | Oas30Parameter>ReferenceUtil.resolveNodeRef(param);
        });

        // Loop through the resolved params looking for duplicates.
        resolvedParams.forEach( (resolvedParam, idx) => {
            if (this.hasValue(resolvedParam) && this.hasValue(resolvedParam.in) && this.hasValue(resolvedParam.name) && resolvedParam.in !== "body") {
                let count: number = this.getParamCount(resolvedParams, resolvedParam.name, resolvedParam.in);
                if (count > 1) {
                    // Report the error on the original param - not the resolved param.
                    let param: Oas20Parameter | Oas30Parameter = params[idx];
                    this.report(param, "in", {
                        paramIn: resolvedParam.in,
                        paramName: resolvedParam.name
                    });
                }
            }

        });
    }

    public visitPathItem(node: Oas20PathItem | Oas30PathItem): void {
        let pathItemParams: (Oas20Parameter | Oas30Parameter)[] = <(Oas20Parameter | Oas30Parameter)[]>node.parameters;
        this.ensureUnique(pathItemParams);
    }
    public visitOperation(node: Oas20Operation | Oas30Operation): void {
        let opParams: (Oas20Parameter | Oas30Parameter)[] = <(Oas20Parameter | Oas30Parameter)[]>node.parameters;
        this.ensureUnique(opParams);
    }

}


/**
 * Implements the Body Parameter Uniqueness validation rule (can only have 1 body param).
 */
export class OasBodyParameterUniquenessValidationRule extends OasValidationRule {

    public visitParameter(node: Oas20Parameter | Oas30Parameter): void {
        let params: OasParameterBase[] = (<any>node.parent() as IOasParameterParent).parameters;
        if (node.in === "body") {
            this.reportIfInvalid(params.filter( param => {
                return param.in === "body";
            }).length === 1, node, "in");
        }
    }

}
