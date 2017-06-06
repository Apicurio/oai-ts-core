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
import {Oas30LinkServer} from "./server.model";
import {Oas30Headers} from "./headers.model";
import {Oas30LinkParameters} from "./link-parameters.model";
import {IOasIndexedNode} from "../inode.model";

/**
 * Models an OAS 3.0 Scopes object.
 */
export class Oas30Scopes extends OasExtensibleNode {

    private _scopes: Oas30ScopeItems = new Oas30ScopeItems();

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas30NodeVisitor = visitor as IOas30NodeVisitor;
        viz.visitScopes(this);
    }

    /**
     * Returns the names of all the scopes.
     * @return {string[]}
     */
    public scopeNames(): string[] {
        let rval: string[] = [];
        for (let sname in this._scopes) {
            rval.push(sname);
        }
        return rval;
    }

    /**
     * Gets the description of a scope.
     * @param scopeName
     * @return {string}
     */
    public scopeDescription(scopeName: string): string {
        return this._scopes[scopeName];
    }

    /**
     * Adds a scope.
     * @param scopeName
     * @param description
     */
    public addScope(scopeName: string, description: string): void {
        this._scopes[scopeName] = description;
    }

    /**
     * Removes a scope.  Returns true if a scope existed and was removed.
     * @param scopeName
     */
    public removeScope(scopeName: string): boolean {
        if (this._scopes[scopeName]) {
            delete this._scopes[scopeName];
            return true;
        }
        return false;
    }

}


export class Oas30ScopeItems {

    [key: string]: string;

}
