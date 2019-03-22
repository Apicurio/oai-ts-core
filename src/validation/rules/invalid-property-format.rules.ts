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

import {Oas20Document} from "../../models/2.0/document.model";
import {OasValidationRule} from "./common.rule";
import {Oas20Operation} from "../../models/2.0/operation.model";
import {Oas20Parameter, Oas20ParameterBase, Oas20ParameterDefinition} from "../../models/2.0/parameter.model";
import {Oas20Items} from "../../models/2.0/items.model";
import {Oas20Header} from "../../models/2.0/header.model";
import {Oas20SecurityScheme} from "../../models/2.0/security-scheme.model";
import {OasValidationRuleUtil} from "../validation";
import {OasInfo} from "../../models/common/info.model";
import {OasContact} from "../../models/common/contact.model";
import {OasLicense} from "../../models/common/license.model";
import {OasOperation} from "../../models/common/operation.model";
import {OasExternalDocumentation} from "../../models/common/external-documentation.model";
import {Oas30Parameter, Oas30ParameterBase, Oas30ParameterDefinition} from "../../models/3.0/parameter.model";
import {OasTag} from "../../models/common/tag.model";
import {OasXML} from "../../models/common/xml.model";
import {Oas30Info} from "../../models/3.0/info.model";
import {Oas30Response, Oas30ResponseBase, Oas30ResponseDefinition} from "../../models/3.0/response.model";
import {Oas30Example, Oas30ExampleDefinition} from "../../models/3.0/example.model";
import {Oas30Link, Oas30LinkDefinition} from "../../models/3.0/link.model";
import {
    Oas30AuthorizationCodeOAuthFlow,
    Oas30ClientCredentialsOAuthFlow,
    Oas30ImplicitOAuthFlow,
    Oas30OAuthFlow,
    Oas30PasswordOAuthFlow
} from "../../models/3.0/oauth-flow.model";
import {Oas30PathItem} from "../../models/3.0/path-item.model";
import {Oas30RequestBody, Oas30RequestBodyDefinition} from "../../models/3.0/request-body.model";
import {Oas30Header, Oas30HeaderDefinition} from "../../models/3.0/header.model";
import {Oas30SecurityScheme} from "../../models/3.0/security-scheme.model";
import {Oas30Server} from "../../models/3.0/server.model";
import {Oas30ServerVariable} from "../../models/3.0/server-variable.model";


/**
 * Implements the Invalid API Host Rule.
 */
export class OasInvalidApiHostRule extends OasValidationRule {

    public visitDocument(node: Oas20Document): void {
        if (this.hasValue(node.host)) {
            this.reportIfInvalid(OasValidationRuleUtil.isValidHost(node.host), node, "host");
        }
    }

}

/**
 * Implements the Invalid API Base Path Rule
 */
export class OasInvalidApiBasePathRule extends OasValidationRule {

    public visitDocument(node: Oas20Document): void {
        if (this.hasValue(node.basePath)) {
            this.reportIfInvalid(node.basePath.indexOf("/") === 0, node, "basePath");
        }
    }

}

/**
 * Implements the Invalid API Description Rule
 */
export class OasInvalidApiDescriptionRule extends OasValidationRule {

    public visitInfo(node: OasInfo): void {
        if (this.hasValue(node.description)) {
            this.reportIfInvalid(OasValidationRuleUtil.isValidGFM(node.description), node, "description");
        }
    }

}

/**
 * Implements the Invalid Contact URL Rule
 */
export class OasInvalidContactUrlRule extends OasValidationRule {

    public visitContact(node: OasContact): void {
        if (this.hasValue(node.url)) {
            this.reportIfInvalid(OasValidationRuleUtil.isValidUrl(node.url), node, "url");
        }
    }

}

/**
 * Implements the Invalid Contact Email Rule
 */
