import {IOasNodeVisitor, IOas20NodeVisitor} from "../../visitors/visitor.iface";
import {OasExtensibleNode} from "../enode.model";

/**
 * Models an OAS 2.0 License object.  Example:
 *
 * {
 *   "name": "Apache 2.0",
 *   "url": "http://www.apache.org/licenses/LICENSE-2.0.html"
 * }
 */
export class Oas20License extends OasExtensibleNode {

    public name: string;
    public url: string;

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas20NodeVisitor = <IOas20NodeVisitor> visitor;
        viz.visitLicense(this);
    }

}