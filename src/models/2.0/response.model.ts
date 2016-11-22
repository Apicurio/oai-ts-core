
import {IOasNodeVisitor, IOas20NodeVisitor} from "../../visitors/visitor.iface";
import {Oas20Operation} from "./operation.model";
import {OasExtensibleNode} from "../enode.model";
import {Oas20Schema} from "./schema.model";
import {Oas20Headers} from "./headers.model";
import {Oas20Example} from "./example.model";

/**
 * Models an OAS 2.0 Response object.  Example:
 */
export class Oas20Response extends OasExtensibleNode {

    public description: string;
    public schema: Oas20Schema;
    public headers: Oas20Headers;
    public examples: Oas20Example;

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas20NodeVisitor = <IOas20NodeVisitor> visitor;
        viz.visitResponse(this);
    }

    /**
     * Creates an OAS 2.0 schema object.
     * @return {Oas20Schema}
     */
    public createSchema(): Oas20Schema {
        let rval: Oas20Schema = new Oas20Schema();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    /**
     * Creates an OAS 2.0 headers object.
     * @return {Oas20Operation}
     */
    public createHeaders(): Oas20Headers {
        let rval: Oas20Headers = new Oas20Headers();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    /**
     * Creates an OAS 2.0 schema object.
     * @return {Oas20Operation}
     */
    public createExample(): Oas20Example {
        let rval: Oas20Example = new Oas20Example();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

}