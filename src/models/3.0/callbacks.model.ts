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
import {IOasIndexedNode} from "../inode.model";
import {Oas30Callback} from "./callback.model";

/**
 * Models an OAS 3.0 Callbacks object.  Example:
 *
 * {
 *   "myWebhook": {
 *     "$request.body#/url": {
 *       "post": {
 *         "requestBody": {
 *           "description": "Callback payload",
 *           "content": {
 *             "application/json": {
 *               "schema": {
 *                 "$ref": "#/components/schemas/SomePayload"
 *               }
 *             }
 *           }
 *         },
 *         "responses": {
 *           "200": {
 *             "description": "webhook successfully processed and no retries will be performed"
 *           }
 *         }
 *       }
 *     }
 *   }
 * }
 */
export class Oas30Callbacks extends OasExtensibleNode  implements IOasIndexedNode<Oas30Callback> {

    __instanceof_IOasIndexedNode: boolean = true;

    private _callbacks: Oas30CallbackItems;

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas30NodeVisitor = <IOas30NodeVisitor> visitor;
        viz.visitCallbacks(this);
    }
    
    /**
     * Returns a single callback by name.
     * @param name
     * @return {Oas30Callback}
     */
    public callback(name: string): Oas30Callback {
        if (this._callbacks) {
            return this._callbacks[name];
        } else {
            return null;
        }
    }

    /**
     * Returns an array of all the callbacks.
     */
    public callbacks(): Oas30Callback[] {
        let names: string[] = this.callbackNames();
        let rval: Oas30Callback[] = [];
        for (let name of names) {
            rval.push(this.callback(name));
        }
        return rval;
    }

    /**
     * Adds a callback.
     * @param name
     * @param callback
     */
    public addCallback(name: string, callback: Oas30Callback): Oas30Callback {
        if (this._callbacks == null) {
            this._callbacks = new Oas30CallbackItems();
        }
        this._callbacks[name] = callback;
        return callback;
    }

    /**
     * Removes a single callback child model.
     * @param name
     */
    public removeCallback(name: string): Oas30Callback {
        let rval: Oas30Callback = this._callbacks[name];
        if (this._callbacks && rval) {
            delete this._callbacks[name];
        }
        return rval;
    }

    /**
     * Gets a list of all the callback status codes.
     */
    public callbackNames(): string[] {
        let rval: string[] = [];
        for (let pname in this._callbacks) {
            rval.push(pname);
        }
        return rval;
    }

    /**
     * Creates an OAS Callback object.
     * @param name
     * @return {Oas30Callback}
     */
    public createCallback(name: string): Oas30Callback {
        let rval: Oas30Callback = new Oas30Callback(name);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    getItem(name: string): Oas30Callback {
        return this.callback(name);
    }

    getItems(): Oas30Callback[] {
        return this.callbacks();
    }

    getItemNames(): string[] {
        return this.callbackNames();
    }

    addItem(name: string, item: Oas30Callback): void {
        this.addCallback(name, item);
    }

    deleteItem(name: string): Oas30Callback {
        return this.removeCallback(name);
    }

}


export class Oas30CallbackItems {
    [key: string]: Oas30Callback;
}
