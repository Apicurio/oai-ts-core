
import {IOasNodeVisitor, IOas20NodeVisitor} from "../../visitors/visitor.iface";
import {OasExtensibleNode} from "../enode.model";

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
export class Oas20Parameter extends OasExtensibleNode {

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas20NodeVisitor = <IOas20NodeVisitor> visitor;
        viz.visitParameter(this);
    }

}