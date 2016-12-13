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

    /**
     * Gets a single header by name.
     * @param headerName
     * @return {Oas20Header}
     */
    public header(headerName: string): Oas20Header {
        return this._headers[headerName];
    }

    /**
     * Returns all the header names.
     * @return {string[]}
     */
    public headerNames(): string[] {
        let rval: string[] = [];
        for (let name in this._headers) {
            rval.push(name);
        }
        return rval;
    }

    /**
     * Removes a single header.
     * @param headerName
     */
    public removeHeader(headerName: string): void {
        if (this._headers && this._headers[headerName]) {
            delete this._headers[headerName];
        }
    }

    /**
     * Adds a header.
     * @param headerName
     * @param header
     */
    public addHeader(headerName: string, header: Oas20Header): Oas20Header {
        if (this._headers == null) {
            this._headers = new Oas20HeaderItems();
        }
        this._headers[headerName] = header;
        return header;
    }

    /**
     * Creates a header model.
     * @param headerName
     * @return {Oas20Header}
     */
    public createHeader(headerName: string): Oas20Header {
        let rval: Oas20Header = new Oas20Header(headerName);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

}


export class Oas20HeaderItems {

    [key: string]: Oas20Header;

}
