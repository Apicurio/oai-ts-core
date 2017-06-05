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
import {Oas30ServerVariables} from "./server-variables.model";
import {IOas30NodeVisitor, IOasNodeVisitor} from "../../visitors/visitor.iface";

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
    public variables: Oas30ServerVariables;

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas30NodeVisitor = <IOas30NodeVisitor> visitor;
        viz.visitServer(this);
    }

    /**
     * Creates an OAS 3.0 Server Variables object.
     * @return {Oas30ServerVariables}
     */
    public createServerVariables(): Oas30ServerVariables {
        let rval: Oas30ServerVariables = new Oas30ServerVariables();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
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
