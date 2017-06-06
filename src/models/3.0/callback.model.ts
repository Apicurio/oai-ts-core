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
import {OasPathItems} from "../common/paths.model";
import {IOasIndexedNode} from "../inode.model";
import {Oas30CallbackPathItem, Oas30PathItem} from "./path-item.model";
import {IOasReferenceNode} from "../reference.model";

/**
 * Models an OAS 3.0 Callback object.
 */
export class Oas30Callback extends OasExtensibleNode implements IOasIndexedNode<Oas30CallbackPathItem>, IOasReferenceNode {

    __instanceof_IOasIndexedNode: boolean = true;

    private _name: string;
    private _pathItems: OasPathItems = new OasPathItems();

    public $ref: string;

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
        let viz: IOas30NodeVisitor = visitor as IOas30NodeVisitor;
        viz.visitCallback(this);
    }

    /**
     * Gets the name of the callback.
     * @return {string}
     */
    public name(): string {
        return this._name;
    }

    /**
     * Returns a single path item by name.
     * @param name
     * @return {Oas30CallbackPathItem}
     */
    public pathItem(name: string): Oas30CallbackPathItem {
        return this._pathItems[name] as Oas30CallbackPathItem;
    }

    /**
     * Returns an array of all the path items.
     */
    public pathItems(): Oas30CallbackPathItem[] {
        let names: string[] = this.pathItemNames();
        let rval: Oas30CallbackPathItem[] = [];
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
    public addPathItem(name: string, pathItem: Oas30CallbackPathItem): Oas30CallbackPathItem {
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
    public removePathItem(path: string): Oas30CallbackPathItem {
        let rval: Oas30CallbackPathItem = this._pathItems[path] as Oas30CallbackPathItem;
        if (rval) {
            delete this._pathItems[path];
        }
        return rval;
    }

    /**
     * Creates an OAS path item object.
     * @param path
     * @return {Oas30PathItem}
     */
    public createPathItem(path: string): Oas30CallbackPathItem {
        let rval: Oas30CallbackPathItem = new Oas30CallbackPathItem(path);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    getItem(name: string): Oas30CallbackPathItem {
        return this.pathItem(name);
    }

    getItems(): Oas30CallbackPathItem[] {
        return this.pathItems();
    }

    getItemNames(): string[] {
        return this.pathItemNames();
    }

    addItem(name: string, item: Oas30CallbackPathItem): void {
        this.addPathItem(name, item);
    }

    deleteItem(name: string): Oas30CallbackPathItem {
        return this.removePathItem(name);
    }

}



/**
 * Models a callback definition found in the components section of an OAS document.
 */
export class Oas30CallbackDefinition extends Oas30Callback {

    /**
     * Constructor.
     * @param name
     */
    constructor(name: string) {
        super(name);
    }

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas30NodeVisitor = <IOas30NodeVisitor> visitor;
        viz.visitCallbackDefinition(this);
    }

}
