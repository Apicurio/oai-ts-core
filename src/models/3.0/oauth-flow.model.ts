/**
 * @license
 * Copyright 2017 Red Hat
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {OasExtensibleNode} from "../enode.model";
import {IOas30NodeVisitor, IOasNodeVisitor} from "../../visitors/visitor.iface";
import {Oas30LinkServer} from "./server.model";
import {Oas30Headers} from "./headers.model";
import {Oas30LinkParameters} from "./link-parameters.model";
import {Oas30Scopes} from "./scopes.model";

/**
 * Models an OAS 3.0 OAuth Flow object.
 */
export abstract class Oas30OAuthFlow extends OasExtensibleNode {

    public authorizationUrl: string;
    public tokenUrl: string;
    public refreshUrl: string;
    public scopes: Oas30Scopes;

    /**
     * Creates a Scopes object.
     * @return {Oas30Scopes}
     */
    public createScopes(): Oas30Scopes {
        let rval: Oas30Scopes = new Oas30Scopes();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

}


/**
 * Implicit OAuth flow.
 */
export class Oas30ImplicitOAuthFlow extends Oas30OAuthFlow {

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas30NodeVisitor = visitor as IOas30NodeVisitor;
        viz.visitImplicitOAuthFlow(this);
    }

}


/**
 * Password OAuth flow.
 */
export class Oas30PasswordOAuthFlow extends Oas30OAuthFlow {

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas30NodeVisitor = visitor as IOas30NodeVisitor;
        viz.visitPasswordOAuthFlow(this);
    }

}


/**
 * ClientCredentials OAuth flow.
 */
export class Oas30ClientCredentialsOAuthFlow extends Oas30OAuthFlow {

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas30NodeVisitor = visitor as IOas30NodeVisitor;
        viz.visitClientCredentialsOAuthFlow(this);
    }

}


/**
 * AuthorizationCode OAuth flow.
 */
export class Oas30AuthorizationCodeOAuthFlow extends Oas30OAuthFlow {

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas30NodeVisitor = visitor as IOas30NodeVisitor;
        viz.visitAuthorizationCodeOAuthFlow(this);
    }

}