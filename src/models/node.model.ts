import {OasExtension} from "./extension.model";
import {OasDocument} from "./document.model";
import {IOasNodeVisitor} from "../visitors/visitor.iface";

var __modelIdCounter = 0;

/**
 * Base class for all OAS nodes.  Contains common fields and methods across all
 * nodes of all versions of the OpenAPI Specification.
 */
export abstract class OasNode {

    public _ownerDocument: OasDocument;
    public _parent: OasNode;
    public _modelId: number = __modelIdCounter++;
    public _attributes: OasNodeAttributes = new OasNodeAttributes();

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
     * Gets the model's unique ID.
     * @return {number}
     */
    public modelId(): number {
        return this._modelId;
    }

    /**
     * Accept the given visitor (call back the appropriate visit() method).
     * @param visitor
     */
    public abstract accept(visitor: IOasNodeVisitor): void;

    /**
     * Gets or sets a node attribute.  When setting the attribute, the previous value
     * will be returned. Otherwise the current value is returned.
     * @param name
     * @param value
     * @return {any}
     */
    public n_attribute(name: string, value?: any): any {
        if (value === undefined) {
            return this._attributes[name];
        } else {
            let pvalue: any = this._attributes[name];
            this._attributes[name] = value;
            return pvalue;
        }
    }
}


export class OasNodeAttributes {

    [key: string]: any;

}