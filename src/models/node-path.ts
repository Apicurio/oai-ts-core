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

import {OasNode} from "./node.model";
import {OasDocument} from "./document.model";
import {IOasIndexedNode} from "./inode.model";


/**
 * Represents a canonical path to a node within a OAS document model.  The node path
 * can be used to identify and locate a single model in the document tree.
 */
export class OasNodePath {

    private _segments: OasNodePathSegment[] = [];

    constructor(path?: string) {
        if (path && path.indexOf("/") === 0 && path !== "/") {
            let currentIdx: number = 1;
            let segStart: number;
            let segEnd: number;
            while (currentIdx < path.length) {
                segStart = currentIdx;
                let nextPathSep: number = path.indexOf("/", segStart);
                if (nextPathSep === -1) {
                    nextPathSep = path.length;
                }
                let nextBrace: number = path.indexOf("[", segStart);
                if (nextBrace != -1 && nextBrace < nextPathSep) {
                    let endBrace: number = path.indexOf("]", nextBrace);
                    if (endBrace != -1) {
                        segEnd = endBrace + 1;
                    } else {
                        segEnd = path.length;
                    }
                } else {
                    segEnd = nextPathSep;
                }

                let segment: OasNodePathSegment = OasNodePathSegment.fromString(path.substring(segStart, segEnd));
                this._segments.push(segment);

                currentIdx = segEnd + 1;
            }
        }
    }

    /**
     * Adds a segment to the beginning of the path.
     * @param name
     * @param index
     */
    public prependSegment(name: string, index?: string | number): void {
        this._segments.unshift(new OasNodePathSegment(name, index));
    }

    /**
     * Adds a segment to the end of the path.
     * @param name
     * @param index
     */
    public appendSegment(name: string, index?: string | number): void {
        this._segments.push(new OasNodePathSegment(name, index));
    }

    /**
     * Resolves a path to its target node within the document model.  This basically
     * walks the tree according to the path segments until it reaches the node being
     * referenced.  If the path does not point to a valid node, then this method
     * returns undefined.
     * @param document
     * @return {undefined}
     */
    public resolve(document: OasDocument): OasNode {
        console.info("Resolving path: " + this.toString());
        let node: OasNode = document;
        for (let segment of this._segments) {
            node = segment.resolve(node);
        }
        return node;
    }

    /**
     * Converts the path to a string.
     */
    public toString(): string {
        let array: string[] = [];
        for (let segment of this._segments) {
            let sval: string = segment.name();
            if (segment.isIndexed()) {
                sval += "[" + segment.index() + "]";
            }
            array.push(sval);
        }
        return "/" + array.join("/");
    }

}


/**
 * Represents a single segment in a model node path.
 */
export class OasNodePathSegment {

    private _name: string;
    private _index: string | number;

    constructor(name: string, index?: string | number) {
        this._name = name;
        this._index = index;
    }

    public name(): string {
        return this._name;
    }

    public index(): string | number {
        return this._index;
    }

    public isIndexed(): boolean {
        return this._index != undefined && this._index != null;
    }

    public resolve(node: OasNode): OasNode {
        let childNode: any = (<any>node)[this.name()];
        if (this.isIndexed()) {
            if (Array.isArray(childNode)) {
                childNode = childNode[this.index()];
            } else if (childNode.getItem) {
                childNode = (<IOasIndexedNode<OasNode>> childNode).getItem(<string>this.index());
            } else {
                childNode = childNode[this.index()];
            }
        }
        return <OasNode>childNode;
    }

    /**
     * Creates a new segment from a string.  Possible formats are:
     *
     *   "name"
     *   "name[propertyIndex]"
     *   "name[numbericIndex]"
     *
     * @param segment
     * @return {OasNodePathSegment}
     */
    public static fromString(segment: string): OasNodePathSegment {
        if (!segment) {
            return new OasNodePathSegment(null);
        }
        if (segment.indexOf("[") === -1) {
            return new OasNodePathSegment(segment);
        } else {
            let bStart: number = segment.indexOf("[");
            let bEnd: number = segment.indexOf("]", bStart);
            let name: string = segment.substring(0, bStart);
            let index: string = segment.substring(bStart + 1, bEnd);
            return new OasNodePathSegment(name, index);
        }
    }

}

