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

import {Oas20Document} from "../../models/2.0/document.model";
import {Oas20ValidationRule} from "./common.rule";
import {OasNode} from "../../models/node.model";
import {Oas20Info} from "../../models/2.0/info.model";
import {Oas20License} from "../../models/2.0/license.model";
import {Oas20Operation} from "../../models/2.0/operation.model";
import {Oas20ExternalDocumentation} from "../../models/2.0/external-documentation.model";
import {Oas20Parameter} from "../../models/2.0/parameter.model";
import {Oas20Items} from "../../models/2.0/items.model";
import {Oas20Response} from "../../models/2.0/response.model";
import {Oas20Header} from "../../models/2.0/header.model";
import {Oas20Tag} from "../../models/2.0/tag.model";
import {Oas20SecurityScheme} from "../../models/2.0/security-scheme.model";

/**
 * Implements the required property validation rule.  Various model properties are either
 * required or conditionally required.  For example, the "swagger" property MUST exist
 * on the root (document) node.  This rule checks for all required and conditionally
 * required properties on all model types.
 */
export class Oas20RequiredPropertyValidationRule extends Oas20ValidationRule {

    /**
     * Called when a required property is missing.
     * @param code
     * @param node
     * @param propertyName
     * @param message
     */
    private requireProperty(code: string, node: OasNode, propertyName: string, message? : string): void {
        let propertyValue: any = node[propertyName];
        if (!this.isDefined(propertyValue)) {
            if (message) {
                this.report(code, node, propertyName, message);
            } else {
                this.report(code, node, propertyName, `Property "${propertyName}" is required.`);
            }
        }
    }

    /**
     * Called when a conditionally required property is missing.
     * @param node
     * @param propertyName
     * @param dependentProperty
     * @param dependentValue
     * @param message
     */
    private requirePropertyWhen(code: string, node: OasNode, propertyName: string, dependentProperty:
            string, dependentValue: string, message?: string): void {
        let propertyValue: any = node[propertyName];
        if (!this.isDefined(propertyValue)) {
            if (message) {
                this.report(code, node, propertyName, message);
            } else {
                this.report(code, node, propertyName,
                    `Property "${propertyName}" is required when "${dependentProperty}" property is '${dependentValue}'.`);
            }
        }
    }

    public visitDocument(node: Oas20Document): void {
        this.requireProperty("R-001", node, "swagger");
        this.requireProperty("R-002", node, "info");
        this.requireProperty("R-003", node, "paths");
    }

    public visitInfo(node: Oas20Info): void {
        this.requireProperty("INF-001", node, "title", "API is missing a title.");
        this.requireProperty("INF-002", node, "version", "API is missing a version.");
    }

    public visitLicense(node: Oas20License): void {
        this.requireProperty("LIC-001", node, "name", "License is missing a name.");
    }

    public visitOperation(node: Oas20Operation): void {
        this.requireProperty("OP-007", node, "responses", "Operation must have at least one response.");
    }

    public visitExternalDocumentation(node: Oas20ExternalDocumentation): void {
        this.requireProperty("ED-001", node, "url", "Externals Docs is missing a URL.");
    }

    public visitParameter(node: Oas20Parameter): void {
        if (this.hasValue(node.$ref)) {
            return;
        }

        this.requireProperty("PAR-001", node, "name", "Parameter is missing a name.");
        this.requireProperty("PAR-002", node, "in", "Parameter is missing a style (Query, Header, etc).");

        if (node.in === "path" && node.required !== true) {
            this.report("PAR-003", node, "required",
                `Path Parameter "${node.name}" must be marked as required.`);
        }

        if (node.in === "body") {
            this.requirePropertyWhen("PAR-004", node, "schema", "in", "body",
                "Body Parameters must have a schema defined.");
        }

        if (node.in !== "body" && !this.isDefined(node.type)) {
            this.report("PAR-005", node, "type", 
                `Parameter '${node.name}' is missing a type.`);
        }

        if (node.in !== "body" && node.type === "array" && !this.isDefined(node.items)) {
            this.report("PAR-006", node, "items",
                `Parameter '${node.name}' marked as array but no array type provided..`);
        }
    }

    public visitItems(node: Oas20Items): void {
        this.requireProperty("IT-001", node, "type");
        if (node.type === "array") {
            this.requirePropertyWhen("IT-002", node, "items", "type", "array",
                "Type information missing for array items.");
        }
    }

    public visitResponse(node: Oas20Response): void {
        if (this.hasValue(node.$ref)) {
            return;
        }
        this.requireProperty("RES-001", node, "description", "Response is missing a description.");
    }

    public visitHeader(node: Oas20Header): void {
        this.requireProperty("HEAD-001", node, "type");
        if (node.type === "array") {
            this.requirePropertyWhen("HEAD-001", node, "items", "type", "array",
                "Header is missing array type information.");
        }
    }

    public visitTag(node: Oas20Tag): void {
        this.requireProperty("TAG-001", node, "name", "Tag is missing a name.");
    }

    public visitSecurityScheme(node: Oas20SecurityScheme): void {
        this.requireProperty("SS-001", node, "type");
        if (node.type === "apiKey") {
            this.requirePropertyWhen("SS-002", node, "name", "type", "apiKey",
                "API Key Security Scheme is missing a parameter name.");
            this.requirePropertyWhen("SS-003", node, "in", "type", "apiKey",
                "API Key Security Scheme is missing a parameter location.");
        }
        if (node.type === "oauth2") {
            this.requirePropertyWhen("SS-004", node, "flow", "type", "oauth2");
            if ((node.flow === "implicit" || node.flow === "accessCode") && !this.isDefined(node.authorizationUrl)) {
                this.report("SS-005", node, "authorizationUrl", 
                    `OAuth Security Scheme is missing an Authorization URL.`);
            }
            if ((node.flow === "password" || node.flow === "application" || node.flow === "accessCode") && !this.isDefined(node.tokenUrl)) {
                this.report("SS-006", node, "tokenUrl",
                    `OAuth Security Scheme is missing a Token URL.`);
            }
            this.requirePropertyWhen("SS-007", node, "scopes", "type", "oauth2",
                "OAuth Security Scheme is missing defined scopes.");
        }
    }

}