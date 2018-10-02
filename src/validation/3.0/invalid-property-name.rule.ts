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
import {OasValidationRuleUtil} from "../validation";
import {Oas30Link, Oas30LinkDefinition} from "../../models/3.0/link.model";
import {Oas30Callback, Oas30CallbackDefinition} from "../../models/3.0/callback.model";
import {Oas30Example, Oas30ExampleDefinition} from "../../models/3.0/example.model";
import {Oas30RequestBody, Oas30RequestBodyDefinition} from "../../models/3.0/request-body.model";
import {Oas30Header, Oas30HeaderDefinition} from "../../models/3.0/header.model";
import {Oas30SecurityRequirement} from "../../models/3.0/security-requirement.model";
import {Oas30CallbackPathItem, Oas30PathItem} from "../../models/3.0/path-item.model";
import {Oas30Response, Oas30ResponseDefinition} from "../../models/3.0/response.model";
import {Oas30Document} from "../../models/3.0/document.model";
import {Oas30SecurityScheme} from "../../models/3.0/security-scheme.model";
import {
    Oas30AdditionalPropertiesSchema,
    Oas30AllOfSchema,
    Oas30AnyOfSchema, Oas30ItemsSchema, Oas30NotSchema,
    Oas30OneOfSchema, Oas30PropertySchema,
    Oas30Schema,
    Oas30SchemaDefinition
} from "../../models/3.0/schema.model";
import {Oas30Parameter, Oas30ParameterDefinition} from "../../models/3.0/parameter.model";
import {Oas30Encoding} from "../../models/3.0/encoding.model";
import {Oas30MediaType} from "../../models/3.0/media-type.model";
import {Oas20ValidationRule} from "../2.0/common.rule";
import {OasNode, OasValidationProblem} from "../../models/node.model";
import {Oas20Document} from "../../models/2.0/document.model";
import {Oas20Info} from "../../models/2.0/info.model";
import {Oas20Contact} from "../../models/2.0/contact.model";
import {Oas20License} from "../../models/2.0/license.model";
import {Oas20Paths} from "../../models/2.0/paths.model";
import {Oas20PathItem} from "../../models/2.0/path-item.model";
import {Oas20Responses} from "../../models/2.0/responses.model";
import {
    Oas20AdditionalPropertiesSchema, Oas20AllOfSchema,
    Oas20ItemsSchema,
    Oas20PropertySchema,
    Oas20Schema, Oas20SchemaDefinition
} from "../../models/2.0/schema.model";
import {Oas20Header} from "../../models/2.0/header.model";
import {Oas20Operation} from "../../models/2.0/operation.model";
import {Oas20XML} from "../../models/2.0/xml.model";
import {Oas20SecurityScheme} from "../../models/2.0/security-scheme.model";
import {Oas20SecurityRequirement} from "../../models/2.0/security-requirement.model";
import {Oas20Tag} from "../../models/2.0/tag.model";
import {Oas20ExternalDocumentation} from "../../models/2.0/external-documentation.model";
import {OasExtension} from "../../models/extension.model";
import {Oas20Parameter, Oas20ParameterDefinition} from "../../models/2.0/parameter.model";
import {Oas20Response, Oas20ResponseDefinition} from "../../models/2.0/response.model";
import {Oas20Headers} from "../../models/2.0/headers.model";
import {Oas20Example} from "../../models/2.0/example.model";
import {Oas20Items} from "../../models/2.0/items.model";
import {Oas20SecurityDefinitions} from "../../models/2.0/security-definitions.model";
import {Oas20Scopes} from "../../models/2.0/scopes.model";
import {Oas20Definitions} from "../../models/2.0/definitions.model";
import {Oas20ParametersDefinitions} from "../../models/2.0/parameters-definitions.model";
import {Oas20ResponsesDefinitions} from "../../models/2.0/responses-definitions.model";
import {Oas30LinkParameterExpression} from "../../models/3.0/link-parameter-expression.model";
import {Oas30LinkRequestBodyExpression} from "../../models/3.0/link-request-body-expression.model";
import {Oas30LinkServer, Oas30Server} from "../../models/3.0/server.model";
import {Oas30Components} from "../../models/3.0/components.model";
import {Oas30OAuthFlows} from "../../models/3.0/oauth-flows.model";
import {
    Oas30AuthorizationCodeOAuthFlow,
    Oas30ClientCredentialsOAuthFlow,
    Oas30ImplicitOAuthFlow,
    Oas30PasswordOAuthFlow
} from "../../models/3.0/oauth-flow.model";
import {Oas30ServerVariable} from "../../models/3.0/server-variable.model";
import {Oas30Discriminator} from "../../models/3.0/discriminator.model";
import {OasDocument} from "../../models/document.model";
import {OasInfo} from "../../models/common/info.model";
import {OasContact} from "../../models/common/contact.model";
import {OasLicense} from "../../models/common/license.model";
import {OasPaths} from "../../models/common/paths.model";
import {OasPathItem} from "../../models/common/path-item.model";
import {OasResponses} from "../../models/common/responses.model";
import {OasSchema} from "../../models/common/schema.model";
import {OasHeader} from "../../models/common/header.model";
import {OasOperation} from "../../models/common/operation.model";
import {OasXML} from "../../models/common/xml.model";
import {OasSecurityScheme} from "../../models/common/security-scheme.model";
import {OasSecurityRequirement} from "../../models/common/security-requirement.model";
import {OasTag} from "../../models/common/tag.model";
import {OasExternalDocumentation} from "../../models/common/external-documentation.model";
import {Oas30Info} from "../../models/3.0/info.model";
import {Oas30Contact} from "../../models/3.0/contact.model";
import {Oas30License} from "../../models/3.0/license.model";
import {Oas30Paths} from "../../models/3.0/paths.model";
import {Oas30Responses} from "../../models/3.0/responses.model";
import {Oas30Operation} from "../../models/3.0/operation.model";
import {Oas30XML} from "../../models/3.0/xml.model";
import {Oas30Tag} from "../../models/3.0/tag.model";
import {Oas30ExternalDocumentation} from "../../models/3.0/external-documentation.model";

