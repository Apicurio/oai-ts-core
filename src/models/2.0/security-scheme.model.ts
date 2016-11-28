
import {IOasNodeVisitor, IOas20NodeVisitor} from "../../visitors/visitor.iface";
import {OasExtensibleNode} from "../enode.model";
import {Oas20Scopes} from "./scopes.model";

/**
 * Models an OAS 2.0 Security Scheme object.  Example:
 *
 * {
 *   "type": "oauth2",
 *   "authorizationUrl": "http://swagger.io/api/oauth/dialog",
 *   "flow": "implicit",
 *   "scopes": {
 *     "write:pets": "modify pets in your account",
 *     "read:pets": "read your pets"
 *   }
 * }
 */
export class Oas20SecurityScheme extends OasExtensibleNode {

    private _schemeName: string;
    public type: string;
    public description: string;
    public name: string;
    public in: string;
    public flow: string;
    public authorizationUrl: string;
    public tokenUrl: string;
    public scopes: Oas20Scopes;

    /**
     * Must construct this with a name.
     * @param name
     */
    constructor(name: string) {
        super();
        this._schemeName = name;
    }

    /**
     * Returns the name of the scheme.
     * @return {string}
     */
    public schemeName(): string {
        return this._schemeName;
    }

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas20NodeVisitor = <IOas20NodeVisitor> visitor;
        viz.visitSecurityScheme(this);
    }

    /**
     * Creates a scopes object.
     */
    public createScopes(): Oas20Scopes {
        let rval: Oas20Scopes = new Oas20Scopes();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }
}
