import {IOasNodeVisitor, IOas20NodeVisitor} from "../../visitors/visitor.iface";
import {OasNode} from "../node.model";
import {Oas20Header} from "./header.model";

/**
 * Models an OAS 2.0 Example object.  Example:
 *
 * {
 *   "application/json": {
 *     "name": "Puma",
 *     "type": "Dog",
 *     "color": "Black",
 *     "gender": "Female",
 *     "breed": "Mixed"
 *   }
 * }
 */
export class Oas20Example extends OasNode {

    private _examples: Oas20ExampleItems;

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas20NodeVisitor = <IOas20NodeVisitor> visitor;
        viz.visitExample(this);
    }

}


export class Oas20ExampleItems {

    [key: string]: any;

}
