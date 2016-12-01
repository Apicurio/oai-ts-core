import {IOasNodeVisitor, IOas20NodeVisitor} from "../../visitors/visitor.iface";
import {Oas20ExternalDocumentation} from "./external-documentation.model";
import {Oas20Items} from "./items.model";
import {Oas20XML} from "./xml.model";

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
export class Oas20Schema extends Oas20Items {

    public $ref: string;
    public title: string;
    public description: string;
    public maxProperties: number;
    public minProperties: number;
    public required: boolean;
    public allOf: Oas20AllOfSchema[];
    public properties: Oas20SchemaProperties;
    public additionalProperties: (boolean | Oas20AdditionalPropertiesSchema);
    public discriminator: string;
    public readOnly: boolean;
    public xml: Oas20XML;
    public externalDocs: Oas20ExternalDocumentation;
    public example: any;

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas20NodeVisitor = <IOas20NodeVisitor> visitor;
        viz.visitSchema(this);
    }

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
     * Add a property.
     * @param propertyName
     * @param schema
     */
    public addProperty(propertyName: string, schema: Oas20PropertySchema): void {
        if (this.properties == null) {
            this.properties = new Oas20SchemaProperties();
        }
        this.properties[propertyName] = schema;
    }

    /**
     * Removes a property by name.
     * @param propertyName
     */
    public removeProperty(propertyName: string) {
        if (this.properties && this.properties[propertyName]) {
            delete this.properties[propertyName];
        }
    }

    /**
     * Gets a single property.
     * @param propertyName
     * @return {null}
     */
    public property(propertyName: string): Oas20Schema {
        if (this.properties && this.properties[propertyName]) {
            return this.properties[propertyName];
        } else {
            return null;
        }
    }
}


export class Oas20SchemaProperties {

    [key: string]: Oas20PropertySchema;

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
export class Oas20DefinitionSchema extends Oas20Schema {

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
        viz.visitDefinitionSchema(this);
    }

    /**
     * Gets the schema's property name.
     * @return {string}
     */
    public definitionName(): string {
        return this._definitionName;
    }

}
