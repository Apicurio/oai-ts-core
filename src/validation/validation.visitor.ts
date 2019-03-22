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

import {OasAllNodeVisitor, OasCombinedCompositeVisitor} from "../visitors/visitor.base";
import {
    DefaultValidationSeverityRegistry,
    IOasValidationProblemReporter,
    IOasValidationSeverityRegistry,
    OasValidationProblemSeverity
} from "./validation";
import {OasNode, OasValidationProblem} from "../models/node.model";
import {OasNodePathUtil} from "../visitors/path.visitor";
import {OasNodePath} from "../models/node-path";
import {ValidationRuleMetaData, ValidationRuleset} from "./ruleset";
import {OasDocument} from "../models/document.model";
import {OasValidationRule} from "./rules/common.rule";


/**
 * Visitor used to clear validation problems.  This is typically done just before
 * validation is run so that the data model is clean.  Validation would then add new
 * problem nodes to the model.
 */
export class OasResetValidationProblemsVisitor extends OasAllNodeVisitor {

    protected doVisitNode(node: OasNode): void {
        node.clearValidationProblems();
    }

}


/**
 * Visitor used to validate a OpenAPI document (or a subsection of the document).  The result
 * of the validation will be a list of validation errors.  In addition, the validator will
 * add the validation errors directly to the offending model nodes as attributes.
 */
export class OasValidationVisitor extends OasCombinedCompositeVisitor implements IOasValidationProblemReporter {

    private errors: OasValidationProblem[] = [];
    private severityRegistry: IOasValidationSeverityRegistry = new DefaultValidationSeverityRegistry();

    /**
     * C'tor.
     * @param document
     */
    constructor(document: OasDocument) {
        super();
        let ruleset: ValidationRuleset = ValidationRuleset.instance;
        let rulesFor: OasValidationRule[] = ruleset.getRulesFor(document);
        rulesFor.forEach( rule => { rule.setReporter(this); });
        this.addVisitors(rulesFor);
    }

    /**
     * Sets the severity registry.
     * @param {IOasValidationSeverityRegistry} severityRegistry
     */
    public setSeverityRegistry(severityRegistry: IOasValidationSeverityRegistry): void {
        this.severityRegistry = severityRegistry;
    }

    /**
     * Returns the array of validation errors found by the visitor.
     * @return {OasValidationProblem[]}
     */
    public getValidationErrors(): OasValidationProblem[] {
        return this.errors;
    }

    /**
     * Called by validation rules when an error is detected.
     * @param ruleInfo
     * @param node
     * @param property
     * @param message
     */
    public report(ruleInfo: ValidationRuleMetaData, node: OasNode, property: string, message: string): void {
        let severity: OasValidationProblemSeverity = this.severityRegistry.lookupSeverity(ruleInfo);
        if (severity === OasValidationProblemSeverity.ignore) {
            return;
        }

        let path: OasNodePath = OasNodePathUtil.createNodePath(node);
        let error: OasValidationProblem = node.addValidationProblem(ruleInfo.code, path, property, message, severity);

        // Include the error in the list of errors found by this visitor.
        this.errors.push(error);
    }

}
