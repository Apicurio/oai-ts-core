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

import {IOasNodeVisitor, IOas20NodeVisitor} from "../../visitors/visitor.iface";
import {IOas20ParameterParent, Oas20Operation} from "./operation.model";
import {Oas20Parameter} from "./parameter.model";
import {OasExtensibleNode} from "../enode.model";

/**
 * Models an OAS 2.0 Path Item object.  Example:
 *
 * {
 *   "get": {
 *     "description": "Returns pets based on ID",
 *     "summary": "Find pets by ID",
 *     "operationId": "getPetsById",
 *     "produces": [
 *       "application/json",
 *       "text/html"
 *     ],
 *     "responses": {
 *       "200": {
 *         "description": "pet response",
 *         "schema": {
 *          "type": "array",
 *           "items": {
 *             "$ref": "#/definitions/Pet"
 *           }
 *         }
 *       },
 *       "default": {
 *         "description": "error payload",
 *         "schema": {
 *           "$ref": "#/definitions/ErrorModel"
 *         }
 *       }
 *     }
 *   },
 *   "parameters": [
 *     {
 *       "name": "id",
 *       "in": "path",
 *       "description": "ID of pet to use",
 *       "required": true,
 *       "type": "array",
 *       "items": {
 *         "type": "string"
 *       },
 *       "collectionFormat": "csv"
 *     }
 *   ]
 * }
 *
 */
export class Oas20PathItem extends OasExtensibleNode implements IOas20ParameterParent {

    private _path: string;
    public $ref: string;
    public get: Oas20Operation;
    public put: Oas20Operation;
    public post: Oas20Operation;
    public delete: Oas20Operation;
    public options: Oas20Operation;
    public head: Oas20Operation;
    public patch: Oas20Operation;
    public parameters: Oas20Parameter[];

    /**
     * Constructor.
     * @param path
     */
    constructor(path: string) {
        super();
        this._path = path;
    }

    /**
     * Returns the path this object is mapped to.
     * @return {string}
     */
    public path(): string {
        return this._path;
    }

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas20NodeVisitor = <IOas20NodeVisitor> visitor;
        viz.visitPathItem(this);
    }

    /**
     * Creates an OAS 2.0 operation object.
     * @param method
     * @return {Oas20Operation}
     */
    public createOperation(method: string): Oas20Operation {
        let rval: Oas20Operation = new Oas20Operation(method);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    /**
     * Creates a child parameter.
     * @return {Oas20Parameter}
     */
    public createParameter(): Oas20Parameter {
        let rval: Oas20Parameter = new Oas20Parameter();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    /**
     * Adds a parameter.
     * @param param
     */
    public addParameter(param: Oas20Parameter): Oas20Parameter {
        if (!this.parameters) {
            this.parameters = [];
        }
        this.parameters.push(param);
        return param;
    }

    /**
     * Returns a list of parameters with a particular value of "in" (e.g. path, formData, body, etc...).
     * @param _in
     * @return {any}
     */
    public getParameters(_in: string): Oas20Parameter[] {
        if (_in === undefined ||_in === null) {
            return [];
        } else {
            return this.parameters.filter( param => {
                return param.in === _in;
            })
        }
    }

}