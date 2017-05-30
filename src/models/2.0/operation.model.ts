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

import {Oas20Parameter} from "./parameter.model";
import {Oas20ExternalDocumentation} from "./external-documentation.model";
import {Oas20SecurityRequirement} from "./security-requirement.model";
import {Oas20Responses} from "./responses.model";
import {OasOperation} from "../common/operation.model";
import {IOasParameterParent} from "../common/parameter.model";


/**
 * Models an OAS 2.0 Operation object.  Example:
 *
 * {
 *   "tags": [
 *     "pet"
 *   ],
 *   "summary": "Updates a pet in the store with form data",
 *   "description": "",
 *   "operationId": "updatePetWithForm",
 *   "consumes": [
 *     "application/x-www-form-urlencoded"
 *   ],
 *   "produces": [
 *     "application/json",
 *     "application/xml"
 *   ],
 *   "parameters": [
 *     {
 *       "name": "petId",
 *       "in": "path",
 *       "description": "ID of pet that needs to be updated",
 *       "required": true,
 *       "type": "string"
 *     },
 *     {
 *       "name": "name",
 *       "in": "formData",
 *       "description": "Updated name of the pet",
 *       "required": false,
 *       "type": "string"
 *     },
 *     {
 *       "name": "status",
 *       "in": "formData",
 *       "description": "Updated status of the pet",
 *       "required": false,
 *       "type": "string"
 *     }
 *   ],
 *   "responses": {
 *     "200": {
 *       "description": "Pet updated."
 *     },
 *     "405": {
 *       "description": "Invalid input"
 *     }
 *   },
 *   "security": [
 *     {
 *       "petstore_auth": [
 *         "write:pets",
 *         "read:pets"
 *       ]
 *     }
 *   ]
 * }
 */
export class Oas20Operation extends OasOperation implements IOasParameterParent {

    public consumes: string[];
    public produces: string[];
    public schemes: string[];

    /**
     * Constructor.
     * @param method
     */
    constructor(method: string) {
        super(method);
    }

    /**
     * Creates a child external documentation model.
     * @return {Oas20ExternalDocumentation}
     */
    public createExternalDocumentation(): Oas20ExternalDocumentation {
        let rval: Oas20ExternalDocumentation = new Oas20ExternalDocumentation();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    /**
     * Creates a child parameter model.
     * @return {Oas20Parameter}
     */
    public createParameter(): Oas20Parameter {
        let rval: Oas20Parameter = new Oas20Parameter();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    /**
     * Creates a child responses model.
     * @return {Oas20Responses}
     */
    public createResponses(): Oas20Responses {
        let rval: Oas20Responses = new Oas20Responses();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    /**
     * Creates a child security requirement model.
     * @return {Oas20SecurityRequirement}
     */
    public createSecurityRequirement(): Oas20SecurityRequirement {
        let rval: Oas20SecurityRequirement = new Oas20SecurityRequirement();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }
}