export class OasInvalidContactEmailRule extends OasValidationRule {
    public visitContact(node: OasContact): void {
        if (this.hasValue(node.email)) {
            this.reportIfInvalid(OasValidationRuleUtil.isValidEmailAddress(node.email), node, "email");
        }
    }

}

/**
 * Implements the Invalid License URL Rule
 */
export class OasInvalidLicenseUrlRule extends OasValidationRule {

    public visitLicense(node: OasLicense): void {
        if (this.hasValue(node.url)) {
            this.reportIfInvalid(OasValidationRuleUtil.isValidUrl(node.url), node, "url");
        }
    }

}

/**
 * Implements the Invalid Operation Description Rule
 */
export class OasInvalidOperationDescriptionRule extends OasValidationRule {

    public visitOperation(node: OasOperation): void {
        if (this.hasValue(node.description)) {
            this.reportIfInvalid(OasValidationRuleUtil.isValidGFM(node.description), node, "description");
        }
    }

}

/**
 * Implements the Invalid Operation Consumes Rule
 */
export class OasInvalidOperationConsumesRule extends OasValidationRule {

    public visitOperation(node: Oas20Operation): void {
        if (this.hasValue(node.consumes)) {
            this.reportIfInvalid(OasValidationRuleUtil.isValidMimeType(node.consumes), node, "consumes");
        }
    }

}

/**
 * Implements the Invalid Operation Produces Rule
 */
export class OasInvalidOperationProducesRule extends OasValidationRule {

    public visitOperation(node: Oas20Operation): void {
        if (this.hasValue(node.produces)) {
            this.reportIfInvalid(OasValidationRuleUtil.isValidMimeType(node.produces), node, "produces");
        }
    }

}

/**
 * Implements the Invalid External Documentation Description Rule
 */
export class OasInvalidExternalDocsDescriptionRule extends OasValidationRule {

    public visitExternalDocumentation(node: OasExternalDocumentation): void {
        if (this.hasValue(node.description)) {
            this.reportIfInvalid(OasValidationRuleUtil.isValidGFM(node.description), node, "description");
        }
    }

}

/**
 * Implements the Invalid External Documentation URL Rule
 */
export class OasInvalidExternalDocsUrlRule extends OasValidationRule {

    public visitExternalDocumentation(node: OasExternalDocumentation): void {
        if (this.hasValue(node.url)) {
            this.reportIfInvalid(OasValidationRuleUtil.isValidUrl(node.url), node, "url");
        }
    }

}

/**
 * Implements the Invalid Parameter Description Rule
 */
export class OasInvalidParameterDescriptionRule extends OasValidationRule {

    protected validateParameter(node: Oas20ParameterBase | Oas30ParameterBase): void {
        if (this.hasValue(node.description)) {
            this.reportIfInvalid(OasValidationRuleUtil.isValidGFM(node.description), node, "description");
        }
    }
    public visitParameter(node: Oas20Parameter | Oas30Parameter): void {
        this.validateParameter(node);
    }
    public visitParameterDefinition(node: Oas20ParameterDefinition | Oas30ParameterDefinition): void {
        this.validateParameter(node);
    }

}

/**
 * Implements the Invalid Schema Items Default Value Rule
 */
export class OasInvalidSchemaItemsDefaultValueRule extends OasValidationRule {

    public visitItems(node: Oas20Items): void {
        if (this.hasValue(node.default)) {
            this.reportIfInvalid(OasValidationRuleUtil.isValidForType(node.default, node), node, "default");
        }
    }

}

/**
 * Implements the Invalid Header Default Value Rule
 */
export class OasInvalidHeaderDefaultValueRule extends OasValidationRule {

    public visitHeader(node: Oas20Header): void {
        if (this.hasValue(node.default)) {
            this.reportIfInvalid(OasValidationRuleUtil.isValidForType(node.default, node), node, "default");
        }
    }

}

/**
 * Implements the Invalid Tag Description Rule
 */
export class OasInvalidTagDescriptionRule extends OasValidationRule {

