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
import {IOasReferenceNode} from "../reference.model";
import {Oas30Content} from "./content.model";

/**
 * Models an OAS 3.0 RequestBody object.  Example:
 *
 * {
 *  "description": "user to add to the system",
 *  "content": {
 *    "application/json": {
 *      "schema": {
 *        "$ref": "#/components/schemas/User"
 *      },
 *      "examples": {
 *          "user" : {
 *            "summary": "User Example",
 *            "externalValue": "http://foo.bar/examples/user-example.json"
 *          }
 *        }
 *    },
 *    "application/xml": {
 *      "schema": {
 *        "$ref": "#/components/schemas/User"
 *      },
 *      "examples": {
 *          "user" : {
 *            "summary": "User example in XML",
 *            "externalValue": "http://foo.bar/examples/user-example.xml"
 *          }
 *        }
 *    },
 *    "text/plain": {
 *      "examples": {
 *        "user" : {
 *            "summary": "User example in Plain text",
 *            "externalValue": "http://foo.bar/examples/user-example.txt"
 *        }
 *      }
 *    },
 *    "text/*": {
 *      "examples": {
 *        "user" : {
 *            "summary": "User example in other format",
 *            "externalValue": "http://foo.bar/examples/user-example.whatever"
 *        }
 *      }
 *    }
 *  }
 *}
 *
 */
export class Oas30RequestBody extends OasExtensibleNode implements IOasReferenceNode {

    public $ref: string;
    public description: string;
    public content: Oas30Content;
    public required: boolean;

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas30NodeVisitor = <IOas30NodeVisitor> visitor;
        viz.visitRequestBody(this);
    }

    /**
     * Creates a 3.0 Content object.
     * @return {Oas30Content}
     */
    public createContent(): Oas30Content {
        let rval: Oas30Content = new Oas30Content();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

}


/**
 * Models a request body definition found in the components section of an OAS document.
 */
export class Oas30RequestBodyDefinition extends Oas30RequestBody {

    private _name: string;

    /**
     * Constructor.
     * @param name
     */
    constructor(name: string) {
        super();
        this._name = name;
    }

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas30NodeVisitor = <IOas30NodeVisitor> visitor;
        viz.visitRequestBodyDefinition(this);
    }

    /**
     * Gets the schema's property name.
     * @return {string}
     */
    public name(): string {
        return this._name;
    }

}
