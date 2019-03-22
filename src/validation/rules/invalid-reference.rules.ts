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

import {Oas20Parameter, Oas20ParameterDefinition} from "../../models/2.0/parameter.model";
import {Oas20Response, Oas20ResponseDefinition} from "../../models/2.0/response.model";
import {
    Oas20AdditionalPropertiesSchema,
    Oas20AllOfSchema,
    Oas20ItemsSchema,
    Oas20PropertySchema,
    Oas20Schema,
    Oas20SchemaDefinition
} from "../../models/2.0/schema.model";
import {Oas20PathItem} from "../../models/2.0/path-item.model";
import {Oas20SecurityRequirement} from "../../models/2.0/security-requirement.model";
import {Oas20Document} from "../../models/2.0/document.model";
import {ReferenceUtil} from "../../util";
import {OasValidationRule} from "./common.rule";
import {
    Oas30AdditionalPropertiesSchema,
    Oas30AllOfSchema,
    Oas30AnyOfSchema,
    Oas30ItemsSchema,
    Oas30NotSchema,
    Oas30OneOfSchema,
    Oas30PropertySchema,
    Oas30Schema,
    Oas30SchemaDefinition
} from "../../models/3.0/schema.model";
import {Oas30Parameter, Oas30ParameterDefinition} from "../../models/3.0/parameter.model";
import {Oas30PathItem} from "../../models/3.0/path-item.model";
import {Oas30Response, Oas30ResponseBase, Oas30ResponseDefinition} from "../../models/3.0/response.model";
import {Oas30SecurityRequirement} from "../../models/3.0/security-requirement.model";
import {Oas30Document} from "../../models/3.0/document.model";
import {OasDocument} from "../../models/document.model";
import {Oas30SecurityScheme} from "../../models/3.0/security-scheme.model";
import {Oas20SecurityScheme} from "../../models/2.0/security-scheme.model";
import {Oas30Callback, Oas30CallbackDefinition} from "../../models/3.0/callback.model";
import {Oas30Example, Oas30ExampleDefinition} from "../../models/3.0/example.model";
import {Oas30Header, Oas30HeaderDefinition} from "../../models/3.0/header.model";
import {Oas30Link, Oas30LinkDefinition} from "../../models/3.0/link.model";
import {Oas30RequestBody, Oas30RequestBodyDefinition} from "../../models/3.0/request-body.model";


/**
 * Implements the Invalid Parameter Reference rule.
 */
export class OasInvalidParameterReferenceRule extends OasValidationRule {

    public visitParameter(node: Oas20Parameter | Oas30Parameter): void {
        if (this.hasValue(node.$ref)) {
            this.reportIfInvalid(ReferenceUtil.canResolveRef(node.$ref, node), node, "$ref");
        }
    }
    public visitParameterDefinition(node: Oas20ParameterDefinition | Oas30ParameterDefinition): void {
        if (node.ownerDocument().is3xDocument()) {
            this.visitParameter(<Oas30ParameterDefinition>node);
        }
    }

}


/**
 * Implements the Invalid Path Item Reference rule.
 */
export class OasInvalidPathItemReferenceRule extends OasValidationRule {

    public visitPathItem(node: Oas20PathItem | Oas30PathItem): void {
        if (this.hasValue(node.$ref)) {
            this.reportIfInvalid(ReferenceUtil.canResolveRef(node.$ref, node), node, "$ref");
        }
    }

}


/**
 * Implements the Invalid Response Reference rule.
 */
export class OasInvalidResponseReferenceRule extends OasValidationRule {

    private visitResponseBase(node: Oas20Response | Oas30ResponseBase): void {
        if (this.hasValue(node.$ref)) {
            this.reportIfInvalid(ReferenceUtil.canResolveRef(node.$ref, node), node, "$ref");
        }
    }
    public visitResponse(node: Oas20Response | Oas30Response): void { this.visitResponseBase(node); }
    public visitResponseDefinition(node: Oas20ResponseDefinition | Oas30ResponseDefinition): void {
        if (node.ownerDocument().is3xDocument()) {
            this.visitResponseBase(<Oas30ResponseDefinition>node);
        }
    }

}


/**
 * Implements the Invalid Schema Reference rule.
 */
export class OasInvalidSchemaReferenceRule extends OasValidationRule {

    public visitSchema(node: Oas20Schema | Oas30Schema): void {
        if (this.hasValue(node.$ref)) {
            this.reportIfInvalid(ReferenceUtil.canResolveRef(node.$ref, node), node, "$ref");
        }
    }

    public visitPropertySchema(node: Oas20PropertySchema | Oas30PropertySchema): void { this.visitSchema(node); }
    public visitAdditionalPropertiesSchema(node: Oas20AdditionalPropertiesSchema | Oas30AdditionalPropertiesSchema): void { this.visitSchema(node); }
    public visitItemsSchema(node: Oas20ItemsSchema | Oas30ItemsSchema): void { this.visitSchema(node); }
    public visitAllOfSchema(node: Oas20AllOfSchema | Oas30AllOfSchema): void { this.visitSchema(node); }
    public visitAnyOfSchema(node: Oas30AnyOfSchema): void { this.visitSchema(node); }
    public visitOneOfSchema(node: Oas30OneOfSchema): void { this.visitSchema(node); }
    public visitNotSchema(node: Oas30NotSchema): void { this.visitSchema(node); }
    public visitSchemaDefinition(node: Oas20SchemaDefinition | Oas30SchemaDefinition): void { this.visitSchema(node); }

}


