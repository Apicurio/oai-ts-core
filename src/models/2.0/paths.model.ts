import {OasExtensibleNode} from "../enode.model";
import {IOasNodeVisitor, IOas20NodeVisitor} from "../../visitors/visitor.iface";
import {Oas20PathItem} from "./path-item.model";

/**
 * Models an OAS 2.0 Paths object.  The Paths object can have any number of child
 * paths, where the field name begins with '/'.  Example:
 *
 * {
 *   "/pets": {
 *     "get": {
 *       "description": "Returns all pets from the system that the user has access to",
 *       "produces": [
 *         "application/json"
 *       ],
 *       "responses": {
 *         "200": {
 *           "description": "A list of pets.",
 *           "schema": {
 *             "type": "array",
 *             "items": {
 *               "$ref": "#/definitions/pet"
 *             }
 *           }
 *         }
 *       }
 *     }
 *   }
 * }
 *
 */
export class Oas20Paths extends OasExtensibleNode {

    private _pathItems: Oas20PathItems;

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas20NodeVisitor = <IOas20NodeVisitor> visitor;
        viz.visitPaths(this);
    }

    /**
     * Returns a single path item by name.
     * @param name
     * @return {Oas20PathItem}
     */
    public pathItem(name: string): Oas20PathItem {
        return this._pathItems[name];
    }

    /**
     * Adds a path item.
     * @param name
     * @param pathItem
     */
    public addPathItem(name: string, pathItem: Oas20PathItem) {
        this._pathItems[name] = pathItem;
    }

    /**
     * Gets a list of all the path names.
     */
    public pathItemNames(): string[] {
        let rval: string[] = [];
        for (let pname in this._pathItems) {
            rval.push(pname);
        }
        return rval;
    }

    /**
     * Creates an OAS 2.0 path item object.
     * @return {Oas20PathItem}
     */
    public createPathItem(name: string): Oas20PathItem {
        let rval: Oas20PathItem = new Oas20PathItem();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        this._pathItems[name] = rval;
        return rval;
    }

}

export class Oas20PathItems {

    [key: string]: Oas20PathItem;

}
