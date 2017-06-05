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

import {Oas30Operation} from "./operation.model";
import {Oas30Parameter} from "./parameter.model";
import {OasPathItem} from "../common/path-item.model";
import {Oas30Server} from "./server.model";
import {IOas30NodeVisitor, IOasNodeVisitor} from "../../visitors/visitor.iface";

/**
 * Models an OAS 3.0 Path Item object.  Example:
 *
 * {
 *  "get": {
 *    "description": "Returns pets based on ID",
 *    "summary": "Find pets by ID",
 *    "operationId": "getPetsById",
 *    "responses": {
 *      "200": {
 *        "description": "pet response",
 *        "content": {
 *          "application/json": {
 *            "schema": {
 *              "type": "array",
 *              "items": {
 *                "$ref": "#/components/schemas/Pet"
 *              }
 *            }
 *          }
 *        }
 *      },
 *      "default": {
 *        "description": "error payload",
 *        "content": {
 *          "text/html": {
 *            "schema": {
 *              "$ref": "#/components/schemas/ErrorModel"
 *            }
 *          }
 *        }
 *      }
 *    }
 *  },
 *  "parameters": [
 *    {
 *      "name": "id",
 *      "in": "path",
 *      "description": "ID of pet to use",
 *      "required": true,
 *      "type": "array",
 *      "items": {
 *        "type": "string"
 *      },
 *      "style": "commaDelimited"
 *    }
 *  ]
 *}
 */
export class Oas30PathItem extends OasPathItem {

    public summary: string;
    public description: string;
    public trace: Oas30Operation;
    public servers: Oas30Server[];

    /**
     * Constructor.
     * @param path
     */
    constructor(path: string) {
        super(path);
    }

    /**
     * Creates an OAS 3.0 operation object.
     * @param method
     * @return {Oas30Operation}
     */
    public createOperation(method: string): Oas30Operation {
        let rval: Oas30Operation = new Oas30Operation(method);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    /**
     * Creates a child parameter.
     * @return {Oas30Parameter}
     */
    public createParameter(): Oas30Parameter {
        let rval: Oas30Parameter = new Oas30Parameter();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    /**
     * Creates an OAS 3.0 Server object.
     * @return {Oas30Info}
     */
    public createServer(): Oas30Server {
        let rval: Oas30Server = new Oas30Server();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

}

/**
 * A path item defined within a callback.
 */
export class Oas30CallbackPathItem extends Oas30PathItem {

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas30NodeVisitor = visitor as IOas30NodeVisitor;
        viz.visitCallbackPathItem(this);
    }

}
