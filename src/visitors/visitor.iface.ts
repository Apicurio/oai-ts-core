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

/**
 * Classes that wish to visit a OAS node or tree must implement this interface.  The
 * appropriate method will be called based on the type of node being visited.
 */
export interface IOasNodeVisitor {

    visitDocument(node: OasDocument): void;

    visitExtension(node: OasExtension): void;

}

/**
 * Extends the base node visitor to support visiting an OAS 2.0 document.
 */
export interface IOas20NodeVisitor extends IOasNodeVisitor {

    visitDocument(node: Oas20Document): void;

    visitInfo(node: Oas20Info): void;

    visitContact(node: Oas20Contact): void;

    visitLicense(node: Oas20License): void;

    visitPaths(node: Oas20Paths): void;

    visitPathItem(node: Oas20PathItem): void;

    visitOperation(node: Oas20Operation): void;

    visitParameter(oas20Parameter: Oas20Parameter): void;

    visitReference(oas20Reference: Oas20Reference): void;

    visitExternalDocumentation(oas20ExternalDocumentation: Oas20ExternalDocumentation): void;

    visitSecurityRequirement(oas20SecurityRequirement: Oas20SecurityRequirement): void;

    visitResponses(oas20Responses: Oas20Responses): void;

    visitResponse(oas20Response: Oas20Response): void;

    visitSchema(oas20Schema: Oas20Schema): void;

    visitHeaders(oas20Headers: Oas20Headers): void;

    visitHeader(oas20Header: Oas20Header): void;

    visitExample(oas20Example: Oas20Example): void;

    visitItems(oas20Items: Oas20Items): void;

}