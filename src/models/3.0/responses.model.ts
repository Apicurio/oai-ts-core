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

import {IOasIndexedNode} from "../inode.model";
import {OasResponses} from "../common/responses.model";
import {Oas30Response} from "./response.model";

/**
 * Models an OAS 2.0 Responses object.  The Responses object can have any number of child
 * responses, where the field names are either 'default' or an HTTP status code.  Example:
 *
 * {
 *   "200": {
 *     "description": "a pet to be returned",
 *     "content": {
 *       "application/json": {
 *         "schema": {
 *           "$ref": "#/components/schemas/Pet"
 *         }
 *       }
 *     }
 *   },
 *   "default": {
 *     "description": "Unexpected error",
 *     "content": {
 *       "application/json": {
 *         "schema": {
 *           "$ref": "#/components/schemas/ErrorModel"
 *         }
 *       }
 *     }
 *   }
 * }
 */
export class Oas30Responses extends OasResponses {

    /**
     * Creates an OAS 3.0 Response object.
     * @param statusCode
     * @return {Oas30Response}
     */
    public createResponse(statusCode?: string): Oas30Response {
        let rval: Oas30Response = new Oas30Response(statusCode);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

}
