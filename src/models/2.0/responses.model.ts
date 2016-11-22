import {OasExtensibleNode} from "../enode.model";
import {IOasNodeVisitor, IOas20NodeVisitor} from "../../visitors/visitor.iface";
import {Oas20Reference} from "./reference.model";
import {Oas20Response} from "./response.model";

/**
 * Models an OAS 2.0 Responses object.  The Responses object can have any number of child
 * responses, where the field names are either 'default' or an HTTP status code.  Example:
 *
 * {
 *   "200": {
 *     "description": "a pet to be returned",
 *     "schema": {
 *       "$ref": "#/definitions/Pet"
 *     }
 *   },
 *   "default": {
 *     "description": "Unexpected error",
 *     "schema": {
 *       "$ref": "#/definitions/ErrorModel"
 *     }
 *   }
 * }
 */
export class Oas20Responses extends OasExtensibleNode {

    private default: Oas20Response | Oas20Reference;
    private _responses: Oas20ResponseItems;

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas20NodeVisitor = <IOas20NodeVisitor> visitor;
        viz.visitResponses(this);
    }

    /**
     * Returns a single response by status code.
     * @param statusCode
     * @return {Oas20Response}
     */
    public response(statusCode: string): Oas20Response | Oas20Reference {
        return this._responses[statusCode];
    }

    /**
     * Adds a response.
     * @param name
     * @param response
     */
    public addResponse(statusCode: string, response: Oas20Response | Oas20Reference) {
        this._responses[statusCode] = response;
    }

    /**
     * Gets a list of all the response names.
     */
    public responseNames(): string[] {
        let rval: string[] = [];
        for (let pname in this._responses) {
            rval.push(pname);
        }
        return rval;
    }

    /**
     * Creates an OAS 2.0 response object.
     * @return {Oas20Response}
     */
    public createResponse(name: string): Oas20Response {
        let rval: Oas20Response = new Oas20Response();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    public createReference($ref: string): Oas20Reference {
        let rval: Oas20Reference = new Oas20Reference();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        rval.$ref = $ref;
        return rval;
    }

}


export class Oas20ResponseItems {
    [key: string]: Oas20Response | Oas20Reference;
}
