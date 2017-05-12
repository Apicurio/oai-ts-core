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
     */
    private requireProperty(code: string, node: OasNode, propertyName: string): void {
        let propertyValue: any = node[propertyName];
        if (!this.isDefined(propertyValue)) {
            this.report(code, node, "Property \"" + propertyName + "\" is required.");
        }
    }

    /**
     * Called when a conditionally required property is missing.
     * @param node
     * @param propertyName
     * @param dependentProperty
     * @param dependentValue
     */
    private requirePropertyWhen(code: string, node: OasNode, propertyName: string, dependentProperty: string, dependentValue: string): void {
        let propertyValue: any = node[propertyName];
        if (!this.isDefined(propertyValue)) {
            this.report(code, node, "Property \"" + propertyName + "\" is required when \"" + dependentProperty + "\" property is '" + dependentValue + "'.");
        }
    }

    public visitDocument(node: Oas20Document): void {
        this.requireProperty("R-001", node, "swagger");
        this.requireProperty("R-002", node, "info");
        this.requireProperty("R-003", node, "paths");
    }

    public visitInfo(node: Oas20Info): void {
        this.requireProperty("INF-001", node, "title");
        this.requireProperty("INF-002", node, "version");
    }

    public visitLicense(node: Oas20License): void {
        this.requireProperty("LIC-001", node, "name");
    }

    public visitOperation(node: Oas20Operation): void {
        this.requireProperty("OP-007", node, "responses");
    }

    public visitExternalDocumentation(node: Oas20ExternalDocumentation): void {
        this.requireProperty("ED-001", node, "url");
    }

    public visitParameter(node: Oas20Parameter): void {
        if (this.hasValue(node.$ref)) {
            return;
        }

        this.requireProperty("PAR-001", node, "name");
        this.requireProperty("PAR-002", node, "in");

        if (node.in === "path" && node.required !== true) {
            this.report("PAR-003", node, "Property \"required\" is required when \"in\" property is 'path' (and value must be 'true').");
        }

        if (node.in === "body") {
            this.requirePropertyWhen("PAR-004", node, "schema", "in", "body");
        }

        if (node.in !== "body" && !this.isDefined(node.type)) {
            this.report("PAR-005", node, "Property \"type\" is required when \"in\" property is NOT 'body'.");
        }

        if (node.in !== "body" && node.type === "array" && !this.isDefined(node.items)) {
            this.report("PAR-006", node, "Property \"items\" is required when \"in\" property is NOT 'body' AND \"type\" property is 'array'.");
        }
    }

    public visitItems(node: Oas20Items): void {
        this.requireProperty("IT-001", node, "type");
        if (node.type === "array") {
            this.requirePropertyWhen("IT-002", node, "items", "type", "array");
        }
    }

    public visitResponse(node: Oas20Response): void {
        if (this.hasValue(node.$ref)) {
            return;
        }
        this.requireProperty("RES-001", node, "description");
    }

    public visitHeader(node: Oas20Header): void {
        this.requireProperty("HEAD-001", node, "type");
        if (node.type === "array") {
            this.requirePropertyWhen("HEAD-001", node, "items", "type", "array");
        }
    }

    public visitTag(node: Oas20Tag): void {
        this.requireProperty("TAG-001", node, "name");
    }

    public visitSecurityScheme(node: Oas20SecurityScheme): void {
        this.requireProperty("SS-001", node, "type");
        if (node.type === "apiKey") {
            this.requirePropertyWhen("SS-002", node, "name", "type", "apiKey");
            this.requirePropertyWhen("SS-003", node, "in", "type", "apiKey");
        }
        if (node.type === "oauth2") {
            this.requirePropertyWhen("SS-004", node, "flow", "type", "oauth2");
            if ((node.flow === "implicit" || node.flow === "accessCode") && !this.isDefined(node.authorizationUrl)) {
                this.report("SS-005", node, "Property \"authorizationUrl\" is is required when \"type\" property is 'oauth2' AND \"flow\" property is 'implicit|accessCode'.");
            }
            if ((node.flow === "password" || node.flow === "application" || node.flow === "accessCode") && !this.isDefined(node.tokenUrl)) {
                this.report("SS-006", node, "Property \"tokenUrl\" is is required when \"type\" property is 'oauth2' AND \"flow\" property is 'password|application|accessCode'.");
            }
            this.requirePropertyWhen("SS-007", node, "scopes", "type", "oauth2");
        }
    }

}