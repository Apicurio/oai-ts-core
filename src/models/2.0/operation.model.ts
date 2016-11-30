
import {IOasNodeVisitor, IOas20NodeVisitor} from "../../visitors/visitor.iface";
import {Oas20Parameter} from "./parameter.model";
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

    private _method: string;
    public tags: string[];
    public summary: string;
    public description: string;
    public externalDocs: Oas20ExternalDocumentation;
    public operationId: string;
    public consumes: string[];
    public produces: string[];
    public parameters: Oas20Parameter[];
    public responses: Oas20Responses;
    public schemes: string[];
    public deprecated: boolean;
    public security: Oas20SecurityRequirement[];

    /**
     * Constructor.
     * @param method
     */
    constructor(method: string) {
        super();
        this._method = method;
    }

    /**
     * Gets the method for this operation (get, put, post, etc).
     * @return {string}
     */
    public method(): string {
        return this._method;
    }

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas20NodeVisitor = <IOas20NodeVisitor> visitor;
        viz.visitOperation(this);
    }

    /**
     * Creates a child external documentation model.
     * @return {Oas20ExternalDocumentation}
     */
    public createExternalDocumentation(): Oas20ExternalDocumentation {
        let rval: Oas20ExternalDocumentation = new Oas20ExternalDocumentation();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    /**
     * Creates a child parameter model.
     * @return {Oas20Parameter}
     */
    public createParameter(): Oas20Parameter {
        let rval: Oas20Parameter = new Oas20Parameter();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    /**
     * Adds a parameter.
     * @param parameter
     */
    public addParameter(parameter: Oas20Parameter): void {
        if (this.parameters == null) {
            this.parameters = [];
        }
        this.parameters.push(parameter);
    }

    /**
     * Creates a child responses model.
     * @return {Oas20Responses}
     */
    public createResponses(): Oas20Responses {
        let rval: Oas20Responses = new Oas20Responses();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    /**
     * Creates a child security requirement model.
     * @return {Oas20SecurityRequirement}
     */
    public createSecurityRequirement(): Oas20SecurityRequirement {
        let rval: Oas20SecurityRequirement = new Oas20SecurityRequirement();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    /**
     * Adds a security requirement child.
     * @param securityRequirement
     */
    public addSecurityRequirement(securityRequirement: Oas20SecurityRequirement): void {
        if (this.security == null) {
            this.security = [];
        }
        this.security.push(securityRequirement);
    }
}