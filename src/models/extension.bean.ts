import {OasNode} from "./node.bean";
import {IOasNodeVisitor} from "../visitors/visitor.iface";

/**
 * Models an extension node in an OAS document.  For example, in OAS version 2, any
 * property that begins with "x-" is a valid extension node (vendor extension).
 */
export class OasExtension extends OasNode {

    public name: string;
    public value: any;

    /**
     * Accepts the given node visitor.  Calls the appropriate method on the visitor.
     * @param visitor
     */
    accept(visitor: IOasNodeVisitor): void {
        visitor.visitExtension(this);
    }

}