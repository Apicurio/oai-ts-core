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

import {OasNode} from "./node.model";

/**
 * Nodes that support indexed children must implement this interface.  Examples include:
 *
 * Oas20Paths
 * Oas20Definitions
 * Oas20Reponses
 */
export interface IOasIndexedNode<T extends OasNode> {

    __instanceof_IOasIndexedNode: boolean;

    /**
     * Gets a single item (indexed child) by name.  Returns undefined if not found.
     * @param name
     */
    getItem(name: string): T;

    /**
     * Returns an array of all the child items.
     */
    getItems(): T[];

    /**
     * Gets a list of the names of all indexed children.
     */
    getItemNames(): string[];

    /**
     * Adds a child item.
     * @param name
     * @param item
     */
    addItem(name: string, item: T): void;

    /**
     * Deletes a child item by name and returns the deleted child or undefined if there wasn't one.
     * @param name
     */
    deleteItem(name: string): T;

}