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

import {Oas20SchemaDefinition} from "../models/2.0/schema.model";
import {Oas20Document} from "../models/2.0/document.model";
import {Oas20Definitions} from "../models/2.0/definitions.model";
import {OasDocument} from "../models/document.model";
import {OasSchema} from "../models/common/schema.model";
import {Oas30SchemaDefinition} from "../models/3.0/schema.model";
import {Oas30Document} from "../models/3.0/document.model";
import {Oas30Components} from "../models/3.0/components.model";


export class OasSchemaFactory {

    /**
     * Creates a new definition schema from a given example.  This method will analyze the example
     * object and create a new schema object that represents the example.  Note that this method
     * does not support arbitrarily complicated examples, and should be used as a starting point
     * for a schema, not a canonical one.
     * @param document
     * @param name
     * @param example
     * @return {Oas20SchemaDefinition}
     */
    public createSchemaDefinitionFromExample(document: OasDocument, name: string, example: any): Oas20SchemaDefinition|Oas30SchemaDefinition {
        let resolveType = function (thing: any, schema: OasSchema): void {
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
        let resolveAll = function (object: any, schema: OasSchema): void {
            resolveType(object, schema);
            if (schema.type === "array") {
                schema.items = schema.createItemsSchema();
                if (example.length > 0) {
                    resolveAll(example[0], schema.items);
                }
            } else if (schema.type === "object") {
                schema.type = "object";
                for (let propName in object) {
                    let pschema: OasSchema = schema.createPropertySchema(propName);
                    schema.addProperty(propName, pschema);
                    let propValue: any = object[propName];
                    resolveAll(propValue, pschema);
                }
            }
        };


        if (document.is2xDocument()) {
            let doc: Oas20Document = document as Oas20Document;
            let definitions: Oas20Definitions = doc.definitions;
            if (!definitions) {
                definitions = doc.createDefinitions();
            }
            // Parse to object if it's not already an object.
            if (typeof example === "string") {
                example = JSON.parse(example);
            }

            let schema: Oas20SchemaDefinition = definitions.createSchemaDefinition(name);
            schema.title = "Root Type for " + name;
            schema.description = "The root of the " + name + " type's schema.";
            resolveAll(example, schema);
            return schema;
        } else if (document.is3xDocument()) {
            let doc: Oas30Document = document as Oas30Document;
            let components: Oas30Components = doc.components;
            if (!components) {
                components = doc.createComponents();
            }
            // Parse to object if it's not already an object.
            if (typeof example === "string") {
                example = JSON.parse(example);
            }

            let schema: Oas30SchemaDefinition = components.createSchemaDefinition(name);
            schema.title = "Root Type for " + name;
            schema.description = "The root of the " + name + " type's schema.";
            resolveAll(example, schema);
            return schema;
        }
    }

}