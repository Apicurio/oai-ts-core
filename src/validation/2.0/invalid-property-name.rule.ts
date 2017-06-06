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
import {OasNode} from "../../models/node.model";
import {Oas20ParameterDefinition} from "../../models/2.0/parameter.model";
import {Oas20Response, Oas20ResponseDefinition} from "../../models/2.0/response.model";
import {Oas20SecurityScheme} from "../../models/2.0/security-scheme.model";
import {Oas20SchemaDefinition} from "../../models/2.0/schema.model";
import {Oas20PathItem} from "../../models/2.0/path-item.model";
import {Oas20Example} from "../../models/2.0/example.model";
import {Oas20Scopes} from "../../models/2.0/scopes.model";
import {Oas20SecurityRequirement} from "../../models/2.0/security-requirement.model";
import {Oas20Document} from "../../models/2.0/document.model";
import {Oas20Operation} from "../../models/2.0/operation.model";

/**
 * Implements the Invalid Property Name validation rule.  This rule is responsible
 * for reporting whenever the **name** of a property fails to conform to the required
 * format defined by the specification.
 */
export class Oas20InvalidPropertyNameValidationRule extends Oas20ValidationRule {

    /**
     * List of valid HTTP response status codes from:  https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml
     */
    private static HTTP_STATUS_CODES: number[] = [
        100, 101, 102,
        200, 201, 202, 203, 204, 205, 206, 207, 208, 226,
        300, 301, 302, 303, 304, 305, 306, 307, 308,
        400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417,
        421, 422, 423, 424, 426, 427, 428, 429, 431, 451,
        500, 501, 502, 503, 504, 505, 506, 507, 508, 510, 511
    ];

    /**
     * Reports a validation error if the property is not valid.
     * @param code
     * @param isValid
     * @param node
     * @param message
     */
    private reportIfInvalid(code: string, isValid: boolean, node: OasNode, message: string): void {
        if (!isValid) {
            this.report(code, node, message);
        }
    }

    /**
     * Returns true if the given status code is a valid HTTP response code.
     * @param statusCode
     * @return {boolean}
     */
    private isValidHttpCode(statusCode: string): boolean {
        return Oas20InvalidPropertyNameValidationRule.HTTP_STATUS_CODES.indexOf(parseInt(statusCode)) != -1;
    }

    /**
     * Returns true if the definition name is valid.
     * @param name
     * @return {boolean}
     */
    private isValidDefinitionName(name: string): boolean {
        // TODO implement some reasonable rules for this
        return name.indexOf("/") == -1;
    }

    /**
     * Returns true if the scope name is valid.
     * @param scope
     */
    private isValidScopeName(scope: string): boolean {
        // TODO implement some reasonable rules for this
        return true;
    }

    public visitPathItem(node: Oas20PathItem): void {
        this.reportIfInvalid("PATH-005", node.path().indexOf("/") === 0, node, "The path must start with a '/' character.");
    }

    public visitResponse(node: Oas20Response): void {
        // The "default" response will have a statusCode of "null"
        if (this.hasValue(node.statusCode())) {
            this.reportIfInvalid("RES-003", this.isValidHttpCode(node.statusCode()), node,
                "Response status code is not a valid HTTP response status code: " + node.statusCode());
        }
    }

    public visitExample(node: Oas20Example): void {
        let produces: string[] = (<Oas20Document>(node.ownerDocument())).produces;
        let operation: Oas20Operation = <Oas20Operation>(node.parent().parent().parent());
        if (this.hasValue(operation.produces)) {
            produces = operation.produces;
        }
        if (!this.hasValue(produces)) {
            produces = [];
        }

        let ctypes: string[] = node.exampleContentTypes();
        ctypes.forEach( ct => {
            this.reportIfInvalid("EX-001", produces.indexOf(ct) != -1, node,
                "Example for type '" + ct + "' does not match any of the \"produces\" mime-types expected by the operation.");
        });
    }

    public visitSchemaDefinition(node: Oas20SchemaDefinition): void {
        this.reportIfInvalid("SDEF-001", this.isValidDefinitionName(node.definitionName()), node, "Definition name does not conform to requirements (invalid format).");
    }

    public visitParameterDefinition(node: Oas20ParameterDefinition): void {
        this.reportIfInvalid("PDEF-001", this.isValidDefinitionName(node.parameterName()), node, "Definition name does not conform to requirements (invalid format).");
    }

    public visitResponseDefinition(node: Oas20ResponseDefinition): void {
        this.reportIfInvalid("RDEF-001", this.isValidDefinitionName(node.name()), node, "Definition name does not conform to requirements (invalid format).");
    }

    public visitScopes(node: Oas20Scopes): void {
        node.scopes().forEach( scope => {
            this.reportIfInvalid("SCPS-001", this.isValidScopeName(scope), node, "Invalid scope name: " + scope);
        })
    }

    public visitSecurityScheme(node: Oas20SecurityScheme): void {
        this.reportIfInvalid("SS-013", this.isValidDefinitionName(node.schemeName()), node,
            "Security scheme definition name does not conform to requirements (invalid format).");
    }

}
