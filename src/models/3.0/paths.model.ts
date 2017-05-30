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

import {OasPaths} from "../common/paths.model";
import {Oas30PathItem} from "./path-item.model";

/**
 * Models an OAS 3.0 Paths object.  The Paths object can have any number of child
 * paths, where the field name begins with '/'.  Example:
 *
 * {
 *  "/pets": {
 *    "get": {
 *      "description": "Returns all pets from the system that the user has access to",
 *      "responses": {
 *        "200": {
 *          "description": "A list of pets.",
 *          "content": {
 *            "application/json": {
 *              "schema": {
 *                "type": "array",
 *                "items": {
 *                  "$ref": "#/components/schemas/pet"
 *                }
 *              }
 *            }
 *          }
 *        }
 *      }
 *    }
 *  }
 *}
 */
export class Oas30Paths extends OasPaths {

    /**
     * Creates an OAS 3.0 path item object.
     * @param path
     * @return {Oas30PathItem}
     */
    public createPathItem(path: string): Oas30PathItem {
        let rval: Oas30PathItem = new Oas30PathItem(path);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

}