/**
 * Implements the Invalid Security Scheme Reference rule.
 */
export class OasInvalidSecuritySchemeReferenceRule extends OasValidationRule {

    public visitSecurityScheme(node: Oas20SecurityScheme | Oas30SecurityScheme): void {
        if (node.ownerDocument().is3xDocument()) {
            let node30: Oas30SecurityScheme = <Oas30SecurityScheme>node;
            if (this.hasValue(node30.$ref)) {
                this.reportIfInvalid(ReferenceUtil.canResolveRef(node30.$ref, node), node, "$ref");
            }
        }
    }

}

/**
 * Implements the Invalid Security Requirement Name rule.
 */
export class OasInvalidSecurityRequirementNameRule extends OasValidationRule {

    /**
     * Returns true if the security requirement name is valid.  It does this by looking up a declared
     * security scheme definition in the document.  If no security scheme definition exists with the
     * given name, then it is invalid.
     * @param securityReqName
     * @param doc
     */
    private isValidSecurityRequirementName(securityReqName: string, doc: OasDocument): boolean {
        if (doc.is2xDocument()) {
            let doc20: Oas20Document = <Oas20Document>doc;
            return this.hasValue(doc20.securityDefinitions) && this.isDefined(doc20.securityDefinitions.securityScheme(securityReqName));
        } else {
            let doc30: Oas30Document = <Oas30Document>doc;
            return this.hasValue(doc30.components) && this.isDefined(doc30.components.getSecurityScheme(securityReqName));
        }
    }

    public visitSecurityRequirement(node: Oas20SecurityRequirement | Oas30SecurityRequirement): void {
        node.securityRequirementNames().forEach( name => {
            this.reportIfInvalid(this.isValidSecurityRequirementName(name, node.ownerDocument()), node, null, {
                name: name
            });
        });
    }

}

/**
 * Implements the Invalid Callback Reference rule.
 */
export class OasInvalidCallbackReferenceRule extends OasValidationRule {

    public visitCallback(node: Oas30Callback): void {
        if (this.hasValue(node.$ref)) {
            this.reportIfInvalid(ReferenceUtil.canResolveRef(node.$ref, node), node, "$ref");
        }
    }
    public visitCallbackDefinition(node: Oas30CallbackDefinition): void { this.visitCallback(node); }

}

/**
 * Implements the Invalid Example Reference rule.
 */
export class OasInvalidExampleReferenceRule extends OasValidationRule {

    public visitExample(node: Oas30Example): void {
        if (this.hasValue(node.$ref)) {
            this.reportIfInvalid(ReferenceUtil.canResolveRef(node.$ref, node), node, "$ref");
        }
    }
    public visitExampleDefinition(node: Oas30ExampleDefinition): void { this.visitExample(node); }

}

/**
 * Implements the Invalid Header Reference rule.
 */
export class OasInvalidHeaderReferenceRule extends OasValidationRule {

    public visitHeader(node: Oas30Header): void {
        if (this.hasValue(node.$ref)) {
            this.reportIfInvalid(ReferenceUtil.canResolveRef(node.$ref, node), node, "$ref");
        }
    }
    public visitHeaderDefinition(node: Oas30HeaderDefinition): void { this.visitHeader(node); }

}

/**
 * Implements the Invalid Link Reference rule.
 */
export class OasInvalidLinkReferenceRule extends OasValidationRule {

    public visitLink(node: Oas30Link): void {
        if (this.hasValue(node.$ref)) {
            this.reportIfInvalid(ReferenceUtil.canResolveRef(node.$ref, node), node, "$ref");
        }
    }
    public visitLinkDefinition(node: Oas30LinkDefinition): void { this.visitLink(node); }

}

/**
 * Implements the Invalid Link Operation Reference rule.
 */
export class OasInvalidLinkOperationReferenceRule extends OasValidationRule {

    public visitLink(node: Oas30Link): void {
        if (this.hasValue(node.operationRef)) {
            this.reportIfInvalid(ReferenceUtil.canResolveRef(node.operationRef, node), node, "operationRef");
        }
    }
    public visitLinkDefinition(node: Oas30LinkDefinition): void { this.visitLink(node); }

}

/**
 * Implements the Invalid Request Body Reference rule.
 */
export class OasInvalidRequestBodyReferenceRule extends OasValidationRule {

    public visitRequestBody(node: Oas30RequestBody): void {
        if (this.hasValue(node.$ref)) {
            this.reportIfInvalid(ReferenceUtil.canResolveRef(node.$ref, node), node, "$ref");
        }
    }
    public visitRequestBodyDefinition(node: Oas30RequestBodyDefinition): void { this.visitRequestBody(node); }

}
