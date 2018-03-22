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

import {Oas30ValidationRule} from "./common.rule";
import {OasNode} from "../../models/node.model";
import {OasValidationRuleUtil} from "../validation";
import {Oas30LinkDefinition} from "../../models/3.0/link.model";
import {Oas30CallbackDefinition} from "../../models/3.0/callback.model";
import {Oas30ExampleDefinition} from "../../models/3.0/example.model";
import {Oas30RequestBodyDefinition} from "../../models/3.0/request-body.model";
import {Oas30HeaderDefinition} from "../../models/3.0/header.model";
import {Oas30SecurityRequirement} from "../../models/3.0/security-requirement.model";
import {Oas30PathItem} from "../../models/3.0/path-item.model";
import {Oas30Response, Oas30ResponseBase, Oas30ResponseDefinition} from "../../models/3.0/response.model";
import {Oas30Document} from "../../models/3.0/document.model";
import {Oas30SecurityScheme} from "../../models/3.0/security-scheme.model";
import {Oas30Schema, Oas30SchemaDefinition} from "../../models/3.0/schema.model";
import {Oas30ParameterDefinition} from "../../models/3.0/parameter.model";
import {Oas30Encoding} from "../../models/3.0/encoding.model";
import {Oas30MediaType} from "../../models/3.0/media-type.model";

/**
 * Implements the Invalid Property Name validation rule.  This rule is responsible
 * for reporting whenever the **name** of a property fails to conform to the required
 * format defined by the specification.
 */
export class Oas30InvalidPropertyNameValidationRule extends Oas30ValidationRule {

    /**
     * Returns true if the definition name is valid.
     * @param name
     * @return {boolean}
     */
    private static isValidDefinitionName(name: string): boolean {
        let definitionNamePattern: RegExp = /^[a-zA-Z0-9\.\-_]+$/;
        return definitionNamePattern.test(name);
    }

    /**
     * Returns true if the given schema has a property defined with the given name.
     * @param {Oas30Schema} schema
     * @param {string} propertyName
     * @return {boolean}
     */
    private isValidSchemaProperty(schema: Oas30Schema, propertyName: string): boolean {
        if (this.isNullOrUndefined(schema)) {
            return false;
        }
        return !this.isNullOrUndefined(schema.property(propertyName));
    }

    public visitPathItem(node: Oas30PathItem): void {
        this.reportIfInvalid("PATH-3-004", node.path().indexOf("/") === 0, node, `The path must start with a '/' character.`);
    }

    public visitResponse(node: Oas30Response): void {
        // The "default" response will have a statusCode of "null"
        if (this.hasValue(node.statusCode())) {
            this.reportIfInvalid("RES-3-001", OasValidationRuleUtil.isValidHttpCode(node.statusCode()), node,
                `Response status code "${node.statusCode()}" is not a valid HTTP response status code.`);
        }
    }

    public visitSecurityRequirement(node: Oas30SecurityRequirement): void {
        let srn: string[] = node.securityRequirementNames();
        srn.forEach( name => {
            let doc: Oas30Document = node.ownerDocument() as Oas30Document;
            let scheme = doc.components.getSecurityScheme(name);
            this.reportIfInvalid("SREQ-3-001", !(scheme === undefined || scheme === null), node,
                `Security Requirement "${name}" does not correspond to a declared Security Scheme.`);
        });
    }

    public visitSchemaDefinition(node: Oas30SchemaDefinition): void {
        this.reportIfInvalid("COMP-3-001", Oas30InvalidPropertyNameValidationRule.isValidDefinitionName(node.name()), node,
            `The Schema Definition name must match the regular expression: ^[a-zA-Z0-9\\.\\-_]+$`);
    }

    public visitParameterDefinition(node: Oas30ParameterDefinition): void {
        this.reportIfInvalid("COMP-3-002", Oas30InvalidPropertyNameValidationRule.isValidDefinitionName(node.parameterName()), node,
            `The Parameter Definition name must match the regular expression: ^[a-zA-Z0-9\\.\\-_]+$`);
    }

    public visitResponseDefinition(node: Oas30ResponseDefinition): void {
        this.reportIfInvalid("COMP-3-003", Oas30InvalidPropertyNameValidationRule.isValidDefinitionName(node.name()), node,
            `The Response Definition name must match the regular expression: ^[a-zA-Z0-9\\.\\-_]+$`);
    }

    public visitSecurityScheme(node: Oas30SecurityScheme): void {
        this.reportIfInvalid("COMP-3-004", Oas30InvalidPropertyNameValidationRule.isValidDefinitionName(node.schemeName()), node,
            `The Security Scheme name must match the regular expression: ^[a-zA-Z0-9\\.\\-_]+$`);
    }

    public visitExampleDefinition(node: Oas30ExampleDefinition): void {
        this.reportIfInvalid("COMP-3-005", Oas30InvalidPropertyNameValidationRule.isValidDefinitionName(node.name()), node,
            `The Example Definition name must match the regular expression: ^[a-zA-Z0-9\\.\\-_]+$`);
    }

    public visitRequestBodyDefinition(node: Oas30RequestBodyDefinition): void {
        this.reportIfInvalid("COMP-3-006", Oas30InvalidPropertyNameValidationRule.isValidDefinitionName(node.name()), node,
            `The Request Body Definition name must match the regular expression: ^[a-zA-Z0-9\\.\\-_]+$`);
    }

    public visitHeaderDefinition(node: Oas30HeaderDefinition): void {
        this.reportIfInvalid("COMP-3-007", Oas30InvalidPropertyNameValidationRule.isValidDefinitionName(node.name()), node,
            `The Header Definition name must match the regular expression: ^[a-zA-Z0-9\\.\\-_]+$`);
    }

    public visitLinkDefinition(node: Oas30LinkDefinition): void {
        this.reportIfInvalid("COMP-3-008", Oas30InvalidPropertyNameValidationRule.isValidDefinitionName(node.name()), node,
            `The Link Definition name must match the regular expression: ^[a-zA-Z0-9\\.\\-_]+$`);
    }

    public visitCallbackDefinition(node: Oas30CallbackDefinition): void {
        this.reportIfInvalid("COMP-3-009", Oas30InvalidPropertyNameValidationRule.isValidDefinitionName(node.name()), node,
            `The Callback Definition name must match the regular expression: ^[a-zA-Z0-9\\.\\-_]+$`);
    }

    public visitEncoding(node: Oas30Encoding): void {
        let name: string = node.name();
        let schema: Oas30Schema = (node.parent() as Oas30MediaType).schema;

        this.reportIfInvalid("ENC-3-006", this.isValidSchemaProperty(schema, name), node,
            `The encoding property "${name}" cannot be found in the associated schema.`);
    }

}
