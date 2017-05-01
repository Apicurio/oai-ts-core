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
import {OasNode} from "../node.model";

/**
 * Models an OAS 2.0 Example object.  Example:
 *
 * {
 *   "application/json": {
 *     "name": "Puma",
 *     "type": "Dog",
 *     "color": "Black",
 *     "gender": "Female",
 *     "breed": "Mixed"
 *   }
 * }
 */
export class Oas20Example extends OasNode {

    private _examples: Oas20ExampleItems;

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas20NodeVisitor = <IOas20NodeVisitor> visitor;
        viz.visitExample(this);
    }

    /**
     * Returns an array of all the example content types.
     * @return {string[]}
     */
    public exampleContentTypes(): string[] {
        let rval: string[] = [];
        for (let ct in this._examples) {
            rval.push(ct);
        }
        return rval;
    }

    /**
     * Gets a single example.
     * @param contentType
     * @return {any}
     */
    public example(contentType: any): any {
        if (this._examples) {
            return this._examples[contentType];
        } else {
            return null;
        }
    }

    /**
     * Adds an example.
     * @param contentType
     * @param example
     */
    public addExample(contentType: any, example: any): void {
        if (!this._examples) {
            this._examples = new Oas20ExampleItems();
        }
        this._examples[contentType] = example;
    }

    /**
     * Removes a single example.
     * @param contentType
     */
    public removeExample(contentType: any): any {
        let rval: any = undefined;
        if (this._examples) {
            rval = this._examples[contentType];
            if (rval) {
                delete this._examples[contentType];
            }
        }
        return rval;
    }
}


export class Oas20ExampleItems {

    [key: string]: any;

}
