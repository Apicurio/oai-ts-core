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
import {IOasReferenceNode} from "../reference.model";
import {OasParameterBase} from "../common/parameter.model";
import {Oas30Schema} from "./schema.model";
import {Oas30Example, Oas30ExampleItems} from "./example.model";
import {Oas30MediaType} from "./media-type.model";


/**
 * Models an OAS 3.0 Parameter object.  Example:
 *
 * {
 *   "name": "token",
 *   "in": "header",
 *   "description": "token to be passed as a header",
 *   "required": true,
 *   "schema": {
 *     "type": "array",
 *     "items": {
 *       "type": "integer",
 *       "format": "int64"
 *     }
 *   },
 *   "style": "commaDelimited"
 * }
 */
export abstract class Oas30ParameterBase extends OasParameterBase {

    public $ref: string;
    public deprecated: boolean;
    public style: string; // matrix, label, form, simple, spaceDelimited, pipeDelimited, deepObject
    public explode: boolean;
    public allowReserved: boolean;
    public example: any;
    public examples: Oas30ExampleItems;
    public content: Oas30ParameterContent = new Oas30ParameterContent();

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

    /**
     * Creates a media type.
     * @param name
     * @return {Oas30MediaType}
     */
    public createMediaType(name: string): Oas30MediaType {
        let rval: Oas30MediaType = new Oas30MediaType(name);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    /**
     * Adds a media type.
     * @param name
     * @param mediaType
     */
    public addMediaType(name: string, mediaType: Oas30MediaType): void {
        this.content[name] = mediaType;
    }

    /**
     * Gets a single media type by name.
     * @param name
     * @return {Oas30MediaType}
     */
    public getMediaType(name: string): Oas30MediaType {
        return this.content[name];
    }

    /**
     * Removes a single media type and returns it.  This may return null or undefined if none found.
     * @param name
     * @return {Oas30MediaType}
     */
    public removeMediaType(name: string): Oas30MediaType {
        let rval: Oas30MediaType = this.content[name];
        if (rval) {
            delete this.content[name];
        }
        return rval;
    }

    /**
     * Gets a list of all media types.
     * @return {Oas30MediaType[]}
     */
    public getMediaTypes(): Oas30MediaType[] {
        let rval: Oas30MediaType[] = [];
        for (let name in this.content) {
            rval.push(this.content[name]);
        }
        return rval;
    }

}


/**
 * Extends the base parameter to model a parameter that is a child of the OAS 3.0 Parameters Definitions
 * object.
 */
export class Oas30ParameterDefinition extends Oas30ParameterBase {

    private _parameterName: string;

    /**
     * Constructor.
     * @param parameterName
     */
    constructor(parameterName: string) {
        super();
        this._parameterName = parameterName;
    }

    /**
     * Gets the parameter name.
     * @return {string}
     */
    public parameterName(): string {
        return this._parameterName;
    }

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas30NodeVisitor = <IOas30NodeVisitor> visitor;
        viz.visitParameterDefinition(this);
    }

}


/**
 * Extends the base parameter to add support for references.
 */
export class Oas30Parameter extends Oas30ParameterBase implements IOasReferenceNode {

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas30NodeVisitor = visitor as IOas30NodeVisitor;
        viz.visitParameter(this);
    }

}


export class Oas30ParameterContent {
    [key: string]: Oas30MediaType;
}
