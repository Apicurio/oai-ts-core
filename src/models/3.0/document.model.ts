/**
 * @license
 * Copyright 2017 Red Hat
 *
 * Licensed under the Apache License, Version 3.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-3.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {OasDocument} from "../document.model";
import {Oas30Info} from "./info.model";
import {Oas30Server} from "./server.model";

/**
 * Models an OAS 3.0.x document.
 */
export class Oas30Document extends OasDocument {

    public openapi: string = "3.0.0";
    public info: Oas30Info;
    public servers: Oas30Server[];
    // public paths: Oas30Paths;
    // public components: Oas30Components;
    // public security: Oas30SecurityRequirement[];
    // public tags: Oas30Server[];
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
     * Creates an OAS 3.0 info object.
     * @return {Oas30Info}
     */
    public createInfo(): Oas30Info {
        let rval: Oas30Info = new Oas30Info();
        rval._ownerDocument = this;
        rval._parent = this;
        return rval;
    }

    /**
     * Creates an OAS 3.0 Server object.
     * @return {Oas30Info}
     */
    public createServer(): Oas30Server {
        let rval: Oas30Server = new Oas30Server();
        rval._ownerDocument = this;
        rval._parent = this;
        return rval;
    }

    /**
     * Adds a server.
     * @param url
     * @param description
     * @return {Oas30Server}
     */
    public addServer(url: string, description: string): Oas30Server {
        let server: Oas30Server = this.createServer();
        server.url = url;
        server.description = description;
        if (!this.servers) {
            this.servers = [];
        }
        this.servers.push(server);
        return server;
    }

}
