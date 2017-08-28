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

import {IOasNodeVisitor} from "../../visitors/visitor.iface";
import {OasExtensibleNode} from "../enode.model";
import {OasExternalDocumentation} from "./external-documentation.model";
import {OasXML} from "./xml.model";


/**
 * Models an OAS Schema object.
 */
export abstract class OasSchema extends OasExtensibleNode {

    public $ref: string;
    public format: string;
    public title: string;
    public description: string;
    public default: any;
    public multipleOf: number;
    public maximum: number;
    public exclusiveMaximum: boolean;
    public minimum: number;
    public exclusiveMinimum: boolean;
    public maxLength: number;
    public minLength: number;
    public pattern: string;
    public maxItems: number;
    public minItems: number;
    public uniqueItems: boolean;
    public maxProperties: number;
    public minProperties: number;
    public required: string[];
    public enum: any[];
    public type: string;

    public items: (OasSchema | OasSchema[]);
    public allOf: OasSchema[];
    public properties: OasSchemaProperties;
    public additionalProperties: (boolean | OasSchema);

    public readOnly: boolean;
    public xml: OasXML;
    public externalDocs: OasExternalDocumentation;
    public example: any;

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        visitor.visitSchema(this);
    }

    /**
     * Creates a child external documentation model.
     * @return {OasExternalDocumentation}
     */
    public abstract createExternalDocumentation(): OasExternalDocumentation;

    /**
     * Creates a child XML model.
     * @return {OasXML}
     */
    public abstract createXML(): OasXML;

    /**
     * Creates a child schema model.
     * @return {OasSchema}
     */
    public abstract createAllOfSchema(): OasSchema;

    /**
     * Creates a child schema model.
     * @return {OasSchema}
     */
    public abstract createItemsSchema(): OasSchema;

    /**
     * Creates a child schema model.
     * @return {OasSchema}
     */
    public abstract createAdditionalPropertiesSchema(): OasSchema;

    /**
     * Creates a child schema model.
     * @return {OasSchema}
     */
    public abstract createPropertySchema(propertyName: string): OasSchema;

    /**
     * Gets a list of all property names.
     * @return {string[]}
     */
    public propertyNames(): string[] {
        let rval: string[] = [];
        for (let name in this.properties) {
            rval.push(name);
        }
        return rval;
    }

    /**
     * Gets a list of all the properties.
     * @return {OasPropertySchema[]}
     */
    public getProperties(): OasSchema[] {
        let names: string[] = this.propertyNames();
        let rval: OasSchema[] = [];
        for (let name of names) {
            rval.push(this.property(name));
        }
        return rval;
    }

    /**
     * Add a property.
     * @param propertyName
     * @param schema
     */
    public addProperty(propertyName: string, schema: OasSchema): OasSchema {
        if (this.properties == null) {
            this.properties = new OasSchemaProperties();
        }
        this.properties[propertyName] = schema;
        return schema;
    }

    /**
     * Removes a property by name.
     * @param propertyName
     */
    public removeProperty(propertyName: string): OasSchema {
        let rval: OasSchema = undefined;
        if (this.properties) {
            rval = this.properties[propertyName];
            if (rval) {
                delete this.properties[propertyName];
            }
        }
        return rval;
    }

    /**
     * Gets a single property.
     * @param propertyName
     * @return {null}
     */
    public property(propertyName: string): OasSchema {
        if (this.properties && this.properties[propertyName]) {
            return this.properties[propertyName];
        } else {
            return null;
        }
    }
}


export class OasSchemaProperties {

    [key: string]: OasSchema;

}
