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
import {IOasNodeVisitor} from "../../visitors/visitor.iface";
import {OasPathItem} from "./path-item.model";
import {IOasIndexedNode} from "../inode.model";

/**
 * Models an OAS Paths object.  The Paths object can have any number of child
 * paths, where the field name begins with '/'.
 */
export abstract class OasPaths extends OasExtensibleNode implements IOasIndexedNode<OasPathItem> {

    __instanceof_IOasIndexedNode: boolean = true;

    private _pathItems: OasPathItems = new OasPathItems();

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        visitor.visitPaths(this);
    }

    /**
     * Returns a single path item by name.
     * @param name
     * @return {OasPathItem}
     */
    public pathItem(name: string): OasPathItem {
        return this._pathItems[name];
    }

    /**
     * Returns an array of all the path items.
     */
    public pathItems(): OasPathItem[] {
        let names: string[] = this.pathItemNames();
        let rval: OasPathItem[] = [];
        for (let name of names) {
            rval.push(this.pathItem(name));
        }
        return rval;
    }

    /**
     * Adds a path item.
     * @param name
     * @param pathItem
     */
    public addPathItem(name: string, pathItem: OasPathItem): OasPathItem {
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
    public removePathItem(path: string): OasPathItem {
        let rval: OasPathItem = this._pathItems[path];
        if (rval) {
            delete this._pathItems[path];
        }
        return rval;
    }

    /**
     * Creates an OAS path item object.
     * @param path
     * @return {OasPathItem}
     */
    public abstract createPathItem(path: string): OasPathItem;

    getItem(name: string): OasPathItem {
        return this.pathItem(name);
    }

    getItems(): OasPathItem[] {
        return this.pathItems();
    }

    getItemNames(): string[] {
        return this.pathItemNames();
    }

    addItem(name: string, item: OasPathItem): void {
        this.addPathItem(name, item);
    }

    deleteItem(name: string): OasPathItem {
        return this.removePathItem(name);
    }

}

export class OasPathItems {

    [key: string]: OasPathItem;

}
