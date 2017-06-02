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

import {IOas30NodeVisitor, IOasNodeVisitor} from "../../visitors/visitor.iface";
import {IOasIndexedNode} from "../inode.model";
import {Oas30MediaType} from "./media-type.model";
import {OasNode} from "../node.model";

/**
 * Models an OAS 3.0 Content object.  The Content object can have any number of child
 * Media Types, where the field names are valid media types (mime types).  Example:
 *
 * {
 *   "application/json": {
 *     "schema": {
 *       "type": "array",
 *       "items": {
 *         "type": "string"
 *       }
 *     },
 *     "examples": {
 *       "list": {
 *         "summary": "List of names",
 *         "value" : ["Bob","Diane","Mary","Bill"]
 *         },
 *       "empty":{
 *         "summary": "Empty List",
 *         "value": []
 *       }
 *     }
 *   },
 *   "application/xml": {
 *     "examples": {
 *       "list": {
 *         "summary": "List of names",
 *         "value": "<Users><User name='Bob'/><User name='Diane'/><User name='Mary'/><User name='Bill'/></Users>"
 *       },
 *       "empty": {
 *         "summary":"Empty",
 *         "value": "<Users/>"
 *       }
 *     }
 *   },
 *   "text/plain": {
 *     "examples": {
 *       "list": {
 *         "summary": "List of names",
 *         "value": "Bob,Diane,Mary,Bill"
 *       },
 *       "empty": {
 *         "summary": "Empty",
 *         "value" : ""
 *       }
 *     }
 *   }
 * }
 */
export class Oas30Content extends OasNode implements IOasIndexedNode<Oas30MediaType> {

    __instanceof_IOasIndexedNode: boolean = true;

    private _mediaTypes: Oas30MediaTypeItems;

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas30NodeVisitor = visitor as IOas30NodeVisitor;
        viz.visitContent(this);
    }

    /**
     * Returns a single mediaType by name.
     * @param name
     * @return {Oas30MediaType}
     */
    public mediaType(name: string): Oas30MediaType {
        if (this._mediaTypes) {
            return this._mediaTypes[name];
        } else {
            return null;
        }
    }

    /**
     * Returns an array of all the mediaTypes.
     */
    public mediaTypes(): Oas30MediaType[] {
        let names: string[] = this.mediaTypeStatusCodes();
        let rval: Oas30MediaType[] = [];
        for (let name of names) {
            rval.push(this.mediaType(name));
        }
        return rval;
    }

    /**
     * Adds a mediaType.
     * @param name
     * @param mediaType
     */
    public addMediaType(name: string, mediaType: Oas30MediaType): Oas30MediaType {
        if (this._mediaTypes == null) {
            this._mediaTypes = new Oas30MediaTypeItems();
        }
        this._mediaTypes[name] = mediaType;
        return mediaType;
    }

    /**
     * Removes a single mediaType child model.
     * @param name
     */
    public removeMediaType(name: string): Oas30MediaType {
        let rval: Oas30MediaType = this._mediaTypes[name];
        if (this._mediaTypes && rval) {
            delete this._mediaTypes[name];
        }
        return rval;
    }

    /**
     * Gets a list of all the mediaType status codes.
     */
    public mediaTypeStatusCodes(): string[] {
        let rval: string[] = [];
        for (let pname in this._mediaTypes) {
            rval.push(pname);
        }
        return rval;
    }

    /**
     * Creates an OAS MediaType object.
     * @param name
     * @return {Oas30MediaType}
     */
    public createMediaType(name: string): Oas30MediaType {
        let rval: Oas30MediaType = new Oas30MediaType(name);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    getItem(name: string): Oas30MediaType {
        return this.mediaType(name);
    }

    getItems(): Oas30MediaType[] {
        return this.mediaTypes();
    }

    getItemNames(): string[] {
        return this.mediaTypeStatusCodes();
    }

    addItem(name: string, item: Oas30MediaType): void {
        this.addMediaType(name, item);
    }

    deleteItem(name: string): Oas30MediaType {
        return this.removeMediaType(name);
    }

}


export class Oas30MediaTypeItems {
    [key: string]: Oas30MediaType;
}
