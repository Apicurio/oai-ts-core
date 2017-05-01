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
import {Oas20Parameter} from "../../models/2.0/parameter.model";
import {Oas20Response} from "../../models/2.0/response.model";
import {
    Oas20AdditionalPropertiesSchema, Oas20AllOfSchema, Oas20ItemsSchema, Oas20PropertySchema,
    Oas20Schema
} from "../../models/2.0/schema.model";
import {Oas20PathItem} from "../../models/2.0/path-item.model";
import {Oas20SecurityRequirement} from "../../models/2.0/security-requirement.model";
import {Oas20Document} from "../../models/2.0/document.model";
import {Oas20Definitions} from "../../models/2.0/definitions.model";
import {Oas20ParametersDefinitions} from "../../models/2.0/parameters-definitions.model";
import {IOasIndexedNode} from "../../models/inode.model";

/**
 * Implements the Invalid Reference validation rule.  This rule is responsible
 * for reporting whenever a property references another node in the document
 * but that reference is missing or invalid.
 */
export class Oas20InvalidReferenceValidationRule extends Oas20ValidationRule {

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
     * Returns true if the security requirement name is valid.  It does this by looking up a declared
     * security scheme definition in the document.  If no security scheme definition exists with the
     * given name, then it is invalid.
     * @param securityReqName
     * @param doc
     */
    private isValidSecurityRequirementName(securityReqName: string, doc: Oas20Document): boolean {
        return this.hasValue(doc.securityDefinitions) && this.isDefined(doc.securityDefinitions.securityScheme(securityReqName));
    }

    /**
     * Resolves a reference from a relative position in the data model.
     * @param $ref
     * @param from
     */
    private resolveRef($ref: string, from: OasNode): OasNode {
        // TODO implement a proper reference resolver including external file resolution: https://github.com/EricWittmann/oai-ts-core/issues/8
        let split: string[] = $ref.split("/");
        let cnode: OasNode = null;
        split.forEach( seg => {
            if (seg === "#") {
                cnode = from.ownerDocument();
            } else if (this.hasValue(cnode)) {
                if (cnode["__instanceof_IOasIndexedNode"]) {
                    cnode = cnode["getItem"](seg);
                } else {
                    cnode = cnode[seg];
                }
            }
        });
        return cnode;
    }

    /**
     * Returns true only if the given reference can be resolved relative to the given document.  Examples
     * of $ref values include:
     *
     * #/definitions/ExampleDefinition
     * #/parameters/fooId
     * #/responses/NotFoundResponse
     *
     * @param $ref
     * @param oasDocument
     */
    private canResolveRef($ref: string, from: OasNode): boolean {
        return this.hasValue(this.resolveRef($ref, from));
    }

    public visitParameter(node: Oas20Parameter): void {
        if (this.hasValue(node.$ref)) {
            this.reportIfInvalid("PAR-018", this.canResolveRef(node.$ref, node), node,
                "The \"$ref\" property must reference a valid Parameter Definition: " + node.$ref);
        }
    }

    public visitPathItem(node: Oas20PathItem): void {
        if (this.hasValue(node.$ref)) {
            this.reportIfInvalid("PATH-001", this.canResolveRef(node.$ref, node), node,
                "Reference to external path is either invalid or not found: " + node.$ref);
        }
    }

    public visitResponse(node: Oas20Response): void {
        if (this.hasValue(node.$ref)) {
            this.reportIfInvalid("RES-002", this.canResolveRef(node.$ref, node), node,
                "The \"$ref\" property must reference a valid Response Definition: " + node.$ref);
        }
    }

    public visitSchema(node: Oas20Schema): void {
        if (this.hasValue(node.$ref)) {
            this.reportIfInvalid("SCH-001", this.canResolveRef(node.$ref, node), node,
                "The \"$ref\" property must reference a valid Definition: " + node.$ref);
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

    public visitSecurityRequirement(node: Oas20SecurityRequirement): void {
        node.securityRequirementNames().forEach( name => {
            this.reportIfInvalid("SREQ-001", this.isValidSecurityRequirementName(name, <Oas20Document>node.ownerDocument()), node,
                "Security Requirement name '" + name + "' does not match an item declared in the Security Definitions.");
        });
    }

}
