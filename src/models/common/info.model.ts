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

import {OasLicense} from "./license.model";
import {OasExtensibleNode} from "../enode.model";
import {IOasNodeVisitor} from "../../visitors/visitor.iface";
import {OasContact} from "./contact.model";

/**
 * Models an OAS Info object.
 */
export abstract class OasInfo extends OasExtensibleNode {

    public title: string;
    public description: string;
    public termsOfService: string;
    public contact: OasContact;
    public license: OasLicense;
    public version: string;

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        visitor.visitInfo(this);
    }

    /**
     * Creates an OAS contact object.
     * @return {Oas30Contact}
     */
    public abstract createContact(): OasContact;

    /**
     * Creates an OAS license object.
     * @return {OasLicense}
     */
    public abstract createLicense(): OasLicense;

}