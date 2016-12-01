import {OasDocument} from "../models/document.model";
import {OasExtension} from "../models/extension.model";
import {Oas20Info} from "../models/2.0/info.model";
import {Oas20Contact} from "../models/2.0/contact.model";
import {Oas20License} from "../models/2.0/license.model";
import {Oas20Paths} from "../models/2.0/paths.model";
import {Oas20PathItem} from "../models/2.0/path-item.model";
import {Oas20Operation} from "../models/2.0/operation.model";
import {Oas20Parameter} from "../models/2.0/parameter.model";
import {Oas20ExternalDocumentation} from "../models/2.0/external-documentation.model";
import {Oas20SecurityRequirement} from "../models/2.0/security-requirement.model";
import {Oas20Responses} from "../models/2.0/responses.model";
import {Oas20Response} from "../models/2.0/response.model";
import {
    Oas20Schema, Oas20PropertySchema, Oas20AdditionalPropertiesSchema,
    Oas20AllOfSchema, Oas20DefinitionSchema
} from "../models/2.0/schema.model";
import {Oas20Headers} from "../models/2.0/headers.model";
import {Oas20Header} from "../models/2.0/header.model";
import {Oas20Example} from "../models/2.0/example.model";
import {Oas20Items} from "../models/2.0/items.model";
import {IOasNodeVisitor, IOas20NodeVisitor} from "./visitor.iface";
import {Oas20Tag} from "../models/2.0/tag.model";
import {Oas20SecurityDefinitions} from "../models/2.0/security-definitions.model";
import {Oas20SecurityScheme} from "../models/2.0/security-scheme.model";
import {Oas20Scopes} from "../models/2.0/scopes.model";
import {Oas20XML} from "../models/2.0/xml.model";
import {Oas20Definitions} from "../models/2.0/definitions.model";

/**
 * Base class for node visitors that are only interested in a subset of the node types
 * that might be visited.  Extending this class means that subclasses can only override
 * the subset of methods desired.
 */
export abstract class OasNodeVisitorAdapter implements IOasNodeVisitor {

    public visitDocument(node: OasDocument) {}
    public visitExtension(node: OasExtension) {}

}

/**
 * Base class for OAS 2.0 node visitors that are only interested in a subset of the node types
 * that might be visited.  Extending this class means that subclasses can only override
 * the subset of methods desired.
 */
export class Oas20NodeVisitorAdapter extends OasNodeVisitorAdapter implements IOas20NodeVisitor {
    public visitInfo(node: Oas20Info): void {}
    public visitContact(node: Oas20Contact): void {}
    public visitLicense(node: Oas20License): void {}
    public visitPaths(node: Oas20Paths): void {}
    public visitPathItem(node: Oas20PathItem): void {}
    public visitOperation(node: Oas20Operation): void {}
    public visitParameter(node: Oas20Parameter): void {}
    public visitExternalDocumentation(node: Oas20ExternalDocumentation): void {}
    public visitSecurityRequirement(node: Oas20SecurityRequirement): void {}
    public visitResponses(node: Oas20Responses): void {}
    public visitResponse(node: Oas20Response): void {}
    public visitSchema(node: Oas20Schema): void {}
    public visitHeaders(node: Oas20Headers): void {}
    public visitHeader(node: Oas20Header): void {}
    public visitExample(node: Oas20Example): void {}
    public visitItems(node: Oas20Items): void {}
    public visitTag(node: Oas20Tag): void {}
    public visitSecurityDefinitions(node: Oas20SecurityDefinitions): void {}
    public visitSecurityScheme(node: Oas20SecurityScheme): void {}
    public visitScopes(node: Oas20Scopes): void {}
    public visitXML(node: Oas20XML): void {}
    public visitPropertySchema(node: Oas20PropertySchema): void {}
    public visitAdditionalPropertiesSchema(node: Oas20AdditionalPropertiesSchema): void {}
    public visitAllOfSchema(node: Oas20AllOfSchema): void {}
    public visitDefinitionSchema(node: Oas20DefinitionSchema): void {}
    public visitDefinitions(node: Oas20Definitions): void {}
}