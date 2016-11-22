
import {IOasNodeVisitor, IOas20NodeVisitor} from "../../visitors/visitor.iface";
import {Oas20Operation} from "./operation.model";
import {Oas20Parameter} from "./parameter.model";
import {Oas20Reference} from "./reference.model";
import {OasExtensibleNode} from "../enode.model";

/**
 * Models an OAS 2.0 Path Item object.  Example:
 *
 * {
 *   "get": {
 *     "description": "Returns pets based on ID",
 *     "summary": "Find pets by ID",
 *     "operationId": "getPetsById",
 *     "produces": [
 *       "application/json",
 *       "text/html"
 *     ],
 *     "responses": {
 *       "200": {
 *         "description": "pet response",
 *         "schema": {
 *          "type": "array",
 *           "items": {
 *             "$ref": "#/definitions/Pet"
 *           }
 *         }
 *       },
 *       "default": {
 *         "description": "error payload",
 *         "schema": {
 *           "$ref": "#/definitions/ErrorModel"
 *         }
 *       }
 *     }
 *   },
 *   "parameters": [
 *     {
 *       "name": "id",
 *       "in": "path",
 *       "description": "ID of pet to use",
 *       "required": true,
 *       "type": "array",
 *       "items": {
 *         "type": "string"
 *       },
 *       "collectionFormat": "csv"
 *     }
 *   ]
 * }
 *
 */
export class Oas20PathItem extends OasExtensibleNode {

    public $ref: string;
    public get: Oas20Operation;
    public put: Oas20Operation;
    public post: Oas20Operation;
    public delete: Oas20Operation;
    public options: Oas20Operation;
    public head: Oas20Operation;
    public patch: Oas20Operation;
    public parameters: (Oas20Parameter | Oas20Reference)[];

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas20NodeVisitor = <IOas20NodeVisitor> visitor;
        viz.visitPathItem(this);
    }

    /**
     * Creates an OAS 2.0 operation object.
     * @return {Oas20Operation}
     */
    public createOperation(): Oas20Operation {
        let rval: Oas20Operation = new Oas20Operation();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

}