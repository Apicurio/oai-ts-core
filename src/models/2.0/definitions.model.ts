import {IOasNodeVisitor, IOas20NodeVisitor} from "../../visitors/visitor.iface";
import {OasNode} from "../node.model";
import {Oas20DefinitionSchema} from "./schema.model";

/**
 * Models an OAS 2.0 Definitions object.  The Definitions object can have any number of child
 * definitions, where the field name is the name of the definition and the value is a schema.
 *
 * {
 *   "Category": {
 *     "type": "object",
 *     "properties": {
 *       "id": {
 *         "type": "integer",
 *         "format": "int64"
 *       },
 *       "name": {
 *         "type": "string"
 *       }
 *     }
 *   },
 *   "Tag": {
 *     "type": "object",
 *     "properties": {
 *       "id": {
 *         "type": "integer",
 *         "format": "int64"
 *       },
 *       "name": {
 *         "type": "string"
 *       }
 *     }
 *   }
 * }
 */
export class Oas20Definitions extends OasNode {

    private _definitions: Oas20DefinitionItems = new Oas20DefinitionItems();

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas20NodeVisitor = <IOas20NodeVisitor> visitor;
        viz.visitDefinitions(this);
    }

    /**
     * Returns a single definition schema by name.
     * @param name
     * @return {Oas20DefinitionSchema}
     */
    public definition(name: string): Oas20DefinitionSchema {
        return this._definitions[name];
    }

    /**
     * Adds a definition.
     * @param name
     * @param schema
     */
    public addDefinition(name: string, schema: Oas20DefinitionSchema): Oas20DefinitionSchema {
        this._definitions[name] = schema;
        return schema;
    }

    /**
     * Removes a definition by name.
     * @param name
     */
    public removeDefinition(name: string): void {
        delete this._definitions[name];
    }

    /**
     * Gets a list of all the definition names.
     */
    public definitionNames(): string[] {
        let rval: string[] = [];
        for (let name in this._definitions) {
            rval.push(name);
        }
        return rval;
    }

    /**
     * Creates an OAS 2.0 Schema object.
     * @param name
     * @return {Oas20DefinitionSchema}
     */
    public createDefinitionSchema(name: string): Oas20DefinitionSchema {
        let rval: Oas20DefinitionSchema = new Oas20DefinitionSchema(name);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

}

export class Oas20DefinitionItems {

    [key: string]: Oas20DefinitionSchema;

}
