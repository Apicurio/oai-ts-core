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

import {OasExtensibleNode} from "../enode.model";
import {IOas30NodeVisitor, IOasNodeVisitor} from "../../visitors/visitor.iface";
import {Oas30Header} from "./header.model";

/**
 * Models an OAS 3.0 Encoding object.
 */
export class Oas30Encoding extends OasExtensibleNode {

    private _name: string;
    public contentType: string;
    public headers: Oas30EncodingHeaders = new Oas30EncodingHeaders();
    public style: string;
    public explode: boolean;
    public allowReserved: boolean;

    /**
     * Constructor.
     * @param name
     */
    constructor(name: string) {
        super();
        this._name = name;
    }

    public name(): string {
        return this._name;
    }

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas30NodeVisitor = visitor as IOas30NodeVisitor;
        viz.visitEncoding(this);
    }

    /**
     * Creates a header.
     * @param name
     * @return {Oas30Header}
     */
    public createHeader(name: string): Oas30Header {
        let rval: Oas30Header = new Oas30Header(name);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    /**
     * Adds a header.
     * @param name
     * @param header
     */
    public addHeader(name: string, header: Oas30Header): void {
        this.headers[name] = header;
    }

    /**
     * Gets a single header by name.
     * @param name
     * @return {Oas30Header}
     */
    public getHeader(name: string): Oas30Header {
        return this.headers[name];
    }

    /**
     * Removes a single header and returns it.  This may return null or undefined if none found.
     * @param name
     * @return {Oas30Header}
     */
    public removeHeader(name: string): Oas30Header {
        let rval: Oas30Header = this.headers[name];
        if (rval) {
            delete this.headers[name];
        }
        return rval;
    }

    /**
     * Gets a list of all headers.
     * @return {Oas30Header[]}
     */
    public getHeaders(): Oas30Header[] {
        let rval: Oas30Header[] = [];
        for (let name in this.headers) {
            rval.push(this.headers[name]);
        }
        return rval;
    }

}


export class Oas30EncodingHeaders {
    [key: string]: Oas30Header;
}
