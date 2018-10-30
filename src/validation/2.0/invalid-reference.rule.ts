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

import {Oas20ValidationRule} from "./common.rule";
import {Oas20Parameter} from "../../models/2.0/parameter.model";
import {Oas20Response} from "../../models/2.0/response.model";
import {
    Oas20AdditionalPropertiesSchema,
    Oas20AllOfSchema,
    Oas20ItemsSchema,
    Oas20PropertySchema,
    Oas20Schema, Oas20SchemaDefinition
} from "../../models/2.0/schema.model";
import {Oas20PathItem} from "../../models/2.0/path-item.model";
import {Oas20SecurityRequirement} from "../../models/2.0/security-requirement.model";
import {Oas20Document} from "../../models/2.0/document.model";
import {OasValidationRuleUtil} from "../validation";

/**
 * Implements the Invalid Reference validation rule.  This rule is responsible
 * for reporting whenever a property references another node in the document
 * but that reference is missing or invalid.
 */
export class Oas20InvalidReferenceValidationRule extends Oas20ValidationRule {

    /**
     * Returns true if the security requirement name is valid.  It does this by looking up a declared
     * security scheme definition in the document.  If no security scheme definition exists with the
     * given name, then it is invalid.
     * @param securityReqName
     * @param doc
     */
    private isValidSecurityRequirementName(securityReqName: string, doc: Oas20Document): boolean {
        return this.hasValue(doc.securityDefinitions) && this.isDefined(doc.securityDefinitions.securityScheme(securityReqName));
    }

    public visitParameter(node: Oas20Parameter): void {
        if (this.hasValue(node.$ref)) {
            this.reportIfInvalid("PAR-018", OasValidationRuleUtil.canResolveRef(node.$ref, node), node, "$ref",
                `Parameter Reference must refer to a valid Parameter Definition.`);
        }
    }

    public visitPathItem(node: Oas20PathItem): void {
        if (this.hasValue(node.$ref)) {
            this.reportIfInvalid("PATH-001", OasValidationRuleUtil.canResolveRef(node.$ref, node), node, "$ref",
                `Path Item Reference must refer to a valid Path Item Definition.`);
        }
    }

    public visitResponse(node: Oas20Response): void {
        if (this.hasValue(node.$ref)) {
            this.reportIfInvalid("RES-002", OasValidationRuleUtil.canResolveRef(node.$ref, node), node, "$ref",
                `Response Reference must refer to a valid Response Definition.`);
        }
    }

    public visitSchema(node: Oas20Schema): void {
        if (this.hasValue(node.$ref)) {
            this.reportIfInvalid("SCH-001", OasValidationRuleUtil.canResolveRef(node.$ref, node), node, "$ref",
                `Schema Reference must refer to a valid Schema Definition.`);
        }
        if (this.hasValue(node.required)) {
            node.required.forEach( pname => {
                this.reportIfInvalid("SCH-002", this.hasSchemaProperty(node, pname), node, "required",
                    `Schema lists property "${ pname }" as required, but it does not exist.`);
            });
        }
    }

    public visitPropertySchema(node: Oas20PropertySchema): void {
        this.visitSchema(node);
    }

    public visitAdditionalPropertiesSchema(node: Oas20AdditionalPropertiesSchema): void {
        this.visitSchema(node);
    }

    public visitItemsSchema(node: Oas20ItemsSchema): void {
        this.visitSchema(node);
    }

    public visitAllOfSchema(node: Oas20AllOfSchema): void {
        this.visitSchema(node);
    }

    public visitSchemaDefinition(node: Oas20SchemaDefinition): void {
        this.visitSchema(node);
    }


    public visitSecurityRequirement(node: Oas20SecurityRequirement): void {
        node.securityRequirementNames().forEach( name => {
            this.reportIfInvalid("SREQ-001", this.isValidSecurityRequirementName(name, <Oas20Document>node.ownerDocument()), node, null,
                `Security Requirement '${name}' must refer to a valid Security Definition.`);
        });
    }

    private hasSchemaProperty(schema: Oas20Schema, propertyName: string): boolean {
        return this.hasValue(schema.properties) && this.hasValue(schema.properties[propertyName]);
    }

}
