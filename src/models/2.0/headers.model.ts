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

import {Oas20Header} from "./header.model";
import {IOas20NodeVisitor, IOasNodeVisitor} from "../../visitors/visitor.iface";
import {OasNode} from "../node.model";
import {IOasIndexedNode} from "../inode.model";

/**
 * Models an OAS 2.0 Headers object.  Example:
 *
 * {
 *     "X-Rate-Limit-Limit": {
 *         "description": "The number of allowed requests in the current period",
 *         "type": "integer"
 *     },
 *     "X-Rate-Limit-Remaining": {
 *         "description": "The number of remaining requests in the current period",
 *         "type": "integer"
 *     },
 *     "X-Rate-Limit-Reset": {
 *         "description": "The number of seconds left in the current period",
 *         "type": "integer"
 *     }
 * }
 */
export class Oas20Headers extends OasNode implements IOasIndexedNode<Oas20Header> {

    __instanceof_IOasIndexedNode: boolean = true;

    private _headers: OasHeaderItems;

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas20NodeVisitor = <IOas20NodeVisitor> visitor;
        viz.visitHeaders(this);
    }

    /**
     * Creates a header model.
     * @param headerName
     * @return {Oas20Header}
     */
    public createHeader(headerName: string): Oas20Header {
        let rval: Oas20Header = new Oas20Header(headerName);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    /**
     * Gets a single header by name.
     * @param headerName
     * @return {OasHeader}
     */
    public header(headerName: string): Oas20Header {
        return this._headers[headerName];
    }

    /**
     * Returns an array of all the headers.
     */
    public headers(): Oas20Header[] {
        let names: string[] = this.headerNames();
        let rval: Oas20Header[] = [];
        for (let name of names) {
            rval.push(this.header(name));
        }
        return rval;
    }

    /**
     * Returns all the header names.
     * @return {string[]}
     */
    public headerNames(): string[] {
        let rval: string[] = [];
        for (let name in this._headers) {
            rval.push(name);
        }
        return rval;
    }

    /**
     * Removes a single header.
     * @param headerName
     */
    public removeHeader(headerName: string): Oas20Header {
        let rval: Oas20Header = this._headers[headerName];
        if (this._headers && rval) {
            delete this._headers[headerName];
        }
        return rval;
    }

    /**
     * Adds a header.
     * @param headerName
     * @param header
     */
    public addHeader(headerName: string, header: Oas20Header): Oas20Header {
        if (this._headers == null) {
            this._headers = new OasHeaderItems();
        }
        this._headers[headerName] = header;
        return header;
    }

    getItem(name: string): Oas20Header {
        return this.header(name);
    }

    getItems(): Oas20Header[] {
        return this.headers();
    }

    getItemNames(): string[] {
        return this.headerNames();
    }

    addItem(name: string, item: Oas20Header): void {
        this.addHeader(name, item);
    }

    deleteItem(name: string): Oas20Header {
        return this.removeHeader(name);
    }

}


export class OasHeaderItems {

    [key: string]: Oas20Header;

}