    public visitTag(node: OasTag): void {
        if (this.hasValue(node.description)) {
            this.reportIfInvalid(OasValidationRuleUtil.isValidGFM(node.description), node, "description");
        }
    }

}

/**
 * Implements the Invalid Security Scheme Auth URL Rule
 */
export class OasInvalidSecuritySchemeAuthUrlRule extends OasValidationRule {

    public visitSecurityScheme(node: Oas20SecurityScheme): void {
        if (this.hasValue(node.authorizationUrl)) {
            this.reportIfInvalid(OasValidationRuleUtil.isValidUrl(node.authorizationUrl), node, "authorizationUrl");
        }
    }

}

/**
 * Implements the Invalid Security Scheme Token URL Rule
 */
export class OasInvalidSecuritySchemeTokenUrlRule extends OasValidationRule {

    public visitSecurityScheme(node: Oas20SecurityScheme): void {
        if (this.hasValue(node.tokenUrl)) {
            this.reportIfInvalid(OasValidationRuleUtil.isValidUrl(node.tokenUrl), node, "tokenUrl");
        }
    }

}

/**
 * Implements the Invalid XML Namespace URL Rule
 */
export class OasInvalidXmlNamespaceUrlRule extends OasValidationRule {

    public visitXML(node: OasXML): void {
        if (this.hasValue(node.namespace)) {
            this.reportIfInvalid(OasValidationRuleUtil.isValidUrl(node.namespace), node, "namespace");
        }
    }

}

/**
 * Implements the Invalid Terms of Service URL Rule
 */
export class OasInvalidTermsOfServiceUrlRule extends OasValidationRule {

    public visitInfo(node: Oas30Info): void {
        if (this.hasValue(node.termsOfService)) {
            this.reportIfInvalid(OasValidationRuleUtil.isValidUrl(node.termsOfService), node, "termsOfService");
        }
    }

}

/**
 * Implements the Invalid Response Description Rule
 */
export class OasInvalidResponseDescriptionRule extends OasValidationRule {

    protected visitResponseBase(node: Oas30ResponseBase): void {
        if (this.hasValue(node.description)) {
            this.reportIfInvalid(OasValidationRuleUtil.isValidCommonMark(node.description), node, "description");
        }
    }
    public visitResponse(node: Oas30Response): void {
        this.visitResponseBase(node);
    }
    public visitResponseDefinition(node: Oas30ResponseDefinition): void {
        this.visitResponseBase(node);
    }

}

/**
 * Implements the Invalid Example Description Rule
 */
export class OasInvalidExampleDescriptionRule extends OasValidationRule {

    public visitExample(node: Oas30Example): void {
        if (this.hasValue(node.description)) {
            this.reportIfInvalid(OasValidationRuleUtil.isValidCommonMark(node.description), node, "description");
        }
    }
    public visitExampleDefinition(node: Oas30ExampleDefinition): void {
        this.visitExample(node);
    }

}

/**
 * Implements the Invalid Link Description Rule
 */
export class OasInvalidLinkDescriptionRule extends OasValidationRule {

    public visitLink(node: Oas30Link): void {
        if (this.hasValue(node.description)) {
            this.reportIfInvalid(OasValidationRuleUtil.isValidCommonMark(node.description), node, "description");
        }
    }
    public visitLinkDefinition(node: Oas30LinkDefinition): void {
        this.visitLink(node);
    }

}

/**
 * Implements the Invalid OAuth Authorization URL Rule
 */
export class OasInvalidOAuthAuthorizationUrlRule extends OasValidationRule {

