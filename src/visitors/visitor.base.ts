import {OasDocument} from "../models/document.model";
import {OasExtension} from "../models/extension.model";
import {Oas20Document} from "../models/2.0/document.model";
import {Oas20Info} from "../models/2.0/info.model";
import {Oas20Contact} from "../models/2.0/contact.model";
import {Oas20License} from "../models/2.0/license.model";
import {Oas20Paths} from "../models/2.0/paths.model";
import {Oas20PathItem} from "../models/2.0/path-item.model";
import {Oas20Operation} from "../models/2.0/operation.model";
import {Oas20Parameter} from "../models/2.0/parameter.model";
import {Oas20Reference} from "../models/2.0/reference.model";
import {Oas20ExternalDocumentation} from "../models/2.0/external-documentation.model";
import {Oas20SecurityRequirement} from "../models/2.0/security-requirement.model";
import {Oas20Responses} from "../models/2.0/responses.model";
import {Oas20Response} from "../models/2.0/response.model";
import {Oas20Schema} from "../models/2.0/schema.model";
import {Oas20Headers} from "../models/2.0/headers.model";
import {Oas20Header} from "../models/2.0/header.model";
import {Oas20Example} from "../models/2.0/example.model";
import {Oas20Items} from "../models/2.0/items.model";
import {IOasNodeVisitor, IOas20NodeVisitor} from "./visitor.iface";
import {Oas20Tag} from "../models/2.0/tag.model";

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
    public visitParameter(oas20Parameter: Oas20Parameter): void {}
    public visitReference(oas20Reference: Oas20Reference): void {}
    public visitExternalDocumentation(oas20ExternalDocumentation: Oas20ExternalDocumentation): void {}
    public visitSecurityRequirement(oas20SecurityRequirement: Oas20SecurityRequirement): void {}
    public visitResponses(oas20Responses: Oas20Responses): void {}
    public visitResponse(oas20Response: Oas20Response): void {}
    public visitSchema(oas20Schema: Oas20Schema): void {}
    public visitHeaders(oas20Headers: Oas20Headers): void {}
    public visitHeader(oas20Header: Oas20Header): void {}
    public visitExample(oas20Example: Oas20Example): void {}
    public visitItems(oas20Items: Oas20Items): void {}
    public visitTag(oas20Tag: Oas20Tag): void {}
}