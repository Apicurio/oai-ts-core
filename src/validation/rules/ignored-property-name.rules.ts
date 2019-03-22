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

import {Oas30Header, Oas30HeaderDefinition} from "../../models/3.0/header.model";
import {OasValidationRule} from "./common.rule";
import {Oas30Parameter} from "../../models/3.0/parameter.model";
import {OasValidationRuleUtil} from "../validation";

/**
 * Implements the Ignored Content-Type Header validation rule.
 */
export class OasIgnoredContentTypeHeaderRule extends OasValidationRule {
    
    public visitHeader(node: Oas30Header): void {
        this.reportIf(node.headerName().toLowerCase() === "content-type", node, null);
    }
    public visitHeaderDefinition(node: Oas30HeaderDefinition): void {
        this.visitHeader(node);
    }

}


/**
 * Implements the Ignored Content-Type/Accept/Authorization Header validation rule.
 */
export class OasIgnoredHeaderParameterRule extends OasValidationRule {

    private static ignoredHeaderNames: string[] = [
        "content-type", "accept", "authorization"
    ];

    public visitParameter(node: Oas30Parameter): void {
        if (this.hasValue(node.name)) {
            let ignored: boolean = OasValidationRuleUtil.isValidEnumItem(node.name.toLowerCase(), OasIgnoredHeaderParameterRule.ignoredHeaderNames);
            this.reportIf(ignored, node, "name", { name: node.name });
        }
    }

}
