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
import {IOasNodeVisitor} from "../../visitors/visitor.iface";
import {IOasIndexedNode} from "../inode.model";
import {OasResponse} from "./response.model";

/**
 * Models an OAS Responses object.  The Responses object can have any number of child
 * responses, where the field names are either 'default' or an HTTP status code.
 */
export abstract class OasResponses extends OasExtensibleNode implements IOasIndexedNode<OasResponse> {

    __instanceof_IOasIndexedNode: boolean = true;

    public default: OasResponse;
    private _responses: OasResponseItems;

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        visitor.visitResponses(this);
    }

    /**
     * Returns a single response by status code.
     * @param statusCode
     * @return {OasResponse}
     */
    public response(statusCode: string): OasResponse {
        if (this._responses) {
            return this._responses[statusCode];
        } else {
            return null;
        }
    }

    /**
     * Returns an array of all the responses.
     */
    public responses(): OasResponse[] {
        let names: string[] = this.responseStatusCodes();
        let rval: OasResponse[] = [];
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
    public addResponse(statusCode: string, response: OasResponse): OasResponse {
        if (this._responses == null) {
            this._responses = new OasResponseItems();
        }
        this._responses[statusCode] = response;
        return response;
    }

    /**
     * Removes a single response child model.
     * @param statusCode
     */
    public removeResponse(statusCode: string): OasResponse {
        let rval: OasResponse = this._responses[statusCode];
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
     * Creates an OAS Response object.
     * @param statusCode
     * @return {OasResponse}
     */
    public abstract createResponse(statusCode?: string): OasResponse;

    getItem(name: string): OasResponse {
        return this.response(name);
    }

    getItems(): OasResponse[] {
        return this.responses();
    }

    getItemNames(): string[] {
        return this.responseStatusCodes();
    }

    addItem(name: string, item: OasResponse): void {
        this.addResponse(name, item);
    }

    deleteItem(name: string): OasResponse {
        return this.removeResponse(name);
    }

}


export class OasResponseItems {
    [key: string]: OasResponse;
}
