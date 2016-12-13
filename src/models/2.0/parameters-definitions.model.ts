import {IOasNodeVisitor, IOas20NodeVisitor} from "../../visitors/visitor.iface";
import {OasNode} from "../node.model";
import {Oas20ParameterDefinition} from "./parameter.model";

/**
 * Models an OAS 2.0 Parameters Definitions object.  The Parameters Definitions object can have any
 * number of child parameters, where the field name is the name of the parameter and the value is a Parameter
 * object.  Example:
 *
 * {
 *   "skipParam": {
 *     "name": "skip",
 *     "in": "query",
 *     "description": "number of items to skip",
 *     "required": true,
 *     "type": "integer",
 *     "format": "int32"
 *   },
 *   "limitParam": {
 *     "name": "limit",
 *     "in": "query",
 *     "description": "max records to return",
 *     "required": true,
 *     "type": "integer",
 *     "format": "int32"
 *   }
 * }
 */
export class Oas20ParametersDefinitions extends OasNode {

    private _parameters: Oas20ParametersDefinitionsItems = new Oas20ParametersDefinitionsItems();

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas20NodeVisitor = <IOas20NodeVisitor> visitor;
        viz.visitParametersDefinitions(this);
    }

    /**
     * Returns a single parameter by name.
     * @param name
     * @return {Oas20ParameterDefinition}
     */
    public parameter(name: string): Oas20ParameterDefinition {
        return this._parameters[name];
    }

    /**
     * Adds a parameter.
     * @param name
     * @param parameter
     */
    public addParameter(name: string, parameter: Oas20ParameterDefinition): Oas20ParameterDefinition {
        this._parameters[name] = parameter;
        return parameter;
    }

    /**
     * Removes a parameter by name.
     * @param name
     */
    public removeParameter(name: string): void {
        delete this._parameters[name];
    }

    /**
     * Gets a list of all the parameter names.
     */
    public parameterNames(): string[] {
        let rval: string[] = [];
        for (let name in this._parameters) {
            rval.push(name);
        }
        return rval;
    }

    /**
     * Creates an OAS 2.0 Parameter object.
     * @param name
     * @return {Oas20ParameterDefinition}
     */
    public createParameter(name: string): Oas20ParameterDefinition {
        let rval: Oas20ParameterDefinition = new Oas20ParameterDefinition(name);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

}

export class Oas20ParametersDefinitionsItems {

    [key: string]: Oas20ParameterDefinition;

}
