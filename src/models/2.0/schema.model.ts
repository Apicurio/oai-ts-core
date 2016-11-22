import {Oas20Contact} from "./contact.model";
import {Oas20License} from "./license.model";
import {OasExtensibleNode} from "../enode.model";
import {IOasNodeVisitor, IOas20NodeVisitor} from "../../visitors/visitor.iface";

/**
 * Models an OAS 2.0 Schema object.  Example:
 *
 */
export class Oas20Schema extends OasExtensibleNode {

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas20NodeVisitor = <IOas20NodeVisitor> visitor;
        viz.visitSchema(this);
    }

}