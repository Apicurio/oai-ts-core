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
import {Oas30Example, Oas30ExampleDefinition} from "../../models/3.0/example.model";
import {Oas30Header, Oas30HeaderDefinition} from "../../models/3.0/header.model";
import {Oas30Link, Oas30LinkDefinition} from "../../models/3.0/link.model";
import {Oas30MediaType} from "../../models/3.0/media-type.model";
import {Oas30Parameter, Oas30ParameterBase, Oas30ParameterDefinition} from "../../models/3.0/parameter.model";

/**
 * Implements the Mutually Exclusive validation rule.  This rule is responsible
 * for reporting whenever properties are used together when that is not allowed.
 * In various places in the specification, some properties are mutually exclusive
 * with each other.
 */
export class Oas30MutuallyExclusiveValidationRule extends Oas30ValidationRule {

    private hasContent(contentParent: Oas30ParameterBase): boolean {
        return contentParent.getMediaTypes().length > 0;
    }

    public visitExample(node: Oas30Example): void {
        this.reportIf("EX-3-002", this.hasValue(node.value) && this.hasValue(node.externalValue), node,
            `The "value" and "externalValue" properties are mutually exclusive.`);
    }
    public visitExampleDefinition(node: Oas30ExampleDefinition): void { this.visitExample(node); }

    public visitHeader(node: Oas30Header): void {
        // TODO implement this rule once 'content' is added to header
        // this.reportIf("HEAD-3-006", this.hasValue(node.schema) && this.hasContent(node), node,
        //     `The "schema" and "content" properties are mutually exclusive.`);
        this.reportIf("HEAD-3-007", this.hasValue(node.example) && this.hasValue(node.examples), node,
            `The "example" and "examples" properties are mutually exclusive.`);
    }
    public visitHeaderDefinition(node: Oas30HeaderDefinition): void { this.visitHeader(node); }

    public visitLink(node: Oas30Link): void {
        this.reportIf("LINK-3-001", this.hasValue(node.operationRef) && this.hasValue(node.operationId), node,
            `The "operationRef" and "operationId" properties are mutually exclusive.`);
    }
    public visitLinkDefinition(node: Oas30LinkDefinition): void { this.visitLink(node); }

    public visitMediaType(node: Oas30MediaType): void {
        this.reportIf("MT-3-001", this.hasValue(node.example) && this.hasValue(node.examples), node,
            `The "example" and "examples" properties are mutually exclusive.`);
    }

    private visitParameterBase(node: Oas30ParameterBase): void {
        this.reportIf("PAR-3-008", this.hasValue(node.schema) && this.hasContent(node), node,
            `The "schema" and "content" properties are mutually exclusive.`);
        this.reportIf("PAR-3-015", this.hasValue(node.example) && this.hasValue(node.examples), node,
            `The "example" and "examples" properties are mutually exclusive.`);
    }
    public visitParameter(node: Oas30Parameter): void { this.visitParameterBase(node); }
    public visitParameterDefinition(node: Oas30ParameterDefinition): void { this.visitParameterBase(node); }
}
