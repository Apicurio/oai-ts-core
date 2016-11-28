
import {IOasNodeVisitor, IOas20NodeVisitor} from "../../visitors/visitor.iface";
import {OasExtensibleNode} from "../enode.model";
import {Oas20Schema} from "./schema.model";
import {Oas20Items} from "./items.model";

/**
 * Models an OAS 2.0 Parameter object.  Example:
 *
 * {
 *   "name": "user",
 *   "in": "body",
 *   "description": "user to add to the system",
 *   "required": true,
 *   "schema": {
 *     "$ref": "#/definitions/User"
 *   }
 * }
 */
export class Oas20Parameter extends Oas20Items {

    public name: string;
    public in: string;
    public description: string;
    public required: boolean;
    public schema: Oas20Schema;
    public allowEmptyValue: boolean;

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas20NodeVisitor = <IOas20NodeVisitor> visitor;
        viz.visitParameter(this);
    }

    /**
     * Creates a child schema model.
     * @return {Oas20Schema}
     */
    public createSchema(): Oas20Schema {
        let rval: Oas20Schema = new Oas20Schema();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

}