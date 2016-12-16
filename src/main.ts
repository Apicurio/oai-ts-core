import {OasDocument} from "./models/document.model";
import {OasNode} from "./models/node.model";
import {OasLibraryUtils} from "./library.utils";

var _oas_library_utils: OasLibraryUtils = new OasLibraryUtils();

export function createDocument(source: any): OasDocument {
    return _oas_library_utils.createDocument(source);
}

export function readNode(source: any, node: OasNode): OasNode {
    return _oas_library_utils.readNode(source, node);
}

export function writeNode(node: OasNode): any {
    return _oas_library_utils.writeNode(node);
}
