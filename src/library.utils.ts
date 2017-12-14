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

import {OasDocument} from "./models/document.model";
import {OasDocumentFactory} from "./factories/document.factory";
import {OasNode} from "./models/node.model";
import {
    Oas20JS2ModelReader, Oas20JS2ModelReaderVisitor, Oas30JS2ModelReader,
    Oas30JS2ModelReaderVisitor
} from "./readers/js2model.reader";
import {Oas20ModelToJSVisitor, Oas30ModelToJSVisitor} from "./visitors/model2js.visitor";
import {OasVisitorUtil, OasTraverserDirection} from "./visitors/visitor.utils";
import {Oas20ValidationVisitor} from "./validation/validation.visitor";
import {OasValidationError} from "./validation/validation";
import {OasNodePath} from "./models/node-path";
import {Oas20NodePathVisitor, Oas30NodePathVisitor} from "./visitors/path.visitor";

/**
 * Represents the global OAS library entry point.  This is used, for example, when
 * using the library in a simple browser environment.  This object exposes the functions
 * and classes
 */
export class OasLibraryUtils {

    /**
     * Creates a document from a source.  The source parameter can be any of the following:
     *
     * -- string: if the string starts with a { then the source is assumed to be a properly
     *            formatted OpenAPI document as a JSON string
     * -- string: if the string is a valid OpenAPI version number (e.g. "2.0") then a new
     *            empty document instance will be returned (of the appropriate version)
     * -- object: an already-parsed OpenAPI document as a javascript object
     *
     * @param source
     */
    public createDocument(source: any): OasDocument {
        let factory: OasDocumentFactory = new OasDocumentFactory();
        if (typeof source === "object") {
            return factory.createFromObject(source);
        }
        if (typeof source === "string") {
            if (source.indexOf("{") === 0) {
                return factory.createFromJson(source);
            } else {
                return factory.createEmpty(source);
            }
        }
        throw new Error("Invalid input (must be either a string or object).");
    }

    /**
     * Reads a partial model from the given source.  The caller must specify what type of
     * node is represented by the source (it is impossible to determine that automatically).
     * The source may either be a JSON string or an object.
     * @param source
     * @param node
     */
    public readNode(source: any, node: OasNode): OasNode {
        if (node === null || typeof node === "undefined") {
            throw new Error("A valid OAS node must be provided.");
        }
        if (typeof source === "string") {
            source = JSON.parse(source);
        }
        if (node.ownerDocument().is2xDocument()) {
            let reader: Oas20JS2ModelReader = new Oas20JS2ModelReader();
            let dispatcher: Oas20JS2ModelReaderVisitor = new Oas20JS2ModelReaderVisitor(reader, <any>source);
            node.accept(dispatcher);
            return node;
        } else if (node.ownerDocument().is3xDocument()) {
            let reader: Oas30JS2ModelReader = new Oas30JS2ModelReader();
            let dispatcher: Oas30JS2ModelReaderVisitor = new Oas30JS2ModelReaderVisitor(reader, <any>source);
            node.accept(dispatcher);
            return node;
        } else {
            throw new Error("Unsupported OAS version: " + node.ownerDocument().getSpecVersion());
        }
    }

    /**
     * Converts the given OAS model into a standard JS object.  Any OAS node can be
     * passed here.
     * @param node
     */
    public writeNode(node: OasNode): any {
        if (node.ownerDocument().is2xDocument()) {
            let visitor: Oas20ModelToJSVisitor = new Oas20ModelToJSVisitor();
            OasVisitorUtil.visitTree(node, visitor);
            return visitor.getResult();
        } else if (node.ownerDocument().is3xDocument()) {
            let visitor: Oas30ModelToJSVisitor = new Oas30ModelToJSVisitor();
            OasVisitorUtil.visitTree(node, visitor);
            return visitor.getResult();
        } else {
            throw new Error("OAS version " + node.ownerDocument().getSpecVersion() + " not supported.");
        }
    }

    /**
     * Validates the given OAS model.
     * @param node
     * @param recursive
     * @return {any}
     */
    public validate(node: OasNode, recursive: boolean = true): OasValidationError[] {
        if (node.ownerDocument().is2xDocument()) {
            let visitor: Oas20ValidationVisitor = new Oas20ValidationVisitor();
            if (recursive) {
                OasVisitorUtil.visitTree(node, visitor);
            } else {
                node.accept(visitor);
            }
            return visitor.getValidationErrors();
        } else if (node.ownerDocument().is3xDocument()) {
            // TODO implement validation for OpenAPI 3.x
            throw new Error("Validation rules not yet implemented for OpenAPI 3.0.x!");
        } else {
            throw new Error("OAS version " + node.ownerDocument().getSpecVersion() + " not supported.");
        }
    }

    /**
     * Creates a node path for a given data model node.
     * @param node
     * @return {OasNodePath}
     */
    public createNodePath(node: OasNode): OasNodePath {
        if (node.ownerDocument().is2xDocument()) {
            let viz: Oas20NodePathVisitor = new Oas20NodePathVisitor();
            OasVisitorUtil.visitTree(node, viz, OasTraverserDirection.up);
            return viz.path();
        } else if (node.ownerDocument().is3xDocument()) {
            let viz: Oas30NodePathVisitor = new Oas30NodePathVisitor();
            OasVisitorUtil.visitTree(node, viz, OasTraverserDirection.up);
            return viz.path();
        } else {
            throw new Error("OAS version " + node.ownerDocument().getSpecVersion() + " not supported.");
        }
    }

}

