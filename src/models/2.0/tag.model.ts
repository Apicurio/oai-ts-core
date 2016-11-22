
import {IOasNodeVisitor, IOas20NodeVisitor} from "../../visitors/visitor.iface";
import {OasExtensibleNode} from "../enode.model";
import {Oas20ExternalDocumentation} from "./external-documentation.model";

/**
 * Models an OAS 2.0 Tag object.  Example:
 *
 * {
 *     "name": "pet",
 *     "description": "Pets operations"
 * }
 */
export class Oas20Tag extends OasExtensibleNode {

    public name: string;
    public description: string;
    public externalDocs: Oas20ExternalDocumentation;

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas20NodeVisitor = <IOas20NodeVisitor> visitor;
        viz.visitTag(this);
    }

    /**
     * Creates an OAS 2.0 External Documentation object.
     * @return {Oas20ExternalDocumentation}
     */
    public createExternalDocumentation(): Oas20ExternalDocumentation {
        let rval: Oas20ExternalDocumentation = new Oas20ExternalDocumentation();
        rval._ownerDocument = this.ownerDocument();
        rval._parent = this;
        return rval;
    }

    /**
     * Sets the external documentation information.
     * @param description
     * @param url
     */
    public setExternalDocumentation(description: string, url: string): Oas20ExternalDocumentation {
        let edoc: Oas20ExternalDocumentation = this.createExternalDocumentation();
        edoc.description = description;
        edoc.url = url;
        this.externalDocs = edoc;
        return edoc;
    }

}