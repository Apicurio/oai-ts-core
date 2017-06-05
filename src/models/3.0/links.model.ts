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
import {OasNode} from "../node.model";
import {Oas30Link} from "./link.model";

/**
 * Models an OAS 3.0 Links object.  The Links object can have any number of mapped child
 * Link objects, where the field names are valid names.
 */
export class Oas30Links extends OasNode implements IOasIndexedNode<Oas30Link> {

    __instanceof_IOasIndexedNode: boolean = true;

    private _links: Oas30LinkItems;

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas30NodeVisitor = visitor as IOas30NodeVisitor;
        viz.visitLinks(this);
    }

    /**
     * Returns a single link by name.
     * @param name
     * @return {Oas30Link}
     */
    public link(name: string): Oas30Link {
        if (this._links) {
            return this._links[name];
        } else {
            return null;
        }
    }

    /**
     * Returns an array of all the links.
     */
    public links(): Oas30Link[] {
        let names: string[] = this.linkNames();
        let rval: Oas30Link[] = [];
        for (let name of names) {
            rval.push(this.link(name));
        }
        return rval;
    }

    /**
     * Adds a link.
     * @param name
     * @param link
     */
    public addLink(name: string, link: Oas30Link): Oas30Link {
        if (this._links == null) {
            this._links = new Oas30LinkItems();
        }
        this._links[name] = link;
        return link;
    }

    /**
     * Removes a single link child model.
     * @param name
     */
    public removeLink(name: string): Oas30Link {
        let rval: Oas30Link = this._links[name];
        if (this._links && rval) {
            delete this._links[name];
        }
        return rval;
    }

    /**
     * Gets a list of all the link names.
     */
    public linkNames(): string[] {
        let rval: string[] = [];
        for (let pname in this._links) {
            rval.push(pname);
        }
        return rval;
    }

    /**
     * Creates an OAS Link object.
     * @param name
     * @return {Oas30Link}
     */
    public createLink(name: string): Oas30Link {
        let rval: Oas30Link = new Oas30Link(name);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    getItem(name: string): Oas30Link {
        return this.link(name);
    }

    getItems(): Oas30Link[] {
        return this.links();
    }

    getItemNames(): string[] {
        return this.linkNames();
    }

    addItem(name: string, item: Oas30Link): void {
        this.addLink(name, item);
    }

    deleteItem(name: string): Oas30Link {
        return this.removeLink(name);
    }

}


export class Oas30LinkItems {
    [key: string]: Oas30Link;
}
