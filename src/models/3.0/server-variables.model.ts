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
import {IOasIndexedNode} from "../inode.model";
import {Oas30ServerVariable} from "./server-variable.model";
import {IOas30NodeVisitor, IOasNodeVisitor} from "../../visitors/visitor.iface";

/**
 * Models an OAS 3.0 License object.  Example:
 *
 * {
 *         "username": {
 *           "default": "demo",
 *           "description": "this value is assigned by the service provider, in this example `gigantic-server.com`"
 *         },
 *         "port": {
 *           "enum": [
 *             8443,
 *             443
 *           ],
 *           "default": 8443
 *         },
 *         "basePath": {
 *           "default": "v2"
 *         }
 *       }
 */
export class Oas30ServerVariables extends OasExtensibleNode implements IOasIndexedNode<Oas30ServerVariable> {

    __instanceof_IOasIndexedNode: boolean = true;

    private _serverVariables: Oas30ServerVariableItems;

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas30NodeVisitor = <IOas30NodeVisitor> visitor;
        viz.visitServerVariables(this);
    }

    /**
     * Returns a single variable by name.
     * @param name
     * @return {Oas30ServerVariable}
     */
    public serverVariable(name: string): Oas30ServerVariable {
        if (this._serverVariables) {
            return this._serverVariables[name];
        } else {
            return null;
        }
    }

    /**
     * Returns an array of all the variables.
     */
    public serverVariables(): Oas30ServerVariable[] {
        let names: string[] = this.serverVariableNames();
        let rval: Oas30ServerVariable[] = [];
        for (let name of names) {
            rval.push(this.serverVariable(name));
        }
        return rval;
    }

    /**
     * Adds a variable.
     * @param name
     * @param serverVariable
     */
    public addServerVariable(name: string, serverVariable: Oas30ServerVariable): Oas30ServerVariable {
        if (this._serverVariables == null) {
            this._serverVariables = new Oas30ServerVariableItems();
        }
        this._serverVariables[name] = serverVariable;
        return serverVariable;
    }

    /**
     * Removes a single variable child model.
     * @param name
     */
    public removeServerVariable(name: string): Oas30ServerVariable {
        let rval: Oas30ServerVariable = this._serverVariables[name];
        if (this._serverVariables && rval) {
            delete this._serverVariables[name];
        }
        return rval;
    }

    /**
     * Gets a list of all the variable names.
     */
    public serverVariableNames(): string[] {
        let rval: string[] = [];
        for (let pname in this._serverVariables) {
            rval.push(pname);
        }
        return rval;
    }

    /**
     * Creates an OAS 2.0 ServerVariable object.
     * @param name
     * @return {Oas30ServerVariable}
     */
    public createServerVariable(name?: string): Oas30ServerVariable {
        let rval: Oas30ServerVariable = new Oas30ServerVariable(name);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    getItem(name: string): Oas30ServerVariable {
        return this.serverVariable(name);
    }

    getItems(): Oas30ServerVariable[] {
        return this.serverVariables();
    }

    getItemNames(): string[] {
        return this.serverVariableNames();
    }

    addItem(name: string, item: Oas30ServerVariable): void {
        this.addServerVariable(name, item);
    }

    deleteItem(name: string): Oas30ServerVariable {
        return this.removeServerVariable(name);
    }

}


export class Oas30ServerVariableItems {
    [key: string]: Oas30ServerVariable;
}