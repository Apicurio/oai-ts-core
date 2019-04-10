/**
 * @license
 * Copyright 2019 Red Hat
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
import {
    Oas30AdditionalPropertiesSchema,
    Oas30AllOfSchema,
    Oas30AnyOfSchema,
    Oas30ItemsSchema,
    Oas30NotSchema,
    Oas30OneOfSchema,
    Oas30PropertySchema,
    Oas30Schema,
    Oas30SchemaDefinition
} from "../../models/3.0/schema.model";
import {OasValidationRule} from "./common.rule";

const allowedTypes = ["string", "number", "integer", "boolean", "array", "object"]

/**
 * Implements the Invalid Property Type validation rule.  This rule is responsible
 * for reporting whenever the **type** and **items** of a property fails to conform to the required
 * format defined by the specification
 */
export abstract class OasInvalidPropertyTypeValidationRule extends OasValidationRule {

    /**
     * Returns true if the type node has a valid type.
     * @param type
     * @return {boolean}
     */
    protected isValidType(type: string): boolean {
        if (this.hasValue(type)) {
            return OasValidationRuleUtil.isValidEnumItem(type, allowedTypes)
        }
        return true;
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

/**
 * Implements the Invalid Schema Type Value rule.
 */
export class OasInvalidSchemaTypeValueRule extends OasInvalidPropertyTypeValidationRule {

    public visitSchema(node: Oas30Schema) {
        this.reportIfInvalid(this.isValidType(node.type), node, "type", {
            type: node.type,
            allowedTypes: allowedTypes.join(", ")
        });
    }
}


/**
 * Implements the Invalid Schema Array Items rule.
 */
export class OasInvalidSchemaArrayItemsRule extends OasInvalidPropertyTypeValidationRule {

    public visitSchema(node: Oas30Schema) {
        if (this.isDefined(node.items) && node.type !== "array") {
            this.report(node, "items");
        }
    }

}
