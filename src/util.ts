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


/**
 * A class to help with resolving references.  Handles recursion with loop detection.
 */
class ReferenceResolver {

    private visitedNodes: OasNode[] = [];

    constructor() {}

    /**
     * Resolves a reference from a relative position in the data model.  Returns null if the
     * $ref is null or cannot be resolved.
     * @param $ref
     * @param from
     */
    public resolveRef($ref: string, from: OasNode): OasNode {
        this.visitedNodes = [];
        return this.resolveRefInternal($ref, from);
    }
    private resolveRefInternal($ref: string, from: OasNode): OasNode {
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

        // Not found?  Return null.
        if (!cnode) {
            return null;
        }

        // If we've already seen cnode, then we're in a loop!
        if (this.visitedNodes.indexOf(cnode) !== -1) {
            return null;
        }
        // Otherwise, add it to the nodes we've seen.
        this.visitedNodes.push(cnode);

        // If cnode itself has a $ref, then keep looking!
        if (cnode["$ref"]) {
            return this.resolveRefInternal(cnode["$ref"], cnode);
        } else {
            return cnode;
        }
    }
}


export class ReferenceUtil {

    /**
     * Resolves a node reference.  If there is no "$ref" property on the node, then the node itself is
     * returned.  If there is a "$ref" property, then it is resolved (if possible) to another node.
     */
    public static resolveNodeRef(node: OasNode): OasNode {
        if (node["$ref"]) {
            return ReferenceUtil.resolveRef(<string>(node["$ref"]), node);
        }
        return node;
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
        let resolver: ReferenceResolver = new ReferenceResolver();
        return resolver.resolveRef($ref, from);
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
    public static hasValue(value: any): boolean {
        if (value === undefined) {
            return false;
        }
        if (value === null) {
            return false;
        }
        return true;
    }

}