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

import {Oas20Contact} from "./contact.model";
import {Oas20License} from "./license.model";
import {OasExtensibleNode} from "../enode.model";
import {IOasNodeVisitor, IOas20NodeVisitor} from "../../visitors/visitor.iface";

/**
 * Models an OAS 2.0 Info object.  Example:
 *
 * {
 *   "title": "Swagger Sample App",
 *   "description": "This is a sample server Petstore server.",
 *   "termsOfService": "http://swagger.io/terms/",
 *   "contact": {
 *     "name": "API Support",
 *     "url": "http://www.swagger.io/support",
 *     "email": "support@swagger.io"
 *   },
 *   "license": {
 *     "name": "Apache 2.0",
 *     "url": "http://www.apache.org/licenses/LICENSE-2.0.html"
 *   },
 *   "version": "1.0.1"
 * }
 */
export class Oas20Info extends OasExtensibleNode {

    public title: string;
    public description: string;
    public termsOfService: string;
    public contact: Oas20Contact;
    public license: Oas20License;
    public version: string;

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas20NodeVisitor = <IOas20NodeVisitor> visitor;
        viz.visitInfo(this);
    }

    /**
     * Creates an OAS 2.0 contact object.
     * @return {Oas20Contact}
     */
    public createContact(): Oas20Contact {
        let rval: Oas20Contact = new Oas20Contact();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    /**
     * Creates an OAS 2.0 license object.
     * @return {Oas20License}
     */
    public createLicense(): Oas20License {
        let rval: Oas20License = new Oas20License();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

}