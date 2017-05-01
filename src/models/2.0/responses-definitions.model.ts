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
import {OasNode} from "../node.model";
import {Oas20ResponseDefinition} from "./response.model";
import {IOasIndexedNode} from "../inode.model";

/**
 * Models an OAS 2.0 Responses Definitions object.  The Responses Definitions object can have any
 * number of child responses, where the field name is the name of the response and the value is a Response
 * object.  Example:
 *
 * {
 *   "NotFound": {
 *     "description": "Entity not found."
 *   },
 *   "IllegalInput": {
 *     "description": "Illegal input for operation."
 *   },
 *   "GeneralError": {
 *     "description": "General Error",
 *     "schema": {
 *         "$ref": "#/definitions/GeneralError"
 *     }
 *   }
 * }
 */
export class Oas20ResponsesDefinitions extends OasNode implements IOasIndexedNode<Oas20ResponseDefinition> {

    __instanceof_IOasIndexedNode: boolean = true;

    private _responses: Oas20ResponsesDefinitionsItems = new Oas20ResponsesDefinitionsItems();

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas20NodeVisitor = <IOas20NodeVisitor> visitor;
        viz.visitResponsesDefinitions(this);
    }

    /**
     * Returns a single response by name.
     * @param name
     * @return {Oas20ResponseDefinition}
     */
    public response(name: string): Oas20ResponseDefinition {
        return this._responses[name];
    }

    /**
     * Returns an array of all the responses.
     */
    public responses(): Oas20ResponseDefinition[] {
        let names: string[] = this.responseNames();
        let rval: Oas20ResponseDefinition[] = [];
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
    public addResponse(name: string, response: Oas20ResponseDefinition): Oas20ResponseDefinition {
        this._responses[name] = response;
        return response;
    }

    /**
     * Removes a response by name.
     * @param name
     */
    public removeResponse(name: string): Oas20ResponseDefinition {
        let rval: Oas20ResponseDefinition = this._responses[name];
        if (rval) {
            delete this._responses[name];
        }
        return rval;
    }

    /**
     * Gets a list of all the response names.
     */
    public responseNames(): string[] {
        let rval: string[] = [];
        for (let name in this._responses) {
            rval.push(name);
        }
        return rval;
    }

    /**
     * Creates an OAS 2.0 Response object.
     * @param name
     * @return {Oas20ResponseDefinition}
     */
    public createResponse(name: string): Oas20ResponseDefinition {
        let rval: Oas20ResponseDefinition = new Oas20ResponseDefinition(name);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    getItem(name: string): Oas20ResponseDefinition {
        return this.response(name);
    }

    getItems(): Oas20ResponseDefinition[] {
        return this.responses();
    }

    getItemNames(): string[] {
        return this.responseNames();
    }

    addItem(name: string, item: Oas20ResponseDefinition): void {
        this.addResponse(name, item);
    }

    deleteItem(name: string): Oas20ResponseDefinition {
        return this.removeResponse(name);
    }

}

export class Oas20ResponsesDefinitionsItems {

    [key: string]: Oas20ResponseDefinition;

}
