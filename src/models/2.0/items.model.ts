
import {IOasNodeVisitor, IOas20NodeVisitor} from "../../visitors/visitor.iface";
import {OasExtensibleNode} from "../enode.model";

/**
 * Models an OAS 2.0 Items object.  Example:
 */
export class Oas20Items extends OasExtensibleNode {

    public type: Oas20ItemsType; // required
    public format: string;
    public items: Oas20Items; // required if type is 'array'
    public collectionFormat: Oas20ItemsCollectionFormat;
    public default: any;
    public maximum: number;
    public exclusiveMaximum: boolean;
    public minimum: number;
    public exclusiveMinimum: boolean;
    public maxLength: number; // Require: integer
    public minLength: number; // Require: integer
    public pattern: string;
    public maxItems: number; // Require: integer
    public minItems: number; // Require: integer
    public uniqueItems: boolean;
    public enum: any[];
    public multipleOf: number;

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas20NodeVisitor = <IOas20NodeVisitor> visitor;
        viz.visitItems(this);
    }

    /**
     * Creates a child items model.
     * @return {Oas20Items}
     */
    public createItems(): Oas20Items {
        let rval: Oas20Items = new Oas20Items();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }
}


export enum Oas20ItemsType {
    string, number, integer, boolean, array
}


export enum Oas20ItemsCollectionFormat {
    csv, ssv, tsv, pipes, multi
}