/**
 * Implements the Invalid Property Name validation rule.  This rule is responsible
 * for reporting whenever the **name** of a property fails to conform to the required
 * format defined by the specification.
 */
export class Oas30InvalidPropertyNameValidationRule extends Oas30ValidationRule {

    /**
     * Returns true if the definition name is valid.
     * @param name
     * @return {boolean}
     */
    private static isValidDefinitionName(name: string): boolean {
        let definitionNamePattern: RegExp = /^[a-zA-Z0-9\.\-_]+$/;
        return definitionNamePattern.test(name);
    }

    /**
     * Returns true if the given schema has a property defined with the given name.
     * @param {Oas30Schema} schema
     * @param {string} propertyName
     * @return {boolean}
     */
    private isValidSchemaProperty(schema: Oas30Schema, propertyName: string): boolean {
        if (this.isNullOrUndefined(schema)) {
            return false;
        }
        return !this.isNullOrUndefined(schema.property(propertyName));
    }

    public visitPathItem(node: Oas30PathItem): void {
        this.reportIfInvalid("PATH-3-004", node.path().indexOf("/") === 0, node, null,
            `Paths must start with a '/' character.`);
    }

    public visitResponse(node: Oas30Response): void {
        // The "default" response will have a statusCode of "null"
        if (this.hasValue(node.statusCode())) {
            this.reportIfInvalid("RES-3-001", OasValidationRuleUtil.isValidHttpCode(node.statusCode()), node, null,
                `"${node.statusCode()}" is not a valid HTTP response status code.`);
        }
    }

    public visitSecurityRequirement(node: Oas30SecurityRequirement): void {
        let srn: string[] = node.securityRequirementNames();
        srn.forEach( name => {
            let doc: Oas30Document = node.ownerDocument() as Oas30Document;
            let scheme = doc.components.getSecurityScheme(name);
            this.reportIfInvalid("SREQ-3-001", !(scheme === undefined || scheme === null), node, null,
                `"${name}" does not match a declared Security Scheme.`);
        });
    }

