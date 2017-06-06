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

import {Oas20CompositeVisitor} from "../visitors/visitor.base";
import {OasValidationError, IOasValidationErrorReporter} from "./validation";
import {OasNode} from "../models/node.model";
import {Oas20RequiredPropertyValidationRule} from "./2.0/required-property.rule";
import {Oas20NodePathVisitor} from "../visitors/path.visitor";
import {OasTraverserDirection, OasVisitorUtil} from "../visitors/visitor.utils";
import {OasNodePath} from "../models/node-path";
import {Oas20Document} from "../models/2.0/document.model";
import {Oas20Info} from "../models/2.0/info.model";
import {Oas20Contact} from "../models/2.0/contact.model";
import {Oas20License} from "../models/2.0/license.model";
import {Oas20Paths} from "../models/2.0/paths.model";
import {Oas20PathItem} from "../models/2.0/path-item.model";
import {Oas20Operation} from "../models/2.0/operation.model";
import {Oas20Parameter, Oas20ParameterDefinition} from "../models/2.0/parameter.model";
import {Oas20ExternalDocumentation} from "../models/2.0/external-documentation.model";
import {Oas20SecurityRequirement} from "../models/2.0/security-requirement.model";
import {Oas20Responses} from "../models/2.0/responses.model";
import {Oas20Response, Oas20ResponseDefinition} from "../models/2.0/response.model";
import {
    Oas20Schema, Oas20SchemaDefinition, Oas20PropertySchema,
    Oas20AdditionalPropertiesSchema, Oas20AllOfSchema, Oas20ItemsSchema
} from "../models/2.0/schema.model";
import {Oas20Headers} from "../models/2.0/headers.model";
import {Oas20Header} from "../models/2.0/header.model";
import {Oas20Example} from "../models/2.0/example.model";
import {Oas20Items} from "../models/2.0/items.model";
import {Oas20Tag} from "../models/2.0/tag.model";
import {Oas20SecurityDefinitions} from "../models/2.0/security-definitions.model";
import {Oas20SecurityScheme} from "../models/2.0/security-scheme.model";
import {Oas20Scopes} from "../models/2.0/scopes.model";
import {Oas20XML} from "../models/2.0/xml.model";
import {Oas20Definitions} from "../models/2.0/definitions.model";
import {Oas20ParametersDefinitions} from "../models/2.0/parameters-definitions.model";
import {Oas20ResponsesDefinitions} from "../models/2.0/responses-definitions.model";
import {OasExtension} from "../models/extension.model";
import {Oas20InvalidPropertyFormatValidationRule} from "./2.0/invalid-property-format.rule";
import {Oas20InvalidPropertyNameValidationRule} from "./2.0/invalid-property-name.rule";
import {Oas20InvalidPropertyValueValidationRule} from "./2.0/invalid-property-value.rule";
import {Oas20UniquenessValidationRule} from "./2.0/uniqueness.rule";
import {Oas20MutuallyExclusiveValidationRule} from "./2.0/mutually-exclusive.rule";
import {Oas20InvalidReferenceValidationRule} from "./2.0/invalid-reference.rule";

/**
 * Visitor used to validate a OpenAPI document (or a subsection of the document).  The result
 * of the validation will be a list of validation errors.  In addition, the validator will
 * add the validation errors directly to the offending model nodes as attributes.
 */
export class Oas20ValidationVisitor extends Oas20CompositeVisitor implements IOasValidationErrorReporter {

    private errors: OasValidationError[] = [];

    constructor() {
        super();

        // Add a bunch of validation rules to the array of visitors.
        this.addVisitors([
            new Oas20RequiredPropertyValidationRule(this),
            new Oas20InvalidPropertyFormatValidationRule(this),
            new Oas20InvalidPropertyNameValidationRule(this),
            new Oas20InvalidPropertyValueValidationRule(this),
            new Oas20UniquenessValidationRule(this),
            new Oas20MutuallyExclusiveValidationRule(this),
            new Oas20InvalidReferenceValidationRule(this)
        ]);
    }

    /**
     * Returns the array of validation errors found by the visitor.
     * @return {OasValidationError[]}
     */
    public getValidationErrors(): OasValidationError[] {
        return this.errors;
    }

