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

import {Oas20PathItem} from "../../models/2.0/path-item.model";
import {Oas20Operation} from "../../models/2.0/operation.model";
import {OasValidationRule} from "./common.rule";
import {Oas30Example, Oas30ExampleDefinition} from "../../models/3.0/example.model";
import {Oas30Header, Oas30HeaderDefinition} from "../../models/3.0/header.model";
import {Oas30Link, Oas30LinkDefinition} from "../../models/3.0/link.model";
import {Oas30MediaType} from "../../models/3.0/media-type.model";
import {Oas30Parameter, Oas30ParameterBase, Oas30ParameterDefinition} from "../../models/3.0/parameter.model";


/**
 * Implements the Body and Form Data Mutual Exclusivity Rule.
 */
export class OasBodyAndFormDataMutualExclusivityRule extends OasValidationRule {

    public visitOperation(node: Oas20Operation): void {
        if (this.hasValue(node.parameters)) {
            let hasBodyParam: boolean = false;
            let hasFormDataParam: boolean = false;
            node.parameters.forEach( param => {
                if (param.in === "body") {
                    hasBodyParam = true;
                }
                if (param.in === "formData") {
                    hasFormDataParam = true;
                }
            });
            this.reportIfInvalid(!(hasBodyParam && hasFormDataParam), node, "body");
        }
    }

    public visitPathItem(node: Oas20PathItem): void {
        if (this.hasValue(node.parameters)) {
            let hasBodyParam: boolean = false;
            let hasFormDataParam: boolean = false;
            node.parameters.forEach( param => {
                if (param.in === "body") {
                    hasBodyParam = true;
                }
                if (param.in === "formData") {
                    hasFormDataParam = true;
                }
            });
            this.reportIfInvalid(!(hasBodyParam && hasFormDataParam), node, "body");
        }
    }

}


/**
 * Implements the Example Value/External Value Mutual Exclusivity Rule.
 */
export class OasExampleValueMutualExclusivityRule extends OasValidationRule {

    public visitExample(node: Oas30Example): void {
        this.reportIf(this.hasValue(node.value) && this.hasValue(node.externalValue), node, "value");
    }
    public visitExampleDefinition(node: Oas30ExampleDefinition): void { this.visitExample(node); }

}

/**
 * Implements the Header Example/Examples Mutual Exclusivity Rule.
 */
export class OasHeaderExamplesMutualExclusivityRule extends OasValidationRule {

    public visitHeader(node: Oas30Header): void {
        this.reportIf(this.hasValue(node.example) && this.hasValue(node.examples), node, "example");
    }
    public visitHeaderDefinition(node: Oas30HeaderDefinition): void { this.visitHeader(node); }

}

/**
 * Implements the Link OperationRef/OperationId Mutual Exclusivity Rule.
 */
export class OasLinkOperationRefMutualExclusivityRule extends OasValidationRule {

    public visitLink(node: Oas30Link): void {
        this.reportIf(this.hasValue(node.operationRef) && this.hasValue(node.operationId), node, "operationId");
    }
    public visitLinkDefinition(node: Oas30LinkDefinition): void { this.visitLink(node); }

}

/**
 * Implements the Media Type Example/Examples Mutual Exclusivity Rule.
 */
export class OasMediaTypeExamplesMutualExclusivityRule extends OasValidationRule {

    public visitMediaType(node: Oas30MediaType): void {
        this.reportIf(this.hasValue(node.example) && this.hasValue(node.examples), node, "example");
    }

}

/**
 * Implements the Parameter Schema/Content Mutual Exclusivity Rule.
 */
export class OasParameterSchemaContentMutualExclusivityRule extends OasValidationRule {

    private hasContent(contentParent: Oas30ParameterBase): boolean {
        return contentParent.getMediaTypes().length > 0;
    }

    private visitParameterBase(node: Oas30ParameterBase): void {
        this.reportIf(this.hasValue(node.schema) && this.hasContent(node), node, "schema");
    }
    public visitParameter(node: Oas30Parameter): void { this.visitParameterBase(node); }
    public visitParameterDefinition(node: Oas30ParameterDefinition): void { this.visitParameterBase(node); }

}

/**
 * Implements the Header Schema/Content Mutual Exclusivity Rule.
 */
export class OasHeaderSchemaContentMutualExclusivityRule extends OasValidationRule {

    private hasContent(contentParent: Oas30Header): boolean {
        return contentParent.getMediaTypes().length > 0;
    }

    public visitHeader(node: Oas30Header): void {
        this.reportIf(this.hasValue(node.schema) && this.hasContent(node), node, "schema");
    }
    public visitHeaderDefinition(node: Oas30HeaderDefinition): void { this.visitHeader(node); }

}

/**
 * Implements the Parameter Example/Examples Mutual Exclusivity Rule.
 */
export class OasParameterExamplesMutualExclusivityRule extends OasValidationRule {

    private visitParameterBase(node: Oas30ParameterBase): void {
        this.reportIf(this.hasValue(node.example) && this.hasValue(node.examples), node, "example");
    }
    public visitParameter(node: Oas30Parameter): void { this.visitParameterBase(node); }
    public visitParameterDefinition(node: Oas30ParameterDefinition): void { this.visitParameterBase(node); }

}
