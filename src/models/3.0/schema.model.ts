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

import {IOas30NodeVisitor, IOasNodeVisitor} from "../../visitors/visitor.iface";
import {Oas30XML} from "./xml.model";
import {OasSchema} from "../common/schema.model";
import {Oas30ExternalDocumentation} from "./external-documentation.model";
import {Oas30Discriminator} from "./discriminator.model";


/**
 * Models an OAS 3.0 Schema object.  Example:
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
export class Oas30Schema extends OasSchema {

    public oneOf: OasSchema[];
    public anyOf: OasSchema[];
    public not: OasSchema;

    public discriminator: Oas30Discriminator;

    public nullable: boolean;
    public writeOnly: boolean;
    public deprecated: boolean;

    /**
     * Creates a child Discriminator model.
     * @return {Oas30Discriminator}
     */
    public createDiscriminator(): Oas30Discriminator {
        let rval: Oas30Discriminator = new Oas30Discriminator();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    /**
     * Creates a child external documentation model.
     * @return {Oas30ExternalDocumentation}
     */
    public createExternalDocumentation(): Oas30ExternalDocumentation {
        let rval: Oas30ExternalDocumentation = new Oas30ExternalDocumentation();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    /**
     * Creates a child XML model.
     * @return {Oas30XML}
     */
    public createXML(): Oas30XML {
        let rval: Oas30XML = new Oas30XML();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    /**
     * Creates a child schema model.
     * @return {Oas30Schema}
     */
    public createAllOfSchema(): Oas30AllOfSchema {
        let rval: Oas30AllOfSchema = new Oas30AllOfSchema();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    /**
     * Creates a child schema model.
     * @return {Oas30Schema}
     */
    public createOneOfSchema(): Oas30OneOfSchema {
        let rval: Oas30OneOfSchema = new Oas30OneOfSchema();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    /**
     * Creates a child schema model.
     * @return {Oas30Schema}
     */
    public createAnyOfSchema(): Oas30AnyOfSchema {
        let rval: Oas30AnyOfSchema = new Oas30AnyOfSchema();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    /**
     * Creates a child schema model.
     * @return {Oas30Schema}
     */
    public createNotSchema(): Oas30NotSchema {
        let rval: Oas30NotSchema = new Oas30NotSchema();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    /**
     * Creates a child schema model.
     * @return {Oas30Schema}
     */
    public createItemsSchema(): Oas30ItemsSchema {
        let rval: Oas30ItemsSchema = new Oas30ItemsSchema();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    /**
     * Creates a child schema model.
     * @return {Oas30Schema}
     */
    public createAdditionalPropertiesSchema(): Oas30AdditionalPropertiesSchema {
        let rval: Oas30AdditionalPropertiesSchema = new Oas30AdditionalPropertiesSchema();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    /**
     * Creates a child schema model.
     * @return {Oas30Schema}
     */
    public createPropertySchema(propertyName: string): Oas30PropertySchema {
        let rval: Oas30PropertySchema = new Oas30PropertySchema(propertyName);
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
export class Oas30PropertySchema extends Oas30Schema {

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
        let viz: IOas30NodeVisitor = <IOas30NodeVisitor> visitor;
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
export class Oas30AllOfSchema extends Oas30Schema {

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas30NodeVisitor = <IOas30NodeVisitor> visitor;
        viz.visitAllOfSchema(this);
    }

}


/**
 * Subclass of Schema to indicate that this is actually an "Any Of" schema (a schema
 * included in the array of "anyOf" schemas, which is a property of any valid schema).
 *
 * http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.22
 * https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#schemaObject
 */
export class Oas30AnyOfSchema extends Oas30Schema {

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas30NodeVisitor = <IOas30NodeVisitor> visitor;
        viz.visitAnyOfSchema(this);
    }

}


/**
 * Subclass of Schema to indicate that this is actually an "One Of" schema (a schema
 * included in the array of "oneOf" schemas, which is a property of any valid schema).
 *
 * http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.22
 * https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#schemaObject
 */
export class Oas30OneOfSchema extends Oas30Schema {

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas30NodeVisitor = <IOas30NodeVisitor> visitor;
        viz.visitOneOfSchema(this);
    }

}


/**
 * Subclass of Schema to indicate that this is actually a "Not" schema (a schema
 * set in the "not" property of a schema).
 *
 * http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.22
 * https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#schemaObject
 */
export class Oas30NotSchema extends Oas30Schema {

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas30NodeVisitor = <IOas30NodeVisitor> visitor;
        viz.visitNotSchema(this);
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
export class Oas30ItemsSchema extends Oas30Schema {

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas30NodeVisitor = <IOas30NodeVisitor> visitor;
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
export class Oas30AdditionalPropertiesSchema extends Oas30Schema {

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas30NodeVisitor = <IOas30NodeVisitor> visitor;
        viz.visitAdditionalPropertiesSchema(this);
    }

}


/**
 * Subclass of Schema to indicate that this is actually a Definition (a schema defined in
 * the "components" section of the OpenAPI document).
 */
export class Oas30SchemaDefinition extends Oas30Schema {

    private _name: string;

    /**
     * Constructor.
     * @param name
     */
    constructor(name: string) {
        super();
        this._name = name;
    }

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas30NodeVisitor = <IOas30NodeVisitor> visitor;
        viz.visitSchemaDefinition(this);
    }

    /**
     * Gets the schema's property name.
     * @return {string}
     */
    public name(): string {
        return this._name;
    }

}
