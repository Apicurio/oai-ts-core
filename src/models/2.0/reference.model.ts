
import {OasNode} from "../node.model";
import {IOasNodeVisitor, IOas20NodeVisitor} from "../../visitors/visitor.iface";

/**
 * Models an OAS 2.0 Reference object.  Example:
 *
 * {
 *    "$ref": "#/definitions/Pet"
 * }
 */
export class Oas20Reference extends OasNode {

    public $ref: string;

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas20NodeVisitor = <IOas20NodeVisitor> visitor;
        viz.visitReference(this);
    }

}