
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

    public _name: string;
    public _scopes: string[];

    /**
     * Gets the name of the security requirement - this must match one of the security
     * definitions declared earlier in the document.
     * @return {string}
     */
    public name(): string {
        return this._name;
    }

    /**
     * Gets the scopes defined for this security requirement.  This is only valid if the
     * type of security is oauth2.
     * @return {string[]}
     */
    public scopes(): string[] {
        return this._scopes;
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