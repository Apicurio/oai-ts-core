import {OasDocument} from "./models/document.model";
import {OasDocumentFactory} from "./factories/document.factory";
import {OasNode} from "./models/node.model";
import {Oas20JS2ModelReader, Oas20JS2ModelReaderVisitor} from "./readers/js2model.reader";
import {Oas20ModelToJSVisitor} from "./visitors/model2js.visitor";
import {OasVisitorUtil} from "./visitors/visitor.utils";

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
            if (source.startsWith("{")) {
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
        if (node.ownerDocument().getSpecVersion() === "2.0") {
            let reader: Oas20JS2ModelReader = new Oas20JS2ModelReader();
            let dispatcher: Oas20JS2ModelReaderVisitor = new Oas20JS2ModelReaderVisitor(reader, <any>source);
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
        if (node._ownerDocument.getSpecVersion() === "2.0") {
            let visitor: Oas20ModelToJSVisitor = new Oas20ModelToJSVisitor();
            OasVisitorUtil.visitTree(node, visitor);
            return visitor.getResult();
        } else {
            throw new Error("OAS version " + node._ownerDocument.getSpecVersion() + " not supported.");
        }
    }

}

