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

import {Oas30Header} from "./header.model";
import {OasHeaders} from "../common/headers.model";

/**
 * Models an OAS 3.0 Headers object.  Example:
 *
 * {
 *     "X-Rate-Limit-Limit": {
 *         "description": "The number of allowed requests in the current period",
 *         "type": "integer"
 *     },
 *     "X-Rate-Limit-Remaining": {
 *         "description": "The number of remaining requests in the current period",
 *         "type": "integer"
 *     },
 *     "X-Rate-Limit-Reset": {
 *         "description": "The number of seconds left in the current period",
 *         "type": "integer"
 *     }
 * }
 */
export class Oas30Headers extends OasHeaders {

    /**
     * Creates a header model.
     * @param headerName
     * @return {Oas30Header}
     */
    public createHeader(headerName: string): Oas30Header {
        let rval: Oas30Header = new Oas30Header(headerName);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

}
