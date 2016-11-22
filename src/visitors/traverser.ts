import {IOas20NodeVisitor} from "./visitor.iface";
import {Oas20Document} from "../models/2.0/document.model";
import {Oas20Info} from "../models/2.0/info.model";
import {Oas20Contact} from "../models/2.0/contact.model";
import {Oas20License} from "../models/2.0/license.model";
import {OasExtension} from "../models/extension.model";
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
import {OasNode} from "../models/node.model";
import {OasExtensibleNode} from "../models/enode.model";

/**
 * Used to traverse an OAS 2.0 tree and call an included visitor for each node.
 */
export class Oas20Traverser implements IOas20NodeVisitor {

    /**
     * Contstructor.
     * @param visitor
     */
    constructor(private visitor: IOas20NodeVisitor) {}

    /**
     * Called to traverse an OAS 2.0 tree starting at the given node and traversing
     * down until this node and all child nodes have been visited.
     * @param node
     */
    public traverse(node: OasNode) {
        node.accept(this);
    }

    /**
     * Traverse into the given node, unless it's null.
     * @param node
     */
    private traverseIfNotNull(node: OasNode) {
        if (node) {
            node.accept(this);
        }
    }

    /**
     * Traverse the extension nodes, if any are found.
     * @param node
     */
    private traverseExtensions(node: OasExtensibleNode) {
        if (node.extensions()) {
            for (let ext of node.extensions()) {
                this.traverseIfNotNull(ext);
            }
        }
    }

    /**
     * Visit the document.
     * @param node
     */
    visitDocument(node: Oas20Document) {
        node.accept(this.visitor);
        this.traverseIfNotNull(node.info);
        this.traverseExtensions(node);
    }

    /**
     * Visit the info object.
     * @param node
     */
    visitInfo(node: Oas20Info) {
        node.accept(this.visitor);
        this.traverseIfNotNull(node.contact);
        this.traverseIfNotNull(node.license);
        this.traverseExtensions(node);
    }

    /**
     * Visit the contact object.
     * @param node
     */
    visitContact(node: Oas20Contact) {
        node.accept(this.visitor);
        this.traverseExtensions(node);
    }

    /**
     * Visit the license object.
     * @param node
     */
    visitLicense(node: Oas20License) {
        node.accept(this.visitor);
        this.traverseExtensions(node);
    }

    /**
     * Visit the extension.
     * @param node
     */
    visitExtension(node: OasExtension) {
        node.accept(this.visitor);
    }

    /**
     * Visit the paths.
     * @param node
     */
    visitPaths(node: Oas20Paths) {
    }

    /**
     * Visit the path item.
     * @param node
     */
    visitPathItem(node: Oas20PathItem) {
    }

    /**
     * Visit the operation.
     * @param node
     */
    visitOperation(node: Oas20Operation) {
    }

    /**
     * Visit the parameter.
     * @param node
     */
    visitParameter(oas20Parameter: Oas20Parameter): void {
    }

    /**
     * Visit the reference.
     * @param node
     */
    visitReference(oas20Reference: Oas20Reference): void {
    }

    /**
     * Visit the external doc.
     * @param node
     */
    visitExternalDocumentation(oas20ExternalDocumentation: Oas20ExternalDocumentation): void {
    }

    /**
     * Visit the security requirement.
     * @param node
     */
    visitSecurityRequirement(oas20SecurityRequirement: Oas20SecurityRequirement): void {
    }

    /**
     * Visit the responses.
     * @param node
     */
    visitResponses(oas20Responses: Oas20Responses): void {
    }

    /**
     * Visit the response.
     * @param node
     */
    visitResponse(oas20Response: Oas20Response): void {
    }

    /**
     * Visit the schema.
     * @param node
     */
    visitSchema(oas20Schema: Oas20Schema): void {
    }

    /**
     * Visit the headers.
     * @param node
     */
    visitHeaders(oas20Headers: Oas20Headers): void {
    }

    /**
     * Visit the header.
     * @param node
     */
    visitHeader(oas20Header: Oas20Header): void {
    }

    /**
     * Visit the example.
     * @param node
     */
    visitExample(oas20Example: Oas20Example): void {
    }

    /**
     * Visit the items.
     * @param node
     */
    visitItems(oas20Items: Oas20Items): void {
    }

}
