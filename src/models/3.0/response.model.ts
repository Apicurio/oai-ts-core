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
import {Oas30Headers} from "./headers.model";
import {Oas30Content} from "./content.model";
import {Oas30Links} from "./links.model";


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

    public content: Oas30Content;
    public links: Oas30Links;

    /**
     * Creates an OAS 3.0 Headers object.
     * @return {Oas30Headers}
     */
    public createHeaders(): Oas30Headers {
        let rval: Oas30Headers = new Oas30Headers();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    /**
     * Creates an OAS 3.0 Content object.
     * @return {Oas30Content}
     */
    public createContent(): Oas30Content {
        let rval: Oas30Content = new Oas30Content();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    /**
     * Creates an OAS 3.0 Links object.
     * @return {Oas30Links}
     */
    public createLinks(): Oas30Links {
        let rval: Oas30Links = new Oas30Links();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
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
    public $ref: string;

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