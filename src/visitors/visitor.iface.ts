import {OasDocument} from "../models/document.bean";
import {OasExtension} from "../models/extension.bean";
import {Oas20Document} from "../models/2.0/document.bean";
import {Oas20Info} from "../models/2.0/info.bean";
import {Oas20Contact} from "../models/2.0/contact.bean";
import {Oas20License} from "../models/2.0/license.bean";

/**
 * Classes that wish to visit a OAS node or tree must implement this interface.  The
 * appropriate method will be called based on the type of node being visited.
 */
export interface IOasNodeVisitor {

    visitDocument(node: OasDocument);

    visitExtension(node: OasExtension);

}

/**
 * Extends the base node visitor to support visiting an OAS 2.0 document.
 */
export interface IOas20NodeVisitor extends IOasNodeVisitor {

    visitDocument(node: Oas20Document);

    visitInfo(node: Oas20Info);

    visitContact(node: Oas20Contact);

    visitLicense(node: Oas20License);

}