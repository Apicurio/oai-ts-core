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

import {OasExtensibleNode} from "./enode.model";
import {IOasNodeVisitor} from "../visitors/visitor.iface";

/**
 * Base class for all OAS documents.  A version-specific implementation of this class
 * is expected for each version of the specification supported by the library.
 */
export abstract class OasDocument extends OasExtensibleNode {

    /**
     * Returns the version of the specification of this document.
     */
    public abstract getSpecVersion(): string;

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        visitor.visitDocument(this);
    }

}