    protected visitFlow(node: Oas30OAuthFlow): void {
        if (this.hasValue(node.authorizationUrl)) {
            this.reportIfInvalid(OasValidationRuleUtil.isValidUrl(node.authorizationUrl), node, "authorizationUrl");
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

}

/**
 * Implements the Invalid OAuth Token URL Rule
 */
export class OasInvalidOAuthTokenUrlRule extends OasValidationRule {

    protected visitFlow(node: Oas30OAuthFlow): void {
        if (this.hasValue(node.tokenUrl)) {
            this.reportIfInvalid(OasValidationRuleUtil.isValidUrl(node.tokenUrl), node, "tokenUrl");
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

}

/**
 * Implements the Invalid OAuth Refresh URL Rule
 */
export class OasInvalidOAuthRefreshUrlRule extends OasValidationRule {

    protected visitFlow(node: Oas30OAuthFlow): void {
        if (this.hasValue(node.refreshUrl)) {
            this.reportIfInvalid(OasValidationRuleUtil.isValidUrl(node.refreshUrl), node, "refreshUrl");
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

}

/**
 * Implements the Invalid Path Item Description Rule
 */
export class OasInvalidPathItemDescriptionRule extends OasValidationRule {

    public visitPathItem(node: Oas30PathItem): void {
        if (this.hasValue(node.description)) {
            this.reportIfInvalid(OasValidationRuleUtil.isValidCommonMark(node.description), node, "description");
        }
    }

}

/**
 * Implements the Invalid Request Body Description Rule
 */
export class OasInvalidRequestBodyDescriptionRule extends OasValidationRule {

    public visitRequestBody(node: Oas30RequestBody): void {
        if (this.hasValue(node.description)) {
            this.reportIfInvalid(OasValidationRuleUtil.isValidCommonMark(node.description), node, "description");
        }
    }
    public visitRequestBodyDefinition(node: Oas30RequestBodyDefinition): void {
        this.visitRequestBody(node);
    }

}


/**
 * Implements the Invalid Header Description Rule
 */
export class OasInvalidHeaderDescriptionRule extends OasValidationRule {

    public visitHeader(node: Oas30Header): void {
        if (this.hasValue(node.description)) {
            this.reportIfInvalid(OasValidationRuleUtil.isValidCommonMark(node.description), node, "description");
        }
    }
    public visitHeaderDefinition(node: Oas30HeaderDefinition): void {
        this.visitHeader(node);
    }

}


/**
 * Implements the Invalid OpenId Connect URL Rule
 */
export class OasInvalidOpenIDConnectUrlRule extends OasValidationRule {

    public visitSecurityScheme(node: Oas30SecurityScheme): void {
        if (this.hasValue(node.openIdConnectUrl)) {
            this.reportIfInvalid(OasValidationRuleUtil.isValidUrl(node.openIdConnectUrl), node, "openIdConnectUrl");
        }
    }

}


/**
 * Implements the Invalid Security Scheme Description Rule
 */
export class OasInvalidSecuritySchemeDescriptionRule extends OasValidationRule {

    public visitSecurityScheme(node: Oas30SecurityScheme): void {
        if (this.hasValue(node.description)) {
            this.reportIfInvalid(OasValidationRuleUtil.isValidCommonMark(node.description), node, "description");
        }
    }

}


/**
 * Implements the Invalid Server Description Rule
 */
export class OasInvalidServerDescriptionRule extends OasValidationRule {

    public visitServer(node: Oas30Server): void {
        if (this.hasValue(node.description)) {
            this.reportIfInvalid(OasValidationRuleUtil.isValidCommonMark(node.description), node, "description");
        }
    }

}


/**
 * Implements the Invalid Server URL Rule
 */
export class OasInvalidServerUrlRule extends OasValidationRule {

    public visitServer(node: Oas30Server): void {
        if (this.hasValue(node.url)) {
            this.reportIfInvalid(OasValidationRuleUtil.isValidUrlTemplate(node.url), node, "url");
        }
    }

}


/**
 * Implements the Invalid Server Variable Description Rule
 */
export class OasInvalidServerVariableDescriptionRule extends OasValidationRule {

    public visitServerVariable(node: Oas30ServerVariable): void {
        if (this.hasValue(node.description)) {
            this.reportIfInvalid(OasValidationRuleUtil.isValidCommonMark(node.description), node, "description");
        }
    }

}



