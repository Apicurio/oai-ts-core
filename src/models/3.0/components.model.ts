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
import {OasExtensibleNode} from "../enode.model";
import {Oas30SchemaDefinition} from "./schema.model";
import {Oas30ResponseDefinition} from "./response.model";
import {Oas30ParameterDefinition} from "./parameter.model";
import {Oas30ExampleDefinition} from "./example.model";
import {Oas30RequestBodyDefinition} from "./request-body.model";
import {Oas30HeaderDefinition} from "./header.model";
import {Oas30SecurityScheme} from "./security-scheme.model";
import {Oas30LinkDefinition} from "./link.model";
import {Oas30CallbackDefinition} from "./callback.model";

/**
 * Models an OAS 3.0 Components object.  Example:
 *
 * {
 *   "schemas": {
 *       "Category": {
 *         "type": "object",
 *         "properties": {
 *           "id": {
 *             "type": "integer",
 *             "format": "int64"
 *           },
 *           "name": {
 *             "type": "string"
 *           }
 *         }
 *       },
 *       "Tag": {
 *         "type": "object",
 *         "properties": {
 *           "id": {
 *             "type": "integer",
 *             "format": "int64"
 *           },
 *           "name": {
 *             "type": "string"
 *           }
 *         }
 *       }
 *     }
 *   },
 *  "parameters": {
 *     "skipParam": {
 *       "name": "skip",
 *       "in": "query",
 *       "description": "number of items to skip",
 *       "required": true,
 *       "schema": {
 *         "type": "integer",
 *         "format": "int32"
 *       }
 *     },
 *     "limitParam": {
 *       "name": "limit",
 *       "in": "query",
 *       "description": "max records to return",
 *       "required": true,
 *       "schema" : {
 *         "type": "integer",
 *         "format": "int32"
 *       }
 *     }
 *   },
 *  "responses": {
 *     "NotFound": {
 *       "description": "Entity not found."
 *     },
 *     "IllegalInput": {
 *       "description": "Illegal input for operation."
 *     },
 *     "GeneralError": {
 *       "description": "General Error",
 *       "content": {
 *         "application/json": {
 *           "schema": {
 *             "$ref": "#/components/schemas/GeneralError"
 *           }
 *         }
 *       }
 *     }
 *   },
 *  "securitySchemes": {
 *     "api_key": {
 *       "type": "apiKey",
 *       "name": "api_key",
 *       "in": "header"
 *     },
 *     "petstore_auth": {
 *       "type": "oauth2",
 *       "flows": {
 *         "implicit": {
 *           "authorizationUrl": "http://example.org/api/oauth/dialog",
 *           "scopes": {
 *             "write:pets": "modify pets in your account",
 *             "read:pets": "read your pets"
 *           }
 *         }
 *       }
 *     }
 *   }
 * }
 */
export class Oas30Components extends OasExtensibleNode {

