
import {IOasNodeVisitor, IOas20NodeVisitor} from "../../visitors/visitor.iface";
import {Oas20Schema} from "./schema.model";
import {Oas20Items} from "./items.model";
import {IOasReferenceNode} from "../reference.model";


/**
 * Models an OAS 2.0 Parameter object.  Example:
 *
 * {
 *   "name": "user",
 *   "in": "body",
 *   "description": "user to add to the system",
 *   "required": true,
 *   "schema": {
 *     "$ref": "#/definitions/User"
 *   }
 * }
 */
export abstract class Oas20ParameterBase extends Oas20Items {

    public name: string;
    public in: string;
    public description: string;
    public required: boolean;
    public schema: Oas20Schema;
    public allowEmptyValue: boolean;

    /**
     * Creates a child schema model.
     * @return {Oas20Schema}
     */
    public createSchema(): Oas20Schema {
        let rval: Oas20Schema = new Oas20Schema();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

}

/**
 * Extends the base parameter to model a parameter that is a child of the OAS 2.0 Parameters Definitions
 * object.
 */
export class Oas20ParameterDefinition extends Oas20ParameterBase {

    private _parameterName: string;

    /**
     * Constructor.
     * @param parameterName
     */
    constructor(parameterName: string) {
        super();
        this._parameterName = parameterName;
    }

    /**
     * Gets the parameter name.
     * @return {string}
     */
    public parameterName(): string {
        return this._parameterName;
    }

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas20NodeVisitor = <IOas20NodeVisitor> visitor;
        viz.visitParameterDefinition(this);
    }

}

/**
 * Extends the base parameter to add support for references.
 */
export class Oas20Parameter extends Oas20ParameterBase implements IOasReferenceNode {

    public $ref: string;

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas20NodeVisitor = <IOas20NodeVisitor> visitor;
        viz.visitParameter(this);
    }

}