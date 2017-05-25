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

import {OasDocument} from "../document.model";
import {Oas30Info} from "./info.model";

/**
 * Models an OAS 3.0.x document.
 */
export class Oas30Document extends OasDocument {

    public openapi: string = "3.0.0";
    public info: Oas30Info;
    // public servers: Oas30Servers;
    // public paths: Oas30Paths;
    // public components: Oas30Components;
    // public security: Oas30SecurityRequirement[];
    // public tags: Oas30Tag[];
    // public externalDocs: Oas30ExternalDocumentation;

    constructor() {
        super();
        this._ownerDocument = this;
    }

    /**
     * Returns the spec version of this document.
     */
    public getSpecVersion(): string {
        return this.openapi;
    }

    /**
     * Creates an OAS 2.0 info object.
     * @return {Oas20Info}
     */
    public createInfo(): Oas30Info {
        let rval: Oas30Info = new Oas30Info();
        rval._ownerDocument = this;
        rval._parent = this;
        return rval;
    }
}
