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

import {IOas20NodeVisitor, IOasNodeVisitor} from "../../visitors/visitor.iface";
import {Oas20Operation} from "./operation.model";
import {Oas20Schema} from "./schema.model";
import {Oas20Headers} from "./headers.model";
import {Oas20Example} from "./example.model";
import {IOasReferenceNode} from "../reference.model";
import {OasResponse} from "../common/response.model";


/**
 * Models an OAS 2.0 Response object.  Example:
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
export abstract class Oas20ResponseBase extends OasResponse {

    public headers: Oas20Headers;
    public schema: Oas20Schema;
    public examples: Oas20Example;

    /**
     * Creates an OAS 2.0 schema object.
     * @return {Oas20Schema}
     */
    public createSchema(): Oas20Schema {
        let rval: Oas20Schema = new Oas20Schema();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    /**
     * Creates an OAS 2.0 headers object.
     * @return {Oas20Operation}
     */
    public createHeaders(): Oas20Headers {
        let rval: Oas20Headers = new Oas20Headers();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    /**
     * Creates an OAS 2.0 schema object.
     * @return {Oas20Operation}
     */
    public createExample(): Oas20Example {
        let rval: Oas20Example = new Oas20Example();
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
export class Oas20Response extends Oas20ResponseBase implements IOasReferenceNode {

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
        let viz: IOas20NodeVisitor = <IOas20NodeVisitor> visitor;
        viz.visitResponse(this);
    }

}


/**
 * Extends the base Response class in order to track the name of the response.  This class
 * is used when the response is a globally defined, named response.
 */
export class Oas20ResponseDefinition extends Oas20ResponseBase {

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
        let viz: IOas20NodeVisitor = <IOas20NodeVisitor> visitor;
        viz.visitResponseDefinition(this);
    }

}