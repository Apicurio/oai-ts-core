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

import {OasNode} from "./node.model";
import {IOasNodeVisitor} from "../visitors/visitor.iface";

/**
 * Models an extension node in an OAS document.  For example, in OAS version 2, any
 * property that begins with "x-" is a valid extension node (vendor extension).
 */
export class OasExtension extends OasNode {

    public name: string;
    public value: any;

    /**
     * Accepts the given node visitor.  Calls the appropriate method on the visitor.
     * @param visitor
     */
    accept(visitor: IOasNodeVisitor): void {
        visitor.visitExtension(this);
    }

}