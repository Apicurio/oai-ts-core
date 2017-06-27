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

import {OasExtensibleNode} from "../enode.model";
import {IOas30NodeVisitor, IOasNodeVisitor} from "../../visitors/visitor.iface";
import {Oas30ServerVariable} from "./server-variable.model";

/**
 * Models an OAS 3.0 Discriminator object.  Example:
 *
 * {
 *   "MySchema": {
 *     "oneOf": [
 *       {
 *         "$ref": "#/components/schemas/Cat"
 *       },
 *       {
 *         "$ref": "#/components/schemas/Dog"
 *       },
 *       {
 *         "$ref": "#/components/schemas/Lizard"
 *       },
 *       {
 *         "$ref": "https://gigantic-server.com/schemas/Monster/schema.json"
 *       }
 *     ],
 *     "discriminator": {
 *       "propertyName": "pet_type",
 *       "mapping": {
 *         "dog": "#/components/schemas/Dog",
 *         "monster": "https://gigantic-server.com/schemas/Monster/schema.json"
 *       }
 *     }
 *   }
 * }
 */
export class Oas30Discriminator extends OasExtensibleNode {

    public propertyName: string;
    public mapping: any;

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas30NodeVisitor = <IOas30NodeVisitor> visitor;
        viz.visitDiscriminator(this);
    }

    /**
     * Gets a mapping value by its key.
     * @param key
     * @return {any}
     */
    public getMapping(key: string): string {
        if (this.mapping) {
            return this.mapping[key];
        }
        return null;
    }

    /**
     * Adds a mapping.
     * @param key
     * @param value
     */
    public addMapping(key: string, value: string): void {
        if (!this.mapping) {
            this.mapping = {};
        }
        this.mapping[key] = value;
    }

}