    public visitSchemaDefinition(node: Oas30SchemaDefinition): void {
        this.reportIfInvalid("COMP-3-001", Oas30InvalidPropertyNameValidationRule.isValidDefinitionName(node.name()), node, "name",
            `Schema Definition Name is not valid.`);
    }

    public visitParameterDefinition(node: Oas30ParameterDefinition): void {
        this.reportIfInvalid("COMP-3-002", Oas30InvalidPropertyNameValidationRule.isValidDefinitionName(node.parameterName()), node, "parameterName",
            `Parameter Definition Name is not valid.`);
    }

    public visitResponseDefinition(node: Oas30ResponseDefinition): void {
        this.reportIfInvalid("COMP-3-003", Oas30InvalidPropertyNameValidationRule.isValidDefinitionName(node.name()), node, "name",
            `Response Definition Name is not valid.`);
    }

    public visitSecurityScheme(node: Oas30SecurityScheme): void {
        this.reportIfInvalid("COMP-3-004", Oas30InvalidPropertyNameValidationRule.isValidDefinitionName(node.schemeName()), node, "schemeName",
                `The Security Scheme Name is not valid.`);
    }

    public visitExampleDefinition(node: Oas30ExampleDefinition): void {
        this.reportIfInvalid("COMP-3-005", Oas30InvalidPropertyNameValidationRule.isValidDefinitionName(node.name()), node, "name",
            `The Example Definition Name is not valid.`);
    }

    public visitRequestBodyDefinition(node: Oas30RequestBodyDefinition): void {
        this.reportIfInvalid("COMP-3-006", Oas30InvalidPropertyNameValidationRule.isValidDefinitionName(node.name()), node, "name",
            `The Request Body Definition Name is not valid.`);
    }

    public visitHeaderDefinition(node: Oas30HeaderDefinition): void {
        this.reportIfInvalid("COMP-3-007", Oas30InvalidPropertyNameValidationRule.isValidDefinitionName(node.name()), node, "name",
            `The Header Definition Name is not valid.`);
    }

    public visitLinkDefinition(node: Oas30LinkDefinition): void {
        this.reportIfInvalid("COMP-3-008", Oas30InvalidPropertyNameValidationRule.isValidDefinitionName(node.name()), node, "name",
            `The Link Definition Name is not valid.`);
    }

    public visitCallbackDefinition(node: Oas30CallbackDefinition): void {
        this.reportIfInvalid("COMP-3-009", Oas30InvalidPropertyNameValidationRule.isValidDefinitionName(node.name()), node, "name",
            `The Callback Definition Name is not valid.`);
    }

    public visitEncoding(node: Oas30Encoding): void {
        let name: string = node.name();
        let schema: Oas30Schema = (node.parent() as Oas30MediaType).schema;

        this.reportIfInvalid("ENC-3-006", this.isValidSchemaProperty(schema, name), node, name,
            `Encoding Property "${name}" not found in the associated schema.`);
    }

}


export class Oas30UnknownPropertyValidationRule extends Oas30ValidationRule {

    protected validateNode(node: OasNode): void {
        if (node.hasExtraProperties()) {
            node.getExtraPropertyNames().forEach( pname => {
                this.report("UNKNOWN-3-001", node, pname, `An unexpected property "${ pname }" was found.  Extension properties should begin with "x-".`);
            })
        }
    }

