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

import {OasOperation} from "../common/operation.model";
import {Oas30Server} from "./server.model";
import {Oas30RequestBody} from "./request-body.model";
import {Oas30Callbacks} from "./callbacks.model";
import {Oas30ExternalDocumentation} from "./external-documentation.model";
import {Oas30Responses} from "./responses.model";
import {Oas30SecurityRequirement} from "./security-requirement.model";
import {Oas30Parameter} from "./parameter.model";
import {IOasParameterParent} from "../common/parameter.model";


/**
 * Models an OAS 3.0 Operation object.  Example:
 *
 * {
 *  "tags": [
 *    "pet"
 *  ],
 *  "summary": "Updates a pet in the store with form data",
 *  "operationId": "updatePetWithForm",
 *  "parameters": [
 *    {
 *      "name": "petId",
 *      "in": "path",
 *      "description": "ID of pet that needs to be updated",
 *      "required": true,
 *      "type": "string"
 *    }
 *  ],
 *  "requestBody": {
 *    "content": {
 *      "application/x-www-form-urlencoded": {
 *        "schema": {
 *          "type": "object",
 *           "properties": {
 *              "name": {
 *                "description": "Updated name of the pet",
 *                "type": "string"
 *              },
 *              "status": {
 *                "description": "Updated status of the pet",
 *                "type": "string"
 *             }
 *           },
 *        "required": ["status"]
 *        }
 *      }
 *    }
 *  },
 *  "responses": {
 *    "200": {
 *      "description": "Pet updated.",
 *      "content": {
 *        "application/json": {},
 *        "application/xml": {}
 *      }
 *    },
 *    "405": {
 *      "description": "Invalid input",
 *      "content": {
 *        "application/json": {},
 *        "application/xml": {}
 *      }
 *    }
 *  },
 *  "security": [
 *    {
 *      "petstore_auth": [
 *        "write:pets",
 *        "read:pets"
 *      ]
 *    }
 *  ]
 * }
 */
export class Oas30Operation extends OasOperation implements IOasParameterParent {

    public requestBody: Oas30RequestBody;
    public callbacks: Oas30Callbacks;
    public servers: Oas30Server[];

    /**
     * Constructor.
     * @param method
     */
    constructor(method: string) {
        super(method);
    }

    /**
     * Creates a child external documentation model.
     * @return {Oas30ExternalDocumentation}
     */
    public createExternalDocumentation(): Oas30ExternalDocumentation {
        let rval: Oas30ExternalDocumentation = new Oas30ExternalDocumentation();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    /**
     * Creates a child parameter model.
     * @return {Oas30Parameter}
     */
    public createParameter(): Oas30Parameter {
        let rval: Oas30Parameter = new Oas30Parameter();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    /**
     * Creates a child responses model.
     * @return {Oas30Responses}
     */
    public createResponses(): Oas30Responses {
        let rval: Oas30Responses = new Oas30Responses();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    /**
     * Creates a child security requirement model.
     * @return {Oas30SecurityRequirement}
     */
    public createSecurityRequirement(): Oas30SecurityRequirement {
        let rval: Oas30SecurityRequirement = new Oas30SecurityRequirement();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    /**
     * Creates a child Callbacks model.
     * @return {Oas30Callbacks}
     */
    public createCallbacks(): Oas30Callbacks {
        let rval: Oas30Callbacks = new Oas30Callbacks();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    /**
     * Creates a child RequestBody model.
     * @return {Oas30Callbacks}
     */
    public createRequestBody(): Oas30RequestBody {
        let rval: Oas30RequestBody = new Oas30RequestBody();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    /**
     * Creates an OAS 3.0 Server object.
     * @return {Oas30Info}
     */
    public createServer(): Oas30Server {
        let rval: Oas30Server = new Oas30Server();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

}