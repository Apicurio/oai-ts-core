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

import {OasHeader} from "../common/header.model";
import {Oas30Schema} from "./schema.model";

/**
 * Models an OAS 3.0 Header object.  Example:
 *
 * {
 *   "description": "The number of allowed requests in the current period",
 *   "required": true,
 *   "schema": {
 *     "type": "string"
 *   }
 * }
 */
export class Oas30Header extends OasHeader {

    public required: boolean;
    public deprecated: boolean;
    public allowEmptyValue: boolean;
    public style: string;
    public explode: boolean;
    public allowReserved: boolean;
    public schema: Oas30Schema;
    public example: any;
    // TODO implement the "examples" property more properly!!
    public examples: any;

    /**
     * Constructor.
     * @param headerName
     */
    constructor(headerName: string) {
        super(headerName);
    }

    /**
     * Creates a child items model.
     * @return {Oas30Schema}
     */
    public createSchema(): Oas30Schema {
        let rval: Oas30Schema = new Oas30Schema();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }
}
