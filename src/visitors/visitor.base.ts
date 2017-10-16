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

import {OasDocument} from "../models/document.model";
import {OasExtension} from "../models/extension.model";
import {Oas20Parameter, Oas20ParameterDefinition} from "../models/2.0/parameter.model";
import {Oas20Response, Oas20ResponseDefinition} from "../models/2.0/response.model";
import {
    Oas20AdditionalPropertiesSchema,
    Oas20AllOfSchema,
    Oas20ItemsSchema,
    Oas20PropertySchema,
    Oas20SchemaDefinition
} from "../models/2.0/schema.model";
import {Oas20Example} from "../models/2.0/example.model";
import {Oas20Items} from "../models/2.0/items.model";
import {IOas20NodeVisitor, IOas30NodeVisitor, IOasNodeVisitor} from "./visitor.iface";
import {Oas20SecurityDefinitions} from "../models/2.0/security-definitions.model";
import {Oas20SecurityScheme} from "../models/2.0/security-scheme.model";
import {Oas20Scopes} from "../models/2.0/scopes.model";
import {Oas20Definitions} from "../models/2.0/definitions.model";
import {Oas20ParametersDefinitions} from "../models/2.0/parameters-definitions.model";
import {Oas20ResponsesDefinitions} from "../models/2.0/responses-definitions.model";
import {OasNode} from "../models/node.model";
import {OasInfo} from "../models/common/info.model";
import {OasContact} from "../models/common/contact.model";
import {OasLicense} from "../models/common/license.model";
import {Oas30ServerVariable} from "../models/3.0/server-variable.model";
import {Oas30LinkServer, Oas30Server} from "../models/3.0/server.model";
import {OasTag} from "../models/common/tag.model";
import {OasSecurityRequirement} from "../models/common/security-requirement.model";
import {OasExternalDocumentation} from "../models/common/external-documentation.model";
import {OasPaths} from "../models/common/paths.model";
import {OasPathItem} from "../models/common/path-item.model";
import {OasOperation} from "../models/common/operation.model";
import {OasResponses} from "../models/common/responses.model";
import {OasSchema} from "../models/common/schema.model";
import {OasHeader} from "../models/common/header.model";
import {OasXML} from "../models/common/xml.model";
import {Oas30Parameter, Oas30ParameterDefinition} from "../models/3.0/parameter.model";
import {Oas30Response, Oas30ResponseDefinition} from "../models/3.0/response.model";
import {Oas30RequestBody, Oas30RequestBodyDefinition} from "../models/3.0/request-body.model";
import {
    Oas30AdditionalPropertiesSchema,
    Oas30AllOfSchema,
    Oas30AnyOfSchema,
    Oas30ItemsSchema,
    Oas30NotSchema,
    Oas30OneOfSchema,
    Oas30PropertySchema,
    Oas30SchemaDefinition
} from "../models/3.0/schema.model";
import {Oas30MediaType} from "../models/3.0/media-type.model";
import {Oas30Encoding} from "../models/3.0/encoding.model";
import {Oas30Example, Oas30ExampleDefinition} from "../models/3.0/example.model";
import {Oas30Link, Oas30LinkDefinition} from "../models/3.0/link.model";
import {Oas30LinkParameterExpression} from "../models/3.0/link-parameter-expression.model";
import {Oas30Callback, Oas30CallbackDefinition} from "../models/3.0/callback.model";
import {Oas30CallbackPathItem} from "../models/3.0/path-item.model";
import {Oas30Components} from "../models/3.0/components.model";
import {Oas30HeaderDefinition} from "../models/3.0/header.model";
import {Oas30OAuthFlows} from "../models/3.0/oauth-flows.model";
import {
    Oas30AuthorizationCodeOAuthFlow,
    Oas30ClientCredentialsOAuthFlow, Oas30ImplicitOAuthFlow,
    Oas30PasswordOAuthFlow
} from "../models/3.0/oauth-flow.model";
import {OasSecurityScheme} from "../models/common/security-scheme.model";
import {Oas20Headers} from "../models/2.0/headers.model";
import {Oas30LinkRequestBodyExpression} from "../models/3.0/link-request-body-expression.model";
import {Oas30Discriminator} from "../models/3.0/discriminator.model";


