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

    /**
     * Creates a new, empty instance of an OAS document.
     * @param oasVersion
     * @return {OasDocument}
     */
    public createEmpty(oasVersion: string): OasDocument {
        if (oasVersion === "2.0") {
            return new Oas20Document();
        }
        if (oasVersion.indexOf("3.") === 0) {
            return new Oas30Document();
        }

        throw new Error("Unsupported OAS version: " + oasVersion);
    }

    /**
     * Reads the given object and creates a valid OAS document model.
     * @param oasObject
     * @return {Oas20Document}
     */
    public createFromObject(oasObject: any): OasDocument {
        if (oasObject.swagger && oasObject.swagger === "2.0") {
            let reader: Oas20JS2ModelReader = new Oas20JS2ModelReader();
            return reader.read(oasObject);
        } else if (oasObject.openapi && oasObject.openapi.indexOf("3.") === 0) {
            let reader: Oas30JS2ModelReader = new Oas30JS2ModelReader();
            return reader.read(oasObject);
        } else {
            let ver: string = oasObject.swagger;
            if (!ver) {
                ver = oasObject.openapi;
            }
            throw new Error("Unsupported OAS version: " + ver);
        }
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

}