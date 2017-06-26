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
import {Oas30ServerVariable} from "./server-variable.model";

/**
 * Models an OAS 3.0 Server object.  Example:
 *
  * {
  *   "url": "https://{username}.gigantic-server.com:{port}/{basePath}",
  *   "description": "The production API server",
  *   "variables": {
  *     "username": {
  *       "default": "demo",
  *       "description": "this value is assigned by the service provider, in this example `gigantic-server.com`"
  *     },
  *     "port": {
  *       "enum": [
  *         8443,
  *         443
  *       ],
  *       "default": 8443
  *     },
  *     "basePath": {
  *       "default": "v2"
  *     }
  *   }
  * }
 */
export class Oas30Server extends OasExtensibleNode {

    public url: string;
    public description: string;
    public variables: Oas30ServerVariables = new Oas30ServerVariables();

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas30NodeVisitor = <IOas30NodeVisitor> visitor;
        viz.visitServer(this);
    }

    /**
     * Creates a server variable.
     * @param name
     * @return {Oas30ServerVariable}
     */
    public createServerVariable(name: string): Oas30ServerVariable {
        let rval: Oas30ServerVariable = new Oas30ServerVariable(name);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    /**
     * Adds a server variable.
     * @param name
     * @param serverVariable
     */
    public addServerVariable(name: string, serverVariable: Oas30ServerVariable): void {
        this.variables[name] = serverVariable;
    }

    /**
     * Gets a single server variable by name.
     * @param name
     * @return {Oas30ServerVariable}
     */
    public getServerVariable(name: string): Oas30ServerVariable {
        return this.variables[name];
    }

    /**
     * Removes a single server variable and returns it.  This may return null or undefined if none found.
     * @param name
     * @return {Oas30ServerVariable}
     */
    public removeServerVariable(name: string): Oas30ServerVariable {
        let rval: Oas30ServerVariable = this.variables[name];
        if (rval) {
            delete this.variables[name];
        }
        return rval;
    }

    /**
     * Gets a list of all server variables.
     * @return {Oas30ServerVariable[]}
     */
    public getServerVariables(): Oas30ServerVariable[] {
        let rval: Oas30ServerVariable[] = [];
        for (let name in this.variables) {
            rval.push(this.variables[name]);
        }
        return rval;
    }

}


/**
 * A single server specified in a Link object.
 */
export class Oas30LinkServer extends Oas30Server {
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas30NodeVisitor = <IOas30NodeVisitor> visitor;
        viz.visitLinkServer(this);
    }

}


export class Oas30ServerVariables {
    [key: string]: Oas30ServerVariable;
}
