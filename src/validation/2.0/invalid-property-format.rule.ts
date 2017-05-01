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

import {Oas20Document} from "../../models/2.0/document.model";
import {Oas20ValidationRule} from "./common.rule";
import {OasNode} from "../../models/node.model";
import {Oas20Info} from "../../models/2.0/info.model";
import {Oas20License} from "../../models/2.0/license.model";
import {Oas20Operation} from "../../models/2.0/operation.model";
import {Oas20ExternalDocumentation} from "../../models/2.0/external-documentation.model";
import {Oas20Parameter} from "../../models/2.0/parameter.model";
import {Oas20Items} from "../../models/2.0/items.model";
import {Oas20Header} from "../../models/2.0/header.model";
import {Oas20Tag} from "../../models/2.0/tag.model";
import {Oas20SecurityScheme} from "../../models/2.0/security-scheme.model";
import {Oas20Contact} from "../../models/2.0/contact.model";
import {Oas20Schema} from "../../models/2.0/schema.model";
import {Oas20XML} from "../../models/2.0/xml.model";

/**
 * Implements the Invalid Property Format validation rule.  This rule is responsible
 * for reporting whenever the value of a property fails to conform to the required
 * *format* for that property.
 */
export class Oas20InvalidPropertyFormatValidationRule extends Oas20ValidationRule {

    /**
     * Returns true only if the given value is a valid URL.
     * @param propertyValue
     * @return {boolean}
     */
    private isValidUrl(propertyValue: string): boolean {
        let urlRegex: string = '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';
        let url: RegExp = new RegExp(urlRegex, 'i');
        return propertyValue.length < 2083 && url.test(propertyValue);
    }

    /**
     * Returns true only if the given value is valid GFM style markup.
     * @param propertyValue
     * @return {boolean}
     */
    private isValidGFM(propertyValue: string): boolean {
        // TODO implement a regexp to test for a valid Github Flavored Markdown string
        return true;
    }

    /**
     * Returns true only if the given value is a valid email address.
     * @param propertyValue
     * @return {boolean}
     */
    private isValidEmailAddress(propertyValue: string): boolean {
        let email: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return email.test(propertyValue);
    }

    /**
     * Returns true only if the given value is a valid mime-type.
     * @param propertyValue
     * @return {boolean}
     */
    private isValidMimeType(propertyValue: string[]): boolean {
        let mt: RegExp = /^.*\/.*(;.*)?$/;
        for (let v of propertyValue) {
            if (!mt.test(v)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Returns true only if the given value is a valid host.
     * @param propertyValue
     * @return {boolean}
     */
    private isValidHost(propertyValue: string): boolean {
        // TODO implement a regexp to test for a valid host plus optional port
        if (propertyValue.indexOf("http:") === 0 || propertyValue.indexOf("https:") === 0) {
            return false;
        }
        return true;
    }

    /**
     * Returns true if the given value is valid according to the schema provided.
     * @param value
     * @param node
     */
    private isValidForType(value: any, node: Oas20Items | Oas20Schema): boolean {
        // TODO validate the value against the schema
        return true;
    }

    /**
     * Reports a validation error if the property is not valid.
     * @param code
     * @param isValid
     * @param node
     * @param message
     */
    private reportIfInvalid(code: string, isValid: boolean, node: OasNode, message: string): void {
        if (!isValid) {
            this.report(code, node, message);
        }
    }

    public visitDocument(node: Oas20Document): void {
        if (this.hasValue(node.host)) {
            this.reportIfInvalid("R-004", this.isValidHost(node.host), node, "Invalid format for \"host\" property - only the host name (and optionally port) should be specified.");
        }
        if (this.hasValue(node.basePath)) {
            this.reportIfInvalid("R-005", node.basePath.indexOf("/") === 0, node, "The \"basePath\" property must start with a '/' character.");
        }
    }

    public visitInfo(node: Oas20Info): void {
        if (this.hasValue(node.description)) {
            this.reportIfInvalid("INF-003", this.isValidGFM(node.description), node, "The \"description\" property must be valid GFM syntax (or plain text).");
        }
    }

    public visitContact(node: Oas20Contact): void {
        if (this.hasValue(node.url)) {
            this.reportIfInvalid("CTC-001", this.isValidUrl(node.url), node, "The \"url\" property must be a valid URL.");
        }
        if (this.hasValue(node.email)) {
            this.reportIfInvalid("CTC-002", this.isValidEmailAddress(node.email), node, "The \"email\" property must be a valid email address.");
        }
    }

    public visitLicense(node: Oas20License): void {
        if (this.hasValue(node.url)) {
            this.reportIfInvalid("LIC-002", this.isValidUrl(node.url), node, "The \"url\" property must be a valid URL.");
        }
    }

    public visitOperation(node: Oas20Operation): void {
        if (this.hasValue(node.description)) {
            this.reportIfInvalid("OP-002", this.isValidGFM(node.description), node, "The \"description\" property must be valid GFM syntax (or plain text).");
        }
        if (this.hasValue(node.consumes)) {
            this.reportIfInvalid("OP-005", this.isValidMimeType(node.consumes), node, "The \"consumes\" property value must be a valid mime type.");
        }
        if (this.hasValue(node.produces)) {
            this.reportIfInvalid("OP-006", this.isValidMimeType(node.produces), node, "The \"produces\" property value must be a valid mime type.");
        }
    }

    public visitExternalDocumentation(node: Oas20ExternalDocumentation): void {
        if (this.hasValue(node.description)) {
            this.reportIfInvalid("ED-002", this.isValidGFM(node.description), node, "The \"description\" property must be valid GFM syntax (or plain text).");
        }
        if (this.hasValue(node.url)) {
            this.reportIfInvalid("ED-003", this.isValidUrl(node.url), node, "The \"url\" property must be a valid URL.");
        }
    }

    public visitParameter(node: Oas20Parameter): void {
        if (this.hasValue(node.description)) {
            this.reportIfInvalid("PAR-010", this.isValidGFM(node.description), node, "The \"description\" property must be valid GFM syntax (or plain text).");
        }
    }

    public visitItems(node: Oas20Items): void {
        if (this.hasValue(node.default)) {
            this.reportIfInvalid("IT-007", this.isValidForType(node.default, node), node, "The \"default\" property must conform to the \"type\" of the items.");
        }
    }

    public visitHeader(node: Oas20Header): void {
        if (this.hasValue(node.default)) {
            this.reportIfInvalid("HEAD-005", this.isValidForType(node.default, node), node, "The \"default\" property must conform to the \"type\" of the items.");
        }
    }

    public visitTag(node: Oas20Tag): void {
        if (this.hasValue(node.description)) {
            this.reportIfInvalid("TAG-002", this.isValidGFM(node.description), node, "The \"description\" property must be valid GFM syntax (or plain text).");
        }
    }

    public visitSecurityScheme(node: Oas20SecurityScheme): void {
        if (this.hasValue(node.authorizationUrl)) {
            this.reportIfInvalid("SS-011", this.isValidUrl(node.authorizationUrl), node, "The \"authorizationUrl\" property must be a valid URL.");
        }
        if (this.hasValue(node.tokenUrl)) {
            this.reportIfInvalid("SS-012", this.isValidUrl(node.tokenUrl), node, "The \"tokenUrl\" property must be a valid URL.");
        }
    }

    public visitXML(node: Oas20XML): void {
        if (this.hasValue(node.namespace)) {
            this.reportIfInvalid("XML-001", this.isValidUrl(node.namespace), node, "The \"namespace\" property must be a valid URL.");
        }
    }

}
