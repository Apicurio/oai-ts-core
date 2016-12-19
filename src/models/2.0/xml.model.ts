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

import {IOasNodeVisitor, IOas20NodeVisitor} from "../../visitors/visitor.iface";
import {OasExtensibleNode} from "../enode.model";

/**
 * Models an OAS 2.0 XML object.  Example:
 *
 * {
 *   "Person": {
 *     "type": "object",
 *     "properties": {
 *       "id": {
 *         "type": "integer",
 *         "format": "int32",
 *         "xml": {
 *           "attribute": true
 *         }
 *       },
 *       "name": {
 *         "type": "string",
 *         "xml": {
 *           "namespace": "http://swagger.io/schema/sample",
 *           "prefix": "sample"
 *         }
 *       }
 *     }
 *   }
 * }
 */
export class Oas20XML extends OasExtensibleNode {

    public name: string;
    public namespace: string;
    public prefix: string;
    public attribute: boolean;
    public wrapped: boolean;

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas20NodeVisitor = <IOas20NodeVisitor> visitor;
        viz.visitXML(this);
    }

}
