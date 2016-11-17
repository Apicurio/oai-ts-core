
import {IOas20NodeVisitor} from "./visitor.iface";
import {OasNode} from "../models/node.bean";
import {Oas20Document} from "../models/2.0/document.bean";
import {Oas20Info} from "../models/2.0/info.bean";
import {Oas20Contact} from "../models/2.0/contact.bean";
import {Oas20License} from "../models/2.0/license.bean";
import {OasExtension} from "../models/extension.bean";
import {OasExtensibleNode} from "../models/enode.bean";

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
        if (node.extensions) {
            for (let ext of node.extensions) {
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

}
