import {IOasNodeVisitor, IOas20NodeVisitor} from "../../visitors/visitor.iface";
import {OasNode} from "../node.model";
import {Oas20ResponseDefinition} from "./response.model";

/**
 * Models an OAS 2.0 Responses Definitions object.  The Responses Definitions object can have any
 * number of child responses, where the field name is the name of the response and the value is a Response
 * object.  Example:
 *
 * {
 *   "NotFound": {
 *     "description": "Entity not found."
 *   },
 *   "IllegalInput": {
 *     "description": "Illegal input for operation."
 *   },
 *   "GeneralError": {
 *     "description": "General Error",
 *     "schema": {
 *         "$ref": "#/definitions/GeneralError"
 *     }
 *   }
 * }
 */
export class Oas20ResponsesDefinitions extends OasNode {

    private _responses: Oas20ResponsesDefinitionsItems = new Oas20ResponsesDefinitionsItems();

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas20NodeVisitor = <IOas20NodeVisitor> visitor;
        viz.visitResponsesDefinitions(this);
    }

    /**
     * Returns a single response by name.
     * @param name
     * @return {Oas20ResponseDefinition}
     */
    public response(name: string): Oas20ResponseDefinition {
        return this._responses[name];
    }

    /**
     * Adds a response.
     * @param name
     * @param schema
     */
    public addResponse(name: string, schema: Oas20ResponseDefinition): void {
        this._responses[name] = schema;
    }

    /**
     * Removes a response by name.
     * @param name
     */
    public removeResponse(name: string): void {
        delete this._responses[name];
    }

    /**
     * Gets a list of all the response names.
     */
    public responseNames(): string[] {
        let rval: string[] = [];
        for (let name in this._responses) {
            rval.push(name);
        }
        return rval;
    }

    /**
     * Creates an OAS 2.0 Response object.
     * @param name
     * @return {Oas20ResponseDefinition}
     */
    public createResponse(name: string): Oas20ResponseDefinition {
        let rval: Oas20ResponseDefinition = new Oas20ResponseDefinition(name);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

}

export class Oas20ResponsesDefinitionsItems {

    [key: string]: Oas20ResponseDefinition;

}