    public schemas: Oas30SchemaComponents = new Oas30SchemaComponents();
    public responses: Oas30ResponseComponents = new Oas30ResponseComponents();
    public parameters: Oas30ParameterComponents = new Oas30ParameterComponents();
    public examples: Oas30ExampleComponents = new Oas30ExampleComponents();
    public requestBodies: Oas30RequestBodyComponents = new Oas30RequestBodyComponents();
    public headers: Oas30HeaderComponents = new Oas30HeaderComponents();
    public securitySchemes: Oas30SecuritySchemeComponents = new Oas30SecuritySchemeComponents();
    public links: Oas30LinkComponents = new Oas30LinkComponents();
    public callbacks: Oas30CallbackComponents = new Oas30CallbackComponents();

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas30NodeVisitor = visitor as IOas30NodeVisitor;
        viz.visitComponents(this);
    }

    /**
     * Creates a schema definition.
     * @param name
     * @return {Oas30SchemaDefinition}
     */
    public createSchemaDefinition(name: string): Oas30SchemaDefinition {
        let rval: Oas30SchemaDefinition = new Oas30SchemaDefinition(name);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    /**
     * Adds a schema definition.
     * @param name
     * @param schemaDefinition
     */
    public addSchemaDefinition(name: string, schemaDefinition: Oas30SchemaDefinition): void {
        this.schemas[name] = schemaDefinition;
    }

    /**
     * Gets a single schema definition by name.
     * @param name
     * @return {Oas30SchemaDefinition}
     */
    public getSchemaDefinition(name: string): Oas30SchemaDefinition {
        return this.schemas[name];
    }

    /**
     * Removes a single schema definition and returns it.  This may return null or undefined if none found.
     * @param name
     * @return {Oas30SchemaDefinition}
     */
    public removeSchemaDefinition(name: string): Oas30SchemaDefinition {
        let rval: Oas30SchemaDefinition = this.schemas[name];
        if (rval) {
            delete this.schemas[name];
        }
        return rval;
    }

    /**
     * Gets a list of all schema definitions.
     * @return {Oas30SchemaDefinition[]}
     */
    public getSchemaDefinitions(): Oas30SchemaDefinition[] {
        let rval: Oas30SchemaDefinition[] = [];
        for (let name in this.schemas) {
            rval.push(this.schemas[name]);
        }
        return rval;
    }

    /**
     * Creates a response definition.
     * @param name
     * @return {Oas30ResponseDefinition}
     */
    public createResponseDefinition(name: string): Oas30ResponseDefinition {
        let rval: Oas30ResponseDefinition = new Oas30ResponseDefinition(name);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    /**
     * Adds a response definition.
     * @param name
     * @param responseDefinition
     */
    public addResponseDefinition(name: string, responseDefinition: Oas30ResponseDefinition): void {
        this.responses[name] = responseDefinition;
    }

    /**
     * Gets a single response definition by name.
     * @param name
     * @return {Oas30ResponseDefinition}
     */
    public getResponseDefinition(name: string): Oas30ResponseDefinition {
        return this.responses[name];
    }

    /**
     * Removes a single response definition and returns it.  This may return null or undefined if none found.
     * @param name
     * @return {Oas30ResponseDefinition}
     */
    public removeResponseDefinition(name: string): Oas30ResponseDefinition {
        let rval: Oas30ResponseDefinition = this.responses[name];
        if (rval) {
            delete this.responses[name];
        }
        return rval;
    }

    /**
     * Gets a list of all response definitions.
     * @return {Oas30ResponseDefinition[]}
     */
    public getResponseDefinitions(): Oas30ResponseDefinition[] {
        let rval: Oas30ResponseDefinition[] = [];
        for (let name in this.responses) {
            rval.push(this.responses[name]);
        }
        return rval;
    }

    /**
     * Creates a parameter definition.
     * @param name
     * @return {Oas30ParameterDefinition}
     */
    public createParameterDefinition(name: string): Oas30ParameterDefinition {
        let rval: Oas30ParameterDefinition = new Oas30ParameterDefinition(name);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    /**
     * Adds a parameter definition.
     * @param name
     * @param parameterDefinition
     */
    public addParameterDefinition(name: string, parameterDefinition: Oas30ParameterDefinition): void {
        this.parameters[name] = parameterDefinition;
    }

    /**
     * Gets a single parameter definition by name.
     * @param name
     * @return {Oas30ParameterDefinition}
     */
    public getParameterDefinition(name: string): Oas30ParameterDefinition {
        return this.parameters[name];
    }

    /**
     * Removes a single parameter definition and returns it.  This may return null or undefined if none found.
     * @param name
     * @return {Oas30ParameterDefinition}
     */
    public removeParameterDefinition(name: string): Oas30ParameterDefinition {
        let rval: Oas30ParameterDefinition = this.parameters[name];
        if (rval) {
            delete this.parameters[name];
        }
        return rval;
    }

    /**
     * Gets a list of all parameter definitions.
     * @return {Oas30ParameterDefinition[]}
     */
    public getParameterDefinitions(): Oas30ParameterDefinition[] {
        let rval: Oas30ParameterDefinition[] = [];
        for (let name in this.parameters) {
            rval.push(this.parameters[name]);
        }
        return rval;
    }

    /**
     * Creates a example definition.
     * @param name
     * @return {Oas30ExampleDefinition}
     */
    public createExampleDefinition(name: string): Oas30ExampleDefinition {
        let rval: Oas30ExampleDefinition = new Oas30ExampleDefinition(name);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    /**
     * Adds a example definition.
     * @param name
     * @param exampleDefinition
     */
    public addExampleDefinition(name: string, exampleDefinition: Oas30ExampleDefinition): void {
        this.examples[name] = exampleDefinition;
    }

    /**
     * Gets a single example definition by name.
     * @param name
     * @return {Oas30ExampleDefinition}
     */
    public getExampleDefinition(name: string): Oas30ExampleDefinition {
        return this.examples[name];
    }

    /**
     * Removes a single example definition and returns it.  This may return null or undefined if none found.
     * @param name
     * @return {Oas30ExampleDefinition}
     */
    public removeExampleDefinition(name: string): Oas30ExampleDefinition {
        let rval: Oas30ExampleDefinition = this.examples[name];
        if (rval) {
            delete this.examples[name];
        }
        return rval;
    }

    /**
     * Gets a list of all example definitions.
     * @return {Oas30ExampleDefinition[]}
     */
    public getExampleDefinitions(): Oas30ExampleDefinition[] {
        let rval: Oas30ExampleDefinition[] = [];
        for (let name in this.examples) {
            rval.push(this.examples[name]);
        }
        return rval;
    }

    /**
     * Creates a request body definition.
     * @param name
     * @return {Oas30RequestBodyDefinition}
     */
    public createRequestBodyDefinition(name: string): Oas30RequestBodyDefinition {
        let rval: Oas30RequestBodyDefinition = new Oas30RequestBodyDefinition(name);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    /**
     * Adds a request body definition.
     * @param name
     * @param requestBodyDefinition
     */
    public addRequestBodyDefinition(name: string, requestBodyDefinition: Oas30RequestBodyDefinition): void {
        this.requestBodies[name] = requestBodyDefinition;
    }

    /**
     * Gets a single request body definition by name.
     * @param name
     * @return {Oas30RequestBodyDefinition}
     */
    public getRequestBodyDefinition(name: string): Oas30RequestBodyDefinition {
        return this.requestBodies[name];
    }

    /**
     * Removes a single request body definition and returns it.  This may return null or undefined if none found.
     * @param name
     * @return {Oas30RequestBodyDefinition}
     */
    public removeRequestBodyDefinition(name: string): Oas30RequestBodyDefinition {
        let rval: Oas30RequestBodyDefinition = this.requestBodies[name];
        if (rval) {
            delete this.requestBodies[name];
        }
        return rval;
    }

    /**
     * Gets a list of all request body definitions.
     * @return {Oas30RequestBodyDefinition[]}
     */
    public getRequestBodyDefinitions(): Oas30RequestBodyDefinition[] {
        let rval: Oas30RequestBodyDefinition[] = [];
        for (let name in this.requestBodies) {
            rval.push(this.requestBodies[name]);
        }
        return rval;
    }

    /**
     * Creates a header definition.
     * @param name
     * @return {Oas30HeaderDefinition}
     */
    public createHeaderDefinition(name: string): Oas30HeaderDefinition {
        let rval: Oas30HeaderDefinition = new Oas30HeaderDefinition(name);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    /**
     * Adds a header definition.
     * @param name
     * @param headerDefinition
     */
    public addHeaderDefinition(name: string, headerDefinition: Oas30HeaderDefinition): void {
        this.headers[name] = headerDefinition;
    }

    /**
     * Gets a single header definition by name.
     * @param name
     * @return {Oas30HeaderDefinition}
     */
    public getHeaderDefinition(name: string): Oas30HeaderDefinition {
        return this.headers[name];
    }

    /**
     * Removes a single header definition and returns it.  This may return null or undefined if none found.
     * @param name
     * @return {Oas30HeaderDefinition}
     */
    public removeHeaderDefinition(name: string): Oas30HeaderDefinition {
        let rval: Oas30HeaderDefinition = this.headers[name];
        if (rval) {
            delete this.headers[name];
        }
        return rval;
    }

    /**
     * Gets a list of all header definitions.
     * @return {Oas30HeaderDefinition[]}
     */
    public getHeaderDefinitions(): Oas30HeaderDefinition[] {
        let rval: Oas30HeaderDefinition[] = [];
        for (let name in this.headers) {
            rval.push(this.headers[name]);
        }
        return rval;
    }

    /**
     * Creates a security scheme definition.
     * @param name
     * @return {Oas30SecurityScheme}
     */
    public createSecurityScheme(name: string): Oas30SecurityScheme {
        let rval: Oas30SecurityScheme = new Oas30SecurityScheme(name);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    /**
     * Adds a security scheme definition.
     * @param name
     * @param securityScheme
     */
    public addSecurityScheme(name: string, securityScheme: Oas30SecurityScheme): void {
        this.securitySchemes[name] = securityScheme;
    }

    /**
     * Gets a single security scheme definition by name.
     * @param name
     * @return {Oas30SecurityScheme}
     */
    public getSecurityScheme(name: string): Oas30SecurityScheme {
        return this.securitySchemes[name];
    }

    /**
     * Removes a single security scheme definition and returns it.  This may return null or undefined if none found.
     * @param name
     * @return {Oas30SecurityScheme}
     */
    public removeSecurityScheme(name: string): Oas30SecurityScheme {
        let rval: Oas30SecurityScheme = this.securitySchemes[name];
        if (rval) {
            delete this.securitySchemes[name];
        }
        return rval;
    }

    /**
     * Gets a list of all security scheme definitions.
     * @return {Oas30SecurityScheme[]}
     */
    public getSecuritySchemes(): Oas30SecurityScheme[] {
        let rval: Oas30SecurityScheme[] = [];
        for (let name in this.securitySchemes) {
            rval.push(this.securitySchemes[name]);
        }
        return rval;
    }

    /**
     * Creates a link definition.
     * @param name
     * @return {Oas30LinkDefinition}
     */
    public createLinkDefinition(name: string): Oas30LinkDefinition {
        let rval: Oas30LinkDefinition = new Oas30LinkDefinition(name);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    /**
     * Adds a link definition.
     * @param name
     * @param linkDefinition
     */
    public addLinkDefinition(name: string, linkDefinition: Oas30LinkDefinition): void {
        this.links[name] = linkDefinition;
    }

    /**
     * Gets a single link definition by name.
     * @param name
     * @return {Oas30LinkDefinition}
     */
    public getLinkDefinition(name: string): Oas30LinkDefinition {
        return this.links[name];
    }

    /**
     * Removes a single link definition and returns it.  This may return null or undefined if none found.
     * @param name
     * @return {Oas30LinkDefinition}
     */
    public removeLinkDefinition(name: string): Oas30LinkDefinition {
        let rval: Oas30LinkDefinition = this.links[name];
        if (rval) {
            delete this.links[name];
        }
        return rval;
    }

    /**
     * Gets a list of all link definitions.
     * @return {Oas30LinkDefinition[]}
     */
    public getLinkDefinitions(): Oas30LinkDefinition[] {
        let rval: Oas30LinkDefinition[] = [];
        for (let name in this.links) {
            rval.push(this.links[name]);
        }
        return rval;
    }

    /**
     * Creates a callback definition.
     * @param name
     * @return {Oas30CallbackDefinition}
     */
    public createCallbackDefinition(name: string): Oas30CallbackDefinition {
        let rval: Oas30CallbackDefinition = new Oas30CallbackDefinition(name);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    /**
     * Adds a callback definition.
     * @param name
     * @param callbackDefinition
     */
    public addCallbackDefinition(name: string, callbackDefinition: Oas30CallbackDefinition): void {
        this.callbacks[name] = callbackDefinition;
    }

    /**
     * Gets a single callback definition by name.
     * @param name
     * @return {Oas30CallbackDefinition}
     */
    public getCallbackDefinition(name: string): Oas30CallbackDefinition {
        return this.callbacks[name];
    }

    /**
     * Removes a single callback definition and returns it.  This may return null or undefined if none found.
     * @param name
     * @return {Oas30CallbackDefinition}
     */
    public removeCallbackDefinition(name: string): Oas30CallbackDefinition {
        let rval: Oas30CallbackDefinition = this.callbacks[name];
        if (rval) {
            delete this.callbacks[name];
        }
        return rval;
    }

    /**
     * Gets a list of all callback definitions.
     * @return {Oas30CallbackDefinition[]}
     */
    public getCallbackDefinitions(): Oas30CallbackDefinition[] {
        let rval: Oas30CallbackDefinition[] = [];
        for (let name in this.callbacks) {
            rval.push(this.callbacks[name]);
        }
        return rval;
    }

}


export class Oas30SchemaComponents {
    [key: string]: Oas30SchemaDefinition;
}

export class Oas30ResponseComponents {
    [key: string]: Oas30ResponseDefinition;
}

export class Oas30ParameterComponents {
    [key: string]: Oas30ParameterDefinition;
}

export class Oas30ExampleComponents {
    [key: string]: Oas30ExampleDefinition;
}

export class Oas30RequestBodyComponents {
    [key: string]: Oas30RequestBodyDefinition;
}

export class Oas30HeaderComponents {
    [key: string]: Oas30HeaderDefinition;
}

export class Oas30SecuritySchemeComponents {
    [key: string]: Oas30SecurityScheme;
}

export class Oas30LinkComponents {
    [key: string]: Oas30LinkDefinition;
}

export class Oas30CallbackComponents {
    [key: string]: Oas30CallbackDefinition;
}
