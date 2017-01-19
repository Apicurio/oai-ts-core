/**
 * @license
 * Copyright 2016 JBoss Inc
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
import {IOasNodeVisitor, IOas20NodeVisitor} from "../../visitors/visitor.iface";
import {Oas20PathItem} from "./path-item.model";
import {IOasIndexedNode} from "../inode.model";

/**
 * Models an OAS 2.0 Paths object.  The Paths object can have any number of child
 * paths, where the field name begins with '/'.  Example:
 *
 * {
 *   "/pets": {
 *     "get": {
 *       "description": "Returns all pets from the system that the user has access to",
 *       "produces": [
 *         "application/json"
 *       ],
 *       "responses": {
 *         "200": {
 *           "description": "A list of pets.",
 *           "schema": {
 *             "type": "array",
 *             "items": {
 *               "$ref": "#/definitions/pet"
 *             }
 *           }
 *         }
 *       }
 *     }
 *   }
 * }
 *
 */
export class Oas20Paths extends OasExtensibleNode implements IOasIndexedNode<Oas20PathItem> {

    private _pathItems: Oas20PathItems = new Oas20PathItems();

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas20NodeVisitor = <IOas20NodeVisitor> visitor;
        viz.visitPaths(this);
    }

    /**
     * Returns a single path item by name.
     * @param name
     * @return {Oas20PathItem}
     */
    public pathItem(name: string): Oas20PathItem {
        return this._pathItems[name];
    }

    /**
     * Adds a path item.
     * @param name
     * @param pathItem
     */
    public addPathItem(name: string, pathItem: Oas20PathItem): Oas20PathItem {
        this._pathItems[name] = pathItem;
        return pathItem;
    }

    /**
     * Gets a list of all the path names.
     */
    public pathItemNames(): string[] {
        let rval: string[] = [];
        for (let pname in this._pathItems) {
            rval.push(pname);
        }
        return rval;
    }

    /**
     * Removes a single path item child model by name.
     * @param path
     */
    public removePathItem(path: string): Oas20PathItem {
        let rval: Oas20PathItem = this._pathItems[path];
        if (rval) {
            delete this._pathItems[path];
        }
        return rval;
    }

    /**
     * Creates an OAS 2.0 path item object.
     * @param path
     * @return {Oas20PathItem}
     */
    public createPathItem(path: string): Oas20PathItem {
        let rval: Oas20PathItem = new Oas20PathItem(path);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    getItem(name: string): Oas20PathItem {
        return this.pathItem(name);
    }

    getItemNames(): string[] {
        return this.pathItemNames();
    }

    addItem(name: string, item: Oas20PathItem): void {
        this.addPathItem(name, item);
    }

    deleteItem(name: string): Oas20PathItem {
        return this.removePathItem(name);
    }

}

export class Oas20PathItems {

    [key: string]: Oas20PathItem;

}
