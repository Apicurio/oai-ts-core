
import {IOasNodeVisitor, IOas20NodeVisitor} from "../../visitors/visitor.iface";
import {OasNode} from "../node.model";

/**
 * Models an OAS 2.0 Security Requirement object.  Example:
 *
 * {
 *   "petstore_auth": [
 *     "write:pets",
 *     "read:pets"
 *   ]
 * }
 */
export class Oas20SecurityRequirement extends OasNode {

    public _items: Oas20SecurityRequirementItems = new Oas20SecurityRequirementItems();

    /**
     * Gets the names of all the security requirements.
     * @return {string[]}
     */
    public securityRequirementNames(): string[] {
        let rval: string[] = [];
        for (let pname in this._items) {
            rval.push(pname);
        }
        return rval;
    }

    /**
     * Gets the scopes defined for this security requirement.  This is only valid if the
     * type of security is oauth2.
     * @return {string[]}
     */
    public scopes(name: string): string[] {
        return this._items[name];
    }

    /**
     * Adds a security requirement item.
     * @param name
     * @param scopes
     */
    public addSecurityRequirementItem(name: string, scopes?: string[]): void {
        if (!scopes) {
            scopes = [];
        }
        this._items[name] = scopes;
    }

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas20NodeVisitor = <IOas20NodeVisitor> visitor;
        viz.visitSecurityRequirement(this);
    }

}

export class Oas20SecurityRequirementItems {

    [key: string]: string[];

}
