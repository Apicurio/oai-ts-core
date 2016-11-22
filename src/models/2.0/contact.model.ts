
import {IOasNodeVisitor, IOas20NodeVisitor} from "../../visitors/visitor.iface";
import {OasExtensibleNode} from "../enode.model";

/**
 * Models an OAS 2.0 Contact object.  Example:
 *
 * {
 *   "name": "API Support",
 *   "url": "http://www.swagger.io/support",
 *   "email": "support@swagger.io"
 * }
 */
export class Oas20Contact extends OasExtensibleNode {

    public name: string;
    public url: string;
    public email: string;

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas20NodeVisitor = <IOas20NodeVisitor> visitor;
        viz.visitContact(this);
    }

}