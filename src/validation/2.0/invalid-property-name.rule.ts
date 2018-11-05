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
import {Oas20Parameter, Oas20ParameterDefinition} from "../../models/2.0/parameter.model";
import {Oas20Response, Oas20ResponseDefinition} from "../../models/2.0/response.model";
import {Oas20SecurityScheme} from "../../models/2.0/security-scheme.model";
import {
    Oas20AdditionalPropertiesSchema,
    Oas20AllOfSchema,
    Oas20ItemsSchema,
    Oas20PropertySchema,
    Oas20Schema,
    Oas20SchemaDefinition
} from "../../models/2.0/schema.model";
import {Oas20PathItem} from "../../models/2.0/path-item.model";
import {Oas20Example} from "../../models/2.0/example.model";
import {Oas20Scopes} from "../../models/2.0/scopes.model";
import {Oas20Document} from "../../models/2.0/document.model";
import {Oas20Operation} from "../../models/2.0/operation.model";
import {OasValidationRuleUtil} from "../validation";
import {Oas20Headers} from "../../models/2.0/headers.model";
import {Oas20Items} from "../../models/2.0/items.model";
import {Oas20SecurityDefinitions} from "../../models/2.0/security-definitions.model";
import {Oas20Definitions} from "../../models/2.0/definitions.model";
import {Oas20ParametersDefinitions} from "../../models/2.0/parameters-definitions.model";
import {Oas20ResponsesDefinitions} from "../../models/2.0/responses-definitions.model";
import {OasExtension} from "../../models/extension.model";
import {OasNode, OasValidationProblem} from "../../models/node.model";
import {Oas20Info} from "../../models/2.0/info.model";
import {Oas20Contact} from "../../models/2.0/contact.model";
import {Oas20License} from "../../models/2.0/license.model";
import {Oas20Paths} from "../../models/2.0/paths.model";
import {Oas20Responses} from "../../models/2.0/responses.model";
import {Oas20Header} from "../../models/2.0/header.model";
import {Oas20XML} from "../../models/2.0/xml.model";
import {Oas20SecurityRequirement} from "../../models/2.0/security-requirement.model";
import {Oas20Tag} from "../../models/2.0/tag.model";
import {Oas20ExternalDocumentation} from "../../models/2.0/external-documentation.model";

/**
 * Implements the Invalid Property Name validation rule.  This rule is responsible
 * for reporting whenever the **name** of a property fails to conform to the required
 * format defined by the specification.
 */
export class Oas20InvalidPropertyNameValidationRule extends Oas20ValidationRule {

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
        this.reportIfInvalid("PATH-005", node.path().indexOf("/") === 0, node, null,
            `Paths must start with a '/' character.`);
    }

    public visitResponse(node: Oas20Response): void {
        // The "default" response will have a statusCode of "null"
        if (this.hasValue(node.statusCode())) {
            this.reportIfInvalid("RES-003", OasValidationRuleUtil.isValidHttpCode(node.statusCode()), node, "statusCode",
                `"${node.statusCode()}" is not a valid HTTP response status code.`);
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
            this.reportIfInvalid("EX-001", produces.indexOf(ct) != -1, node, "produces",
                `Example '${ct}' must match one of the "produces" mime-types.`);
        });
    }

    public visitSchemaDefinition(node: Oas20SchemaDefinition): void {
        this.reportIfInvalid("SDEF-001", this.isValidDefinitionName(node.definitionName()), node, "definitionName",
            `Schema Definition Name is not valid.`);
    }

    public visitParameterDefinition(node: Oas20ParameterDefinition): void {
        this.reportIfInvalid("PDEF-001", this.isValidDefinitionName(node.parameterName()), node, "parameterName",
            `Parameter Definition Name is not valid.`);
    }

    public visitResponseDefinition(node: Oas20ResponseDefinition): void {
        this.reportIfInvalid("RDEF-001", this.isValidDefinitionName(node.name()), node, "name",
            `Response Definition Name is not valid.`);
    }

    public visitScopes(node: Oas20Scopes): void {
        node.scopes().forEach( scope => {
            this.reportIfInvalid("SCPS-001", this.isValidScopeName(scope), node, "scopes",
                `'${scope}' is not a valid scope name.`);
        })
    }

    public visitSecurityScheme(node: Oas20SecurityScheme): void {
        this.reportIfInvalid("SS-013", this.isValidDefinitionName(node.schemeName()), node, "schemeName",
            `Security Scheme Name is not valid.`);
    }

}

