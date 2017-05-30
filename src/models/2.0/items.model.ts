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

import {IOasNodeVisitor, IOas20NodeVisitor} from "../../visitors/visitor.iface";
import {OasExtensibleNode} from "../enode.model";


export interface IOas20Items {

    type: string; // required
    format: string;
    items: Oas20Items; // required if type is 'array'
    collectionFormat: string;
    default: any;
    maximum: number;
    exclusiveMaximum: boolean;
    minimum: number;
    exclusiveMinimum: boolean;
    maxLength: number; // Require: integer
    minLength: number; // Require: integer
    pattern: string;
    maxItems: number; // Require: integer
    minItems: number; // Require: integer
    uniqueItems: boolean;
    enum: any[];
    multipleOf: number;

    createItems(): Oas20Items;

}


/**
 * Models an OAS 2.0 Items object.  Example:
 */
export class Oas20Items extends OasExtensibleNode implements IOas20Items {

    public type: string; // required
    public format: string;
    public items: Oas20Items; // required if type is 'array'
    public collectionFormat: string;
    public default: any;
    public maximum: number;
    public exclusiveMaximum: boolean;
    public minimum: number;
    public exclusiveMinimum: boolean;
    public maxLength: number; // Require: integer
    public minLength: number; // Require: integer
    public pattern: string;
    public maxItems: number; // Require: integer
    public minItems: number; // Require: integer
    public uniqueItems: boolean;
    public enum: any[];
    public multipleOf: number;

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas20NodeVisitor = <IOas20NodeVisitor> visitor;
        viz.visitItems(this);
    }

    /**
     * Creates a child items model.
     * @return {Oas20Items}
     */
    public createItems(): Oas20Items {
        let rval: Oas20Items = new Oas20Items();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }
}
