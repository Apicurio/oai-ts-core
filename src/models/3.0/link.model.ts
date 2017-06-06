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
import {Oas30Headers} from "./headers.model";
import {Oas30LinkParameters} from "./link-parameters.model";

/**
 * Models an OAS 3.0 Link object.
 */
export class Oas30Link extends OasExtensibleNode {

    private _name: string;

    public $ref: string;
    public operationRef: string;
    public operationId: string;
    public parameters: Oas30LinkParameters;
    public headers: Oas30Headers;
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
     * Creates a child link parameters model.
     * @return {Oas30LinkParameters}
     */
    public createLinkParameters(): Oas30LinkParameters {
        let rval: Oas30LinkParameters = new Oas30LinkParameters();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    }

    /**
     * Creates an OAS 3.0 Headers object.
     * @return {Oas30Headers}
     */
    public createHeaders(): Oas30Headers {
        let rval: Oas30Headers = new Oas30Headers();
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
