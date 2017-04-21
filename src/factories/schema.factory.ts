/**
 * @license
 * Copyright 2017 JBoss Inc
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

import {Oas20DefinitionSchema, Oas20PropertySchema, Oas20Schema} from "../models/2.0/schema.model";
import {Oas20Document} from "../models/2.0/document.model";
import {Oas20Definitions} from "../models/2.0/definitions.model";

export class Oas20SchemaFactory {

    /**
     * Creates a new definition schema from a given example.  This method will analyze the example
     * object and create a new schema object that represents the example.  Note that this method
     * does not support arbitrarily complicated examples, and should be used as a starting point
     * for a schema, not a canonical one.
     * @param document
     * @param name
     * @param example
     * @return {Oas20DefinitionSchema}
     */
    public createDefinitionSchemaFromExample(document: Oas20Document, name: string, example: any): Oas20DefinitionSchema {
        let definitions: Oas20Definitions = document.definitions;
        if (!definitions) {
            definitions = document.createDefinitions();
        }
        // Parse to object if it's not already an object.
        if (typeof example === "string") {
            example = JSON.parse(example);
        }

        let resolveType = function(thing: any, schema: Oas20Schema): void {
            if (typeof thing === "number") {
                if (Math.round(thing) === thing) {
                    schema.type = "integer";
                    if (thing >= -2147483647 && thing <= 2147483647) {
                        schema.format = "int32";
                    } else if (thing >= -9223372036854775807 && thing <= 9223372036854775807) {
                        schema.format = "int64";
                    }
                } else {
                    schema.type = "number";
                    schema.format = "double";
                }
            } else if (typeof thing === "boolean") {
                schema.type = "boolean";
            } else if (Array.isArray(thing)) {
                schema.type = "array";
            } else if (typeof thing === "object") {
                schema.type = "object";
            } else {
                schema.type = "string";
                if ((<string>thing).match(/^(\d{4})\D?(0[1-9]|1[0-2])\D?([12]\d|0[1-9]|3[01])$/)) {
                    schema.format = "date";
                } else if ((<string>thing).match(/^(\d{4})\D?(0[1-9]|1[0-2])\D?([12]\d|0[1-9]|3[01])(\D?([01]\d|2[0-3])\D?([0-5]\d)\D?([0-5]\d)?\D?(\d{3})?([zZ]|([\+-])([01]\d|2[0-3])\D?([0-5]\d)?)?)?$/)) {
                    schema.format = "date-time";
                }
            }
        };
        let resolveAll = function(object: any, schema: Oas20Schema): void {
            resolveType(object, schema);
            if (schema.type === "array") {
                schema.items = schema.createItemsSchema();
                if (example.length > 0) {
                    resolveAll(example[0], schema.items);
                }
            } else if (schema.type === "object") {
                schema.type = "object";
                for (let propName in object) {
                    let pschema: Oas20PropertySchema = schema.createPropertySchema(propName);
                    schema.addProperty(propName, pschema);
                    let propValue: any = object[propName];
                    resolveAll(propValue, pschema);
                }
            }
        };

        let schema: Oas20DefinitionSchema = definitions.createDefinitionSchema(name);
        schema.title = "Root Type";
        schema.description = "The root of the " + name + " type's schema.";
        resolveAll(example, schema);
        return schema;
    }

}