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

/**
 * Models an OAS 3.0 OAuth Flow object.
 */
export abstract class Oas30OAuthFlow extends OasExtensibleNode {

    public authorizationUrl: string;
    public tokenUrl: string;
    public refreshUrl: string;
    public scopes: any = {};

    public addScope(scope: string, description: string): void {
        this.scopes[scope] = description;
    }

    public removeScope(scope: string): void {
        delete this.scopes[scope];
    }

    public getScopes(): string[] {
        let rval: string[] = [];
        for (let scope in this.scopes) {
            rval.push(scope);
        }
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