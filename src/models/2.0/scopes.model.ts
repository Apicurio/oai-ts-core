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
import {OasExtensibleNode} from "../enode.model";

/**
 * Models an OAS 2.0 OAuth Scopes object.  Example:
 *
 * {
 *   "write:pets": "modify pets in your account",
 *   "read:pets": "read your pets"
 * }
 */
export class Oas20Scopes extends OasExtensibleNode {

    private _items: Oas20ScopeItems = new Oas20ScopeItems();

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas20NodeVisitor = <IOas20NodeVisitor> visitor;
        viz.visitScopes(this);
    }

    /**
     * Returns all the scopes.
     * @return {string[]}
     */
    public scopes(): string[] {
        let rval: string[] = [];
        for (let scope in this._items) {
            rval.push(scope);
        }
        return rval;
    }

    /**
     * Gets a scope description.
     * @param scope
     * @return {string}
     */
    public getScopeDescription(scope: string): string {
        return this._items[scope];
    }

    /**
     * Adds a scope to the map.
     * @param scope
     * @param description
     */
    public addScope(scope: string, description: string): void {
        this._items[scope] = description;
    }

    /**
     * Removes a scope.
     * @param scope
     */
    public removeScope(scope: string): string {
        let rval: string = this._items[scope];
        if (rval) {
            delete this._items[scope];
        }
        return rval;
    }

}

export class Oas20ScopeItems {

    [key: string]: string;

}
