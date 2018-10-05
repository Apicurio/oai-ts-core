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

import {OasExtension} from "./extension.model";
import {OasNode} from "./node.model";

/**
 * Base class for all extensible OAS nodes.  Most nodes allow extension properties that
 * being with x-* (OAS 2.0).
 */
export abstract class OasExtensibleNode extends OasNode {

    private _extensions: OasExtension[];

    /**
     * Returns all the extensions.
     * @return {OasExtension[]}
     */
    public extensions(): OasExtension[] {
        return this._extensions;
    }

    /**
     * Gets a single extension by name or null if not found.
     * @param name
     */
    public extension(name: string): OasExtension {
        let rval: OasExtension = null;
        if (this._extensions) {
            this._extensions.forEach( extension => {
                if (extension.name === name) {
                    rval = extension;
                }
            });
        }
        return rval;
    }

    /**
     * Creates an extension.
     * @return {OasExtension}
     */
    public createExtension(): OasExtension {
        let rval: OasExtension = new OasExtension();
        rval._ownerDocument = this.ownerDocument();
        rval._parent = this;
        return rval;
    }

    /**
     * Adds an extension.
     * @param name
     * @param value
     */
    public addExtension(name: string, value: any): OasExtension {
        let ext: OasExtension = this.createExtension();
        ext.name = name;
        ext.value = value;
        if (!this._extensions) {
            this._extensions = [];
        }
        this._extensions.push(ext);
        return ext;
    }

    /**
     * Removes an extension by name.
     * @param name
     */
    public removeExtension(name: string): OasExtension {
        let rval: OasExtension = null;
        if (this._extensions) {
            let idx: number = -1;
            this._extensions.forEach( (extension, index) => {
                if (extension.name === name) {
                    rval = extension;
                    idx = index;
                }
            });
            if (idx !== -1) {
                this._extensions.splice(idx, 1);
            }
        }
        return rval;
    }

}
