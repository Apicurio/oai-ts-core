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

import {OasContact} from "../common/contact.model";
import {OasNode} from "../node.model";
import {IOasIndexedNode} from "../inode.model";
import {IOas30NodeVisitor, IOasNodeVisitor} from "../../visitors/visitor.iface";
import {Oas30EncodingProperty} from "./encoding-property.model";

/**
 * Models an OAS 3.0 Encoding object.  Example:
 *
 * {
 *   "historyMetadata": {
 *     "contentType": "application/xml; charset=utf-8"
 *   },
 *   "profileImage": {
 *     "contentType": "image/png, image/jpeg"
 *   }
 * }
 */
export class Oas30Encoding extends OasNode implements IOasIndexedNode<Oas30EncodingProperty> {

    __instanceof_IOasIndexedNode: boolean = true;

    private _encodingProperties: Oas30EncodingPropertyItems;

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas30NodeVisitor = visitor as IOas30NodeVisitor;
        viz.visitEncoding(this);
    }

    /**
     * Returns a single encodingProperty by name.
     * @param name
     * @return {Oas30EncodingProperty}
     */
    public encodingProperty(name: string): Oas30EncodingProperty {
        if (this._encodingProperties) {
            return this._encodingProperties[name];
        } else {
            return null;
        }
    }

    /**
     * Returns an array of all the encodingPropertys.
     */
    public encodingPropertys(): Oas30EncodingProperty[] {
        let names: string[] = this.encodingPropertyStatusCodes();
        let rval: Oas30EncodingProperty[] = [];
        for (let name of names) {
            rval.push(this.encodingProperty(name));
        }
        return rval;
    }

    /**
     * Adds a encodingProperty.
     * @param name
     * @param encodingProperty
     */
    public addEncodingProperty(name: string, encodingProperty: Oas30EncodingProperty): Oas30EncodingProperty {
        if (this._encodingProperties == null) {
            this._encodingProperties = new Oas30EncodingPropertyItems();
        }
        this._encodingProperties[name] = encodingProperty;
        return encodingProperty;
    }

    /**
     * Removes a single encodingProperty child model.
     * @param name
     */
    public removeEncodingProperty(name: string): Oas30EncodingProperty {
        let rval: Oas30EncodingProperty = this._encodingProperties[name];
        if (this._encodingProperties && rval) {
            delete this._encodingProperties[name];
        }
        return rval;
    }

    /**
     * Gets a list of all the encodingProperty status codes.
     */
    public encodingPropertyStatusCodes(): string[] {
        let rval: string[] = [];
        for (let pname in this._encodingProperties) {
            rval.push(pname);
        }
        return rval;
    }

    /**
     * Creates an OAS EncodingProperty object.
     * @param name
     * @return {Oas30EncodingProperty}
     */
    public createEncodingProperty(name: string): Oas30EncodingProperty {
        let rval: Oas30EncodingProperty = new Oas30EncodingProperty(name);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    getItem(name: string): Oas30EncodingProperty {
        return this.encodingProperty(name);
    }

    getItems(): Oas30EncodingProperty[] {
        return this.encodingPropertys();
    }

    getItemNames(): string[] {
        return this.encodingPropertyStatusCodes();
    }

    addItem(name: string, item: Oas30EncodingProperty): void {
        this.addEncodingProperty(name, item);
    }

    deleteItem(name: string): Oas30EncodingProperty {
        return this.removeEncodingProperty(name);
    }

}


export class Oas30EncodingPropertyItems {
    [key: string]: Oas30EncodingProperty;
}
