
import {IOasNodeVisitor, IOas20NodeVisitor} from "../../visitors/visitor.iface";
import {OasExtensibleNode} from "../enode.model";

/**
 * Models an OAS 2.0 OAuth Scopes object.  Example:
 *
 * {
 *   "write:pets": "modify pets in your account",
 *   "read:pets": "read your pets"
 * }
 */
export class Oas20Scopes extends OasExtensibleNode {

    private _items: Oas20ScopeItems = new Oas20ScopeItems();

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas20NodeVisitor = <IOas20NodeVisitor> visitor;
        viz.visitScopes(this);
    }

    /**
     * Returns all the scopes.
     * @return {string[]}
     */
    public scopes(): string[] {
        let rval: string[] = [];
        for (let scope in this._items) {
            rval.push(scope);
        }
        return rval;
    }

    /**
     * Gets a scope description.
     * @param scope
     * @return {string}
     */
    public getScopeDescription(scope: string): string {
        return this._items[scope];
    }

    /**
     * Adds a scope to the map.
     * @param scope
     * @param description
     */
    public addScope(scope: string, description: string): void {
        this._items[scope] = description;
    }

    /**
     * Removes a scope.
     * @param scope
     */
    public removeScope(scope: string): void {
        if (this._items[scope]) {
            delete this._items[scope];
        }
    }

}

export class Oas20ScopeItems {

    [key: string]: string;

}
