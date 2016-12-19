/**
 * @license
 * Copyright 2016 JBoss Inc
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
