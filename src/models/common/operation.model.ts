/**
 * @license
 * Copyright 17 Red Hat
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
import {OasExternalDocumentation} from "./external-documentation.model";
import {IOasNodeVisitor} from "../../visitors/visitor.iface";
import {OasSecurityRequirement} from "./security-requirement.model";
import {OasResponses} from "./responses.model";
import {IOasParameterParent, OasParameterBase} from "./parameter.model";


/**
 * Models an OAS Operation object.
 */
export abstract class OasOperation extends OasExtensibleNode implements IOasParameterParent {

    private _method: string;
    public tags: string[];
    public summary: string;
    public description: string;
    public externalDocs: OasExternalDocumentation;
    public operationId: string;
    public parameters: OasParameterBase[];
    public responses: OasResponses;
    public deprecated: boolean;
    public security: OasSecurityRequirement[];

    /**
     * Constructor.
     * @param method
     */
    constructor(method: string) {
        super();
        this._method = method;
    }

    /**
     * Gets the method for this operation (get, put, post, etc).
     * @return {string}
     */
    public method(): string {
        return this._method;
    }

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        visitor.visitOperation(this);
    }

    /**
     * Creates a child external documentation model.
     * @return {OasExternalDocumentation}
     */
    public abstract createExternalDocumentation(): OasExternalDocumentation;

    /**
     * Creates a child parameter model.
     * @return {OasParameter}
     */
    public abstract createParameter(): OasParameterBase;

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

    /**
     * Adds a parameter.
     * @param parameter
     */
    public addParameter(parameter: OasParameterBase): OasParameterBase {
        if (this.parameters == null) {
            this.parameters = [];
        }
        this.parameters.push(parameter);
        return parameter;
    }

    /**
     * Creates a child responses model.
     * @return {OasResponses}
     */
    public abstract createResponses(): OasResponses;

    /**
     * Creates a child security requirement model.
     * @return {OasSecurityRequirement}
     */
    public abstract createSecurityRequirement(): OasSecurityRequirement;

    /**
     * Adds a security requirement child.
     * @param securityRequirement
     */
    public addSecurityRequirement(securityRequirement: OasSecurityRequirement): OasSecurityRequirement {
        if (this.security == null) {
            this.security = [];
        }
        this.security.push(securityRequirement);
        return securityRequirement;
    }
}