/**
 * Base class for node visitors that are only interested in a subset of the node types
 * that might be visited.  Extending this class means that subclasses can only override
 * the subset of methods desired.
 */
export abstract class OasNodeVisitorAdapter implements IOasNodeVisitor {
    public visitDocument(node: OasDocument) {}
    public visitInfo(node: OasInfo): void {}
    public visitContact(node: OasContact): void {}
    public visitLicense(node: OasLicense): void {}
    public visitPaths(node: OasPaths): void {}
    public visitPathItem(node: OasPathItem): void {}
    public visitResponses(node: OasResponses): void {}
    public visitSchema(node: OasSchema): void {}
    public visitHeader(node: OasHeader): void {}
    public visitOperation(node: OasOperation): void {}
    public visitXML(node: OasXML): void {}
    public visitSecurityScheme(node: OasSecurityScheme): void {}
    public visitSecurityRequirement(node: OasSecurityRequirement): void {}
    public visitTag(node: OasTag): void {}
    public visitExternalDocumentation(node: OasExternalDocumentation): void {}
    public visitExtension(node: OasExtension) {}
}


/**
 * Base class for OAS 2.0 node visitors that are only interested in a subset of the node types
 * that might be visited.  Extending this class means that subclasses can only override
 * the subset of methods desired.
 */
export class Oas20NodeVisitorAdapter extends OasNodeVisitorAdapter implements IOas20NodeVisitor {
    public visitParameter(node: Oas20Parameter): void {}
    public visitParameterDefinition(node: Oas20ParameterDefinition): void {}
    public visitResponse(node: Oas20Response): void {}
    public visitHeaders(node: Oas20Headers): void {}
    public visitResponseDefinition(node: Oas20ResponseDefinition): void {}
    public visitExample(node: Oas20Example): void {}
    public visitItems(node: Oas20Items): void {}
    public visitSecurityDefinitions(node: Oas20SecurityDefinitions): void {}
    public visitSecurityScheme(node: Oas20SecurityScheme): void {}
    public visitScopes(node: Oas20Scopes): void {}
    public visitPropertySchema(node: Oas20PropertySchema): void {}
    public visitAdditionalPropertiesSchema(node: Oas20AdditionalPropertiesSchema): void {}
    public visitItemsSchema(node: Oas20ItemsSchema): void {}
    public visitAllOfSchema(node: Oas20AllOfSchema): void {}
    public visitSchemaDefinition(node: Oas20SchemaDefinition): void {}
    public visitDefinitions(node: Oas20Definitions): void {}
    public visitParametersDefinitions(node: Oas20ParametersDefinitions): void {}
    public visitResponsesDefinitions(node: Oas20ResponsesDefinitions): void {}
}


/**
 * Base class for OAS 3.0 node visitors that are only interested in a subset of the node types
 * that might be visited.  Extending this class means that subclasses can only override
 * the subset of methods desired.
 */
