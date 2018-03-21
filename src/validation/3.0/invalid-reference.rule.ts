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

import {OasValidationRuleUtil} from "../validation";
import {Oas30ValidationRule} from "./common.rule";
import {Oas30Callback, Oas30CallbackDefinition} from "../../models/3.0/callback.model";
import {Oas30Example, Oas30ExampleDefinition} from "../../models/3.0/example.model";
import {Oas30Header, Oas30HeaderDefinition} from "../../models/3.0/header.model";
import {Oas30Link, Oas30LinkDefinition} from "../../models/3.0/link.model";
import {Oas30Parameter, Oas30ParameterDefinition} from "../../models/3.0/parameter.model";
import {Oas30RequestBody, Oas30RequestBodyDefinition} from "../../models/3.0/request-body.model";
import {Oas30Response, Oas30ResponseBase, Oas30ResponseDefinition} from "../../models/3.0/response.model";
import {Oas30SecurityScheme} from "../../models/3.0/security-scheme.model";
import {
    Oas30AdditionalPropertiesSchema,
    Oas30AllOfSchema,
    Oas30AnyOfSchema,
    Oas30ItemsSchema,
    Oas30NotSchema,
    Oas30OneOfSchema,
    Oas30PropertySchema,
    Oas30Schema, Oas30SchemaDefinition
} from "../../models/3.0/schema.model";

/**
 * Implements the Invalid Reference validation rule.  This rule is responsible
 * for reporting whenever a property references another node in the document
 * but that reference is missing or invalid.
 */
export class Oas30InvalidReferenceValidationRule extends Oas30ValidationRule {

    /**
     * Returns true if the security requirement name is valid.  It does this by looking up a declared
     * security scheme definition in the document.  If no security scheme definition exists with the
     * given name, then it is invalid.
     * @param securityReqName
     * @param doc
     */
    // private isValidSecurityRequirementName(securityReqName: string, doc: Oas30Document): boolean {
    //     return this.hasValue(doc.components) && this.hasValue(doc.components.getSecurityScheme(securityReqName));
    // }

    public visitCallback(node: Oas30Callback): void {
        if (this.hasValue(node.$ref)) {
            this.reportIfInvalid("CALL-3-001", OasValidationRuleUtil.canResolveRef(node.$ref, node), node,
                `The "$ref" property value "${node.$ref}" must reference a valid Callback.`);
        }
    }
    public visitCallbackDefinition(node: Oas30CallbackDefinition): void { this.visitCallback(node); }

    public visitExample(node: Oas30Example): void {
        if (this.hasValue(node.$ref)) {
            this.reportIfInvalid("EX-3-003", OasValidationRuleUtil.canResolveRef(node.$ref, node), node,
                `The "$ref" property value "${node.$ref}" must reference a valid Example.`);
        }
    }
    public visitExampleDefinition(node: Oas30ExampleDefinition): void { this.visitExample(node); }

    public visitHeader(node: Oas30Header): void {
        if (this.hasValue(node.$ref)) {
            this.reportIfInvalid("HEAD-3-005", OasValidationRuleUtil.canResolveRef(node.$ref, node), node,
                `The "$ref" property value "${node.$ref}" must reference a valid Header.`);
        }
    }
    public visitHeaderDefinition(node: Oas30HeaderDefinition): void { this.visitHeader(node); }

    public visitLink(node: Oas30Link): void {
        if (this.hasValue(node.$ref)) {
            this.reportIfInvalid("LINK-3-005", OasValidationRuleUtil.canResolveRef(node.$ref, node), node,
                `The "$ref" property value "${node.$ref}" must reference a valid Link.`);
        }
        if (this.hasValue(node.operationRef)) {
            this.reportIfInvalid("LINK-3-003", OasValidationRuleUtil.canResolveRef(node.operationRef, node), node,
                `The "operationRef" property value "${node.$ref}" must reference a valid Link.`);
        }
    }
    public visitLinkDefinition(node: Oas30LinkDefinition): void { this.visitLink(node); }

    public visitParameter(node: Oas30Parameter): void {
        if (this.hasValue(node.$ref)) {
            this.reportIfInvalid("PAR-3-017", OasValidationRuleUtil.canResolveRef(node.$ref, node), node,
                `The "$ref" property value "${node.$ref}" must reference a valid Parameter.`);
        }
    }
    public visitParameterDefinition(node: Oas30ParameterDefinition): void { this.visitParameter(node); }

    public visitRequestBody(node: Oas30RequestBody): void {
        if (this.hasValue(node.$ref)) {
            this.reportIfInvalid("RB-3-003", OasValidationRuleUtil.canResolveRef(node.$ref, node), node,
                `The "$ref" property value "${node.$ref}" must reference a valid Request Body.`);
        }
    }
    public visitRequestBodyDefinition(node: Oas30RequestBodyDefinition): void { this.visitRequestBody(node); }

    private visitResponseBase(node: Oas30ResponseBase): void {
        if (this.hasValue(node.$ref)) {
            this.reportIfInvalid("RES-3-004", OasValidationRuleUtil.canResolveRef(node.$ref, node), node,
                `The "$ref" property value "${node.$ref}" must reference a valid Response.`);
        }
    }
    public visitResponse(node: Oas30Response): void { this.visitResponseBase(node); }
    public visitResponseDefinition(node: Oas30ResponseDefinition): void { this.visitResponseBase(node); }

    public visitSecurityScheme(node: Oas30SecurityScheme): void {
        if (this.hasValue(node.$ref)) {
            this.reportIfInvalid("SS-3-012", OasValidationRuleUtil.canResolveRef(node.$ref, node), node,
                `The "$ref" property value "${node.$ref}" must reference a valid Security Scheme.`);
        }
    }

    public visitSchema(node: Oas30Schema): void {
        if (this.hasValue(node.$ref)) {
            this.reportIfInvalid("SCH-3-002", OasValidationRuleUtil.canResolveRef(node.$ref, node), node,
                `The "$ref" property value "${node.$ref}" must reference a valid Schema.`);
        }
    }
    public visitAllOfSchema(node: Oas30AllOfSchema): void { this.visitSchema(node); }
    public visitAnyOfSchema(node: Oas30AnyOfSchema): void { this.visitSchema(node); }
    public visitOneOfSchema(node: Oas30OneOfSchema): void { this.visitSchema(node); }
    public visitNotSchema(node: Oas30NotSchema): void { this.visitSchema(node); }
    public visitPropertySchema(node: Oas30PropertySchema): void { this.visitSchema(node); }
    public visitItemsSchema(node: Oas30ItemsSchema): void { this.visitSchema(node); }
    public visitAdditionalPropertiesSchema(node: Oas30AdditionalPropertiesSchema): void { this.visitSchema(node); }
    public visitSchemaDefinition(node: Oas30SchemaDefinition): void { this.visitSchema(node); }

}
