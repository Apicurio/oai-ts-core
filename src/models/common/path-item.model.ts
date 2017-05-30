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

import {IOasNodeVisitor} from "../../visitors/visitor.iface";
import {OasExtensibleNode} from "../enode.model";
import {OasOperation} from "./operation.model";
import {IOasParameterParent, OasParameterBase} from "./parameter.model";

/**
 * Models an OAS Path Item object.
 */
export abstract class OasPathItem extends OasExtensibleNode implements IOasParameterParent {

    private _path: string;
    public $ref: string;
    public get: OasOperation;
    public put: OasOperation;
    public post: OasOperation;
    public delete: OasOperation;
    public options: OasOperation;
    public head: OasOperation;
    public patch: OasOperation;
    public parameters: OasParameterBase[];

    /**
     * Constructor.
     * @param path
     */
    constructor(path: string) {
        super();
        this._path = path;
    }

    /**
     * Returns the path this object is mapped to.
     * @return {string}
     */
    public path(): string {
        return this._path;
    }

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        visitor.visitPathItem(this);
    }

    /**
     * Creates an OAS operation object.
     * @param method
     * @return {OasOperation}
     */
    public abstract createOperation(method: string): OasOperation;

    /**
     * Creates a child parameter.
     * @return {OasParameter}
     */
    public abstract createParameter(): OasParameterBase;

    /**
     * Adds a parameter.
     * @param param
     */
    public addParameter(param: OasParameterBase): OasParameterBase {
        if (!this.parameters) {
            this.parameters = [];
        }
        this.parameters.push(param);
        return param;
    }

    /**
     * Returns a list of parameters with a particular value of "in" (e.g. path, formData, body, etc...).
     * @param _in
     * @return {any}
     */
    public getParameters(_in: string): OasParameterBase[] {
        if (_in === undefined ||_in === null || this.parameters === undefined || this.parameters === null) {
            return [];
        } else {
            return this.parameters.filter( param => {
                return param.in === _in;
            })
        }
    }

    /**
     * Returns a single, unique parameter identified by "in" and "name" (which are the two
     * properties that uniquely identify a parameter).  Returns null if no parameter is found.
     * @param _in
     * @param name
     * @return {OasParameterBase}
     */
    public parameter(_in: string, name: string): OasParameterBase {
        let rval: OasParameterBase = null;
        this.getParameters(_in).forEach( param => {
            if (param.name === name) {
                rval = param;
            }
        })
        return rval;
    }

}