export class Oas30NodeVisitorAdapter extends OasNodeVisitorAdapter implements IOas30NodeVisitor {
    public visitParameter(node: Oas30Parameter): void {}
    public visitParameterDefinition(node: Oas30ParameterDefinition): void {}
    public visitResponse(node: Oas30Response): void {}
    public visitLink(node: Oas30Link): void {}
    public visitLinkParameterExpression(node: Oas30LinkParameterExpression): void {}
    public visitLinkRequestBodyExpression(node: Oas30LinkRequestBodyExpression): void {}
    public visitLinkServer(node: Oas30LinkServer): void {}
    public visitResponseDefinition(node: Oas30ResponseDefinition): void {}
    public visitRequestBody(node: Oas30RequestBody): void {}
    public visitMediaType(node: Oas30MediaType): void {}
    public visitExample(node: Oas30Example): void {}
    public visitEncoding(node: Oas30Encoding): void {}
    public visitCallback(node: Oas30Callback): void {}
    public visitCallbackPathItem(node: Oas30CallbackPathItem): void {}
    public visitAllOfSchema(node: Oas30AllOfSchema): void {}
    public visitAnyOfSchema(node: Oas30AnyOfSchema): void {}
    public visitOneOfSchema(node: Oas30OneOfSchema): void {}
    public visitNotSchema(node: Oas30NotSchema): void {}
    public visitPropertySchema(node: Oas30PropertySchema): void {}
    public visitItemsSchema(node: Oas30ItemsSchema): void {}
    public visitAdditionalPropertiesSchema(node: Oas30AdditionalPropertiesSchema): void {}
    public visitComponents(node: Oas30Components): void {}
    public visitExampleDefinition(node: Oas30ExampleDefinition): void {}
    public visitRequestBodyDefinition(node: Oas30RequestBodyDefinition): void {}
    public visitHeaderDefinition(node: Oas30HeaderDefinition): void {}
    public visitOAuthFlows(node: Oas30OAuthFlows): void {}
    public visitImplicitOAuthFlow(node: Oas30ImplicitOAuthFlow): void {}
    public visitPasswordOAuthFlow(node: Oas30PasswordOAuthFlow): void {}
    public visitClientCredentialsOAuthFlow(node: Oas30ClientCredentialsOAuthFlow): void {}
    public visitAuthorizationCodeOAuthFlow(node: Oas30AuthorizationCodeOAuthFlow): void {}
    public visitLinkDefinition(node: Oas30LinkDefinition): void {}
    public visitCallbackDefinition(node: Oas30CallbackDefinition): void {}
    public visitSchemaDefinition(node: Oas30SchemaDefinition): void {}
    public visitServer(node: Oas30Server): void {}
    public visitServerVariable(node: Oas30ServerVariable): void {}
    public visitDiscriminator(node: Oas30Discriminator): void {}
}


/**
 * A composite visitor - this class makes it easy to apply multiple visitors to
 * a node at the same time.  It's basically just an array of visitors.
 */
export abstract class OasCompositeVisitor implements IOasNodeVisitor {

    private _visitors: IOasNodeVisitor[];

    /**
     * Constructor.
     * @param visitors
     */
    constructor(visitors: IOasNodeVisitor[]) {
        this._visitors = visitors;
    }

    /**
     * Adds a single visitor to the list.
     * @param visitor
     */
    public addVisitor(visitor: IOasNodeVisitor): void {
        this._visitors.push(visitor);
    }

    /**
     * Adds multiple visitors to the list.
     * @param visitors
     */
    public addVisitors(visitors: IOasNodeVisitor[]): void {
        for (let visitor of visitors) {
            this._visitors.push(visitor);
        }
    }

    /**
     * Called to accept all of the visitors contained by this composite.  This basically
     * iterates through all the visitors and calls node.accept(visitor) on each.
     * @param node
     * @private
     */
    protected _acceptAll(node: OasNode): void {
        this._visitors.every((visitor) => {
            node.accept(visitor);
            return true;
        });
    }

    public visitDocument(node: OasDocument): void { this._acceptAll(node); }
    public visitInfo(node: OasInfo): void { this._acceptAll(node); }
    public visitContact(node: OasContact): void { this._acceptAll(node); }
    public visitLicense(node: OasLicense): void { this._acceptAll(node); }
    public visitPaths(node: OasPaths): void { this._acceptAll(node); }
    public visitPathItem(node: OasPathItem): void { this._acceptAll(node); }
    public visitOperation(node: OasOperation): void { this._acceptAll(node); }
    public visitResponses(node: OasResponses): void { this._acceptAll(node); }
    public visitSchema(node: OasSchema): void { this._acceptAll(node); }
    public visitHeader(node: OasHeader): void { this._acceptAll(node); }
    public visitXML(node: OasXML): void { this._acceptAll(node); }
    public visitSecurityScheme(node: OasSecurityScheme): void { this._acceptAll(node); }
    public visitSecurityRequirement(node: OasSecurityRequirement): void { this._acceptAll(node); }
    public visitTag(node: OasTag): void { this._acceptAll(node); }
    public visitExternalDocumentation(node: OasExternalDocumentation): void { this._acceptAll(node); }
    public visitExtension(node: OasExtension): void { this._acceptAll(node); }

}

