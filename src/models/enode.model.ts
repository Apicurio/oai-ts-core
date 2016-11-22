import {OasExtension} from "./extension.model";
import {OasNode} from "./node.model";

/**
 * Base class for all extensible OAS nodes.  Most nodes allow extension properties that
 * being with x-* (OAS 2.0).
 */
export abstract class OasExtensibleNode extends OasNode {

    private _extensions: OasExtension[];

    /**
     * Returns all the extensions.
     * @return {OasExtension[]}
     */
    public extensions(): OasExtension[] {
        return this._extensions;
    }

    /**
     * Creates an extension.
     * @return {OasExtension}
     */
    public createExtension(): OasExtension {
        let rval: OasExtension = new OasExtension();
        rval._ownerDocument = this.ownerDocument();
        rval._parent = this;
        return rval;
    }

    /**
     * Adds an extension.
     * @param name
     * @param value
     */
    public addExtension(name: string, value: any): OasExtension {
        let ext: OasExtension = this.createExtension();
        ext.name = name;
        ext.value = value;
        if (!this._extensions) {
            this._extensions = [];
        }
        this._extensions.push(ext);
        return ext;
    }

}
