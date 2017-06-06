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

import {IOas30NodeVisitor, IOasNodeVisitor} from "../../visitors/visitor.iface";
import {OasExtensibleNode} from "../enode.model";
import {Oas30SchemaDefinition} from "./schema.model";

/**
 * Models an OAS 3.0 Components object.  Example:
 *
 * {
 *   "schemas": {
 *       "Category": {
 *         "type": "object",
 *         "properties": {
 *           "id": {
 *             "type": "integer",
 *             "format": "int64"
 *           },
 *           "name": {
 *             "type": "string"
 *           }
 *         }
 *       },
 *       "Tag": {
 *         "type": "object",
 *         "properties": {
 *           "id": {
 *             "type": "integer",
 *             "format": "int64"
 *           },
 *           "name": {
 *             "type": "string"
 *           }
 *         }
 *       }
 *     }
 *   },
 *  "parameters": {
 *     "skipParam": {
 *       "name": "skip",
 *       "in": "query",
 *       "description": "number of items to skip",
 *       "required": true,
 *       "schema": {
 *         "type": "integer",
 *         "format": "int32"
 *       }
 *     },
 *     "limitParam": {
 *       "name": "limit",
 *       "in": "query",
 *       "description": "max records to return",
 *       "required": true,
 *       "schema" : {
 *         "type": "integer",
 *         "format": "int32"
 *       }
 *     }
 *   },
 *  "responses": {
 *     "NotFound": {
 *       "description": "Entity not found."
 *     },
 *     "IllegalInput": {
 *       "description": "Illegal input for operation."
 *     },
 *     "GeneralError": {
 *       "description": "General Error",
 *       "content": {
 *         "application/json": {
 *           "schema": {
 *             "$ref": "#/components/schemas/GeneralError"
 *           }
 *         }
 *       }
 *     }
 *   },
 *  "securitySchemes": {
 *     "api_key": {
 *       "type": "apiKey",
 *       "name": "api_key",
 *       "in": "header"
 *     },
 *     "petstore_auth": {
 *       "type": "oauth2",
 *       "flows": {
 *         "implicit": {
 *           "authorizationUrl": "http://example.org/api/oauth/dialog",
 *           "scopes": {
 *             "write:pets": "modify pets in your account",
 *             "read:pets": "read your pets"
 *           }
 *         }
 *       }
 *     }
 *   }
 * }
 */
export class Oas30Components extends OasExtensibleNode {

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas30NodeVisitor = visitor as IOas30NodeVisitor;
        viz.visitComponents(this);
    }

}


export class Oas30SchemaComponents {
    [key: string]: Oas30SchemaDefinition;
}
