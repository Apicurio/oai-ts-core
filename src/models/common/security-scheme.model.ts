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

import {IOasNodeVisitor} from "../../visitors/visitor.iface";
import {OasExtensibleNode} from "../enode.model";

/**
 * Models an OAS Security Scheme object.
 */
export class OasSecurityScheme extends OasExtensibleNode {

    private _schemeName: string;

    public type: string;
    public description: string;
    public name: string;
    public in: string;

    /**
     * Must construct this with a name.
     * @param name
     */
    constructor(name: string) {
        super();
        this._schemeName = name;
    }

    /**
     * Returns the name of the scheme.
     * @return {string}
     */
    public schemeName(): string {
        return this._schemeName;
    }

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        visitor.visitSecurityScheme(this);
    }
}
