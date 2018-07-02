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

import {OasValidationRuleUtil} from "../validation";
import {Oas30ValidationRule} from "./common.rule";
import {Oas30Example, Oas30ExampleDefinition} from "../../models/3.0/example.model";
import {Oas30Contact} from "../../models/3.0/contact.model";
import {Oas30XML} from "../../models/3.0/xml.model";
import {Oas30Info} from "../../models/3.0/info.model";
import {Oas30License} from "../../models/3.0/license.model";
import {Oas30Operation} from "../../models/3.0/operation.model";
import {Oas30ExternalDocumentation} from "../../models/3.0/external-documentation.model";
import {Oas30Parameter, Oas30ParameterDefinition} from "../../models/3.0/parameter.model";
import {Oas30Header, Oas30HeaderDefinition} from "../../models/3.0/header.model";
import {Oas30Tag} from "../../models/3.0/tag.model";
import {Oas30SecurityScheme} from "../../models/3.0/security-scheme.model";
import {Oas30Response, Oas30ResponseBase, Oas30ResponseDefinition} from "../../models/3.0/response.model";
import {
    Oas30AuthorizationCodeOAuthFlow,
    Oas30ClientCredentialsOAuthFlow,
    Oas30ImplicitOAuthFlow,
    Oas30OAuthFlow,
    Oas30PasswordOAuthFlow
} from "../../models/3.0/oauth-flow.model";
import {Oas30PathItem} from "../../models/3.0/path-item.model";
import {Oas30RequestBody, Oas30RequestBodyDefinition} from "../../models/3.0/request-body.model";
import {Oas30Server} from "../../models/3.0/server.model";
import {Oas30ServerVariable} from "../../models/3.0/server-variable.model";
import {Oas30Link, Oas30LinkDefinition} from "../../models/3.0/link.model";

/**
 * Implements the Invalid Property Format validation rule.  This rule is responsible
 * for reporting whenever the value of a property fails to conform to the required
 * *format* for that property.
 */
export class Oas30InvalidPropertyFormatValidationRule extends Oas30ValidationRule {

    public visitInfo(node: Oas30Info): void {
        if (this.hasValue(node.description)) {
            this.reportIfInvalid("INF-3-003", OasValidationRuleUtil.isValidCommonMark(node.description), node, "description",
                `API description is an incorrect format.`);
        }
        if (this.hasValue(node.termsOfService)) {
            this.reportIfInvalid("CTC-3-004", OasValidationRuleUtil.isValidUrl(node.termsOfService), node, "termsOfService",
                `Terms of Service URL is an incorrect format.`);
        }
    }

    protected visitResponseBase(node: Oas30ResponseBase): void {
        if (this.hasValue(node.description)) {
            this.reportIfInvalid("RES-3-002", OasValidationRuleUtil.isValidCommonMark(node.description), node, "description",
                `Response description is an incorrect format.`);
        }
    }
    public visitResponse(node: Oas30Response): void {
        this.visitResponseBase(node);
    }
    public visitResponseDefinition(node: Oas30ResponseDefinition): void {
        this.visitResponseBase(node);
    }

    public visitContact(node: Oas30Contact): void {
        if (this.hasValue(node.url)) {
            this.reportIfInvalid("CTC-3-001", OasValidationRuleUtil.isValidUrl(node.url), node, "url",
                `Contact URL is an incorrect format.`);
        }
        if (this.hasValue(node.email)) {
            this.reportIfInvalid("CTC-3-002", OasValidationRuleUtil.isValidEmailAddress(node.email), node, "email",
                `Contact email is an incorrect format.`);
        }
    }

    public visitExample(node: Oas30Example): void {
        if (this.hasValue(node.description)) {
            this.reportIfInvalid("EX-3-001", OasValidationRuleUtil.isValidCommonMark(node.description), node, "description",
                `Example Description is an incorrect format.`);
        }
    }
    public visitExampleDefinition(node: Oas30ExampleDefinition): void {
        this.visitExample(node);
    }

    public visitLink(node: Oas30Link): void {
        if (this.hasValue(node.description)) {
            this.reportIfInvalid("LINK-3-004", OasValidationRuleUtil.isValidCommonMark(node.description), node, "description",
                `Link Description is an incorrect format.`);
        }
    }
    public visitLinkDefinition(node: Oas30LinkDefinition): void {
        this.visitLink(node);
    }

    protected visitFlow(node: Oas30OAuthFlow): void {
        if (this.hasValue(node.authorizationUrl)) {
            this.reportIfInvalid("FLOW-3-003", OasValidationRuleUtil.isValidUrl(node.authorizationUrl), node, "authorizationUrl",
                `OAuth Authorization URL is an incorrect format.`);
        }
        if (this.hasValue(node.tokenUrl)) {
            this.reportIfInvalid("FLOW-3-004", OasValidationRuleUtil.isValidUrl(node.tokenUrl), node, "tokenUrl",
                `OAuth Token URL is an incorrect format.`);
        }
        if (this.hasValue(node.refreshUrl)) {
            this.reportIfInvalid("FLOW-3-005", OasValidationRuleUtil.isValidUrl(node.refreshUrl), node, "refreshUrl",
                `OAuth Refresh URL is an incorrect format.`);
        }
    }
    public visitImplicitOAuthFlow(node: Oas30ImplicitOAuthFlow): void {
        this.visitFlow(node);
    }
    public visitPasswordOAuthFlow(node: Oas30PasswordOAuthFlow): void {
        this.visitFlow(node);
    }
    public visitClientCredentialsOAuthFlow(node: Oas30ClientCredentialsOAuthFlow): void {
        this.visitFlow(node);
    }
    public visitAuthorizationCodeOAuthFlow(node: Oas30AuthorizationCodeOAuthFlow): void {
        this.visitFlow(node);
    }

