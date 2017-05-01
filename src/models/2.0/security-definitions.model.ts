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
import {Oas20SecurityScheme} from "./security-scheme.model";
import {IOasIndexedNode} from "../inode.model";

/**
 * Models an OAS 2.0 Security Definitions object.  Example:
 *
 * {
 *   "api_key": {
 *     "type": "apiKey",
 *     "name": "api_key",
 *     "in": "header"
 *   },
 *   "petstore_auth": {
 *     "type": "oauth2",
 *     "authorizationUrl": "http://swagger.io/api/oauth/dialog",
 *     "flow": "implicit",
 *     "scopes": {
 *       "write:pets": "modify pets in your account",
 *       "read:pets": "read your pets"
 *     }
 *   }
 * }
 */
export class Oas20SecurityDefinitions extends OasNode implements IOasIndexedNode<Oas20SecurityScheme> {

    __instanceof_IOasIndexedNode: boolean = true;

    private _items: Oas20SecuritySchemeItems = new Oas20SecuritySchemeItems();

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas20NodeVisitor = <IOas20NodeVisitor> visitor;
        viz.visitSecurityDefinitions(this);
    }

    /**
     * Gets a list of all the security scheme names.
     */
    public securitySchemeNames(): string[] {
        let rval: string[] = [];
        for (let pname in this._items) {
            rval.push(pname);
        }
        return rval;
    }

    /**
     * Returns a single security scheme by name.
     * @param name
     * @return {Oas20SecurityScheme}
     */
    public securityScheme(name: string): Oas20SecurityScheme {
        return this._items[name];
    }

    /**
     * Returns an array of all the security schemes.
     */
    public securitySchemes(): Oas20SecurityScheme[] {
        let names: string[] = this.securitySchemeNames();
        let rval: Oas20SecurityScheme[] = [];
        for (let name of names) {
            rval.push(this.securityScheme(name));
        }
        return rval;
    }

    /**
     * Adds a security scheme child node.
     * @param name
     * @param scheme
     */
    public addSecurityScheme(name: string, scheme: Oas20SecurityScheme): void {
        this._items[name] = scheme;
    }

    /**
     * Removes a single security scheme by name.
     * @param name
     */
    public removeSecurityScheme(name: string): Oas20SecurityScheme {
        let rval: Oas20SecurityScheme = this._items[name];
        if (this._items && rval) {
            delete this._items[name];
        }
        return rval;
    }

    /**
     * Creates a child security scheme object and adds it to the list.
     * @param name
     * @return {Oas20SecurityScheme}
     */
    public createSecurityScheme(name: string): Oas20SecurityScheme {
        let rval: Oas20SecurityScheme = new Oas20SecurityScheme(name);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    getItem(name: string): Oas20SecurityScheme {
        return this.securityScheme(name);
    }

    getItems(): Oas20SecurityScheme[] {
        return this.securitySchemes();
    }

    getItemNames(): string[] {
        return this.securitySchemeNames();
    }

    addItem(name: string, item: Oas20SecurityScheme): void {
        this.addSecurityScheme(name, item);
    }

    deleteItem(name: string): Oas20SecurityScheme {
        return this.removeSecurityScheme(name);
    }

}

export class Oas20SecuritySchemeItems {

    [key: string]: Oas20SecurityScheme;

}