    /**
     * Called by validation rules when an error is detected.
     * @param code
     * @param node
     * @param message
     */
    public report(code: string, node: OasNode, message: string): void {
        let viz: Oas20NodePathVisitor = new Oas20NodePathVisitor();
        OasVisitorUtil.visitTree(node, viz, OasTraverserDirection.up);
        let path: OasNodePath = viz.path();
        let error: OasValidationError = new OasValidationError(code, path, message);

        // Include the error in the list of errors found by this visitor.
        this.errors.push(error);

        // Also make sure to add the error to the list of validation errors on the node model itself.
        let errors: OasValidationError[] = node.n_attribute("validation-errors");
        if (errors === undefined || errors === null) {
            errors = [];
            node.n_attribute("validation-errors", errors);
        }
        errors.push(error);
    }

    /**
     * Clears any previous validation errors from the node and re-validates.
     * @param node
     */
    private clearAndAcceptAll(node: OasNode): void {
        node.n_attribute("validation-errors", null);
        this._acceptAll(node);
    }

    visitDocument(node: Oas20Document): void { this.clearAndAcceptAll(node); }
    visitInfo(node: Oas20Info): void { this.clearAndAcceptAll(node); }
    visitContact(node: Oas20Contact): void { this.clearAndAcceptAll(node); }
    visitLicense(node: Oas20License): void { this.clearAndAcceptAll(node); }
    visitPaths(node: Oas20Paths): void { this.clearAndAcceptAll(node); }
    visitPathItem(node: Oas20PathItem): void { this.clearAndAcceptAll(node); }
    visitOperation(node: Oas20Operation): void { this.clearAndAcceptAll(node); }
    visitParameter(node: Oas20Parameter): void { this.clearAndAcceptAll(node); }
    visitParameterDefinition(node: Oas20ParameterDefinition): void { this.clearAndAcceptAll(node); }
    visitExternalDocumentation(node: Oas20ExternalDocumentation): void { this.clearAndAcceptAll(node); }
    visitSecurityRequirement(node: Oas20SecurityRequirement): void { this.clearAndAcceptAll(node); }
    visitResponses(node: Oas20Responses): void { this.clearAndAcceptAll(node); }
    visitResponse(node: Oas20Response): void { this.clearAndAcceptAll(node); }
    visitResponseDefinition(node: Oas20ResponseDefinition): void { this.clearAndAcceptAll(node); }
    visitSchema(node: Oas20Schema): void { this.clearAndAcceptAll(node); }
    visitHeaders(node: Oas20Headers): void { this.clearAndAcceptAll(node); }
    visitHeader(node: Oas20Header): void { this.clearAndAcceptAll(node); }
    visitExample(node: Oas20Example): void { this.clearAndAcceptAll(node); }
    visitItems(node: Oas20Items): void { this.clearAndAcceptAll(node); }
    visitTag(node: Oas20Tag): void { this.clearAndAcceptAll(node); }
    visitSecurityDefinitions(node: Oas20SecurityDefinitions): void { this.clearAndAcceptAll(node); }
    visitSecurityScheme(node: Oas20SecurityScheme): void { this.clearAndAcceptAll(node); }
    visitScopes(node: Oas20Scopes): void { this.clearAndAcceptAll(node); }
    visitXML(node: Oas20XML): void { this.clearAndAcceptAll(node); }
    visitSchemaDefinition(node: Oas20SchemaDefinition): void { this.clearAndAcceptAll(node); }
    visitPropertySchema(node: Oas20PropertySchema): void { this.clearAndAcceptAll(node); }
    visitAdditionalPropertiesSchema(node: Oas20AdditionalPropertiesSchema): void { this.clearAndAcceptAll(node); }
    visitAllOfSchema(node: Oas20AllOfSchema): void { this.clearAndAcceptAll(node); }
    visitItemsSchema(node: Oas20ItemsSchema): void { this.clearAndAcceptAll(node); }
    visitDefinitions(node: Oas20Definitions): void { this.clearAndAcceptAll(node); }
    visitParametersDefinitions(node: Oas20ParametersDefinitions): void { this.clearAndAcceptAll(node); }
    visitResponsesDefinitions(node: Oas20ResponsesDefinitions): void { this.clearAndAcceptAll(node); }
    visitExtension(node: OasExtension): void { this.clearAndAcceptAll(node); }

}
