import {Oas20Contact} from "./contact.bean";
import {Oas20License} from "./license.bean";
import {OasExtensibleNode} from "../enode.bean";
import {IOasNodeVisitor, IOas20NodeVisitor} from "../../visitors/visitor.iface";

/**
 * Models an OAS 2.0 Info object.
 */
export class Oas20Info extends OasExtensibleNode {

    public title: string;
    public description: string;
    public termsOfService: string;
    public contact: Oas20Contact;
    public license: Oas20License;
    public version: string;

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas20NodeVisitor = <IOas20NodeVisitor> visitor;
        viz.visitInfo(this);
    }

    /**
     * Creates an OAS 2.0 contact object.
     * @return {Oas20Contact}
     */
    public createContact() {
        let rval: Oas20Contact = new Oas20Contact();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    /**
     * Creates an OAS 2.0 license object.
     * @return {Oas20License}
     */
    public createLicense() {
        let rval: Oas20License = new Oas20License();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

}