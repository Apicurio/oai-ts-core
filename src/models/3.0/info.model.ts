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

import {Oas30Contact} from "./contact.model";
import {Oas30License} from "./license.model";
import {OasInfo} from "../common/info.model";

/**
 * Models an OAS 3.0 Info object.  Example:
 *
 *  {
 *    "title": "Sample Pet Store App",
 *    "description": "This is a sample server for a pet store.",
 *    "termsOfService": "http://example.com/terms/",
 *    "contact": {
 *      "name": "API Support",
 *      "url": "http://www.example.com/support",
 *      "email": "support@example.com"
 *    },
 *    "license": {
 *      "name": "Apache 2.0",
 *      "url": "http://www.apache.org/licenses/LICENSE-2.0.html"
 *    },
 *    "version": "1.0.1"
 *  }
 */
export class Oas30Info extends OasInfo {

    /**
     * Creates an OAS 3.0 Contact object.
     * @return {Oas30Contact}
     */
    public createContact(): Oas30Contact {
        let rval: Oas30Contact = new Oas30Contact();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    /**
     * Creates an OAS 3.0 License object.
     * @return {Oas30License}
     */
    public createLicense(): Oas30License {
        let rval: Oas30License = new Oas30License();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

}