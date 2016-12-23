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

import {OasNode} from "../models/node.model";
import {IOasNodeVisitor, IOas20NodeVisitor} from "./visitor.iface";
import {Oas20Traverser, Oas20ReverseTraverser, IOasTraverser} from "./traverser";
import {Oas20ModelToJSVisitor} from "./model2js.visitor";

export enum OasTraverserDirection {
    up, down
}

/**
 * Some static convenience methods for visiting an OAS node/tree.
 */
export class OasVisitorUtil {

    /**
     * Convenience method for visiting a single node.
     * @param node
     * @param visitor
     */
    public static visitNode(node: OasNode, visitor: IOasNodeVisitor) {
        node.accept(visitor);
    }

    /**
     * Convenience method for visiting an OAS tree.  This will traverse and visit
     * all nodes starting with the given one and traversing down.
     * @param node the node to traverse and visit
     * @param visitor the visitor to call for each node visited
     */
    public static visitTree(node: OasNode, visitor: IOasNodeVisitor, direction: OasTraverserDirection = OasTraverserDirection.down) {
        if (node.ownerDocument().getSpecVersion() === "2.0") {
            let traverser: IOasTraverser;
            if (direction === OasTraverserDirection.up) {
                traverser = new Oas20ReverseTraverser(<IOas20NodeVisitor> visitor);
            } else {
                traverser = new Oas20Traverser(<IOas20NodeVisitor> visitor);
            }
            traverser.traverse(node);
        } else {
            throw new Error("OAS version " + node.ownerDocument().getSpecVersion() + " not supported.");
        }
    }

}