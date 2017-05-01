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
import {Oas20ParameterDefinition} from "./parameter.model";
import {IOasIndexedNode} from "../inode.model";

/**
 * Models an OAS 2.0 Parameters Definitions object.  The Parameters Definitions object can have any
 * number of child parameters, where the field name is the name of the parameter and the value is a Parameter
 * object.  Example:
 *
 * {
 *   "skipParam": {
 *     "name": "skip",
 *     "in": "query",
 *     "description": "number of items to skip",
 *     "required": true,
 *     "type": "integer",
 *     "format": "int32"
 *   },
 *   "limitParam": {
 *     "name": "limit",
 *     "in": "query",
 *     "description": "max records to return",
 *     "required": true,
 *     "type": "integer",
 *     "format": "int32"
 *   }
 * }
 */
export class Oas20ParametersDefinitions extends OasNode implements IOasIndexedNode<Oas20ParameterDefinition> {

    __instanceof_IOasIndexedNode: boolean = true;

    private _parameters: Oas20ParametersDefinitionsItems = new Oas20ParametersDefinitionsItems();

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas20NodeVisitor = <IOas20NodeVisitor> visitor;
        viz.visitParametersDefinitions(this);
    }

    /**
     * Returns a single parameter by name.
     * @param name
     * @return {Oas20ParameterDefinition}
     */
    public parameter(name: string): Oas20ParameterDefinition {
        return this._parameters[name];
    }

    /**
     * Returns an array of all the parameters.
     */
    public parameters(): Oas20ParameterDefinition[] {
        let names: string[] = this.parameterNames();
        let rval: Oas20ParameterDefinition[] = [];
        for (let name of names) {
            rval.push(this.parameter(name));
        }
        return rval;
    }

    /**
     * Adds a parameter.
     * @param name
     * @param parameter
     */
    public addParameter(name: string, parameter: Oas20ParameterDefinition): Oas20ParameterDefinition {
        this._parameters[name] = parameter;
        return parameter;
    }

    /**
     * Removes a parameter by name.
     * @param name
     */
    public removeParameter(name: string): Oas20ParameterDefinition {
        let rval: Oas20ParameterDefinition = this._parameters[name];
        if (rval) {
            delete this._parameters[name];
        }
        return rval;
    }

    /**
     * Gets a list of all the parameter names.
     */
    public parameterNames(): string[] {
        let rval: string[] = [];
        for (let name in this._parameters) {
            rval.push(name);
        }
        return rval;
    }

    /**
     * Creates an OAS 2.0 Parameter object.
     * @param name
     * @return {Oas20ParameterDefinition}
     */
    public createParameter(name: string): Oas20ParameterDefinition {
        let rval: Oas20ParameterDefinition = new Oas20ParameterDefinition(name);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    getItem(name: string): Oas20ParameterDefinition {
        return this.parameter(name);
    }

    getItems(): Oas20ParameterDefinition[] {
        return this.parameters();
    }

    getItemNames(): string[] {
        return this.parameterNames();
    }

    addItem(name: string, item: Oas20ParameterDefinition): void {
        this.addParameter(name, item);
    }

    deleteItem(name: string): Oas20ParameterDefinition {
        return this.removeParameter(name);
    }

}

export class Oas20ParametersDefinitionsItems {

    [key: string]: Oas20ParameterDefinition;

}
