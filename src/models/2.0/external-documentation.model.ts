
import {IOasNodeVisitor, IOas20NodeVisitor} from "../../visitors/visitor.iface";
import {OasExtensibleNode} from "../enode.model";

/**
 * Models an OAS 2.0 External Documentation object.  Example:
 *
 * {
 *   "description": "Find more info here",
 *   "url": "https://swagger.io"
 * }
 */
export class Oas20ExternalDocumentation extends OasExtensibleNode {

    public description: string;
    public url: string;

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas20NodeVisitor = <IOas20NodeVisitor> visitor;
        viz.visitExternalDocumentation(this);
    }

}