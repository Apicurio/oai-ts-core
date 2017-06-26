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
import {Oas30LinkServer} from "./server.model";
import {Oas30Header} from "./header.model";
import {Oas30LinkParameterExpression} from "./link-parameter-expression.model";
import {Oas30LinkRequestBodyExpression} from "./link-request-body-expression.model";

/**
 * Models an OAS 3.0 Link object.
 */
export class Oas30Link extends OasExtensibleNode {

    private _name: string;

    public $ref: string;
    public operationRef: string;
    public operationId: string;
    public parameters: Oas30LinkParameters = new Oas30LinkParameters();
    public requestBody: Oas30LinkRequestBodyExpression;
    public description: string;
    public server: Oas30LinkServer;

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
        let viz: IOas30NodeVisitor = visitor as IOas30NodeVisitor;
        viz.visitLink(this);
    }

    /**
     * Gets the name of the link.
     * @return {string}
     */
    public name(): string {
        return this._name;
    }

    /**
     * Creates a link parameter expression.
     * @param name
     * @param value
     * @return {Oas30LinkParameterExpression}
     */
    public createLinkParameterExpression(name: string, value: any): Oas30LinkParameterExpression {
        let rval: Oas30LinkParameterExpression = new Oas30LinkParameterExpression(name, value);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    /**
     * Adds a link parameter expression.
     * @param name
     * @param expression
     */
    public addLinkParameterExpression(name: string, expression: Oas30LinkParameterExpression): void {
        this.parameters[name] = expression;
    }

    /**
     * Adds a link parameter expression.
     * @param name
     * @param expression
     * @return {Oas30LinkParameterExpression}
     */
    public addLinkParameter(name: string, expression: string): Oas30LinkParameterExpression {
        let model: Oas30LinkParameterExpression = this.createLinkParameterExpression(name, expression);
        this.addLinkParameterExpression(name, model);
        return model;
    }

    /**
     * Gets a single link parameter expression by name.
     * @param name
     * @return {Oas30LinkParameterExpression}
     */
    public getLinkParameterExpression(name: string): Oas30LinkParameterExpression {
        return this.parameters[name];
    }

    /**
     * Removes a single link parameter expression and returns it.  This may return null or undefined if none found.
     * @param name
     * @return {Oas30LinkParameterExpression}
     */
    public removeLinkParameterExpression(name: string): Oas30LinkParameterExpression {
        let rval: Oas30LinkParameterExpression = this.parameters[name];
        if (rval) {
            delete this.parameters[name];
        }
        return rval;
    }

    /**
     * Gets a list of all link parameter expressions.
     * @return {Oas30LinkParameterExpression[]}
     */
    public getLinkParameterExpressions(): Oas30LinkParameterExpression[] {
        let rval: Oas30LinkParameterExpression[] = [];
        for (let name in this.parameters) {
            rval.push(this.parameters[name]);
        }
        return rval;
    }

    /**
     * Creates a link request body expression.
     * @param name
     * @param value
     * @return {Oas30LinkRequestBodyExpression}
     */
    public createLinkRequestBodyExpression(value: any): Oas30LinkRequestBodyExpression {
        let rval: Oas30LinkRequestBodyExpression = new Oas30LinkRequestBodyExpression(value);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    /**
     * Creates a header.
     * @param name
     * @return {Oas30Header}
     */
    public createHeader(name: string): Oas30Header {
        let rval: Oas30Header = new Oas30Header(name);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    /**
     * Creates an OAS 3.0 Server object.
     * @return {Oas30LinkServer}
     */
    public createServer(): Oas30LinkServer {
        let rval: Oas30LinkServer = new Oas30LinkServer();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

}


/**
 * Models a link definition found in the components section of an OAS document.
 */
export class Oas30LinkDefinition extends Oas30Link {

    /**
     * Constructor.
     * @param name
     */
    constructor(name: string) {
        super(name);
    }

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas30NodeVisitor = <IOas30NodeVisitor> visitor;
        viz.visitLinkDefinition(this);
    }

}


export class Oas30LinkHeaders {
    [key: string]: Oas30Header;
}


export class Oas30LinkParameters {
    [key: string]: Oas30LinkParameterExpression;
}
