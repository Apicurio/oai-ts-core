
import {OasNode} from "../models/node.model";
import {IOasNodeVisitor, IOas20NodeVisitor} from "./visitor.iface";
import {Oas20Traverser} from "./traverser";
import {Oas20ModelToJSVisitor} from "./model2js.visitor";

/**
 * Some static convenience methods for visiting an OAS node/tree.
 */
export class OasVisitorUtil {

    /**
     * Convenience method for visiting a single node.
     * @param node
     * @param visitor
     */
    public static visitNode(node: OasNode, visitor: IOasNodeVisitor) {
        node.accept(visitor);
    }

    /**
     * Convenience method for visiting an OAS tree.  This will traverse and visit
     * all nodes starting with the given one and traversing down.
     * @param node the node to traverse and visit
     * @param visitor the visitor to call for each node visited
     */
    public static visitTree(node: OasNode, visitor: IOasNodeVisitor) {
        if (node.ownerDocument().getSpecVersion() === "2.0") {
            let traverser: Oas20Traverser = new Oas20Traverser(<IOas20NodeVisitor> visitor);
            traverser.traverse(node);
        } else {
            throw new Error("OAS version " + node.ownerDocument().getSpecVersion() + " not supported.");
        }
    }

    /**
     * Convenience method to convert from a model to a plain JS object, suitable for JSONifying.
     * @param node
     */
    public static model2js(node: OasNode): any {
        if (node._ownerDocument.getSpecVersion() === "2.0") {
            let visitor: Oas20ModelToJSVisitor = new Oas20ModelToJSVisitor();
            OasVisitorUtil.visitTree(node, visitor);
            return visitor.getResult();
        } else {
            throw new Error("OAS version " + node._ownerDocument.getSpecVersion() + " not supported.");
        }
    }
}