/**
 * @license
 * Copyright 2018 Red Hat
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

import {OasNode} from "./models/node.model";

export class ReferenceUtil {

    /**
     * Recurses through references and returns a resolved OASNode object if successful or the address of the last reference which could not be resolved
     * (e.g. when the pointer is to a non-existent value within the components).
     * @param node - Generic node for which the value must be resolved
     * @return {T | string} - Returns (recursively) resolved object or a string with invalid ref.
     */
    public static resolveReferenceRecursive<T extends OasNode>(node: T): T | string {
        let resolvedNode: T = node;
        while (resolvedNode['$ref'] !== undefined) {
            const referencedNode = <T>ReferenceUtil.resolveRef(resolvedNode['$ref'], node.ownerDocument());
            if (referencedNode === undefined || referencedNode === null) {
                return resolvedNode['$ref'];
            }
            resolvedNode = referencedNode;
        }
        return resolvedNode;
    }

    /**
     * Resolves a reference from a relative position in the data model.  Returns null if the
     * $ref is null or cannot be resolved.
     * @param $ref
     * @param from
     */
    public static resolveRef($ref: string, from: OasNode): OasNode {
        if (!$ref) {
            return null;
        }
        // TODO implement a proper reference resolver including external file resolution: https://github.com/EricWittmann/oai-ts-core/issues/8
        let split: string[] = $ref.split("/");
        let cnode: OasNode = null;
        split.forEach( seg => {
            if (seg === "#") {
                cnode = from.ownerDocument();
            } else if (ReferenceUtil.hasValue(cnode)) {
                if (cnode["__instanceof_IOasIndexedNode"]) {
                    cnode = cnode["getItem"](seg);
                } else {
                    cnode = cnode[seg];
                }
            }
        });
        return cnode;
    }

    /**
     * Returns true only if the given reference can be resolved relative to the given document.  Examples
     * of $ref values include:
     *
     * #/definitions/ExampleDefinition
     * #/parameters/fooId
     * #/responses/NotFoundResponse
     *
     * @param $ref
     * @param oasDocument
     */
    public static canResolveRef($ref: string, from: OasNode): boolean {
        // Don't try to resolve e.g. external references.
        if ($ref.indexOf('#/') !== 0) { return true; }
        return ReferenceUtil.hasValue(ReferenceUtil.resolveRef($ref, from));
    }

    /**
     * Check if the property value exists (is not undefined and is not null).
     * @param propertyValue
     * @return {boolean}
     */
    private static hasValue(value: any): boolean {
        if (value === undefined) {
            return false;
        }
        if (value === null) {
            return false;
        }
        return true;
    }

}