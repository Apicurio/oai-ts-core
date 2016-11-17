
import {IOasNodeVisitor, IOas20NodeVisitor} from "./visitor.iface";
import {OasDocument} from "../models/document.bean";
import {OasExtension} from "../models/extension.bean";
import {Oas20Info} from "../models/2.0/info.bean";
import {Oas20Contact} from "../models/2.0/contact.bean";
import {Oas20License} from "../models/2.0/license.bean";

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
export abstract class Oas20NodeVisitorAdapter extends OasNodeVisitorAdapter implements IOas20NodeVisitor {

    public visitInfo(node: Oas20Info) {}
    public visitContact(node: Oas20Contact) {}
    public visitLicense(node: Oas20License) {}

}