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
import {Oas20Items} from "./items.model";

/**
 * Models an OAS 2.0 Header object.  Example:
 *
 * {
 *   "description": "The number of allowed requests in the current period",
 *   "type": "integer"
 * }
 */
export class Oas20Header extends Oas20Items {

    private _headerName: string;
    public description: string;

    /**
     * Constructor.
     * @param headerName
     */
    constructor(headerName: string) {
        super();
        this._headerName = headerName;
    }

    /**
     * Gets the header name.
     * @return {string}
     */
    public headerName(): string {
        return this._headerName;
    }

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas20NodeVisitor = <IOas20NodeVisitor> visitor;
        viz.visitHeader(this);
    }

}
