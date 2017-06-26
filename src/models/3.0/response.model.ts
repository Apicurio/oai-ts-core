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

import {IOas30NodeVisitor, IOasNodeVisitor} from "../../visitors/visitor.iface";
import {IOasReferenceNode} from "../reference.model";
import {OasResponse} from "../common/response.model";
import {Oas30MediaType} from "./media-type.model";
import {Oas30Header} from "./header.model";
import {Oas30Link} from "./link.model";


/**
 * Models an OAS 3.0 Response object.  Example:
 *
 * {
 *   "description": "A complex object array response",
 *   "schema": {
 *     "type": "array",
 *     "items": {
 *       "$ref": "#/definitions/VeryComplexType"
 *     }
 *   }
 * }
 */
export abstract class Oas30ResponseBase extends OasResponse {

    public $ref: string;
    public headers: Oas30ResponseHeaders = new Oas30ResponseHeaders();
    public content: Oas30ResponseContent = new Oas30ResponseContent();
    public links: Oas30Links = new Oas30Links();

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

    /**
     * Creates a media type.
     * @param name
     * @return {Oas30MediaType}
     */
    public createMediaType(name: string): Oas30MediaType {
        let rval: Oas30MediaType = new Oas30MediaType(name);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    /**
     * Adds a media type.
     * @param name
     * @param mediaType
     */
    public addMediaType(name: string, mediaType: Oas30MediaType): void {
        this.content[name] = mediaType;
    }

    /**
     * Gets a single media type by name.
     * @param name
     * @return {Oas30MediaType}
     */
    public getMediaType(name: string): Oas30MediaType {
        return this.content[name];
    }

    /**
     * Removes a single media type and returns it.  This may return null or undefined if none found.
     * @param name
     * @return {Oas30MediaType}
     */
    public removeMediaType(name: string): Oas30MediaType {
        let rval: Oas30MediaType = this.content[name];
        if (rval) {
            delete this.content[name];
        }
        return rval;
    }

    /**
     * Gets a list of all media types.
     * @return {Oas30MediaType[]}
     */
    public getMediaTypes(): Oas30MediaType[] {
        let rval: Oas30MediaType[] = [];
        for (let name in this.content) {
            rval.push(this.content[name]);
        }
        return rval;
    }

    /**
     * Creates a link.
     * @param name
     * @return {Oas30Link}
     */
    public createLink(name: string): Oas30Link {
        let rval: Oas30Link = new Oas30Link(name);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    /**
     * Adds a link.
     * @param name
     * @param link
     */
    public addLink(name: string, link: Oas30Link): void {
        this.links[name] = link;
    }

    /**
     * Gets a single link by name.
     * @param name
     * @return {Oas30Link}
     */
    public getLink(name: string): Oas30Link {
        return this.links[name];
    }

    /**
     * Removes a single link and returns it.  This may return null or undefined if none found.
     * @param name
     * @return {Oas30Link}
     */
    public removeLink(name: string): Oas30Link {
        let rval: Oas30Link = this.links[name];
        if (rval) {
            delete this.links[name];
        }
        return rval;
    }

    /**
     * Gets a list of all links.
     * @return {Oas30Link[]}
     */
    public getLinks(): Oas30Link[] {
        let rval: Oas30Link[] = [];
        for (let name in this.links) {
            rval.push(this.links[name]);
        }
        return rval;
    }

}

/**
 * Extends the base Response class in order to also support references and to
 * track the status code the response is mapped to.  This class is used when a
 * response appears as part of a path/operation.
 */
export class Oas30Response extends Oas30ResponseBase implements IOasReferenceNode {

    private _statusCode: string; // null if 'default'

    /**
     * Constructor.
     * @param statusCode
     */
    constructor(statusCode: string) {
        super();
        if (statusCode) {
            this._statusCode = statusCode;
        } else {
            this._statusCode = null;
        }
    }

    /**
     * Gets the status code.
     * @return {string}
     */
    public statusCode(): string {
        return this._statusCode;
    }

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas30NodeVisitor = <IOas30NodeVisitor> visitor;
        viz.visitResponse(this);
    }

}


/**
 * Extends the base Response class in order to track the name of the response.  This class
 * is used when the response is a globally defined, named response.
 */
export class Oas30ResponseDefinition extends Oas30ResponseBase {

    private _name: string;

    /**
     * Constructor.
     * @param name
     */
    constructor(name: string) {
        super();
        if (name) {
            this._name = name;
        } else {
            this._name = null;
        }
    }

    /**
     * Gets the response name.
     * @return {string}
     */
    public name(): string {
        return this._name;
    }

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas30NodeVisitor = <IOas30NodeVisitor> visitor;
        viz.visitResponseDefinition(this);
    }

}


export class Oas30ResponseHeaders {
    [key: string]: Oas30Header;
}

export class Oas30ResponseContent {
    [key: string]: Oas30MediaType;
}

export class Oas30Links {
    [key: string]: Oas30Link;
}