/**
 * A composite visitor - this class makes it easy to apply multiple visitors to
 * a node at the same time.  It's basically just an array of visitors.
 */
export class Oas20CompositeVisitor extends OasCompositeVisitor implements IOas20NodeVisitor {

    /**
     * Constructor.
     * @param visitors
     */
    constructor(...visitors: IOas20NodeVisitor[]) {
        super(visitors);
    }

    public visitParameter(node: Oas20Parameter): void { this._acceptAll(node); }
    public visitParameterDefinition(node: Oas20ParameterDefinition): void { this._acceptAll(node); }
    public visitResponse(node: Oas20Response): void { this._acceptAll(node); }
    public visitHeaders(node: Oas20Headers): void { this._acceptAll(node); }
    public visitResponseDefinition(node: Oas20ResponseDefinition): void { this._acceptAll(node); }
    public visitExample(node: Oas20Example): void { this._acceptAll(node); }
    public visitItems(node: Oas20Items): void { this._acceptAll(node); }
    public visitSecurityDefinitions(node: Oas20SecurityDefinitions): void { this._acceptAll(node); }
    public visitSecurityScheme(node: Oas20SecurityScheme): void { this._acceptAll(node); }
    public visitScopes(node: Oas20Scopes): void { this._acceptAll(node); }
    public visitSchemaDefinition(node: Oas20SchemaDefinition): void { this._acceptAll(node); }
    public visitPropertySchema(node: Oas20PropertySchema): void { this._acceptAll(node); }
    public visitAdditionalPropertiesSchema(node: Oas20AdditionalPropertiesSchema): void { this._acceptAll(node); }
    public visitAllOfSchema(node: Oas20AllOfSchema): void { this._acceptAll(node); }
    public visitItemsSchema(node: Oas20ItemsSchema): void { this._acceptAll(node); }
    public visitDefinitions(node: Oas20Definitions): void { this._acceptAll(node); }
    public visitParametersDefinitions(node: Oas20ParametersDefinitions): void { this._acceptAll(node); }
    public visitResponsesDefinitions(node: Oas20ResponsesDefinitions): void { this._acceptAll(node); }

}


/**
 * A composite visitor - this class makes it easy to apply multiple visitors to
 * a node at the same time.  It's basically just an array of visitors.
 */
export class Oas30CompositeVisitor extends OasCompositeVisitor implements IOas30NodeVisitor {

    /**
     * Constructor.
     * @param visitors
     */
    constructor(...visitors: IOas30NodeVisitor[]) {
        super(visitors);
    }

