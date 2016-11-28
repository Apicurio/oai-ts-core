
import {IOasNodeVisitor, IOas20NodeVisitor} from "../../visitors/visitor.iface";
import {OasNode} from "../node.model";
import {Oas20SecurityScheme} from "./security-scheme.model";

/**
 * Models an OAS 2.0 Security Definitions object.  Example:
 *
 * {
 *   "api_key": {
 *     "type": "apiKey",
 *     "name": "api_key",
 *     "in": "header"
 *   },
 *   "petstore_auth": {
 *     "type": "oauth2",
 *     "authorizationUrl": "http://swagger.io/api/oauth/dialog",
 *     "flow": "implicit",
 *     "scopes": {
 *       "write:pets": "modify pets in your account",
 *       "read:pets": "read your pets"
 *     }
 *   }
 * }
 */
export class Oas20SecurityDefinitions extends OasNode {

    private _items: Oas20SecuritySchemeItems = new Oas20SecuritySchemeItems();

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas20NodeVisitor = <IOas20NodeVisitor> visitor;
        viz.visitSecurityDefinitions(this);
    }

    /**
     * Gets a list of all the security scheme names.
     */
    public securitySchemeNames(): string[] {
        let rval: string[] = [];
        for (let pname in this._items) {
            rval.push(pname);
        }
        return rval;
    }

    /**
     * Returns a single security scheme by name.
     * @param name
     * @return {Oas20SecurityScheme}
     */
    public securityScheme(name: string): Oas20SecurityScheme {
        return this._items[name];
    }

    /**
     * Removes a single security scheme by name.
     * @param name
     */
    public removeSecurityScheme(name: string): void {
        if (this._items[name]) {
            delete this._items[name];
        }
    }

    /**
     * Creates a child security scheme object and adds it to the list.
     * @param name
     * @return {Oas20SecurityScheme}
     */
    public createSecurityScheme(name: string): Oas20SecurityScheme {
        let rval: Oas20SecurityScheme = new Oas20SecurityScheme(name);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        this._items[name] = rval;
        return rval;
    }

}

export class Oas20SecuritySchemeItems {

    [key: string]: Oas20SecurityScheme;

}