    public visitDocument(node: Oas30Document): void { this.validateNode(node); }
    public visitInfo(node: Oas30Info): void { this.validateNode(node); }
    public visitContact(node: Oas30Contact): void { this.validateNode(node); }
    public visitLicense(node: Oas30License): void { this.validateNode(node); }
    public visitPaths(node: Oas30Paths): void { this.validateNode(node); }
    public visitPathItem(node: Oas30PathItem): void { this.validateNode(node); }
    public visitResponses(node: Oas30Responses): void { this.validateNode(node); }
    public visitSchema(node: Oas30Schema): void { this.validateNode(node); }
    public visitHeader(node: Oas30Header): void { this.validateNode(node); }
    public visitOperation(node: Oas30Operation): void { this.validateNode(node); }
    public visitXML(node: Oas30XML): void { this.validateNode(node); }
    public visitSecurityScheme(node: Oas30SecurityScheme): void { this.validateNode(node); }
    public visitSecurityRequirement(node: Oas30SecurityRequirement): void { this.validateNode(node); }
    public visitTag(node: Oas30Tag): void { this.validateNode(node); }
    public visitExternalDocumentation(node: Oas30ExternalDocumentation): void { this.validateNode(node); }
    public visitExtension(node: OasExtension): void { this.validateNode(node); }
    public visitValidationProblem(node: OasValidationProblem): void { this.validateNode(node); }
    public visitParameter(node: Oas30Parameter): void { this.validateNode(node); }
    public visitParameterDefinition(node: Oas30ParameterDefinition): void { this.validateNode(node); }
    public visitResponse(node: Oas30Response): void { this.validateNode(node); }
    public visitLink(node: Oas30Link): void { this.validateNode(node); }
    public visitLinkParameterExpression(node: Oas30LinkParameterExpression): void { this.validateNode(node); }
    public visitLinkRequestBodyExpression(node: Oas30LinkRequestBodyExpression): void { this.validateNode(node); }
    public visitLinkServer(node: Oas30LinkServer): void { this.validateNode(node); }
    public visitResponseDefinition(node: Oas30ResponseDefinition): void { this.validateNode(node); }
    public visitRequestBody(node: Oas30RequestBody): void { this.validateNode(node); }
    public visitMediaType(node: Oas30MediaType): void { this.validateNode(node); }
    public visitExample(node: Oas30Example): void { this.validateNode(node); }
    public visitEncoding(node: Oas30Encoding): void { this.validateNode(node); }
    public visitCallback(node: Oas30Callback): void { this.validateNode(node); }
    public visitCallbackPathItem(node: Oas30CallbackPathItem): void { this.validateNode(node); }
    public visitAllOfSchema(node: Oas30AllOfSchema): void { this.validateNode(node); }
    public visitAnyOfSchema(node: Oas30AnyOfSchema): void { this.validateNode(node); }
    public visitOneOfSchema(node: Oas30OneOfSchema): void { this.validateNode(node); }
    public visitNotSchema(node: Oas30NotSchema): void { this.validateNode(node); }
    public visitPropertySchema(node: Oas30PropertySchema): void { this.validateNode(node); }
    public visitItemsSchema(node: Oas30ItemsSchema): void { this.validateNode(node); }
    public visitAdditionalPropertiesSchema(node: Oas30AdditionalPropertiesSchema): void { this.validateNode(node); }
    public visitComponents(node: Oas30Components): void { this.validateNode(node); }
    public visitExampleDefinition(node: Oas30ExampleDefinition): void { this.validateNode(node); }
    public visitRequestBodyDefinition(node: Oas30RequestBodyDefinition): void { this.validateNode(node); }
    public visitHeaderDefinition(node: Oas30HeaderDefinition): void { this.validateNode(node); }
    public visitOAuthFlows(node: Oas30OAuthFlows): void { this.validateNode(node); }
    public visitImplicitOAuthFlow(node: Oas30ImplicitOAuthFlow): void { this.validateNode(node); }
    public visitPasswordOAuthFlow(node: Oas30PasswordOAuthFlow): void { this.validateNode(node); }
    public visitClientCredentialsOAuthFlow(node: Oas30ClientCredentialsOAuthFlow): void { this.validateNode(node); }
    public visitAuthorizationCodeOAuthFlow(node: Oas30AuthorizationCodeOAuthFlow): void { this.validateNode(node); }
    public visitLinkDefinition(node: Oas30LinkDefinition): void { this.validateNode(node); }
    public visitCallbackDefinition(node: Oas30CallbackDefinition): void { this.validateNode(node); }
    public visitSchemaDefinition(node: Oas30SchemaDefinition): void { this.validateNode(node); }
    public visitServer(node: Oas30Server): void { this.validateNode(node); }
    public visitServerVariable(node: Oas30ServerVariable): void { this.validateNode(node); }
    public visitDiscriminator(node: Oas30Discriminator): void { this.validateNode(node); }

}
