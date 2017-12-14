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

import {OasExtensibleNode} from "./enode.model";
import {IOasNodeVisitor} from "../visitors/visitor.iface";
import {OasInfo} from "./common/info.model";
import {Oas20Info} from "./2.0/info.model";
import {OasPaths} from "./common/paths.model";
import {OasSecurityRequirement} from "./common/security-requirement.model";
import {OasTag} from "./common/tag.model";
import {OasExternalDocumentation} from "./common/external-documentation.model";

/**
 * Base class for all OAS documents.  A version-specific implementation of this class
 * is expected for each version of the specification supported by the library.
 */
export abstract class OasDocument extends OasExtensibleNode {

    public info: OasInfo;
    public paths: OasPaths;
    public security: OasSecurityRequirement[];
    public tags: OasTag[];
    public externalDocs: OasExternalDocumentation;

    /**
     * Returns the version of the specification of this document.
     */
    public abstract getSpecVersion(): string;

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        visitor.visitDocument(this);
    }

    /**
     * Creates an OAS info object.
     * @return {OasInfo}
     */
    public abstract createInfo(): OasInfo;

    /**
     * Creates an OAS Paths object.
     * @return {OasPaths}
     */
    public abstract createPaths(): OasPaths;

    /**
     * Creates an OAS Security Requirement object.
     * @return {OasSecurityRequirement}
     */
    public abstract createSecurityRequirement(): OasSecurityRequirement;

    /**
     * Creates an OAS Tag object.
     * @return {OasTag}
     */
    public abstract createTag(): OasTag;

    /**
     * Adds a tag.
     * @param name
     * @param description
     * @return {OasTag}
     */
    public abstract addTag(name: string, description: string): OasTag;

    /**
     * Creates an OAS External Documentation object.
     * @return {OasExternalDocumentation}
     */
    public abstract createExternalDocumentation(): OasExternalDocumentation;

    /**
     * Sets the external documentation information.
     * @param description
     * @param url
     */
    public abstract setExternalDocumentation(description: string, url: string): OasExternalDocumentation;

    /**
     * Returns true if the document is an OpenAPI/Swagger 2.0 document.
     * @return {boolean}
     */
    public is2xDocument(): boolean {
        return this.getSpecVersion() === "2.0";
    }

    /**
     * Returns true if the document is an OpenAPI 3.x document.
     * @return {boolean}
     */
    public is3xDocument(): boolean {
        return this.getSpecVersion().indexOf("3.") === 0;
    }

}