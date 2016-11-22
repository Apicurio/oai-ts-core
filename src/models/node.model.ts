import {OasExtension} from "./extension.model";
import {OasDocument} from "./document.model";
import {IOasNodeVisitor} from "../visitors/visitor.iface";

/**
 * Base class for all OAS nodes.  Contains common fields and methods across all
 * nodes of all versions of the OpenAPI Specification.
 */
export abstract class OasNode {

    public _ownerDocument: OasDocument;
    public _parent: OasNode;

    /**
     * Gets the owner document.
     * @return {OasDocument}
     */
    public ownerDocument(): OasDocument {
        return this._ownerDocument;
    }

    /**
     * Gets the parent.
     * @return {OasNode}
     */
    public parent(): OasNode {
        return this._parent;
    }

    /**
     * Accept the given visitor (call back the appropriate visit() method).
     * @param visitor
     */
    public abstract accept(visitor: IOasNodeVisitor): void;

}
