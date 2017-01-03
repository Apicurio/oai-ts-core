/**
 * @license
 * Copyright 2016 JBoss Inc
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
import {JsonSchemaType} from "../../models/json-schema";

/**
 * Implements the required property validation rule.  Various model properties are either
 * required or conditionally required.  For example, the "swagger" property MUST exist
 * on the root (document) node.  This rule checks for all required and conditionally
 * required properties on all model types.
 */
export class Oas20RequiredPropertyValidationRule extends Oas20ValidationRule {

    /**
     * Check if a property was defined.
     * @param propertyValue
     * @return {boolean}
     */
    private isDefined(propertyValue: any): boolean {
        if (propertyValue === undefined) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * Called when a required property is missing.
     * @param node
     * @param propertyName
     */
    private requireProperty(node: OasNode, propertyName: string): void {
        let propertyValue: any = node[propertyName];
        if (!this.isDefined(propertyValue)) {
            this.report(node, "Property \"" + propertyName + "\" is required.");
        }
    }

    /**
     * Called when a conditionally required property is missing.
     * @param node
     * @param propertyName
     * @param dependentProperty
     * @param dependentValue
     */
    private requirePropertyWhen(node: OasNode, propertyName: string, dependentProperty: string, dependentValue: string): void {
        let propertyValue: any = node[propertyName];
        if (!this.isDefined(propertyValue)) {
            this.report(node, "Property \"" + propertyName + "\" is required when \"" + dependentProperty + "\" property is '" + dependentValue + "'.");
        }
    }

    public visitDocument(node: Oas20Document): void {
        this.requireProperty(node, "swagger");
        this.requireProperty(node, "info");
        this.requireProperty(node, "paths");
    }

    public visitInfo(node: Oas20Info): void {
        this.requireProperty(node, "title");
        this.requireProperty(node, "version");
    }

    public visitLicense(node: Oas20License): void {
        this.requireProperty(node, "name");
    }

    public visitOperation(node: Oas20Operation): void {
        this.requireProperty(node, "responses");
    }

    public visitExternalDocumentation(node: Oas20ExternalDocumentation): void {
        this.requireProperty(node, "url");
    }

    public visitParameter(node: Oas20Parameter): void {
        this.requireProperty(node, "name");
        this.requireProperty(node, "in");

        if (node.in === "path" && node.required !== true) {
            this.report(node, "Property \"required\" is required when \"in\" property is 'path' (and value must be 'true').");
        }

        if (node.in === "body") {
            this.requirePropertyWhen(node, "schema", "in", "body");
        }

        if (node.in !== "body" && !this.isDefined(node.type)) {
            this.report(node, "Property \"type\" is required when \"in\" property is NOT 'body'.");
        }

        if (node.in !== "body" && node.type === JsonSchemaType.array && !this.isDefined(node.items)) {
            this.report(node, "Property \"items\" is required when \"in\" property is NOT 'body' AND \"type\" property is 'array'.");
        }
    }

    public visitItems(node: Oas20Items): void {
        this.requireProperty(node, "type");
        if (node.type === JsonSchemaType.array) {
            this.requirePropertyWhen(node, "items", "type", "array");
        }
    }

    public visitResponse(node: Oas20Response): void {
        this.requireProperty(node, "description");
    }

    public visitHeader(node: Oas20Header): void {
        this.requireProperty(node, "type");
        if (node.type === JsonSchemaType.array) {
            this.requirePropertyWhen(node, "items", "type", "array");
        }
    }

    public visitTag(node: Oas20Tag): void {
        this.requireProperty(node, "name");
    }

    public visitSecurityScheme(node: Oas20SecurityScheme): void {
        this.requireProperty(node, "type");
        if (node.type === "apiKey") {
            this.requirePropertyWhen(node, "name", "type", "apiKey");
            this.requirePropertyWhen(node, "in", "type", "apiKey");
        }
        if (node.type === "oauth2") {
            this.requirePropertyWhen(node, "flow", "type", "oauth2");
            if ((node.flow === "implicit" || node.flow === "accessCode") && !this.isDefined(node.authorizationUrl)) {
                this.report(node, "Property \"authorizationUrl\" is is required when \"type\" property is 'oauth2' AND \"flow\" property is 'implicit|accessCode'.");
            }
            if ((node.flow === "password" || node.flow === "application" || node.flow === "accessCode") && !this.isDefined(node.tokenUrl)) {
                this.report(node, "Property \"tokenUrl\" is is required when \"type\" property is 'oauth2' AND \"flow\" property is 'password|application|accessCode'.");
            }
            this.requirePropertyWhen(node, "scopes", "type", "oauth2");
        }
    }

}