    public visitParameter(node: Oas30Parameter): void { this._acceptAll(node); }
    public visitParameterDefinition(node: Oas30ParameterDefinition): void { this._acceptAll(node); }
    public visitResponse(node: Oas30Response): void { this._acceptAll(node); }
    public visitLink(node: Oas30Link): void { this._acceptAll(node); }
    public visitLinkParameterExpression(node: Oas30LinkParameterExpression): void { this._acceptAll(node); }
    public visitLinkRequestBodyExpression(node: Oas30LinkRequestBodyExpression): void { this._acceptAll(node); }
    public visitLinkServer(node: Oas30LinkServer): void { this._acceptAll(node); }
    public visitResponseDefinition(node: Oas30ResponseDefinition): void { this._acceptAll(node); }
    public visitRequestBody(node: Oas30RequestBody): void { this._acceptAll(node); }
    public visitCallback(node: Oas30Callback): void { this._acceptAll(node); }
    public visitCallbackPathItem(node: Oas30CallbackPathItem): void { this._acceptAll(node); }
    public visitMediaType(node: Oas30MediaType): void { this._acceptAll(node); }
    public visitExample(node: Oas30Example): void { this._acceptAll(node); }
    public visitEncoding(node: Oas30Encoding): void { this._acceptAll(node); }
    public visitAllOfSchema(node: Oas30AllOfSchema): void { this._acceptAll(node); }
    public visitAnyOfSchema(node: Oas30AnyOfSchema): void { this._acceptAll(node); }
    public visitOneOfSchema(node: Oas30OneOfSchema): void { this._acceptAll(node); }
    public visitNotSchema(node: Oas30NotSchema): void { this._acceptAll(node); }
    public visitPropertySchema(node: Oas30PropertySchema): void { this._acceptAll(node); }
    public visitItemsSchema(node: Oas30ItemsSchema): void { this._acceptAll(node); }
    public visitAdditionalPropertiesSchema(node: Oas30AdditionalPropertiesSchema): void { this._acceptAll(node); }
    public visitDiscriminator(node: Oas30Discriminator): void { this._acceptAll(node); }
    public visitComponents(node: Oas30Components): void { this._acceptAll(node); }
    public visitExampleDefinition(node: Oas30ExampleDefinition): void { this._acceptAll(node); }
    public visitRequestBodyDefinition(node: Oas30RequestBodyDefinition): void { this._acceptAll(node); }
    public visitHeaderDefinition(node: Oas30HeaderDefinition): void { this._acceptAll(node); }
    public visitOAuthFlows(node: Oas30OAuthFlows): void { this._acceptAll(node); }
    public visitImplicitOAuthFlow(node: Oas30ImplicitOAuthFlow): void { this._acceptAll(node); }
    public visitPasswordOAuthFlow(node: Oas30PasswordOAuthFlow): void { this._acceptAll(node); }
    public visitClientCredentialsOAuthFlow(node: Oas30ClientCredentialsOAuthFlow): void { this._acceptAll(node); }
    public visitAuthorizationCodeOAuthFlow(node: Oas30AuthorizationCodeOAuthFlow): void { this._acceptAll(node); }
    public visitLinkDefinition(node: Oas30LinkDefinition): void { this._acceptAll(node); }
    public visitCallbackDefinition(node: Oas30CallbackDefinition): void { this._acceptAll(node); }
    public visitSchemaDefinition(node: Oas30SchemaDefinition): void { this._acceptAll(node); }
    public visitServer(node: Oas30Server): void { this._acceptAll(node); }
    public visitServerVariable(node: Oas30ServerVariable): void { this._acceptAll(node); }

}


