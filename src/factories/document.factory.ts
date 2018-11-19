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

import {OasDocument} from "../models/document.model";
import {Oas20Document} from "../models/2.0/document.model";
import {Oas20JS2ModelReader, Oas30JS2ModelReader} from "../readers/js2model.reader";
import {Oas30Document} from "../models/3.0/document.model";

/**
 * The main factory for creating new OAS Documents.  This can be used to create a new, empty
 * document.  It can also be used to parse
 */
export class OasDocumentFactory {

    private V2_DEFAULT_MINOR = "0";
    private V3_DEFAULT_MINOR = "0";
    private V3_DEFAULT_PATCH = "2";

    /**
     * Creates a new, empty instance of an OAS document.
     * @param oasVersion
     * @return {OasDocument}
     */
    public createEmpty(oasVersion: string): OasDocument {
        const ver = oasVersion;
        oasVersion = this.parseVersion(oasVersion);

        if (oasVersion && oasVersion === "2.0") {
            return new Oas20Document();
        }

        if (oasVersion && oasVersion.indexOf("3.0") === 0) {
            let doc: Oas30Document = new Oas30Document();
            doc.openapi = oasVersion;
            return doc;
        }

        // Use the original version when reporting error
        throw new Error("Unsupported OAS version: " + ver);
    }

    /**
     * Reads the given object and creates a valid OAS document model.
     * @param oasObject
     * @return {Oas20Document}
     */
    public createFromObject(oasObject: any): OasDocument {
        let ver: string = oasObject.swagger;
        if (oasObject.openapi) {
            ver = oasObject.openapi;
        }

        const oasVersion = this.parseVersion(ver);

        // We side-effect the input object when reading it, so make a deep copy of it first.
        oasObject = JSON.parse(JSON.stringify(oasObject));

        if (oasVersion && oasVersion === "2.0") {
            oasObject.swagger = oasVersion;
            let reader: Oas20JS2ModelReader = new Oas20JS2ModelReader();
            return reader.read(oasObject);
        }
        
        if (oasVersion && oasVersion.indexOf("3.0") === 0) {
            oasObject.openapi = oasVersion;
            let reader: Oas30JS2ModelReader = new Oas30JS2ModelReader();
            return reader.read(oasObject);
        }

        // Use the original version as read from the document when reporting error
        throw new Error("Unsupported OAS version: " + ver);
    }

    /**
     * Parses the given OAS definition source, parses it into an appropriate data model, and
     * returns it.  The factory will figure out what version of the data model to create based
     * on the content of the source.
     *
     * @param oasDefinitionSource
     * @return {null}
     */
    public createFromJson(oasDefinition: string): OasDocument {
        let jsObj: any = JSON.parse(oasDefinition);
        return this.createFromObject(jsObj);
    }

    /**
     * @param ver 
     * @return {string | undefined}
     */
    private parseVersion(ver: any) {
        let version;
        if (ver) {
            if (typeof ver !== "string") {
                ver = "" + ver;
            }
            // The regular expression may need to change if supported minor version for OAS 3 changes from 0 to 1 or later.
            // Lenient regular expression which accepts "lower dotted" number beyond patch e.g. strings like "3.0.0.1.1", as well as revision labels after a dash.
            // While semantic versioning has more strict rules about what follows after dash - this expression does not care.
            const specVersionExp = new RegExp(/^(2|3)(\.(0)(\.(\d))?((\.\d)*))?(-(.+))?$/g);

            // We can use the following expression, if we want to be more strict and do not want to allow anything after patch (still accepts revision after dash).
            // const specVersionExp = new RegExp(/^(2|3)(\.(0)(\.(\d))?)?(-(.+))?$/g);

            let match: RegExpExecArray;
            let major: string;
            let minor: string;
            let patch: string;
            let revision: string; // We don't care about the revision but it is there
            if (match = specVersionExp.exec(ver)) {
                major = match[1];
                minor = match[2] !== undefined ? match[3] : (major === "2" ? this.V2_DEFAULT_MINOR : this.V3_DEFAULT_MINOR);
                patch = (match[2] !== undefined && match[4] !== undefined) ? match[5] : (major === "2" ? "" : this.V3_DEFAULT_PATCH);
                revision = match[6] !== undefined ? match[7] : "";
                version =  major === "2" ? [].concat(major, minor).join(".") : [].concat(major, minor, patch).join(".");
            }
        }
        return version;
    }

}
