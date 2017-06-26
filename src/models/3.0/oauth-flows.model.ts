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
import {
    Oas30AuthorizationCodeOAuthFlow,
    Oas30ClientCredentialsOAuthFlow, Oas30ImplicitOAuthFlow,
    Oas30PasswordOAuthFlow
} from "./oauth-flow.model";

/**
 * Models an OAS 3.0 OAuth Flows object.
 */
export class Oas30OAuthFlows extends OasExtensibleNode {

    public implicit: Oas30ImplicitOAuthFlow;
    public password: Oas30PasswordOAuthFlow;
    public clientCredentials: Oas30ClientCredentialsOAuthFlow;
    public authorizationCode: Oas30AuthorizationCodeOAuthFlow;

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas30NodeVisitor = visitor as IOas30NodeVisitor;
        viz.visitOAuthFlows(this);
    }

    /**
     * Creates an OAuth Flow object.
     * @return {Oas30ImplicitOAuthFlow}
     */
    public createImplicitOAuthFlow(): Oas30ImplicitOAuthFlow {
        let rval: Oas30ImplicitOAuthFlow = new Oas30ImplicitOAuthFlow();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    /**
     * Creates an OAuth Flow object.
     * @return {Oas30PasswordOAuthFlow}
     */
    public createPasswordOAuthFlow(): Oas30PasswordOAuthFlow {
        let rval: Oas30PasswordOAuthFlow = new Oas30PasswordOAuthFlow();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    /**
     * Creates an OAuth Flow object.
     * @return {Oas30ClientCredentialsOAuthFlow}
     */
    public createClientCredentialsOAuthFlow(): Oas30ClientCredentialsOAuthFlow {
        let rval: Oas30ClientCredentialsOAuthFlow = new Oas30ClientCredentialsOAuthFlow();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    /**
     * Creates an OAuth Flow object.
     * @return {Oas30AuthorizationCodeOAuthFlow}
     */
    public createAuthorizationCodeOAuthFlow(): Oas30AuthorizationCodeOAuthFlow {
        let rval: Oas30AuthorizationCodeOAuthFlow = new Oas30AuthorizationCodeOAuthFlow();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

}