export class OasCombinedVisitorAdapter implements IOas20NodeVisitor, IOas30NodeVisitor {
    visitDocument(node: OasDocument): void {}
    visitInfo(node: OasInfo): void {}
    visitContact(node: OasContact): void {}
    visitLicense(node: OasLicense): void {}
    visitPaths(node: OasPaths): void {}
    visitPathItem(node: OasPathItem): void {}
    visitOperation(node: OasOperation): void {}
    visitParameter(node: Oas20Parameter | Oas30Parameter): void {}
    visitParameterDefinition(node: Oas20ParameterDefinition | Oas30ParameterDefinition): void {}
    visitExternalDocumentation(node: OasExternalDocumentation): void {}
    visitSecurityRequirement(node: OasSecurityRequirement): void {}
    visitResponses(node: OasResponses): void {}
    visitResponse(node: Oas20Response | Oas30Response): void {}
    visitResponseDefinition(node: Oas20ResponseDefinition | Oas30ResponseDefinition): void {}
    visitSchema(node: OasSchema): void {}
    visitHeaders(node: Oas20Headers): void {}
    visitHeader(node: OasHeader): void {}
    visitExample(node: Oas20Example | Oas30Example): void {}
    visitItems(node: Oas20Items): void {}
    visitTag(node: OasTag): void {}
    visitSecurityDefinitions(node: Oas20SecurityDefinitions): void {}
    visitSecurityScheme(node: OasSecurityScheme): void {}
    visitScopes(node: Oas20Scopes): void {}
    visitXML(node: OasXML): void {}
    visitSchemaDefinition(node: Oas20SchemaDefinition | Oas30SchemaDefinition): void {}
    visitPropertySchema(node: Oas20PropertySchema | Oas30PropertySchema): void {}
    visitAdditionalPropertiesSchema(node: Oas20AdditionalPropertiesSchema | Oas30AdditionalPropertiesSchema): void {}
    visitAllOfSchema(node: Oas20AllOfSchema | Oas30AllOfSchema): void {}
    visitItemsSchema(node: Oas20ItemsSchema | Oas30ItemsSchema): void {}
    visitDefinitions(node: Oas20Definitions): void {}
    visitParametersDefinitions(node: Oas20ParametersDefinitions): void {}
    visitResponsesDefinitions(node: Oas20ResponsesDefinitions): void {}
    visitExtension(node: OasExtension): void {}
    visitMediaType(node: Oas30MediaType): void {}
    visitEncoding(node: Oas30Encoding): void {}
    visitLink(node: Oas30Link): void {}
    visitLinkParameterExpression(node: Oas30LinkParameterExpression): void {}
    visitLinkRequestBodyExpression(node: Oas30LinkRequestBodyExpression): void {}
    visitLinkServer(node: Oas30LinkServer): void {}
    visitRequestBody(node: Oas30RequestBody): void {}
    visitCallback(node: Oas30Callback): void {}
    visitCallbackPathItem(node: Oas30CallbackPathItem): void {}
    visitServer(node: Oas30Server): void {}
    visitServerVariable(node: Oas30ServerVariable): void {}
    visitAnyOfSchema(node: Oas30AnyOfSchema): void {}
    visitOneOfSchema(node: Oas30OneOfSchema): void {}
    visitNotSchema(node: Oas30NotSchema): void {}
    visitComponents(node: Oas30Components): void {}
    visitExampleDefinition(node: Oas30ExampleDefinition): void {}
    visitRequestBodyDefinition(node: Oas30RequestBodyDefinition): void {}
    visitHeaderDefinition(node: Oas30HeaderDefinition): void {}
    visitOAuthFlows(node: Oas30OAuthFlows): void {}
    visitImplicitOAuthFlow(node: Oas30ImplicitOAuthFlow): void {}
    visitPasswordOAuthFlow(node: Oas30PasswordOAuthFlow): void {}
    visitClientCredentialsOAuthFlow(node: Oas30ClientCredentialsOAuthFlow): void {}
    visitAuthorizationCodeOAuthFlow(node: Oas30AuthorizationCodeOAuthFlow): void {}
    visitLinkDefinition(node: Oas30LinkDefinition): void {}
    visitCallbackDefinition(node: Oas30CallbackDefinition): void {}
    visitDiscriminator(node: Oas30Discriminator): void {}
}


/**
 * Base class for visitors that simply want to get called for *every* node
 * in the model.
 */
export abstract class OasAllNodeVisitor extends OasCombinedVisitorAdapter {

    protected abstract doVisitNode(node: OasNode): void;

