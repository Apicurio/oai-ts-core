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

import {IOasNodeVisitor} from "../../visitors/visitor.iface";
import {OasNode} from "../node.model";

/**
 * Models an OAS Security Requirement object.
 */
export class OasSecurityRequirement extends OasNode {

    public _items: OasSecurityRequirementItems = new OasSecurityRequirementItems();

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
        visitor.visitSecurityRequirement(this);
    }

}

export class OasSecurityRequirementItems {

    [key: string]: string[];

}
