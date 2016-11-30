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
import {Oas20Tag} from "../models/2.0/tag.model";
import {Oas20Scopes} from "../models/2.0/scopes.model";
import {Oas20SecurityDefinitions} from "../models/2.0/security-definitions.model";
import {Oas20SecurityScheme} from "../models/2.0/security-scheme.model";

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
    public traverse(node: OasNode): void {
        node.accept(this);
    }

    /**
     * Traverse into the given node, unless it's null.
     * @param node
     */
    private traverseIfNotNull(node: OasNode): void {
        if (node) {
            node.accept(this);
        }
    }

    /**
     * Traverse the items of the given array.
     * @param items
     */
    private traverseArray(items: OasNode[]): void {
        if (items) {
            for (let item of items) {
                this.traverseIfNotNull(item);
            }
        }
    }

    /**
     * Traverse the extension nodes, if any are found.
     * @param node
     */
    private traverseExtensions(node: OasExtensibleNode): void {
        this.traverseArray(node.extensions());
    }

    /**
     * Visit the document.
     * @param node
     */
    visitDocument(node: Oas20Document): void {
        node.accept(this.visitor);
        this.traverseIfNotNull(node.info);
        this.traverseIfNotNull(node.paths);
        this.traverseIfNotNull(node.securityDefinitions);
        this.traverseArray(node.security);
        this.traverseArray(node.tags);
        this.traverseIfNotNull(node.externalDocs);
        this.traverseExtensions(node);
    }

    /**
     * Visit the info object.
     * @param node
     */
    visitInfo(node: Oas20Info): void {
        node.accept(this.visitor);
        this.traverseIfNotNull(node.contact);
        this.traverseIfNotNull(node.license);
        this.traverseExtensions(node);
    }

    /**
     * Visit the contact object.
     * @param node
     */
    visitContact(node: Oas20Contact): void {
        node.accept(this.visitor);
        this.traverseExtensions(node);
    }

    /**
     * Visit the license object.
     * @param node
     */
    visitLicense(node: Oas20License): void {
        node.accept(this.visitor);
        this.traverseExtensions(node);
    }

    /**
     * Visit the extension.
     * @param node
     */
    visitExtension(node: OasExtension): void {
        node.accept(this.visitor);
    }

    /**
     * Visit the paths.
     * @param node
     */
    visitPaths(node: Oas20Paths): void {
        node.accept(this.visitor);
        for (let pathName of node.pathItemNames()) {
            let pathItem: Oas20PathItem = node.pathItem(pathName);
            this.traverseIfNotNull(pathItem);
        }
        this.traverseExtensions(node);
    }

    /**
     * Visit the path item.
     * @param node
     */
    visitPathItem(node: Oas20PathItem): void {
        node.accept(this.visitor);
        this.traverseIfNotNull(node.get);
        this.traverseIfNotNull(node.put);
        this.traverseIfNotNull(node.post);
        this.traverseIfNotNull(node.delete);
        this.traverseIfNotNull(node.options);
        this.traverseIfNotNull(node.head);
        this.traverseIfNotNull(node.patch);
        this.traverseArray(node.parameters);
        this.traverseExtensions(node);
    }

    /**
     * Visit the operation.
     * @param node
     */
    visitOperation(node: Oas20Operation): void {
        node.accept(this.visitor);
        this.traverseIfNotNull(node.externalDocs);
        this.traverseArray(node.parameters);
        this.traverseIfNotNull(node.responses);
        this.traverseArray(node.security);
        this.traverseExtensions(node);
    }

    /**
     * Visit the parameter.
     * @param node
     */
    visitParameter(node: Oas20Parameter): void {
        node.accept(this.visitor);
        this.traverseIfNotNull(node.schema);
        this.traverseIfNotNull(node.items);
        this.traverseExtensions(node);
    }

    /**
     * Visit the external doc.
     * @param node
     */
    visitExternalDocumentation(node: Oas20ExternalDocumentation): void {
        node.accept(this.visitor);
        this.traverseExtensions(node);
    }

    /**
     * Visit the security requirement.
     * @param node
     */
    visitSecurityRequirement(node: Oas20SecurityRequirement): void {
        node.accept(this.visitor);
    }

    /**
     * Visit the responses.
     * @param node
     */
    visitResponses(node: Oas20Responses): void {
        node.accept(this.visitor);
        for (let name of node.responseStatusCodes()) {
            let response: Oas20Response = node.response(name);
            this.traverseIfNotNull(response);
        }
        this.traverseIfNotNull(node.default);
        this.traverseExtensions(node);
    }

    /**
     * Visit the response.
     * @param node
     */
    visitResponse(node: Oas20Response): void {
        node.accept(this.visitor);
        this.traverseIfNotNull(node.schema);
        this.traverseIfNotNull(node.headers);
        this.traverseIfNotNull(node.examples);
        this.traverseExtensions(node);
    }

    /**
     * Visit the schema.
     * @param node
     */
    visitSchema(node: Oas20Schema): void {
        node.accept(this.visitor);
        this.traverseExtensions(node);
    }

    /**
     * Visit the headers.
     * @param node
     */
    visitHeaders(node: Oas20Headers): void {
        node.accept(this.visitor);
        for (let hname of node.headerNames()) {
            let header: Oas20Header = node.header(hname);
            this.traverseIfNotNull(header);
        }
    }

    /**
     * Visit the header.
     * @param node
     */
    visitHeader(node: Oas20Header): void {
        node.accept(this.visitor);
        this.traverseIfNotNull(node.items);
        this.traverseExtensions(node);
    }

    /**
     * Visit the example.
     * @param node
     */
    visitExample(node: Oas20Example): void {
        node.accept(this.visitor);
    }

    /**
     * Visit the items.
     * @param node
     */
    visitItems(node: Oas20Items): void {
        node.accept(this.visitor);
        this.traverseIfNotNull(node.items);
        this.traverseExtensions(node);
    }

    /**
     * Visit the tag.
     * @param node
     */
    visitTag(node: Oas20Tag): void {
        node.accept(this.visitor);
        this.traverseExtensions(node);
    }

    /**
     * Visit the security definitions.
     * @param node
     */
    visitSecurityDefinitions(node: Oas20SecurityDefinitions): void {
        node.accept(this.visitor);
        for (let schemeName of node.securitySchemeNames()) {
            this.traverse(node.securityScheme(schemeName));
        }
    }

    /**
     * Visit the security scheme.
     * @param node
     */
    visitSecurityScheme(node: Oas20SecurityScheme): void {
        node.accept(this.visitor);
        this.traverseIfNotNull(node.scopes);
        this.traverseExtensions(node);
    }

    /**
     * Visit the scopes.
     * @param node
     */
    visitScopes(node: Oas20Scopes): void {
        node.accept(this.visitor);
    }

}