    visitDocument(node: OasDocument): void { this.doVisitNode(node); }
    visitInfo(node: OasInfo): void { this.doVisitNode(node); }
    visitContact(node: OasContact): void { this.doVisitNode(node); }
    visitLicense(node: OasLicense): void { this.doVisitNode(node); }
    visitPaths(node: OasPaths): void { this.doVisitNode(node); }
    visitPathItem(node: OasPathItem): void { this.doVisitNode(node); }
    visitOperation(node: OasOperation): void { this.doVisitNode(node); }
    visitParameter(node: Oas20Parameter | Oas30Parameter): void { this.doVisitNode(node); }
    visitParameterDefinition(node: Oas20ParameterDefinition | Oas30ParameterDefinition): void { this.doVisitNode(node); }
    visitExternalDocumentation(node: OasExternalDocumentation): void { this.doVisitNode(node); }
    visitSecurityRequirement(node: OasSecurityRequirement): void { this.doVisitNode(node); }
    visitResponses(node: OasResponses): void { this.doVisitNode(node); }
    visitResponse(node: Oas20Response | Oas30Response): void { this.doVisitNode(node); }
    visitResponseDefinition(node: Oas20ResponseDefinition | Oas30ResponseDefinition): void { this.doVisitNode(node); }
    visitSchema(node: OasSchema): void { this.doVisitNode(node); }
    visitHeaders(node: Oas20Headers): void { this.doVisitNode(node); }
    visitHeader(node: OasHeader): void { this.doVisitNode(node); }
    visitExample(node: Oas20Example | Oas30Example): void { this.doVisitNode(node); }
    visitItems(node: Oas20Items): void { this.doVisitNode(node); }
    visitTag(node: OasTag): void { this.doVisitNode(node); }
    visitSecurityDefinitions(node: Oas20SecurityDefinitions): void { this.doVisitNode(node); }
    visitSecurityScheme(node: OasSecurityScheme): void { this.doVisitNode(node); }
    visitScopes(node: Oas20Scopes): void { this.doVisitNode(node); }
    visitXML(node: OasXML): void { this.doVisitNode(node); }
    visitSchemaDefinition(node: Oas20SchemaDefinition | Oas30SchemaDefinition): void { this.doVisitNode(node); }
    visitPropertySchema(node: Oas20PropertySchema | Oas30PropertySchema): void { this.doVisitNode(node); }
    visitAdditionalPropertiesSchema(node: Oas20AdditionalPropertiesSchema | Oas30AdditionalPropertiesSchema): void { this.doVisitNode(node); }
    visitAllOfSchema(node: Oas20AllOfSchema | Oas30AllOfSchema): void { this.doVisitNode(node); }
    visitItemsSchema(node: Oas20ItemsSchema | Oas30ItemsSchema): void { this.doVisitNode(node); }
    visitDefinitions(node: Oas20Definitions): void { this.doVisitNode(node); }
    visitParametersDefinitions(node: Oas20ParametersDefinitions): void { this.doVisitNode(node); }
    visitResponsesDefinitions(node: Oas20ResponsesDefinitions): void { this.doVisitNode(node); }
    visitExtension(node: OasExtension): void { this.doVisitNode(node); }
    visitMediaType(node: Oas30MediaType): void { this.doVisitNode(node); }
    visitEncoding(node: Oas30Encoding): void { this.doVisitNode(node); }
    visitLink(node: Oas30Link): void { this.doVisitNode(node); }
    visitLinkParameterExpression(node: Oas30LinkParameterExpression): void { this.doVisitNode(node); }
    visitLinkRequestBodyExpression(node: Oas30LinkRequestBodyExpression): void { this.doVisitNode(node); }
    visitLinkServer(node: Oas30LinkServer): void { this.doVisitNode(node); }
    visitRequestBody(node: Oas30RequestBody): void { this.doVisitNode(node); }
    visitCallback(node: Oas30Callback): void { this.doVisitNode(node); }
    visitCallbackPathItem(node: Oas30CallbackPathItem): void { this.doVisitNode(node); }
    visitServer(node: Oas30Server): void { this.doVisitNode(node); }
    visitServerVariable(node: Oas30ServerVariable): void { this.doVisitNode(node); }
    visitAnyOfSchema(node: Oas30AnyOfSchema): void { this.doVisitNode(node); }
    visitOneOfSchema(node: Oas30OneOfSchema): void { this.doVisitNode(node); }
    visitNotSchema(node: Oas30NotSchema): void { this.doVisitNode(node); }
    visitComponents(node: Oas30Components): void { this.doVisitNode(node); }
    visitExampleDefinition(node: Oas30ExampleDefinition): void { this.doVisitNode(node); }
    visitRequestBodyDefinition(node: Oas30RequestBodyDefinition): void { this.doVisitNode(node); }
    visitHeaderDefinition(node: Oas30HeaderDefinition): void { this.doVisitNode(node); }
    visitOAuthFlows(node: Oas30OAuthFlows): void { this.doVisitNode(node); }
    visitImplicitOAuthFlow(node: Oas30ImplicitOAuthFlow): void { this.doVisitNode(node); }
    visitPasswordOAuthFlow(node: Oas30PasswordOAuthFlow): void { this.doVisitNode(node); }
    visitClientCredentialsOAuthFlow(node: Oas30ClientCredentialsOAuthFlow): void { this.doVisitNode(node); }
    visitAuthorizationCodeOAuthFlow(node: Oas30AuthorizationCodeOAuthFlow): void { this.doVisitNode(node); }
    visitLinkDefinition(node: Oas30LinkDefinition): void { this.doVisitNode(node); }
    visitCallbackDefinition(node: Oas30CallbackDefinition): void { this.doVisitNode(node); }
    visitDiscriminator(node: Oas30Discriminator): void { this.doVisitNode(node); }
}
