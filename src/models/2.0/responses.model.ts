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

import {OasExtensibleNode} from "../enode.model";
import {IOasNodeVisitor, IOas20NodeVisitor} from "../../visitors/visitor.iface";
import {Oas20Response} from "./response.model";
import {IOasIndexedNode} from "../inode.model";

/**
 * Models an OAS 2.0 Responses object.  The Responses object can have any number of child
 * responses, where the field names are either 'default' or an HTTP status code.  Example:
 *
 * {
 *   "200": {
 *     "description": "a pet to be returned",
 *     "schema": {
 *       "$ref": "#/definitions/Pet"
 *     }
 *   },
 *   "default": {
 *     "description": "Unexpected error",
 *     "schema": {
 *       "$ref": "#/definitions/ErrorModel"
 *     }
 *   }
 * }
 */
export class Oas20Responses extends OasExtensibleNode implements IOasIndexedNode<Oas20Response> {

    __instanceof_IOasIndexedNode: boolean = true;

    public default: Oas20Response;
    private _responses: Oas20ResponseItems;

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas20NodeVisitor = <IOas20NodeVisitor> visitor;
        viz.visitResponses(this);
    }

    /**
     * Returns a single response by status code.
     * @param statusCode
     * @return {Oas20Response}
     */
    public response(statusCode: string): Oas20Response {
        if (this._responses) {
            return this._responses[statusCode];
        } else {
            return null;
        }
    }

    /**
     * Returns an array of all the responses.
     */
    public responses(): Oas20Response[] {
        let names: string[] = this.responseStatusCodes();
        let rval: Oas20Response[] = [];
        for (let name of names) {
            rval.push(this.response(name));
        }
        return rval;
    }

    /**
     * Adds a response.
     * @param name
     * @param response
     */
    public addResponse(statusCode: string, response: Oas20Response): Oas20Response {
        if (this._responses == null) {
            this._responses = new Oas20ResponseItems();
        }
        this._responses[statusCode] = response;
        return response;
    }

    /**
     * Removes a single response child model.
     * @param statusCode
     */
    public removeResponse(statusCode: string): Oas20Response {
        let rval: Oas20Response = this._responses[statusCode];
        if (this._responses && rval) {
            delete this._responses[statusCode];
        }
        return rval;
    }

    /**
     * Gets a list of all the response status codes.
     */
    public responseStatusCodes(): string[] {
        let rval: string[] = [];
        for (let pname in this._responses) {
            rval.push(pname);
        }
        return rval;
    }

    /**
     * Creates an OAS 2.0 response object.
     * @param statusCode
     * @return {Oas20Response}
     */
    public createResponse(statusCode?: string): Oas20Response {
        let rval: Oas20Response = new Oas20Response(statusCode);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    getItem(name: string): Oas20Response {
        return this.response(name);
    }

    getItems(): Oas20Response[] {
        return this.responses();
    }

    getItemNames(): string[] {
        return this.responseStatusCodes();
    }

    addItem(name: string, item: Oas20Response): void {
        this.addResponse(name, item);
    }

    deleteItem(name: string): Oas20Response {
        return this.removeResponse(name);
    }

}


export class Oas20ResponseItems {
    [key: string]: Oas20Response;
}