export class Oas20UnknownPropertyValidationRule extends Oas20ValidationRule {

    protected validateNode(node: OasNode): void {
        if (node.hasExtraProperties()) {
            node.getExtraPropertyNames().forEach( pname => {
                this.report("UNKNOWN-001", node, pname, `An unexpected property "${ pname }" was found.  Extension properties should begin with "x-".`);
            })
        }
    }

    public visitDocument(node: Oas20Document): void { this.validateNode(node); }
    public visitInfo(node: Oas20Info): void { this.validateNode(node); }
    public visitContact(node: Oas20Contact): void { this.validateNode(node); }
    public visitLicense(node: Oas20License): void { this.validateNode(node); }
    public visitPaths(node: Oas20Paths): void { this.validateNode(node); }
    public visitPathItem(node: Oas20PathItem): void { this.validateNode(node); }
    public visitResponses(node: Oas20Responses): void { this.validateNode(node); }
    public visitSchema(node: Oas20Schema): void { this.validateNode(node); }
    public visitHeader(node: Oas20Header): void { this.validateNode(node); }
    public visitOperation(node: Oas20Operation): void { this.validateNode(node); }
    public visitXML(node: Oas20XML): void { this.validateNode(node); }
    public visitSecurityScheme(node: Oas20SecurityScheme): void { this.validateNode(node); }
    public visitSecurityRequirement(node: Oas20SecurityRequirement): void { this.validateNode(node); }
    public visitTag(node: Oas20Tag): void { this.validateNode(node); }
    public visitExternalDocumentation(node: Oas20ExternalDocumentation): void { this.validateNode(node); }
    public visitExtension(node: OasExtension): void { this.validateNode(node); }
    public visitValidationProblem(node: OasValidationProblem): void { this.validateNode(node); }
    public visitParameter(node: Oas20Parameter): void { this.validateNode(node); }
    public visitParameterDefinition(node: Oas20ParameterDefinition): void { this.validateNode(node); }
    public visitResponse(node: Oas20Response): void { this.validateNode(node); }
    public visitHeaders(node: Oas20Headers): void { this.validateNode(node); }
    public visitResponseDefinition(node: Oas20ResponseDefinition): void { this.validateNode(node); }
    public visitExample(node: Oas20Example): void { this.validateNode(node); }
    public visitItems(node: Oas20Items): void { this.validateNode(node); }
    public visitSecurityDefinitions(node: Oas20SecurityDefinitions): void { this.validateNode(node); }
    public visitScopes(node: Oas20Scopes): void { this.validateNode(node); }
    public visitPropertySchema(node: Oas20PropertySchema): void { this.validateNode(node); }
    public visitAdditionalPropertiesSchema(node: Oas20AdditionalPropertiesSchema): void { this.validateNode(node); }
    public visitItemsSchema(node: Oas20ItemsSchema): void { this.validateNode(node); }
    public visitAllOfSchema(node: Oas20AllOfSchema): void { this.validateNode(node); }
    public visitSchemaDefinition(node: Oas20SchemaDefinition): void { this.validateNode(node); }
    public visitDefinitions(node: Oas20Definitions): void { this.validateNode(node); }
    public visitParametersDefinitions(node: Oas20ParametersDefinitions): void { this.validateNode(node); }
    public visitResponsesDefinitions(node: Oas20ResponsesDefinitions): void { this.validateNode(node); }

}
