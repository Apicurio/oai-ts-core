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

import {OasDocument} from "./document.model";
import {IOasNodeVisitor} from "../visitors/visitor.iface";

var __modelIdCounter = 0;

/**
 * Base class for all OAS nodes.  Contains common fields and methods across all
 * nodes of all versions of the OpenAPI Specification.
 */
export abstract class OasNode {

    public _ownerDocument: OasDocument;
    public _parent: OasNode;
    public _modelId: number = __modelIdCounter++;
    public _attributes: OasNodeAttributes = new OasNodeAttributes();

    /**
     * Gets the owner document.
     * @return {OasDocument}
     */
    public ownerDocument(): OasDocument {
        return this._ownerDocument;
    }

    /**
     * Gets the parent.
     * @return {OasNode}
     */
    public parent(): OasNode {
        return this._parent;
    }

    /**
     * Gets the model's unique ID.
     * @return {number}
     */
    public modelId(): number {
        return this._modelId;
    }

    /**
     * Accept the given visitor (call back the appropriate visit() method).
     * @param visitor
     */
    public abstract accept(visitor: IOasNodeVisitor): void;

    /**
     * Gets or sets a node attribute.  When setting the attribute, the previous value
     * will be returned. Otherwise the current value is returned.
     * @param name
     * @param value
     * @return {any}
     */
    public n_attribute(name: string, value?: any): any {
        if (value === undefined) {
            return this._attributes[name];
        } else {
            let pvalue: any = this._attributes[name];
            this._attributes[name] = value;
            return pvalue;
        }
    }
}


export class OasNodeAttributes {

    [key: string]: any;

}