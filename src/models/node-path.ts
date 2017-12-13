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
            let currentScanType: string = "path";
            let currentIdx: number = 1;
            while (currentIdx < path.length) {
                let segStart: number = currentIdx;
                let segEnd: number;
                if (currentScanType === "path") {
                    let nextPathSep: number = path.indexOf("/", segStart);
                    let nextBrace: number = path.indexOf("[", segStart);
                    if (nextPathSep === -1) { nextPathSep = path.length; }
                    if (nextBrace === -1) { nextBrace = path.length; }
                    if (nextPathSep <= nextBrace) {
                        segEnd = nextPathSep;
                    } else {
                        segEnd = nextBrace;
                    }
                } else {
                    let nextCloseBrace: number = path.indexOf("]", segStart);
                    if (nextCloseBrace === -1) { nextCloseBrace = path.length; }
                    segEnd = nextCloseBrace + 1;
                }

                let seg: string = path.substring(segStart, segEnd);
                let segment: OasNodePathSegment = OasNodePathSegment.fromString(seg);
                this._segments.push(segment);

                // Default next values.
                currentScanType = "path";
                currentIdx = segEnd + 1;

                // Find real next values.
                if (path.charAt(segEnd) === '/') {
                    currentScanType = "path";
                    currentIdx = segEnd + 1;
                } else if (path.charAt(segEnd) === '[') {
                    currentScanType = "index";
                    currentIdx = segEnd;
                } else if (path.charAt(segEnd) === ']') {
                    if (path.charAt(segEnd+1) === '[') {
                        currentScanType = "index";
                        currentIdx = segEnd + 1;
                    } else if (path.charAt(segEnd+1) === '/') {
                        currentScanType = "path";
                        currentIdx = segEnd + 1;
                    }
                }
            }
        }
    }

    /**
     * Adds a segment to the beginning of the path.
     * @param value
     * @param index
     */
    public prependSegment(value: string|number, index?: boolean): void {
        this._segments.unshift(new OasNodePathSegment(value, index));
    }

    /**
     * Adds a segment to the end of the path.
     * @param value
     * @param index
     */
    public appendSegment(value: string | number, index?: boolean): void {
        this._segments.push(new OasNodePathSegment(value, index));
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
        if (this._segments.length === 0) {
            return "/";
        }
        let rval: string = "";
        for (let segment of this._segments) {
            if (segment.isIndex()) {
                rval += '[' + segment.value() + ']';
            } else {
                rval += '/' + segment.value();
            }
        }
        return rval;
    }

}


/**
 * Represents a single segment in a model node path.
 */
export class OasNodePathSegment {

    private _value: string | number;
    private _index: boolean = false;

    constructor(value: string | number, index?: boolean) {
        this._value = value;
        if (index) {
            this._index = true;
        }
    }

    public value(): string | number {
        return this._value;
    }

    public isIndex(): boolean {
        return this._index;
    }

    public resolve(node: OasNode): OasNode {
        if (node === null) {
            return null;
        }
        let childNode: any = null;
        if (this.isIndex() && node["__instanceof_IOasIndexedNode"]) {
            childNode = (<any>node as IOasIndexedNode<OasNode>).getItem(<string>this.value());
        } else {
            childNode = node[this.value()];
            if (childNode === undefined) {
                childNode = null;
            }
        }
        return <OasNode>childNode;
    }

    /**
     * Creates a new segment from a string.
     * @param segment
     * @return {OasNodePathSegment}
     */
    public static fromString(segment: string): OasNodePathSegment {
        if (!segment) {
            return new OasNodePathSegment(null);
        }
        if (segment.indexOf("[") !== 0) {
            return new OasNodePathSegment(segment);
        } else {
            let bStart: number = segment.indexOf("[");
            let bEnd: number = segment.indexOf("]", bStart);
            let value: string = segment.substring(bStart + 1, bEnd);
            return new OasNodePathSegment(value, true);
        }
    }

}

