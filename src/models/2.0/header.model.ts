import {OasExtensibleNode} from "../enode.model";
import {IOasNodeVisitor, IOas20NodeVisitor} from "../../visitors/visitor.iface";
import {Oas20Items} from "./items.model";

/**
 * Models an OAS 2.0 Header object.  Example:
 *
 * {
 *   "description": "The number of allowed requests in the current period",
 *   "type": "integer"
 * }
 */
export class Oas20Header extends Oas20Items {

    private _headerName: string;
    public description: string;

    /**
     * Constructor.
     * @param headerName
     */
    constructor(headerName: string) {
        super();
        this._headerName = headerName;
    }

    /**
     * Gets the header name.
     * @return {string}
     */
    public headerName(): string {
        return this._headerName;
    }

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas20NodeVisitor = <IOas20NodeVisitor> visitor;
        viz.visitHeader(this);
    }

}
