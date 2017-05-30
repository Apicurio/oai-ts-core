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

    public deprecated: boolean;
    public style: string; // matrix, label, form, simple, spaceDelimited, pipeDelimited, deepObject
    public explode: boolean;
    public allowReserved: boolean;
    public example: any;
    // TODO implement the "examples" property more properly!!
    //public examples: any;
    // TODO implement the 'content' property
    //public content: Oas30Content;


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

    public $ref: string;

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas30NodeVisitor = visitor as IOas30NodeVisitor;
        viz.visitParameter(this);
    }

}