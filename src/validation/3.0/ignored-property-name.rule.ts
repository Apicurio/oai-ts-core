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
import {Oas30Header, Oas30HeaderDefinition} from "../../models/3.0/header.model";

/**
 * Implements the Ignored Property Name validation rule.  This rule is responsible
 * for reporting whenever a property found in the data model is valid but will
 * be ignored.
 */
export class Oas30IgnoredPropertyNameValidationRule extends Oas30ValidationRule {
    
    public visitHeader(node: Oas30Header): void {
        if (node.headerName().toLowerCase() === "content-type") {
            this.report("HEAD-3-001", node, `The "Content-Type" header will be ignored.`);
        }
    }
    public visitHeaderDefinition(node: Oas30HeaderDefinition): void {
        this.visitHeader(node);
    }

}
