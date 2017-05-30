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

import {OasExtensibleNode} from "../enode.model";
import {OasSchema} from "./schema.model";


/**
 * Models that serve as parent to a list of OasParameter objects must implement this
 * interface.
 */
export interface IOasParameterParent {

    parameters: OasParameterBase[];

    addParameter(parameter: OasParameterBase): OasParameterBase;
    createParameter(): OasParameterBase;
    getParameters(_in: string): OasParameterBase[];
    parameter(_in: string, name: string): OasParameterBase;

}


/**
 * Models an OAS Parameter object.
 */
export abstract class OasParameterBase extends OasExtensibleNode {

    public name: string;
    public in: string;
    public description: string;
    public required: boolean;
    public schema: OasSchema;
    public allowEmptyValue: boolean;

    /**
     * Creates a child schema model.
     * @return {OasSchema}
     */
    public abstract createSchema(): OasSchema;

}
