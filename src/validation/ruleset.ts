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
import {OasDocument} from "../models/document.model";
import {OasValidationRule} from "./rules/common.rule";
import {
    OasBodyParameterUniquenessValidationRule,
    OasOperationIdUniquenessValidationRule,
    OasParameterUniquenessValidationRule,
    OasTagUniquenessValidationRule
} from "./rules/uniqueness.rules";
import {
    OasInvalidApiBasePathRule,
    OasInvalidApiDescriptionRule,
    OasInvalidApiHostRule,
    OasInvalidContactEmailRule,
    OasInvalidContactUrlRule,
    OasInvalidExampleDescriptionRule,
    OasInvalidExternalDocsDescriptionRule,
    OasInvalidExternalDocsUrlRule,
    OasInvalidHeaderDefaultValueRule,
    OasInvalidHeaderDescriptionRule,
    OasInvalidLicenseUrlRule,
    OasInvalidLinkDescriptionRule,
    OasInvalidOAuthAuthorizationUrlRule,
    OasInvalidOAuthRefreshUrlRule,
    OasInvalidOAuthTokenUrlRule,
    OasInvalidOpenIDConnectUrlRule,
    OasInvalidOperationConsumesRule,
    OasInvalidOperationDescriptionRule,
    OasInvalidOperationProducesRule,
    OasInvalidParameterDescriptionRule,
    OasInvalidPathItemDescriptionRule,
    OasInvalidRequestBodyDescriptionRule,
    OasInvalidResponseDescriptionRule,
    OasInvalidSchemaItemsDefaultValueRule,
    OasInvalidSecuritySchemeAuthUrlRule,
    OasInvalidSecuritySchemeDescriptionRule,
    OasInvalidSecuritySchemeTokenUrlRule,
    OasInvalidServerDescriptionRule,
    OasInvalidServerUrlRule,
    OasInvalidServerVariableDescriptionRule,
    OasInvalidTagDescriptionRule,
    OasInvalidTermsOfServiceUrlRule,
    OasInvalidXmlNamespaceUrlRule
} from "./rules/invalid-property-format.rules";
import {
    OasDuplicatePathSegmentRule,
    OasEmptyPathSegmentRule,
    OasIdenticalPathTemplateRule,
    OasInvalidCallbackDefinitionNameRule,
    OasInvalidExampleDefinitionNameRule,
    OasInvalidHeaderDefinitionNameRule,
    OasInvalidHttpResponseCodeRule,
    OasInvalidLinkDefinitionNameRule,
    OasInvalidParameterDefNameRule,
    OasInvalidPathSegmentRule,
    OasInvalidRequestBodyDefinitionNameRule,
    OasInvalidResponseDefNameRule,
    OasInvalidSchemaDefNameRule,
    OasInvalidScopeNameRule,
    OasInvalidSecuritySchemeNameRule,
    OasUnmatchedEncodingPropertyRule,
    OasUnmatchedExampleTypeRule
} from "./rules/invalid-property-name.rules";
import {OasUnknownPropertyRule} from "./rules/unknown-property.rules";
import {
    OasAllowReservedNotAllowedForParamRule,
    OasAllowReservedNotAllowedRule,
    OasEncodingStyleNotAllowedRule,
    OasExplodeNotAllowedRule,
    OasFormDataParamNotAllowedRule,
    OasInvalidApiConsumesMTRule,
    OasInvalidApiProducesMTRule,
    OasInvalidApiSchemeRule,
    OasInvalidEncodingForMPMTRule,
    OasInvalidHeaderStyleRule,
    OasInvalidHttpSecuritySchemeTypeRule,
    OasInvalidLinkOperationIdRule,
    OasInvalidOperationIdRule,
    OasInvalidOperationSchemeRule,
    OasInvalidSecurityReqScopesRule,
    OasMissingPathParamDefinitionRule,
    OasMissingResponseForOperationRule,
    OasOperationSummaryTooLongRule,
    OasPathParamNotFoundRule,
    OasRequiredParamWithDefaultValueRule,
    OasSecurityRequirementScopesMustBeEmptyRule,
    OasServerVarNotFoundInTemplateRule,
    OasUnexpectedArrayCollectionFormatRule,
    OasUnexpectedHeaderCollectionFormatRule,
    OasUnexpectedHeaderUsageRule,
    OasUnexpectedNumberOfHeaderMTsRule,
    OasUnexpectedNumOfParamMTsRule,
    OasUnexpectedParamAllowEmptyValueRule,
    OasUnexpectedParamCollectionFormatRule,
    OasUnexpectedParamMultiRule,
    OasUnexpectedRequestBodyRule,
    OasUnexpectedSecurityRequirementScopesRule,
    OasUnexpectedUsageOfBearerTokenRule,
    OasUnexpectedUsageOfDiscriminatorRule,
    OasUnexpectedXmlWrappingRule,
    OasUnknownApiKeyLocationRule,
    OasUnknownArrayCollectionFormatRule,
    OasUnknownArrayFormatRule,
    OasUnknownArrayTypeRule,
    OasUnknownCookieParamStyleRule,
    OasUnknownEncodingStyleRule,
    OasUnknownHeaderCollectionFormatRule,
    OasUnknownHeaderFormatRule,
    OasUnknownHeaderParamStyleRule,
    OasUnknownHeaderTypeRule,
    OasUnknownOauthFlowTypeRule,
    OasUnknownParamCollectionFormatRule,
    OasUnknownParamFormatRule,
    OasUnknownParamLocationRule,
    OasUnknownParamStyleRule,
    OasUnknownParamTypeRule,
    OasUnknownPathParamStyleRule,
    OasUnknownQueryParamStyleRule,
    OasUnknownSecuritySchemeTypeRule
} from "./rules/invalid-property-value.rules";
import {
    OasInvalidCallbackReferenceRule,
    OasInvalidExampleReferenceRule,
    OasInvalidHeaderReferenceRule, OasInvalidLinkOperationReferenceRule,
    OasInvalidLinkReferenceRule,
    OasInvalidParameterReferenceRule,
    OasInvalidPathItemReferenceRule, OasInvalidRequestBodyReferenceRule,
    OasInvalidResponseReferenceRule,
    OasInvalidSchemaReferenceRule,
    OasInvalidSecurityRequirementNameRule,
    OasInvalidSecuritySchemeReferenceRule
} from "./rules/invalid-reference.rules";
import {
    OasBodyAndFormDataMutualExclusivityRule,
    OasExampleValueMutualExclusivityRule,
    OasHeaderExamplesMutualExclusivityRule, OasHeaderSchemaContentMutualExclusivityRule,
    OasLinkOperationRefMutualExclusivityRule,
    OasMediaTypeExamplesMutualExclusivityRule, OasParameterExamplesMutualExclusivityRule,
    OasParameterSchemaContentMutualExclusivityRule
} from "./rules/mutually-exclusive.rules";
import {
    OasMissingApiInformationRule,
    OasMissingApiKeySchemeParamLocationRule,
    OasMissingApiKeySchemeParamNameRule,
    OasMissingApiPathsRule,
    OasMissingApiTitleRule,
    OasMissingApiVersionRule,
    OasMissingBodyParameterSchemaRule,
    OasMissingDiscriminatorPropertyNameRule,
    OasMissingExternalDocumentationUrlRule,
    OasMissingHeaderArrayInformationRule,
    OasMissingHeaderTypeRule, OasMissingHttpSecuritySchemeTypeRule,
    OasMissingItemsArrayInformationRule,
    OasMissingItemsTypeRule,
    OasMissingLicenseNameRule,
    OasMissingOAuthFlowAuthUrlRule, OasMissingOAuthFlowRokenUrlRule,
    OasMissingOAuthFlowScopesRule,
    OasMissingOAuthSchemeAuthUrlRule,
    OasMissingOAuthSchemeFlowTypeRule,
    OasMissingOAuthSchemeScopesRule,
    OasMissingOAuthSchemeTokenUrlRule, OasMissingOAuthSecuritySchemeFlowsRule,
    OasMissingOpenApiPropertyRule, OasMissingOpenIdConnectSecuritySchemeConnectUrlRule,
    OasMissingOperationIdRule,
    OasMissingOperationResponsesRule,
    OasMissingParameterArrayTypeRule,
    OasMissingParameterLocationRule,
    OasMissingParameterNameRule,
    OasMissingParameterTypeRule, OasMissingRequestBodyContentRule,
    OasMissingResponseDescriptionRule,
    OasMissingSecuritySchemeTypeRule, OasMissingServerTemplateUrlRule, OasMissingServerVarDefaultValueRule,
    OasMissingTagNameRule,
    OasPathParamsMustBeRequiredRule
} from "./rules/required-property.rules";
import {OasIgnoredContentTypeHeaderRule, OasIgnoredHeaderParameterRule} from "./rules/ignored-property-name.rules";
import {OasInvalidSchemaArrayItemsRule, OasInvalidSchemaTypeValueRule} from "./rules/invalid-property-type.rules";


