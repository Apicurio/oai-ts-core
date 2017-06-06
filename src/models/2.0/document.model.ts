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
import {Oas20Info} from "./info.model";
import {Oas20Tag} from "./tag.model";
import {Oas20ExternalDocumentation} from "./external-documentation.model";
import {Oas20SecurityRequirement} from "./security-requirement.model";
import {Oas20SecurityDefinitions} from "./security-definitions.model";
import {Oas20PathItem} from "./path-item.model";
import {Oas20Paths} from "./paths.model";
import {Oas20Definitions} from "./definitions.model";
import {Oas20ParametersDefinitions} from "./parameters-definitions.model";
import {Oas20ResponsesDefinitions} from "./responses-definitions.model";

/**
 * Models an OAS 2.0 document.
 */
export class Oas20Document extends OasDocument {

    public readonly swagger: string = "2.0";
    public host: string;
    public basePath: string;
    public schemes: string[];
    public consumes: string[];
    public produces: string[];
    public definitions: Oas20Definitions;
    public parameters: Oas20ParametersDefinitions;
    public responses: Oas20ResponsesDefinitions;
    public securityDefinitions: Oas20SecurityDefinitions;

    constructor() {
        super();
        this._ownerDocument = this;
    }

    /**
     * Returns the spec version of this document.
     */
    public getSpecVersion(): string {
        return this.swagger;
    }

    /**
     * Creates an OAS 2.0 info object.
     * @return {Oas20Info}
     */
    public createInfo(): Oas20Info {
        let rval: Oas20Info = new Oas20Info();
        rval._ownerDocument = this;
        rval._parent = this;
        return rval;
    }

    /**
     * Creates an OAS 2.0 Definitions object.
     * @return {Oas20Info}
     */
    public createDefinitions(): Oas20Definitions {
        let rval: Oas20Definitions = new Oas20Definitions();
        rval._ownerDocument = this;
        rval._parent = this;
        return rval;
    }

    /**
     * Creates an OAS 2.0 Tag object.
     * @return {Oas20Info}
     */
    public createTag(): Oas20Tag {
        let rval: Oas20Tag = new Oas20Tag();
        rval._ownerDocument = this;
        rval._parent = this;
        return rval;
    }

    /**
     * Adds a tag.
     * @param name
     * @param description
     * @return {Oas20Tag}
     */
    public addTag(name: string, description: string): Oas20Tag {
        let tag: Oas20Tag = this.createTag();
        tag.name = name;
        tag.description = description;
        if (!this.tags) {
            this.tags = [];
        }
        this.tags.push(tag);
        return tag;
    }

    /**
     * Creates an OAS 2.0 Security Definition object.
     * @return {Oas20SecurityDefinition}
     */
    public createSecurityDefinitions(): Oas20SecurityDefinitions {
        let rval: Oas20SecurityDefinitions = new Oas20SecurityDefinitions();
        rval._ownerDocument = this.ownerDocument();
        rval._parent = this;
        return rval;
    }

    /**
     * Creates an OAS 2.0 Security Requirement object.
     * @return {Oas20SecurityRequirement}
     */
    public createSecurityRequirement(): Oas20SecurityRequirement {
        let rval: Oas20SecurityRequirement = new Oas20SecurityRequirement();
        rval._ownerDocument = this.ownerDocument();
        rval._parent = this;
        return rval;
    }

    /**
     * Creates an OAS 2.0 External Documentation object.
     * @return {Oas20ExternalDocumentation}
     */
    public createExternalDocumentation(): Oas20ExternalDocumentation {
        let rval: Oas20ExternalDocumentation = new Oas20ExternalDocumentation();
        rval._ownerDocument = this.ownerDocument();
        rval._parent = this;
        return rval;
    }

    /**
     * Sets the external documentation information.
     * @param description
     * @param url
     */
    public setExternalDocumentation(description: string, url: string): Oas20ExternalDocumentation {
        let edoc: Oas20ExternalDocumentation = this.createExternalDocumentation();
        edoc.description = description;
        edoc.url = url;
        this.externalDocs = edoc;
        return edoc;
    }

    /**
     * Creates an OAS 2.0 Paths object.
     * @return {Oas20Paths}
     */
    public createPaths(): Oas20Paths {
        let rval: Oas20Paths = new Oas20Paths();
        rval._ownerDocument = this.ownerDocument();
        rval._parent = this;
        return rval;
    }

    /**
     * Creates an OAS 2.0 Responses Definitions object.
     * @return {Oas20ResponsesDefinitions}
     */
    public createResponsesDefinitions(): Oas20ResponsesDefinitions {
        let rval: Oas20ResponsesDefinitions = new Oas20ResponsesDefinitions();
        rval._ownerDocument = this.ownerDocument();
        rval._parent = this;
        return rval;
    }

    /**
     * Creates an OAS 2.0 Responses Definitions object.
     * @return {Oas20ParametersDefinitions}
     */
    public createParametersDefinitions(): Oas20ParametersDefinitions {
        let rval: Oas20ParametersDefinitions = new Oas20ParametersDefinitions();
        rval._ownerDocument = this.ownerDocument();
        rval._parent = this;
        return rval;
    }
}
