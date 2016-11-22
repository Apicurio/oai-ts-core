
import {IOasNodeVisitor, IOas20NodeVisitor} from "../../visitors/visitor.iface";
import {Oas20Parameter} from "./parameter.model";
import {Oas20Reference} from "./reference.model";
import {OasExtensibleNode} from "../enode.model";
import {Oas20ExternalDocumentation} from "./external-documentation.model";
import {Oas20SecurityRequirement} from "./security-requirement.model";
import {Oas20Responses} from "./responses.model";

/**
 * Models an OAS 2.0 Operation object.  Example:
 *
 * {
 *   "tags": [
 *     "pet"
 *   ],
 *   "summary": "Updates a pet in the store with form data",
 *   "description": "",
 *   "operationId": "updatePetWithForm",
 *   "consumes": [
 *     "application/x-www-form-urlencoded"
 *   ],
 *   "produces": [
 *     "application/json",
 *     "application/xml"
 *   ],
 *   "parameters": [
 *     {
 *       "name": "petId",
 *       "in": "path",
 *       "description": "ID of pet that needs to be updated",
 *       "required": true,
 *       "type": "string"
 *     },
 *     {
 *       "name": "name",
 *       "in": "formData",
 *       "description": "Updated name of the pet",
 *       "required": false,
 *       "type": "string"
 *     },
 *     {
 *       "name": "status",
 *       "in": "formData",
 *       "description": "Updated status of the pet",
 *       "required": false,
 *       "type": "string"
 *     }
 *   ],
 *   "responses": {
 *     "200": {
 *       "description": "Pet updated."
 *     },
 *     "405": {
 *       "description": "Invalid input"
 *     }
 *   },
 *   "security": [
 *     {
 *       "petstore_auth": [
 *         "write:pets",
 *         "read:pets"
 *       ]
 *     }
 *   ]
 * }
 */
export class Oas20Operation extends OasExtensibleNode {

    public tags: string[];
    public summary: string;
    public description: string;
    public externalDocs: Oas20ExternalDocumentation;
    public operationId: string;
    public consumes: string[];
    public produces: string[];
    public parameters: (Oas20Parameter | Oas20Reference)[];
    public responses: Oas20Responses;
    public schemes: string[];
    public deprecated: boolean;
    public security: Oas20SecurityRequirement[];

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas20NodeVisitor = <IOas20NodeVisitor> visitor;
        viz.visitOperation(this);
    }

}