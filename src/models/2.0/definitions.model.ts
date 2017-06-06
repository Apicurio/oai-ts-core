/**
 * @license
 * Copyright 2017 Red Hat
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {IOasNodeVisitor, IOas20NodeVisitor} from "../../visitors/visitor.iface";
import {OasNode} from "../node.model";
import {Oas20SchemaDefinition} from "./schema.model";
import {IOasIndexedNode} from "../inode.model";

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
export class Oas20Definitions extends OasNode implements IOasIndexedNode<Oas20SchemaDefinition> {

    __instanceof_IOasIndexedNode: boolean = true;

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
     * @return {Oas20SchemaDefinition}
     */
    public definition(name: string): Oas20SchemaDefinition {
        return this._definitions[name];
    }

    /**
     * Returns an array of all the definitions.
     */
    public definitions(): Oas20SchemaDefinition[] {
        let names: string[] = this.definitionNames();
        let rval: Oas20SchemaDefinition[] = [];
        for (let name of names) {
            rval.push(this.definition(name));
        }
        return rval;
    }

    /**
     * Adds a definition.
     * @param name
     * @param schema
     */
    public addDefinition(name: string, schema: Oas20SchemaDefinition): Oas20SchemaDefinition {
        this._definitions[name] = schema;
        return schema;
    }

    /**
     * Removes a definition by name.
     * @param name
     */
    public removeDefinition(name: string): Oas20SchemaDefinition {
        let rval: Oas20SchemaDefinition = this._definitions[name];
        if (this._definitions && rval) {
            delete this._definitions[name];
        }
        return rval;
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
     * @return {Oas20SchemaDefinition}
     */
    public createSchemaDefinition(name: string): Oas20SchemaDefinition {
        let rval: Oas20SchemaDefinition = new Oas20SchemaDefinition(name);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    getItem(name: string): Oas20SchemaDefinition {
        return this.definition(name);
    }

    getItems(): Oas20SchemaDefinition[] {
        return this.definitions();
    }

    getItemNames(): string[] {
        return this.definitionNames();
    }

    addItem(name: string, item: Oas20SchemaDefinition): void {
        this.addDefinition(name, item);
    }

    deleteItem(name: string): Oas20SchemaDefinition {
        return this.removeDefinition(name);
    }

}

export class Oas20DefinitionItems {

    [key: string]: Oas20SchemaDefinition;

}
