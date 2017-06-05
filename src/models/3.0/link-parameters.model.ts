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
import {IOasIndexedNode} from "../inode.model";
import {OasNode} from "../node.model";
import {Oas30LinkParameterExpression} from "./link-parameter-expression.model";

/**
 * Models an OAS 3.0 Expression Parameters object.
 */
export class Oas30LinkParameters extends OasNode implements IOasIndexedNode<Oas30LinkParameterExpression> {

    __instanceof_IOasIndexedNode: boolean = true;

    private _expressions: Oas30ExpressionItems;

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas30NodeVisitor = visitor as IOas30NodeVisitor;
        viz.visitLinkParameters(this);
    }

    /**
     * Returns a single expression by name.
     * @param name
     * @return {Oas30LinkParameterExpression}
     */
    public expression(name: string): Oas30LinkParameterExpression {
        if (this._expressions) {
            return this._expressions[name];
        } else {
            return null;
        }
    }

    /**
     * Returns an array of all the expressions.
     */
    public expressions(): Oas30LinkParameterExpression[] {
        let names: string[] = this.expressionNames();
        let rval: Oas30LinkParameterExpression[] = [];
        for (let name of names) {
            rval.push(this.expression(name));
        }
        return rval;
    }

    /**
     * Adds a expression.
     * @param name
     * @param expression
     */
    public addExpression(name: string, expression: Oas30LinkParameterExpression): Oas30LinkParameterExpression {
        if (this._expressions == null) {
            this._expressions = new Oas30ExpressionItems();
        }
        this._expressions[name] = expression;
        return expression;
    }

    /**
     * Removes a single expression child model.
     * @param name
     */
    public removeExpression(name: string): Oas30LinkParameterExpression {
        let rval: Oas30LinkParameterExpression = this._expressions[name];
        if (this._expressions && rval) {
            delete this._expressions[name];
        }
        return rval;
    }

    /**
     * Gets a list of all the expression names.
     */
    public expressionNames(): string[] {
        let rval: string[] = [];
        for (let pname in this._expressions) {
            rval.push(pname);
        }
        return rval;
    }

    /**
     * Creates an OAS Expression object.
     * @param name
     * @param value
     * @return {Oas30LinkParameterExpression}
     */
    public createExpression(name: string, value: any): Oas30LinkParameterExpression {
        let rval: Oas30LinkParameterExpression = new Oas30LinkParameterExpression(name, value);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    getItem(name: string): Oas30LinkParameterExpression {
        return this.expression(name);
    }

    getItems(): Oas30LinkParameterExpression[] {
        return this.expressions();
    }

    getItemNames(): string[] {
        return this.expressionNames();
    }

    addItem(name: string, item: Oas30LinkParameterExpression): void {
        this.addExpression(name, item);
    }

    deleteItem(name: string): Oas30LinkParameterExpression {
        return this.removeExpression(name);
    }

}


export class Oas30ExpressionItems {
    [key: string]: Oas30LinkParameterExpression;
}