export interface ValidationRuleMetaData {
    code: string;
    name: string;
    type: string;
    entity: string;
    versions: string[];
    specMandated: boolean,
    messageTemplate: any;
    class: any;
}


function template(literals: TemplateStringsArray, ...placeholders: string[]) {
    return (function(...values: any[]) {
        let dict: any = values[values.length - 1] || {};
        let result: string[] = [literals[0]];
        placeholders.forEach(function(key, i) {
            let value: string = dict[key] || key;
            result.push(value, literals[i + 1]);
        });
        return result.join('');
    });
}


export class OasValidationRuleset {

    public static instance: OasValidationRuleset = new OasValidationRuleset();

    private _rules: ValidationRuleMetaData[] = [
        { code: "UNKNOWN-001",  name: "Unknown/Unexpected Property", type: "Unknown Property", entity: "All", versions: [ "2.0", "3.0" ], specMandated: true, messageTemplate: template`An unexpected property "${'property'}" was found.  Extension properties should begin with "x-".`, class: OasUnknownPropertyRule },
        /** Uniqueness **/
        { code: "TAG-003",  name: "Duplicate Tag Definition", type: "Uniqueness", entity: "Tag", versions: [ "2.0", "3.0" ], specMandated: true, messageTemplate: template`Duplicate tag '${'tagName'}' found (every tag must have a unique name).`, class: OasTagUniquenessValidationRule },
        { code: "OP-003",   name: "Duplicate Operation ID", type: "Uniqueness", entity: "Operation", versions: [ "2.0", "3.0" ], specMandated: true, messageTemplate: template`Duplicate operationId '${'operationId'}' found (operation IDs must be unique across all operations in the API).`, class: OasOperationIdUniquenessValidationRule },
        { code: "PAR-019",  name: "Duplicate Parameter", type: "Uniqueness", entity: "Parameter", versions: [ "2.0", "3.0" ], specMandated: true, messageTemplate: template`Duplicate ${'paramIn'} parameter named '${'paramName'}' found (parameters must be unique by name and location).`, class: OasParameterUniquenessValidationRule },
        { code: "PAR-020",  name: "Duplicate Body Parameter", type: "Uniqueness", entity: "Parameter", versions: [ "2.0" ], specMandated: true, messageTemplate: template`Operation has multiple "body" parameters.`, class: OasBodyParameterUniquenessValidationRule },
        /** Invalid Property Format **/
        { code: "R-004",    name: "Invalid API Host", type: "Invalid Property Format", entity: "API", versions: [ "2.0" ], specMandated: true, messageTemplate: template`Host not properly formatted - only the host name (and optionally port) should be specified.`, class: OasInvalidApiHostRule },
        { code: "R-005",    name: "Invalid API Base Path", type: "Invalid Property Format", entity: "API", versions: [ "2.0" ], specMandated: true, messageTemplate: template`Base Path should being with a '/' character.`, class: OasInvalidApiBasePathRule },
        { code: "INF-003",  name: "Invalid API Description", type: "Invalid Property Format", entity: "Info", versions: [ "2.0", "3.0" ], specMandated: true, messageTemplate: template`API description is an incorrect format.`, class: OasInvalidApiDescriptionRule },
        { code: "INF-004",  name: "Invalid Terms of Service URL", type: "Invalid Property Format", entity: "Info", versions: [ "3.0" ], specMandated: true, messageTemplate: template`Terms of Service URL is an incorrect format.`, class: OasInvalidTermsOfServiceUrlRule },
        { code: "CTC-001",  name: "Invalid Contact URL", type: "Invalid Property Format", entity: "Contact", versions: [ "2.0", "3.0" ], specMandated: true, messageTemplate: template`Contact URL is an incorrect format.`, class: OasInvalidContactUrlRule },
        { code: "CTC-002",  name: "Invalid Contact Email", type: "Invalid Property Format", entity: "Contact", versions: [ "2.0", "3.0" ], specMandated: true, messageTemplate: template`Contact Email is an incorrect format.`, class: OasInvalidContactEmailRule },
        { code: "LIC-002",  name: "Invalid License URL", type: "Invalid Property Format", entity: "License", versions: [ "2.0", "3.0" ], specMandated: true, messageTemplate: template`License URL is an incorrect format.`, class: OasInvalidLicenseUrlRule },
        { code: "OP-002",   name: "Invalid Operation Description", type: "Invalid Property Format", entity: "Operation", versions: [ "2.0", "3.0" ], specMandated: true, messageTemplate: template`Operation Description is an incorrect format.`, class: OasInvalidOperationDescriptionRule },
        { code: "OP-005",   name: "Invalid Operation 'Consumes' Type", type: "Invalid Property Format", entity: "Operation", versions: [ "2.0" ], specMandated: true, messageTemplate: template`Operation "consumes" must be a valid mime type.`, class: OasInvalidOperationConsumesRule },
        { code: "OP-006",   name: "Invalid Operation 'Produces' Type", type: "Invalid Property Format", entity: "Operation", versions: [ "2.0" ], specMandated: true, messageTemplate: template`Operation "produces" must be a valid mime type.`, class: OasInvalidOperationProducesRule },
        { code: "ED-002",   name: "Invalid External Documentation Description", type: "Invalid Property Format", entity: "External Documentation", versions: [ "2.0", "3.0" ], specMandated: true, messageTemplate: template`External Docs Description is an incorrect format.`, class: OasInvalidExternalDocsDescriptionRule },
        { code: "ED-003",   name: "Invalid External Documentation URL", type: "Invalid Property Format", entity: "External Documentation", versions: [ "2.0", "3.0" ], specMandated: true, messageTemplate: template`External Docs URL is an incorrect format.`, class: OasInvalidExternalDocsUrlRule },
        { code: "PAR-010",  name: "Invalid Parameter Description", type: "Invalid Property Format", entity: "Parameter", versions: [ "2.0", "3.0" ], specMandated: true, messageTemplate: template`Parameter Description is an incorrect format.`, class: OasInvalidParameterDescriptionRule },
        { code: "IT-007",   name: "Invalid Schema Items Default Value", type: "Invalid Property Format", entity: "Shema Items", versions: [ "2.0", "3.0" ], specMandated: true, messageTemplate: template`Schema Items default value does not conform to the correct type.`, class: OasInvalidSchemaItemsDefaultValueRule },
        { code: "HEAD-005", name: "Invalid Header Default Value", type: "Invalid Property Format", entity: "Header Items", versions: [ "2.0" ], specMandated: true, messageTemplate: template`The "default" property must conform to the "type" of the items.`, class: OasInvalidHeaderDefaultValueRule },
        { code: "TAG-002",  name: "Invalid Tag Description", type: "Invalid Property Format", entity: "Tag", versions: [ "2.0", "3.0" ], specMandated: true, messageTemplate: template`Tag Description is an incorrect format.`, class: OasInvalidTagDescriptionRule },
        { code: "SS-011",   name: "Invalid Security Scheme Auth URL", type: "Invalid Property Format", entity: "Security Scheme", versions: [ "2.0" ], specMandated: true, messageTemplate: template`Security Scheme Authorization URL is an incorrect format.`, class: OasInvalidSecuritySchemeAuthUrlRule },
        { code: "SS-012",   name: "Invalid Security Scheme Token URL", type: "Invalid Property Format", entity: "Security Scheme", versions: [ "2.0" ], specMandated: true, messageTemplate: template`Security Scheme Token URL is an incorrect format.`, class: OasInvalidSecuritySchemeTokenUrlRule },
        { code: "XML-001",  name: "Invalid XML Namespace URL", type: "Invalid Property Format", entity: "XML", versions: [ "2.0", "3.0" ], specMandated: true, messageTemplate: template`XML Namespace URL is an incorrect format.`, class: OasInvalidXmlNamespaceUrlRule },
        { code: "RES-004",  name: "Invalid Response Description", type: "Invalid Property Format", entity: "Response", versions: [ "3.0" ], specMandated: true, messageTemplate: template`Response description is an incorrect format.`, class: OasInvalidResponseDescriptionRule },
        { code: "EX-002",   name: "Invalid Example Description", type: "Invalid Property Format", entity: "Example", versions: [ "3.0" ], specMandated: true, messageTemplate: template`Example Description is an incorrect format.`, class: OasInvalidExampleDescriptionRule },
        { code: "LINK-004", name: "Invalid Link Description", type: "Invalid Property Format", entity: "Link", versions: [ "3.0" ], specMandated: true, messageTemplate: template`Link Description is an incorrect format.`, class: OasInvalidLinkDescriptionRule },
        { code: "FLOW-003", name: "Invalid OAuth Authorization URL", type: "Invalid Property Format", entity: "Link", versions: [ "3.0" ], specMandated: true, messageTemplate: template`OAuth Authorization URL is an incorrect format.`, class: OasInvalidOAuthAuthorizationUrlRule },
        { code: "FLOW-004", name: "Invalid OAuth Token URL", type: "Invalid Property Format", entity: "Link", versions: [ "3.0" ], specMandated: true, messageTemplate: template`OAuth Token URL is an incorrect format.`, class: OasInvalidOAuthTokenUrlRule },
        { code: "FLOW-005", name: "Invalid OAuth Refresh URL", type: "Invalid Property Format", entity: "Link", versions: [ "3.0" ], specMandated: true, messageTemplate: template`OAuth Refresh URL is an incorrect format.`, class: OasInvalidOAuthRefreshUrlRule },
        { code: "PATH-008", name: "Invalid Path Item Description", type: "Invalid Property Format", entity: "Path Item", versions: [ "3.0" ], specMandated: true, messageTemplate: template`Path Item Description is an incorrect format.`, class: OasInvalidPathItemDescriptionRule },
        { code: "RB-001",   name: "Invalid Request Body Description", type: "Invalid Property Format", entity: "Request Body", versions: [ "3.0" ], specMandated: true, messageTemplate: template`Request Body Description is an incorrect format.`, class: OasInvalidRequestBodyDescriptionRule },
        { code: "HEAD-009", name: "Invalid Header Description", type: "Invalid Property Format", entity: "Header", versions: [ "3.0" ], specMandated: true, messageTemplate: template`Header Description is an incorrect format.`, class: OasInvalidHeaderDescriptionRule },
        { code: "SS-014",   name: "Invalid OpenID Connect URL", type: "Invalid Property Format", entity: "Security Scheme", versions: [ "3.0" ], specMandated: true, messageTemplate: template`OpenID Connect URL is an incorrect format.`, class: OasInvalidOpenIDConnectUrlRule },
        { code: "SS-015",   name: "Invalid Security Scheme Description", type: "Invalid Property Format", entity: "Security Scheme", versions: [ "3.0" ], specMandated: true, messageTemplate: template`Security Scheme Description is an incorrect format.`, class: OasInvalidSecuritySchemeDescriptionRule },
        { code: "SRV-003",  name: "Invalid Server Description", type: "Invalid Property Format", entity: "Server", versions: [ "3.0" ], specMandated: true, messageTemplate: template`Server Description is an incorrect format.`, class: OasInvalidServerDescriptionRule },
        { code: "SRV-002",  name: "Invalid Server URL", type: "Invalid Property Format", entity: "Server", versions: [ "3.0" ], specMandated: true, messageTemplate: template`Server URL is an incorrect format.`, class: OasInvalidServerUrlRule },
        { code: "SVAR-002", name: "Invalid Server Variable Description", type: "Invalid Property Format", entity: "Server Variable", versions: [ "3.0" ], specMandated: true, messageTemplate: template`Server Variable Description is an incorrect format.`, class: OasInvalidServerVariableDescriptionRule },
        /** Invalid Property Name **/
        { code: "PATH-006", name: "Empty Path Segment", type: "Invalid Property Name", entity: "Path Item", versions: [ "2.0", "3.0" ], specMandated: true, messageTemplate: template`Path template "${'path'}" contains one or more empty segment.`, class: OasEmptyPathSegmentRule },
        { code: "PATH-007", name: "Duplicate Path Segment", type: "Invalid Property Name", entity: "Path Item", versions: [ "2.0", "3.0" ], specMandated: true, messageTemplate: template`Path template "${'path'}" contains duplicate variable names (${'duplicates'}).`, class: OasDuplicatePathSegmentRule },
        { code: "PATH-005", name: "Invalid Path Segment", type: "Invalid Property Name", entity: "Path Item", versions: [ "2.0", "3.0" ], specMandated: true, messageTemplate: template`Path template "${'path'}" is not valid.`, class: OasInvalidPathSegmentRule },
        { code: "PATH-009", name: "Identical Path Template", type: "Invalid Property Name", entity: "Path Item", versions: [ "2.0", "3.0" ], specMandated: true, messageTemplate: template`Path template "${'path'}" is semantically identical to at least one other path.`, class: OasIdenticalPathTemplateRule },
        { code: "RES-003",  name: "Invalid HTTP Response Code", type: "Invalid Property Name", entity: "Response", versions: [ "2.0", "3.0" ], specMandated: true, messageTemplate: template`"${'statusCode'}" is not a valid HTTP response status code.`, class: OasInvalidHttpResponseCodeRule },
        { code: "EX-001",   name: "Unmatched Example Type", type: "Invalid Property Name", entity: "Example", versions: [ "2.0" ], specMandated: true, messageTemplate: template`Example '${'contentType'}' must match one of the "produces" mime-types.`, class: OasUnmatchedExampleTypeRule },
        { code: "SDEF-001", name: "Invalid Schema Definition Name", type: "Invalid Property Name", entity: "Schema Definition", versions: [ "2.0", "3.0" ], specMandated: true, messageTemplate: template`Schema Definition Name is not valid.`, class: OasInvalidSchemaDefNameRule },
        { code: "PDEF-001", name: "Invalid Parameter Definition Name", type: "Invalid Property Name", entity: "Parameter Definition", versions: [ "2.0", "3.0" ], specMandated: true, messageTemplate: template`Parameter Definition Name is not valid.`, class: OasInvalidParameterDefNameRule },
        { code: "RDEF-001", name: "Invalid Response Definition Name", type: "Invalid Property Name", entity: "Response Definition", versions: [ "2.0", "3.0" ], specMandated: true, messageTemplate: template`Response Definition Name is not valid.`, class: OasInvalidResponseDefNameRule },
        { code: "SCPS-001", name: "Invalid Scope Name", type: "Invalid Scope Name", entity: "Scopes", versions: [ "2.0", "3.0" ], specMandated: true, messageTemplate: template`'${'scope'}' is not a valid scope name.`, class: OasInvalidScopeNameRule },
        { code: "SS-013",   name: "Invalid Security Scheme Name", type: "Invalid Property Name", entity: "Security Scheme", versions: [ "2.0", "3.0" ], specMandated: true, messageTemplate: template`Security Scheme Name is not valid.`, class: OasInvalidSecuritySchemeNameRule },
        { code: "EDEF-001", name: "Invalid Example Definition Name", type: "Invalid Property Name", entity: "Components", versions: [ "3.0" ], specMandated: true, messageTemplate: template`Example Definition Name is not valid.`, class: OasInvalidExampleDefinitionNameRule},
        { code: "RBDEF-001",name: "Invalid Request Body Definition Name", type: "Invalid Property Name", entity: "Components", versions: [ "3.0" ], specMandated: true, messageTemplate: template`Request Body Definition Name is not valid.`, class: OasInvalidRequestBodyDefinitionNameRule},
        { code: "HDEF-001", name: "Invalid Header Definition Name", type: "Invalid Property Name", entity: "Components", versions: [ "3.0" ], specMandated: true, messageTemplate: template`Header Definition Name is not valid.`, class: OasInvalidHeaderDefinitionNameRule},
        { code: "LDEF-001", name: "Invalid Link Definition Name", type: "Invalid Property Name", entity: "Components", versions: [ "3.0" ], specMandated: true, messageTemplate: template`Link Definition Name is not valid.`, class: OasInvalidLinkDefinitionNameRule},
        { code: "CDEF-001", name: "Invalid Callback Definition Name", type: "Invalid Property Name", entity: "Components", versions: [ "3.0" ], specMandated: true, messageTemplate: template`Callback Definition Name is not valid.`, class: OasInvalidCallbackDefinitionNameRule},
        { code: "ENC-006",  name: "Unmatched Encoding Property", type: "Invalid Property Name", entity: "Components", versions: [ "3.0" ], specMandated: true, messageTemplate: template`Encoding Property "${'name'}" not found in the associated schema.`, class: OasUnmatchedEncodingPropertyRule},
        /** Invalid Property Value **/
        { code: "R-006",    name: "Invalid API Scheme", type: "Invalid Property Value", entity: "API", versions: [ "2.0" ], specMandated: true, messageTemplate: template`API scheme "${'scheme'}" not allowed.  Must be one of: http, https, ws, wss`, class: OasInvalidApiSchemeRule },
        { code: "R-007",    name: "Invalid 'Consumes' Mime-Type", type: "Invalid Property Value", entity: "API", versions: [ "2.0" ], specMandated: true, messageTemplate: template`API "consumes" must be a valid mime-type.`, class: OasInvalidApiConsumesMTRule },
        { code: "R-008",    name: "Invalid 'Produces' Mime-Type", type: "Invalid Property Value", entity: "API", versions: [ "2.0" ], specMandated: true, messageTemplate: template`API "produces" must be a valid mime-type.`, class: OasInvalidApiProducesMTRule },
        { code: "OP-001",   name: "Operation Summary Too Long", type: "Invalid Property Value", entity: "Operation", versions: [ "2.0", "3.0" ], specMandated: true, messageTemplate: template`Operation Summary should be less than 120 characters.`, class: OasOperationSummaryTooLongRule },
        { code: "OP-004",   name: "Invalid Operation ID", type: "Invalid Property Value", entity: "Operation", versions: [ "2.0", "3.0" ], specMandated: true, messageTemplate: template`Operation ID is an invalid format.`, class: OasInvalidOperationIdRule },
        { code: "OP-010",   name: "Invalid Operation Scheme", type: "Invalid Property Value", entity: "Operation", versions: [ "2.0", "3.0" ], specMandated: true, messageTemplate: template`Operation scheme "${'scheme'}" not allowed.  Must be one of: http, https, ws, wss`, class: OasInvalidOperationSchemeRule },
        { code: "PAR-007",  name: "Path Parameter Not Found", type: "Invalid Property Value", entity: "Parameter", versions: [ "2.0", "3.0" ], specMandated: true, messageTemplate: template`Path Parameter "${'name'}" not found in path template.`, class: OasPathParamNotFoundRule },
        { code: "PAR-008",  name: "Form Data Parameter Not Allowed", type: "Invalid Property Value", entity: "Parameter", versions: [ "2.0" ], specMandated: true, messageTemplate: template`Form Data Parameters are only used in 'application/x-www-form-urlencoded' or 'multipart/form-data' requests.`, class: OasFormDataParamNotAllowedRule },
        { code: "PAR-009",  name: "Unknown Parameter Location", type: "Invalid Property Value", entity: "Parameter", versions: [ "2.0", "3.0" ], specMandated: true, messageTemplate: template`Parameters can only be found in one of: ${'options'}`, class: OasUnknownParamLocationRule },
        { code: "PAR-011",  name: "Unknown Parameter Type", type: "Invalid Property Value", entity: "Parameter", versions: [ "2.0" ], specMandated: true, messageTemplate: template`Parameter types are limited to: string, number, integer, boolean, array, file`, class: OasUnknownParamTypeRule },
        { code: "PAR-012",  name: "Unknown Parameter Format", type: "Invalid Property Value", entity: "Parameter", versions: [ "2.0" ], specMandated: true, messageTemplate: template`Parameter Format must be one of: int32, int64, float, double, byte, binary, date, date-time, password`, class: OasUnknownParamFormatRule },
        { code: "PAR-013",  name: "Unexpected Usage of Parameter 'allowEmptyValue'", type: "Invalid Property Value", entity: "Parameter", versions: [ "2.0", "3.0" ], specMandated: true, messageTemplate: template`Allow Empty Value is not allowed (only for ${'options'} params).`, class: OasUnexpectedParamAllowEmptyValueRule },
        { code: "PAR-014",  name: "Unexpected Usage of Parameter 'collectionFormat'", type: "Invalid Property Value", entity: "Parameter", versions: [ "2.0" ], specMandated: true, messageTemplate: template`The "collectionFormat" property is only allowed for 'array' type parameters.`, class: OasUnexpectedParamCollectionFormatRule },
        { code: "PAR-015",  name: "Unknown Parameter Collection Format", type: "Invalid Property Value", entity: "Parameter", versions: [ "2.0" ], specMandated: true, messageTemplate: template`Parameter Collection Format must be one of: csv, ssv, tsv, pipes, multi`, class: OasUnknownParamCollectionFormatRule },
        { code: "PAR-016",  name: "Unexpected Parameter Usage of 'multi'", type: "Invalid Property Value", entity: "Parameter", versions: [ "2.0" ], specMandated: true, messageTemplate: template`Parameter Collection Format can only be "multi" for Query and Form Data parameters.`, class: OasUnexpectedParamMultiRule },
        { code: "PAR-017",  name: "Required Parameter With Default Value Not Allowed", type: "Invalid Property Value", entity: "Parameter", versions: [ "2.0" ], specMandated: true, messageTemplate: template`Required Parameters can not have a default value.`, class: OasRequiredParamWithDefaultValueRule },
        { code: "IT-003",   name: "Unknown Array Type", type: "Invalid Property Value", entity: "Items", versions: [ "2.0" ], specMandated: true, messageTemplate: template`Schema Items Type must be one of: string, number, integer, boolean, array`, class: OasUnknownArrayTypeRule },
        { code: "IT-004",   name: "Unknown Array Format", type: "Invalid Property Value", entity: "Items", versions: [ "2.0" ], specMandated: true, messageTemplate: template`Schema Items Format must be one of: int32, int64, float, double, byte, binary, date, date-time, password`, class: OasUnknownArrayFormatRule },
        { code: "IT-005",   name: "Unknown Array Collection Format", type: "Invalid Property Value", entity: "Items", versions: [ "2.0" ], specMandated: true, messageTemplate: template`Schema Items Collection Format must be one of: csv, ssv, tsv, pipes`, class: OasUnknownArrayCollectionFormatRule },
        { code: "IT-006",   name: "Unexpected Usage of Array 'collectionFormat'", type: "Invalid Property Value", entity: "Items", versions: [ "2.0" ], specMandated: true, messageTemplate: template`Schema Items Collection Format is only allowed for Array style parameters.`, class: OasUnexpectedArrayCollectionFormatRule },
        { code: "HEAD-003", name: "Unknown Header Type", type: "Invalid Property Value", entity: "Header", versions: [ "2.0" ], specMandated: true, messageTemplate: template`Header Type must be one of: string, number, integer, boolean, array`, class: OasUnknownHeaderTypeRule },
        { code: "HEAD-004", name: "Unknown Header Format", type: "Invalid Property Value", entity: "Header", versions: [ "2.0" ], specMandated: true, messageTemplate: template`Header Format must be one of: int32, int64, float, double, byte, binary, date, date-time, password`, class: OasUnknownHeaderFormatRule },
        { code: "HEAD-006", name: "Unexpected Usage of Header 'collectionFormat'", type: "Invalid Property Value", entity: "Header", versions: [ "2.0" ], specMandated: true, messageTemplate: template`Header Collection Format is only allowed for "array" type headers.`, class: OasUnexpectedHeaderCollectionFormatRule },
        { code: "HEAD-007", name: "Unknown Header Collection Format", type: "Invalid Property Value", entity: "Header", versions: [ "2.0" ], specMandated: true, messageTemplate: template`Header Collection Format must be one of: csv, ssv, tsv, pipes`, class: OasUnknownHeaderCollectionFormatRule },
        { code: "XML-002",  name: "Unexpected Usage of XML Wrapping", type: "Invalid Property Value", entity: "XML", versions: [ "2.0", "3.0" ], specMandated: true, messageTemplate: template`XML Wrapped elements can only be used for "array" properties.`, class: OasUnexpectedXmlWrappingRule },
        { code: "SS-008",   name: "Unknown Security Scheme Type", type: "Invalid Property Value", entity: "Security Scheme", versions: [ "2.0", "3.0" ], specMandated: true, messageTemplate: template`Security Scheme Type must be one of: ${'options'}`, class: OasUnknownSecuritySchemeTypeRule },
        { code: "SS-009",   name: "Unknown API Key Location", type: "Invalid Property Value", entity: "Security Scheme", versions: [ "2.0", "3.0" ], specMandated: true, messageTemplate: template`API Key Security Scheme must be located "in" one of: ${'options'}`, class: OasUnknownApiKeyLocationRule },
        { code: "SS-010",   name: "Unknown OAuth Flow Type", type: "Invalid Property Value", entity: "Security Scheme", versions: [ "2.0" ], specMandated: true, messageTemplate: template`OAuth Security Scheme "flow" must be one of: implicit, password, application, accessCode`, class: OasUnknownOauthFlowTypeRule },
        { code: "SREQ-002", name: "Security Requirement Scopes Must Be Empty", type: "Invalid Property Value", entity: "Security Requirement", versions: [ "2.0", "3.0" ], specMandated: true, messageTemplate: template`Security Requirement '${'sname'}' scopes must be an empty array because the referenced Security Definition not ${'options'}.`, class: OasSecurityRequirementScopesMustBeEmptyRule },
        { code: "SREQ-003", name: "Unexpected Security Requirement Scope(s)", type: "Invalid Property Value", entity: "Security Requirement", versions: [ "2.0" ], specMandated: true, messageTemplate: template`Security Requirement '${'sname'}' scopes must be an array of values from the possible scopes defined by the referenced Security Definition.`, class: OasUnexpectedSecurityRequirementScopesRule },
        { code: "ENC-001",  name: "Unexpected Usage of Headers (Multipart Media Type)", type: "Invalid Property Value", entity: "Encoding", versions: [ "3.0" ], specMandated: true, messageTemplate: template`Headers are not allowed for "${'name'}" media types.`, class: OasUnexpectedHeaderUsageRule },
        { code: "ENC-002",  name: "Encoding Style Not Allowed for Media Type", type: "Invalid Property Value", entity: "Encoding", versions: [ "3.0" ], specMandated: true, messageTemplate: template`Encoding Style is not allowed for "${'name'}" media types.`, class: OasEncodingStyleNotAllowedRule },
        { code: "ENC-003",  name: "'Explode' Not Allowed for Media Type", type: "Invalid Property Value", entity: "Encoding", versions: [ "3.0" ], specMandated: true, messageTemplate: template`"Explode" is not allowed for "${'name'}" media types.`, class: OasExplodeNotAllowedRule },
        { code: "ENC-004",  name: "'Allow Reserved' Not Allowed for Media Type", type: "Invalid Property Value", entity: "Encoding", versions: [ "3.0" ], specMandated: true, messageTemplate: template`"Allow Reserved" is not allowed for "${'name'}" media types.`, class: OasAllowReservedNotAllowedRule },
        { code: "ENC-005",  name: "Unknown Encoding Style", type: "Invalid Property Value", entity: "Encoding", versions: [ "3.0" ], specMandated: true, messageTemplate: template`Encoding Style is an invalid value.`, class: OasUnknownEncodingStyleRule },
        { code: "HEAD-010", name: "InvalidHeaderStyle", type: "Invalid Property Value", entity: "Header", versions: [ "3.0" ], specMandated: true, messageTemplate: template`Header Style must be "simple".`, class: OasInvalidHeaderStyleRule },
        { code: "HEAD-011", name: "Unexpected Number of Header Media Types", type: "Invalid Property Value", entity: "Header", versions: [ "3.0" ], specMandated: true, messageTemplate: template`Header content cannot have multiple media types.`, class: OasUnexpectedNumberOfHeaderMTsRule },
        { code: "LINK-002", name: "Invalid Link OperationID Reference", type: "Invalid Reference", entity: "Link", versions: [ "3.0" ], specMandated: true, messageTemplate: template`The Operation ID does not refer to an existing Operation.`, class: OasInvalidLinkOperationIdRule },
        { code: "MT-003",   name: "Invalid Encoding For Multi-Part Media Type", type: "Invalid Property Value", entity: "Media Type", versions: [ "3.0" ], specMandated: true, messageTemplate: template`Encoding is not allowed for "${'name'}" media types.`, class: OasInvalidEncodingForMPMTRule },
        { code: "OP-009",   name: "Unexpected Request Body", type: "Invalid Property Value", entity: "Operation", versions: [ "3.0" ], specMandated: true, messageTemplate: template`Request Body is not supported for ${'method'} operations.`, class: OasUnexpectedRequestBodyRule },
        { code: "OP-011",   name: "Missing Path Parameter Definition", type: "Invalid Property Value", entity: "Operation", versions: [ "3.0" ], specMandated: true, messageTemplate: template`No definition found for path variable "${'param'}" for path '${'path'}' and method '${'method'}'.`, class: OasMissingPathParamDefinitionRule },
        { code: "OP-013",   name: "Missing Response for Operation", type: "Invalid Property Value", entity: "Operation", versions: [ "3.0" ], specMandated: true, messageTemplate: template`Operation must have at least one Response.`, class: OasMissingResponseForOperationRule },
        { code: "PAR-022",  name: "Unknown Parameter Style", type: "Invalid Property Value", entity: "Parameter", versions: [ "3.0" ], specMandated: true, messageTemplate: template`Parameter Style must be one of: ["matrix", "label", "form", "simple", "spaceDelimited", "pipeDelimited", "deepObject"] (Found "${'style'}").`, class: OasUnknownParamStyleRule },
        { code: "PAR-023",  name: "Unknown Query Parameter Style", type: "Invalid Property Value", entity: "Parameter", versions: [ "3.0" ], specMandated: true, messageTemplate: template`Query Parameter Style must be one of: ["form", "spaceDelimited", "pipeDelimited", "deepObject"] (Found "${'style'}").`, class: OasUnknownQueryParamStyleRule },
        { code: "PAR-024",  name: "Unknown Cookie Parameter Style", type: "Invalid Property Value", entity: "Parameter", versions: [ "3.0" ], specMandated: true, messageTemplate: template`Cookie Parameter style must be "form". (Found "${'style'}")`, class: OasUnknownCookieParamStyleRule },
        { code: "PAR-025",  name: "Unknown Header Parameter Style", type: "Invalid Property Value", entity: "Parameter", versions: [ "3.0" ], specMandated: true, messageTemplate: template`Header Parameter Style must be "simple". (Found "${'style'}").`, class: OasUnknownHeaderParamStyleRule },
        { code: "PAR-027",  name: "Unknown Path Parameter Style", type: "Invalid Property Value", entity: "Parameter", versions: [ "3.0" ], specMandated: true, messageTemplate: template`Path Parameter Style must be one of: ["matrix", "label", "simple"]  (Found "${'style'}").`, class: OasUnknownPathParamStyleRule },
        { code: "PAR-028",  name: "'Allow Reserved' Not Allowed for Param", type: "Invalid Property Value", entity: "Parameter", versions: [ "3.0" ], specMandated: true, messageTemplate: template`Allow Reserved is only allowed for Query Parameters.`, class: OasAllowReservedNotAllowedForParamRule },
        { code: "PAR-029",  name: "Unexpected Number of Parameter Media Types", type: "Invalid Property Value", entity: "Parameter", versions: [ "3.0" ], specMandated: true, messageTemplate: template`Parameter content cannot have multiple media types.`, class: OasUnexpectedNumOfParamMTsRule },
        { code: "SCH-002",  name: "Unexpected Usage of Discriminator", type: "Invalid Property Value", entity: "Schema", versions: [ "3.0" ], specMandated: true, messageTemplate: template`Schema Discriminator is only allowed when using one of: ["oneOf", "anyOf", "allOf"]`, class: OasUnexpectedUsageOfDiscriminatorRule },
        { code: "SS-016",   name: "Invalid HTTP Security Scheme Type", type: "Invalid Property Value", entity: "Security Scheme", versions: [ "3.0" ], specMandated: true, messageTemplate: template`HTTP Security Scheme must be one of: ["basic", "bearer", "digest", "hoba", "mutual", "negotiate", "oauth", "vapid", "scram-sha-1", "scram-sha-256"] (Found: '${'scheme'}')`, class: OasInvalidHttpSecuritySchemeTypeRule },
        { code: "SS-017",   name: "Unexpected Usage of 'bearerFormat'", type: "Invalid Property Value", entity: "Security Scheme", versions: [ "3.0" ], specMandated: true, messageTemplate: template`Security Scheme "Bearer Format" only allowed for HTTP Bearer auth scheme.`, class: OasUnexpectedUsageOfBearerTokenRule },
        { code: "SREQ-004", name: "Invalid Security Requirement Scopes", type: "Invalid Property Value", entity: "Security Requirement", versions: [ "3.0" ], specMandated: true, messageTemplate: template`Value (scopes) for Security Requirement "${'name'}" must be an array.`, class: OasInvalidSecurityReqScopesRule },
        { code: "SVAR-003", name: "Server Variable Not Found in Template", type: "Invalid Property Value", entity: "XXX", versions: [ "3.0" ], specMandated: true, messageTemplate: template`Server Variable "${'name'}" is not found in the server url template.`, class: OasServerVarNotFoundInTemplateRule },
        /** Invalid Reference **/
        { code: "PAR-018",  name: "Invalid Parameter Reference", type: "Invalid Reference", entity: "Parameter", versions: [ "2.0", "3.0" ], specMandated: true, messageTemplate: template`Parameter Reference must refer to a valid Parameter Definition.`, class: OasInvalidParameterReferenceRule },
        { code: "PATH-001", name: "Invalid Path Item Reference", type: "Invalid Reference", entity: "Path Item", versions: [ "2.0", "3.0" ], specMandated: true, messageTemplate: template`Path Item Reference must refer to a valid Path Item Definition.`, class: OasInvalidPathItemReferenceRule },
        { code: "RES-002",  name: "Invalid Response Reference", type: "Invalid Reference", entity: "Response", versions: [ "2.0", "3.0" ], specMandated: true, messageTemplate: template`Response Reference must refer to a valid Response Definition.`, class: OasInvalidResponseReferenceRule },
        { code: "SCH-001",  name: "Invalid Schema Reference", type: "Invalid Reference", entity: "Schema", versions: [ "2.0", "3.0" ], specMandated: true, messageTemplate: template`Schema Reference must refer to a valid Schema Definition.`, class: OasInvalidSchemaReferenceRule },
        { code: "SREQ-001", name: "Invalid Security Requirement Name", type: "Invalid Reference", entity: "Security Requirement", versions: [ "2.0", "3.0" ], specMandated: true, messageTemplate: template`Security Requirement '${'name'}' must refer to a valid Security Scheme.`, class: OasInvalidSecurityRequirementNameRule },
        { code: "SS-018",   name: "Invalid Security Scheme Reference", type: "Invalid Reference", entity: "Security Scheme", versions: [ "3.0" ], specMandated: true, messageTemplate: template`Security Scheme Reference must refer to a valid Security Scheme Definition.`, class: OasInvalidSecuritySchemeReferenceRule },
        { code: "CALL-001", name: "Invalid Callback Reference", type: "Invalid Reference", entity: "Callback", versions: [ "3.0" ], specMandated: true, messageTemplate: template`Callback Reference must refer to a valid Callback Definition.`, class: OasInvalidCallbackReferenceRule },
        { code: "EX-003",   name: "Invalid Example Reference", type: "Invalid Reference", entity: "Example", versions: [ "3.0" ], specMandated: true, messageTemplate: template`Example Reference must refer to a valid Example Definition.`, class: OasInvalidExampleReferenceRule },
        { code: "HEAD-012", name: "Invalid Head Reference", type: "Invalid Reference", entity: "Header", versions: [ "3.0" ], specMandated: true, messageTemplate: template`Header Reference must refer to a valid Header Definition.`, class: OasInvalidHeaderReferenceRule },
        { code: "LINK-005", name: "Invalid Link Reference", type: "Invalid Reference", entity: "Link", versions: [ "3.0" ], specMandated: true, messageTemplate: template`Link Reference must refer to a valid Link Definition.`, class: OasInvalidLinkReferenceRule },
        { code: "LINK-003", name: "Invalid Link Operation Reference", type: "Invalid Reference", entity: "Link", versions: [ "3.0" ], specMandated: true, messageTemplate: template`Link "Operation Reference" must refer to a valid Operation Definition.`, class: OasInvalidLinkOperationReferenceRule },
        { code: "RB-003",   name: "Invalid Request Body Reference", type: "Invalid Reference", entity: "Request Body", versions: [ "3.0" ], specMandated: true, messageTemplate: template`Request Body Reference must refer to a valid Request Body Definition.`, class: OasInvalidRequestBodyReferenceRule },
        /** Mutual Exclusivity **/
        { code: "PATH-002", name: "Body and Form Data Params are Mutually Exclusive", type: "Mutual Exclusivity", entity: "Operation", versions: [ "2.0" ], specMandated: true, messageTemplate: template`Operation may not have both Body and Form Data parameters.`, class: OasBodyAndFormDataMutualExclusivityRule },
        { code: "EX-004", name: "Example Value and External Value are Mutually Exclusive", type: "Mutual Exclusivity", entity: "Example", versions: [ "3.0" ], specMandated: true, messageTemplate: template`Example "Value" and "External Value" are mutually exclusive.`, class: OasExampleValueMutualExclusivityRule },
        { code: "HEAD-013", name: "Header Example and Examples are Mutually Exclusive", type: "Mutual Exclusivity", entity: "Header", versions: [ "3.0" ], specMandated: true, messageTemplate: template`Header "Example" and "Examples" are mutually exclusive.`, class: OasHeaderExamplesMutualExclusivityRule },
        { code: "HEAD-014", name: "Header Schema and Content are Mutually Exclusive", type: "Mutual Exclusivity", entity: "Header", versions: [ "3.0" ], specMandated: true, messageTemplate: template`Header cannot have both a Schema and Content.`, class: OasHeaderSchemaContentMutualExclusivityRule },
        { code: "LINK-001", name: "Link Operation Ref and Operation ID are Mutually Exclusive", type: "Mutual Exclusivity", entity: "Link", versions: [ "3.0" ], specMandated: true, messageTemplate: template`Link Operation Reference and Operation ID cannot both be used.`, class: OasLinkOperationRefMutualExclusivityRule },
        { code: "MT-001", name: "Media Type Example and Examples are Mutually Exclusive", type: "Mutual Exclusivity", entity: "Media Type", versions: [ "3.0" ], specMandated: true, messageTemplate: template`Media Type "Example" and "Examples" are mutually exclusive.`, class: OasMediaTypeExamplesMutualExclusivityRule },
        { code: "PAR-030", name: "Parameter Schema and Content are Mutually Exclusive", type: "Mutual Exclusivity", entity: "Parameter", versions: [ "3.0" ], specMandated: true, messageTemplate: template`Parameter cannot have both a Schema and Content.`, class: OasParameterSchemaContentMutualExclusivityRule },
        { code: "PAR-031", name: "Parameter Example and Examples are Mutually Exclusive", type: "Mutual Exclusivity", entity: "Parameter", versions: [ "3.0" ], specMandated: true, messageTemplate: template`Parameter "Example" and "Examples" are mutually exclusive.`, class: OasParameterExamplesMutualExclusivityRule },
        /** Required Property **/
        { code: "R-001",    name: "Missing OpenAPI Property", type: "Required Property", entity: "API", versions: [ "2.0", "3.0" ], specMandated: true, messageTemplate: template`API is missing the 'openapi' property.`, class: OasMissingOpenApiPropertyRule },
        { code: "R-002",    name: "Missing API Information", type: "Required Property", entity: "API", versions: [ "2.0", "3.0" ], specMandated: true, messageTemplate: template`API is missing the 'info' property.`, class: OasMissingApiInformationRule },
        { code: "R-003",    name: "Missing API Paths", type: "Required Property", entity: "API", versions: [ "2.0", "3.0" ], specMandated: true, messageTemplate: template`API is missing the 'paths' property.`, class: OasMissingApiPathsRule },
        { code: "INF-001",  name: "Missing API Title", type: "Required Property", entity: "Info", versions: [ "2.0", "3.0" ], specMandated: true, messageTemplate: template`API is missing a title.`, class: OasMissingApiTitleRule },
        { code: "INF-002",  name: "Missing API Version", type: "Required Property", entity: "Info", versions: [ "2.0", "3.0" ], specMandated: true, messageTemplate: template`API is missing a version.`, class: OasMissingApiVersionRule },
        { code: "LIC-001",  name: "Missing License Name", type: "Required Property", entity: "License", versions: [ "2.0", "3.0" ], specMandated: true, messageTemplate: template`License is missing a name.`, class: OasMissingLicenseNameRule },
        { code: "OP-007",   name: "Missing Operation Responses", type: "Required Property", entity: "Operation", versions: [ "2.0", "3.0" ], specMandated: true, messageTemplate: template`Operation must have at least one response.`, class: OasMissingOperationResponsesRule },
        { code: "OP-008",   name: "Missing Operation ID", type: "Required Property", entity: "Operation", versions: [ "2.0", "3.0" ], specMandated: false, messageTemplate: template`Operation is missing a operation id.`, class: OasMissingOperationIdRule },
        { code: "ED-001",   name: "Missing External Documentation URL", type: "Required Property", entity: "External Documentation", versions: [ "2.0", "3.0" ], specMandated: true, messageTemplate: template`External Documentation is missing a URL.`, class: OasMissingExternalDocumentationUrlRule },
        { code: "PAR-001",  name: "Missing Parameter Name", type: "Required Property", entity: "Parameter", versions: [ "2.0", "3.0" ], specMandated: true, messageTemplate: template`Parameter is missing a name.`, class: OasMissingParameterNameRule },
        { code: "PAR-002",  name: "Missing Parameter Location", type: "Required Property", entity: "Parameter", versions: [ "2.0", "3.0" ], specMandated: true, messageTemplate: template`Parameter is missing a location (Query, Header, etc).`, class: OasMissingParameterLocationRule },
        { code: "PAR-003",  name: "Path Parameters Must Be Required", type: "Required Property", entity: "Parameter", versions: [ "2.0", "3.0" ], specMandated: true, messageTemplate: template`Path Parameter "${'name'}" must be marked as required.`, class: OasPathParamsMustBeRequiredRule },
        { code: "PAR-004",  name: "Missing Body Parameter Schema", type: "Required Property", entity: "Parameter", versions: [ "2.0" ], specMandated: true, messageTemplate: template`Body Parameters must have a schema defined.`, class: OasMissingBodyParameterSchemaRule },
        { code: "PAR-005",  name: "Missing Parameter Type", type: "Required Property", entity: "Parameter", versions: [ "2.0" ], specMandated: true, messageTemplate: template`Parameter '${'name'}' is missing a type.`, class: OasMissingParameterTypeRule },
        { code: "PAR-006",  name: "Missing Parameter Array Type", type: "Required Property", entity: "Parameter", versions: [ "2.0" ], specMandated: true, messageTemplate: template`Parameter '${'name'}' marked as array but no array type provided.`, class: OasMissingParameterArrayTypeRule },
        { code: "IT-001",   name: "Missing Items Type", type: "Required Property", entity: "Items", versions: [ "2.0" ], specMandated: true, messageTemplate: template`Type information is missing for array items.`, class: OasMissingItemsTypeRule },
        { code: "IT-002",   name: "Missing Items Array Information", type: "Required Property", entity: "Items", versions: [ "2.0" ], specMandated: true, messageTemplate: template`Type information missing for array items.`, class: OasMissingItemsArrayInformationRule },
        { code: "RES-001",  name: "Missing Response Description", type: "Required Property", entity: "Response", versions: [ "2.0", "3.0" ], specMandated: true, messageTemplate: template`Response (code ${'statusCode'}) is missing a description.`, class: OasMissingResponseDescriptionRule },
        { code: "HEAD-001", name: "Missing Header Type", type: "Required Property", entity: "Header", versions: [ "2.0" ], specMandated: true, messageTemplate: template`Header is missing array type information.`, class: OasMissingHeaderTypeRule },
        { code: "HEAD-002", name: "Missing Header Array Information", type: "Required Property", entity: "Header", versions: [ "2.0" ], specMandated: true, messageTemplate: template`Header is missing array type information.`, class: OasMissingHeaderArrayInformationRule },
        { code: "TAG-001",  name: "Missing Tag Name", type: "Required Property", entity: "Tag", versions: [ "2.0", "3.0" ], specMandated: true, messageTemplate: template`Tag is missing a name.`, class: OasMissingTagNameRule },
        { code: "SS-001",   name: "Missing Security Scheme Type", type: "Required Property", entity: "Security Scheme", versions: [ "2.0", "3.0" ], specMandated: true, messageTemplate: template`Security Scheme is missing a type.`, class: OasMissingSecuritySchemeTypeRule },
        { code: "SS-002",   name: "Missing API-Key Scheme Parameter Name", type: "Required Property", entity: "Security Scheme", versions: [ "2.0", "3.0" ], specMandated: true, messageTemplate: template`API Key Security Scheme is missing a parameter name (e.g. name of a header or query param).`, class: OasMissingApiKeySchemeParamNameRule },
        { code: "SS-003",   name: "Missing API-Key Scheme Parameter Location", type: "Required Property", entity: "Security Scheme", versions: [ "2.0", "3.0" ], specMandated: true, messageTemplate: template`API Key Security Scheme must describe where the Key can be found (e.g. header, query param, etc).`, class: OasMissingApiKeySchemeParamLocationRule },
        { code: "SS-004",   name: "Missing OAuth Scheme Flow Type", type: "Required Property", entity: "Security Scheme", versions: [ "2.0" ], specMandated: true, messageTemplate: template`OAuth Security Scheme is missing a flow type.`, class: OasMissingOAuthSchemeFlowTypeRule },
        { code: "SS-005",   name: "Missing OAuth Scheme Auth URL", type: "Required Property", entity: "Security Scheme", versions: [ "2.0" ], specMandated: true, messageTemplate: template`OAuth Security Scheme is missing an Authorization URL.`, class: OasMissingOAuthSchemeAuthUrlRule },
        { code: "SS-006",   name: "Missing OAuth Scheme Token URL", type: "Required Property", entity: "Security Scheme", versions: [ "2.0" ], specMandated: true, messageTemplate: template`OAuth Security Scheme is missing a Token URL.`, class: OasMissingOAuthSchemeTokenUrlRule },
        { code: "SS-007",   name: "Missing OAuth Scheme Scopes", type: "Required Property", entity: "Security Scheme", versions: [ "2.0" ], specMandated: true, messageTemplate: template`OAuth Security Scheme is missing defined scopes.`, class: OasMissingOAuthSchemeScopesRule },
        { code: "DISC-001", name: "Missing a Discriminator Property Name", type: "Required Property", entity: "Discriminator", versions: [ "3.0" ], specMandated: true, messageTemplate: template`Discriminator must indicate a property (by name).`, class: OasMissingDiscriminatorPropertyNameRule },
        { code: "FLOW-006", name: "Missing OAuth Flow Scopes", type: "Required Property", entity: "OAuth Flow", versions: [ "3.0" ], specMandated: true, messageTemplate: template`OAuth Flow is missing defined scopes.`, class: OasMissingOAuthFlowScopesRule },
        { code: "FLOW-001", name: "Missing OAuth Flow Authorization URL", type: "Required Property", entity: "OAuth Flow", versions: [ "3.0" ], specMandated: true, messageTemplate: template`${'flowType'} OAuth Flow is missing an Authorization URL.`, class: OasMissingOAuthFlowAuthUrlRule },
        { code: "FLOW-002", name: "Missing OAuth Flow Token URL", type: "Required Property", entity: "OAuth Flow", versions: [ "3.0" ], specMandated: true, messageTemplate: template`${'flowType'} OAuth Flow is missing a Token URL.`, class: OasMissingOAuthFlowRokenUrlRule },
        { code: "RB-002",   name: "Missing Request Body Content", type: "Required Property", entity: "Request Body", versions: [ "3.0" ], specMandated: true, messageTemplate: template`Request Body content is missing.`, class: OasMissingRequestBodyContentRule },
        { code: "SRV-001",  name: "Missing Server Template URL", type: "Required Property", entity: "Server", versions: [ "3.0" ], specMandated: true, messageTemplate: template`Server is missing a template URL.`, class: OasMissingServerTemplateUrlRule },
        { code: "SS-019",   name: "Missing HTTP Security Scheme Style", type: "Required Property", entity: "Security Scheme", versions: [ "3.0" ], specMandated: true, messageTemplate: template`HTTP Security Scheme is missing a scheme (Basic, Digest, etc).`, class: OasMissingHttpSecuritySchemeTypeRule },
        { code: "SS-020",   name: "Missing OAuth Security Scheme Flows", type: "Required Property", entity: "Security Scheme", versions: [ "3.0" ], specMandated: true, messageTemplate: template`OAuth Security Scheme does not define any OAuth flows.`, class: OasMissingOAuthSecuritySchemeFlowsRule },
        { code: "SS-021",   name: "Missing OID Connect Security Scheme Connect URL", type: "Required Property", entity: "Security Scheme", versions: [ "3.0" ], specMandated: true, messageTemplate: template`OpenID Connect Security Scheme is missing a Connect URL.`, class: OasMissingOpenIdConnectSecuritySchemeConnectUrlRule },
        { code: "SVAR-001", name: "Missing Server Variable Default Value", type: "Required Property", entity: "Server Variable", versions: [ "3.0" ], specMandated: true, messageTemplate: template`Server Variable "${'name'}" is missing a default value.`, class: OasMissingServerVarDefaultValueRule },
        /** Ignored Property **/
        { code: "HEAD-008", name: "Ignored Content-Type Header", type: "Ignored Property", entity: "Header", versions: [ "3.0" ], specMandated: true, messageTemplate: template`The "Content-Type" header will be ignored.`, class: OasIgnoredContentTypeHeaderRule },
        { code: "PAR-021",  name: "Ignored Header Parameter", type: "Ignored Property", entity: "Parameter", versions: [ "3.0" ], specMandated: true, messageTemplate: template`The "${'name'}" header parameter will be ignored.`, class: OasIgnoredHeaderParameterRule },
        /** Invalid Property Type **/
        { code: "SCH-003",  name: "Invalid Schema Type Value", type: "Invalid Property Type", entity: "Schema", versions: [ "3.0" ], specMandated: true, messageTemplate: template`Schema type value of "${'type'}" is not allowed.  Must be one of: [${'allowedTypes'}]`, class: OasInvalidSchemaTypeValueRule },
        { code: "SCH-004",  name: "Invalid Schema Array Items", type: "Invalid Property Type", entity: "Schema", versions: [ "3.0" ], specMandated: true, messageTemplate: template`Schema items must be present only for schemas of type 'array'.`, class: OasInvalidSchemaArrayItemsRule },
    ];

    /**
     * C'tor.
     */
    public constructor() {
        this.validateRuleData();
    }

    /**
     * Verify that there are no duplicate codes in the set of rules.
     */
    private validateRuleData(): void {
        let codes: any = {};
        let names: any = {};
        this._rules.forEach( rule => {
            if (codes[rule.code]) {
                throw new Error("Duplicate rule code found: " + rule.code);
            } else {
                codes[rule.code] = rule.name;
            }
            if (names[rule.name]) {
                throw new Error("Duplicate rule name found: " + rule.name);
            } else {
                names[rule.name] = rule.code;
            }
        })

    }

    /**
     * Gets all of the registered rules.
     */
    public getAllRules(): ValidationRuleMetaData[] {
        return this._rules;
    }

    /**
     * Gets the actual rule instances (visitors) that should be applied to the given document.
     * @param document
     */
    public getRulesFor(document: OasDocument): OasValidationRule[] {
        let version: string = "2.0";
        if (document.is3xDocument()) {
            version = "3.0";
        }
        return this._rules.filter( rule => {
            return rule.versions.indexOf(version) != -1;
        }).map( rule => {
            return new rule.class(rule);
        });
    }

}
