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

import {Oas20CompositeVisitor, Oas30CompositeVisitor} from "../visitors/visitor.base";
import {IOasValidationErrorReporter, OasValidationError} from "./validation";
import {OasNode} from "../models/node.model";
import {Oas20RequiredPropertyValidationRule} from "./2.0/required-property.rule";
import {Oas20NodePathVisitor, Oas30NodePathVisitor} from "../visitors/path.visitor";
import {OasTraverserDirection, OasVisitorUtil} from "../visitors/visitor.utils";
import {OasNodePath} from "../models/node-path";
import {Oas20InvalidPropertyFormatValidationRule} from "./2.0/invalid-property-format.rule";
import {Oas20InvalidPropertyNameValidationRule} from "./2.0/invalid-property-name.rule";
import {Oas20InvalidPropertyValueValidationRule} from "./2.0/invalid-property-value.rule";
import {Oas20UniquenessValidationRule} from "./2.0/uniqueness.rule";
import {Oas20MutuallyExclusiveValidationRule} from "./2.0/mutually-exclusive.rule";
import {Oas20InvalidReferenceValidationRule} from "./2.0/invalid-reference.rule";
import {Oas30InvalidPropertyFormatValidationRule} from "./3.0/invalid-property-format.rule";
import {Oas30IgnoredPropertyNameValidationRule} from "./3.0/ignored-property-name.rule";
import {Oas30InvalidPropertyNameValidationRule} from "./3.0/invalid-property-name.rule";
import {Oas30InvalidPropertyValueValidationRule} from "./3.0/invalid-property-value.rule";

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
    protected _acceptAll(node: OasNode): void {
        node.n_attribute("validation-errors", null);
        super._acceptAll(node);
    }

}


/**
 * Visitor used to validate a OpenAPI document (or a subsection of the document).  The result
 * of the validation will be a list of validation errors.  In addition, the validator will
 * add the validation errors directly to the offending model nodes as attributes.
 */
export class Oas30ValidationVisitor extends Oas30CompositeVisitor implements IOasValidationErrorReporter {

    private errors: OasValidationError[] = [];

    constructor() {
        super();

        // Add a bunch of validation rules to the array of visitors.
        this.addVisitors([
            new Oas30InvalidPropertyFormatValidationRule(this),
            new Oas30IgnoredPropertyNameValidationRule(this),
            new Oas30InvalidPropertyNameValidationRule(this),
            new Oas30InvalidPropertyValueValidationRule(this)
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
        let viz: Oas30NodePathVisitor = new Oas30NodePathVisitor();
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
    protected _acceptAll(node: OasNode): void {
        node.n_attribute("validation-errors", null);
        super._acceptAll(node);
    }

}
