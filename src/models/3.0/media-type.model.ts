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

import {Oas30Schema} from "./schema.model";
import {OasExtensibleNode} from "../enode.model";
import {IOas30NodeVisitor, IOasNodeVisitor} from "../../visitors/visitor.iface";
import {Oas30Example, Oas30ExampleItems} from "./example.model";
import {Oas30Encoding} from "./encoding.model";

/**
 * Models an OAS 3.0 MediaType object.  Example:
 *
 * {
 *   "application/json": {
 *     "schema": {
 *          "$ref": "#/components/schemas/Pet"
 *     },
 *     "examples": {
 *       "cat" : {
 *         "summary": "An example of a cat",
 *         "value":
 *           {
 *             "name": "Fluffy",
 *             "petType": "Cat",
 *             "color": "White",
 *             "gender": "male",
 *             "breed": "Persian"
 *           }
 *       },
 *       "dog": {
 *         "summary": "An example of a dog with a cat's name",
 *         "value" :  {
 *           "name": "Puma",
 *           "petType": "Dog",
 *           "color": "Black",
 *           "gender": "Female",
 *           "breed": "Mixed"
 *         },
 *       "frog": {
 *           "$ref": "#/components/examples/frog-example"
 *         }
 *       }
 *     }
 *   }
 * }
 */
export class Oas30MediaType extends OasExtensibleNode {

    private _name: string;

    public schema: Oas30Schema;
    public example: any;
    public examples: Oas30ExampleItems;
    public encoding: Oas30EncodingItems = new Oas30EncodingItems();

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
        viz.visitMediaType(this);
    }

    public name(): string {
        return this._name;
    }

    /**
     * Creates a child schema model.
     * @return {Oas30Schema}
     */
    public createSchema(): Oas30Schema {
        let rval: Oas30Schema = new Oas30Schema();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    /**
     * Creates a encoding.
     * @param name
     * @return {Oas30Encoding}
     */
    public createEncoding(name: string): Oas30Encoding {
        let rval: Oas30Encoding = new Oas30Encoding(name);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    /**
     * Adds a encoding.
     * @param name
     * @param encoding
     */
    public addEncoding(name: string, encoding: Oas30Encoding): void {
        this.encoding[name] = encoding;
    }

    /**
     * Gets a single encoding by name.
     * @param name
     * @return {Oas30Encoding}
     */
    public getEncoding(name: string): Oas30Encoding {
        return this.encoding[name];
    }

    /**
     * Removes a single encoding and returns it.  This may return null or undefined if none found.
     * @param name
     * @return {Oas30Encoding}
     */
    public removeEncoding(name: string): Oas30Encoding {
        let rval: Oas30Encoding = this.encoding[name];
        if (rval) {
            delete this.encoding[name];
        }
        return rval;
    }

    /**
     * Gets a list of all encodings.
     * @return {Oas30Encoding[]}
     */
    public getEncodings(): Oas30Encoding[] {
        let rval: Oas30Encoding[] = [];
        for (let name in this.encoding) {
            rval.push(this.encoding[name]);
        }
        return rval;
    }

    /**
     * Creates a child Example model.
     * @return {Oas30Example}
     */
    public createExample(name: string): Oas30Example {
        let rval: Oas30Example = new Oas30Example(name);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    /**
     * Adds the Example to the map of examples.
     * @param example
     */
    public addExample(example: Oas30Example): void {
        if (!this.examples) {
            this.examples = new Oas30ExampleItems();
        }
        this.examples[example.name()] = example;
    }

    /**
     * Removes an Example and returns it.
     * @param name
     * @return {Oas30Example}
     */
    public removeExample(name: string): Oas30Example {
        let rval: Oas30Example = null;
        if (this.examples) {
            rval = this.examples[name];
            delete this.examples[name];
        }
        return rval;
    }

    /**
     * Gets a single example by name.
     * @param name
     * @return {any}
     */
    public getExample(name: string): Oas30Example {
        if (this.examples) {
            return this.examples[name];
        } else {
            return null;
        }
    }

    /**
     * Gets all examples.
     * @return {Oas30Example[]}
     */
    public getExamples(): Oas30Example[] {
        let examples: Oas30Example[] = [];
        if (this.examples) {
            for (let exampleName in this.examples) {
                let example: Oas30Example = this.examples[exampleName];
                examples.push(example);
            }
        }
        return examples;
    }

}


export class Oas30EncodingItems {
    [key: string]: Oas30Encoding;
}
