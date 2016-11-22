import {IOasNodeVisitor, IOas20NodeVisitor} from "../../visitors/visitor.iface";
import {OasNode} from "../node.model";
import {Oas20Header} from "./header.model";

/**
 * Models an OAS 2.0 Headers object.  Example:
 *
 * {
 *     "X-Rate-Limit-Limit": {
 *         "description": "The number of allowed requests in the current period",
 *         "type": "integer"
 *     },
 *     "X-Rate-Limit-Remaining": {
 *         "description": "The number of remaining requests in the current period",
 *         "type": "integer"
 *     },
 *     "X-Rate-Limit-Reset": {
 *         "description": "The number of seconds left in the current period",
 *         "type": "integer"
 *     }
 * }
 */
export class Oas20Headers extends OasNode {

    private _headers: Oas20HeaderItems;

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas20NodeVisitor = <IOas20NodeVisitor> visitor;
        viz.visitHeaders(this);
    }

}


export class Oas20HeaderItems {

    [key: string]: Oas20Header;

}