    public visitPathItem(node: Oas30PathItem): void {
        if (this.hasValue(node.description)) {
            this.reportIfInvalid("PATH-3-003", OasValidationRuleUtil.isValidCommonMark(node.description), node, "description",
                `Path Item Description is an incorrect format.`);
        }
    }

    public visitRequestBody(node: Oas30RequestBody): void {
        if (this.hasValue(node.description)) {
            this.reportIfInvalid("RB-3-001", OasValidationRuleUtil.isValidCommonMark(node.description), node, "description",
                `Request Body Description is an incorrect format.`);
        }
    }
    public visitRequestBodyDefinition(node: Oas30RequestBodyDefinition): void {
        this.visitRequestBody(node);
    }

    public visitLicense(node: Oas30License): void {
        if (this.hasValue(node.url)) {
            this.reportIfInvalid("LIC-3-002", OasValidationRuleUtil.isValidUrl(node.url), node, "url",
                `License URL is an incorrect format.`);
        }
    }

    public visitOperation(node: Oas30Operation): void {
        if (this.hasValue(node.description)) {
            this.reportIfInvalid("OP-3-001", OasValidationRuleUtil.isValidCommonMark(node.description), node, "description",
                `Operation Description is an incorrect format.`);
        }
    }

    public visitExternalDocumentation(node: Oas30ExternalDocumentation): void {
        if (this.hasValue(node.description)) {
            this.reportIfInvalid("ED-3-001", OasValidationRuleUtil.isValidCommonMark(node.description), node, "description",
                `External Documentation Description is an incorrect format.`);
        }
        if (this.hasValue(node.url)) {
            this.reportIfInvalid("ED-3-003", OasValidationRuleUtil.isValidUrl(node.url), node, "url",
                `External Documentation URL is an incorrect format.`);
        }
    }

    public visitParameter(node: Oas30Parameter): void {
        if (this.hasValue(node.description)) {
            this.reportIfInvalid("PAR-3-005", OasValidationRuleUtil.isValidCommonMark(node.description), node, "description",
                `Parameter Description is an incorrect format.`);
        }
    }
    public visitParameterDefinition(node: Oas30ParameterDefinition): void {
        this.visitParameter(node);
    }

    public visitHeader(node: Oas30Header): void {
        if (this.hasValue(node.description)) {
            this.reportIfInvalid("HEAD-3-002", OasValidationRuleUtil.isValidCommonMark(node.description), node, "description",
                `Header Description is an incorrect format.`);
        }
    }
    public visitHeaderDefinition(node: Oas30HeaderDefinition): void {
        this.visitHeader(node);
    }

    public visitTag(node: Oas30Tag): void {
        if (this.hasValue(node.description)) {
            this.reportIfInvalid("TAG-3-002", OasValidationRuleUtil.isValidCommonMark(node.description), node, "description",
                `Tag Description is an incorrect format.`);
        }
    }

    public visitSecurityScheme(node: Oas30SecurityScheme): void {
        if (this.hasValue(node.openIdConnectUrl)) {
            this.reportIfInvalid("SS-3-007", OasValidationRuleUtil.isValidUrl(node.openIdConnectUrl), node, "openIdConnectUrl",
                `OpenID Connect URL is an incorrect format.`);
        }
        if (this.hasValue(node.description)) {
            this.reportIfInvalid("SS-3-009", OasValidationRuleUtil.isValidCommonMark(node.description), node, "description",
                `Security Scheme Description is an incorrect format.`);
        }
    }

    public visitServer(node: Oas30Server): void {
        if (this.hasValue(node.description)) {
            this.reportIfInvalid("SRV-3-003", OasValidationRuleUtil.isValidCommonMark(node.description), node, "description",
                `Server Description is an incorrect format.`);
        }
        if (this.hasValue(node.url)) {
            this.reportIfInvalid("SRV-3-002", OasValidationRuleUtil.isValidUrlTemplate(node.url), node, "url",
                `Server URL is an incorrect format.`);
        }
    }

    public visitServerVariable(node: Oas30ServerVariable): void {
        if (this.hasValue(node.description)) {
            this.reportIfInvalid("SVAR-3-002", OasValidationRuleUtil.isValidCommonMark(node.description), node, "description",
                `Server Variable Description is an incorrect format.`);
        }
    }

    public visitXML(node: Oas30XML): void {
        if (this.hasValue(node.namespace)) {
            this.reportIfInvalid("XML-3-002", OasValidationRuleUtil.isValidUrl(node.namespace), node, "namespace",
                `XML Namespace URL is an incorrect format.`);
        }
    }

}
