/**
 * @license
 * Copyright 2018 Red Hat
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

import { Oas30ValidationRule } from "./common.rule";
import { OasValidationRuleUtil } from "../validation";
import { Oas30Schema, Oas30SchemaDefinition, Oas30ItemsSchema, Oas30PropertySchema, Oas30AllOfSchema, Oas30AnyOfSchema, Oas30OneOfSchema, Oas30NotSchema, Oas30AdditionalPropertiesSchema } from "../../models/3.0/schema.model";

const allowedTypes = ["string", "number", "integer", "boolean", "array", "object"]

/**
 * Implements the Invalid Property Type validation rule.  This rule is responsible
 * for reporting whenever the **type** and **items** of a property fails to conform to the required
 * format defined by the specification
 */
export class Oas30InvalidPropertyTypeValidationRule extends Oas30ValidationRule {

    /**
     * Returns true if the type node has a valid type.
     * @param type
     * @return {boolean}
     */
    private isValidType(type: string): boolean {
        if (this.hasValue(type)) {
            return OasValidationRuleUtil.isValidEnumItem(type, allowedTypes)
        }
        return true;
    }

    /**
     * Returns true if the type is array and items is defined
     * @param type
     * @return {boolean}
     */
    private isValidItems(node: Oas30Schema): boolean {
        const { type, items } = node;
        if (type == 'array' && !this.hasValue(items)) return false;
        if (type !== 'array' && this.hasValue(items)) return false;
        return true;
    }

    public visitSchema(node: Oas30Schema) {
        this.reportIfInvalid("SCH-3-003", this.isValidType(node.type), node, "type",
            `Schema type value of "${ node.type }" is not allowed.  Must be one of: [${allowedTypes.join(", ")}]`);

        this.reportIfInvalid("SCH-3-004", this.isValidItems(node), node, "items",
            `Schema items must be present only for schemas of type 'array'.`);
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
