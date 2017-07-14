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

import {IOas20NodeVisitor, IOasNodeVisitor} from "../../visitors/visitor.iface";
import {Oas20ExternalDocumentation} from "./external-documentation.model";
import {Oas20XML} from "./xml.model";
import {OasSchema} from "../common/schema.model";


/**
 * Models an OAS 2.0 Schema object.  Example:
 *
 * {
 *   "type": "object",
 *   "required": [
 *     "name"
 *   ],
 *   "properties": {
 *     "name": {
 *       "type": "string"
 *     },
 *     "address": {
 *       "$ref": "#/definitions/Address"
 *     },
 *     "age": {
 *       "type": "integer",
 *       "format": "int32",
 *       "minimum": 0
 *     }
 *   }
 */
export class Oas20Schema extends OasSchema {

    public discriminator: string;

    /**
     * Creates a child external documentation model.
     * @return {Oas20ExternalDocumentation}
     */
    public createExternalDocumentation(): Oas20ExternalDocumentation {
        let rval: Oas20ExternalDocumentation = new Oas20ExternalDocumentation();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    /**
     * Creates a child XML model.
     * @return {Oas20XML}
     */
    public createXML(): Oas20XML {
        let rval: Oas20XML = new Oas20XML();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    /**
     * Creates a child schema model.
     * @return {Oas20Schema}
     */
    public createAllOfSchema(): Oas20AllOfSchema {
        let rval: Oas20AllOfSchema = new Oas20AllOfSchema();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    /**
     * Creates a child schema model.
     * @return {Oas20Schema}
     */
    public createItemsSchema(): Oas20ItemsSchema {
        let rval: Oas20ItemsSchema = new Oas20ItemsSchema();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    /**
     * Creates a child schema model.
     * @return {Oas20Schema}
     */
    public createAdditionalPropertiesSchema(): Oas20AdditionalPropertiesSchema {
        let rval: Oas20AdditionalPropertiesSchema = new Oas20AdditionalPropertiesSchema();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    /**
     * Creates a child schema model.
     * @return {Oas20Schema}
     */
    public createPropertySchema(propertyName: string): Oas20PropertySchema {
        let rval: Oas20PropertySchema = new Oas20PropertySchema(propertyName);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }
}

/**
 * Subclass of Schema to indicate that this is actually a Property schema (a schema
 * defined as a property of another schema).  References:
 *
 * http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.16
 * https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#schemaObject
 */
export class Oas20PropertySchema extends Oas20Schema {

    private _propertyName: string;

    /**
     * Constructor.
     * @param propertyName
     */
    constructor(propertyName: string) {
        super()
        this._propertyName = propertyName;
    }

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas20NodeVisitor = <IOas20NodeVisitor> visitor;
        viz.visitPropertySchema(this);
    }

    /**
     * Gets the schema's property name.
     * @return {string}
     */
    public propertyName(): string {
        return this._propertyName;
    }

}


/**
 * Subclass of Schema to indicate that this is actually an "All Of" schema (a schema
 * included in the array of "allOf" schemas, which is a property of any valid schema).
 *
 * http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.22
 * https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#schemaObject
 *
 * Example:
 *
 * {
 *   "allOf": [
 *     { "type": "string" },
 *     { "maxLength": 5 }
 *   ]
 * }
 */
export class Oas20AllOfSchema extends Oas20Schema {

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas20NodeVisitor = <IOas20NodeVisitor> visitor;
        viz.visitAllOfSchema(this);
    }

}


/**
 * Subclass of Schema to indicate that this is actually an "items" schema (a schema
 * that is assigned to the 'items' property).
 *
 * http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.9
 * https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#schemaObject
 *
 * Example:
 *
 * {
 *   "items": [
 *     { "type": "string" },
 *     { "maxLength": 5 }
 *   ]
 * }
 */
export class Oas20ItemsSchema extends Oas20Schema {

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas20NodeVisitor = <IOas20NodeVisitor> visitor;
        viz.visitItemsSchema(this);
    }

}


/**
 * Subclass of Schema to indicate that this is actually an Additional Properties schema (a schema
 * defined as a property of another schema).  References:
 *
 * http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.18
 * https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#schemaObject
 */
export class Oas20AdditionalPropertiesSchema extends Oas20Schema {

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas20NodeVisitor = <IOas20NodeVisitor> visitor;
        viz.visitAdditionalPropertiesSchema(this);
    }

}

/**
 * Subclass of Schema to indicate that this is actually a Definition schema (a schema defined in
 * the "definitions" section of the OpenAPI document).  References:
 *
 * https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#definitionsObject
 */
export class Oas20SchemaDefinition extends Oas20Schema {

    private _definitionName: string;

    /**
     * Constructor.
     * @param definitionName
     */
    constructor(definitionName: string) {
        super()
        this._definitionName = definitionName;
    }

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas20NodeVisitor = <IOas20NodeVisitor> visitor;
        viz.visitSchemaDefinition(this);
    }

    /**
     * Gets the schema's property name.
     * @return {string}
     */
    public definitionName(): string {
        return this._definitionName;
    }

}
