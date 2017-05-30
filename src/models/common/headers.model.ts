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
import {OasNode} from "../node.model";
import {IOasIndexedNode} from "../inode.model";
import {OasHeader} from "./header.model";

/**
 * Models an OAS Headers object.
 */
export abstract class OasHeaders extends OasNode implements IOasIndexedNode<OasHeader> {

    __instanceof_IOasIndexedNode: boolean = true;

    private _headers: OasHeaderItems;

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOasNodeVisitor = <IOasNodeVisitor> visitor;
        viz.visitHeaders(this);
    }

    /**
     * Gets a single header by name.
     * @param headerName
     * @return {OasHeader}
     */
    public header(headerName: string): OasHeader {
        return this._headers[headerName];
    }

    /**
     * Returns an array of all the headers.
     */
    public headers(): OasHeader[] {
        let names: string[] = this.headerNames();
        let rval: OasHeader[] = [];
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
    public removeHeader(headerName: string): OasHeader {
        let rval: OasHeader = this._headers[headerName];
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
    public addHeader(headerName: string, header: OasHeader): OasHeader {
        if (this._headers == null) {
            this._headers = new OasHeaderItems();
        }
        this._headers[headerName] = header;
        return header;
    }

    /**
     * Creates a header model.
     * @param headerName
     * @return {OasHeader}
     */
    public abstract createHeader(headerName: string): OasHeader;

    getItem(name: string): OasHeader {
        return this.header(name);
    }

    getItems(): OasHeader[] {
        return this.headers();
    }

    getItemNames(): string[] {
        return this.headerNames();
    }

    addItem(name: string, item: OasHeader): void {
        this.addHeader(name, item);
    }

    deleteItem(name: string): OasHeader {
        return this.removeHeader(name);
    }

}


export class OasHeaderItems {

    [key: string]: OasHeader;

}
