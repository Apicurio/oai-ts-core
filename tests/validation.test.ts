///<reference path="../node_modules/@types/jasmine/index.d.ts"/>
///<reference path="@types/karma-read-json/index.d.ts"/>

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

import {Oas20Document} from "../src/models/2.0/document.model";
import {OasLibraryUtils} from "../src/library.utils";
import {OasNode} from "../src/models/node.model";
import {OasValidationError, OasValidationErrorSeverity} from "../src/validation/validation";

describe("Validation (2.0)", () => {

    let library: OasLibraryUtils;

    function errorsAsString(errors: OasValidationError[]): string {
        let es: string[] = [];
        for (let error of errors) {
            es.push("[" + OasValidationErrorSeverity[error.severity] + "] {" + error.nodePath + "} :: " + error.message);
        }
        return es.join("\n");
    };

    beforeEach(() => {
        library = new OasLibraryUtils();
    });

    it("Valid Pet Store Document", () => {
        let json: any = readJSON('tests/fixtures/validation/2.0/valid-pet-store.json');
        let document: Oas20Document = <Oas20Document> library.createDocument(json);

        let node: OasNode = document;
        let errors: OasValidationError[] = library.validate(node);

        expect(errors).toEqual([]);
    });

    it("Document (Required Properties)", () => {
        let json: any = readJSON('tests/fixtures/validation/2.0/document-required-properties.json');
        let document: Oas20Document = <Oas20Document> library.createDocument(json);

        let node: OasNode = document;
        let errors: OasValidationError[] = library.validate(node);

        let actual: string = errorsAsString(errors);
        let expected: string =
            "[error] {/} :: Property \"info\" is required.\n" +
            "[error] {/} :: Property \"paths\" is required.";

        expect(actual).toEqual(expected);
    });

    it("Info (Required Properties)", () => {
        let json: any = readJSON('tests/fixtures/validation/2.0/info-required-properties.json');
        let document: Oas20Document = <Oas20Document> library.createDocument(json);

        let node: OasNode = document;
        let errors: OasValidationError[] = library.validate(node);

        let actual: string = errorsAsString(errors);
        let expected: string =
            "[error] {/info} :: Property \"title\" is required.\n" +
            "[error] {/info} :: Property \"version\" is required.";

        expect(actual).toEqual(expected);
    });

    it("Security Scheme (Required Properties)", () => {
        let json: any = readJSON('tests/fixtures/validation/2.0/security-scheme-required-properties.json');
        let document: Oas20Document = <Oas20Document> library.createDocument(json);

        let node: OasNode = document;
        let errors: OasValidationError[] = library.validate(node);

        let actual: string = errorsAsString(errors);
        let expected: string =
            "[error] {/securityDefinitions[notype_auth]} :: Property \"type\" is required.\n" +
            "[error] {/securityDefinitions[apikey_auth_1]} :: Property \"name\" is required when \"type\" property is 'apiKey'.\n" +
            "[error] {/securityDefinitions[apikey_auth_1]} :: Property \"in\" is required when \"type\" property is 'apiKey'.\n" +
            "[error] {/securityDefinitions[oauth2_auth_1]} :: Property \"flow\" is required when \"type\" property is 'oauth2'.\n" +
            "[error] {/securityDefinitions[oauth2_auth_1]} :: Property \"scopes\" is required when \"type\" property is 'oauth2'.\n" +
            "[error] {/securityDefinitions[oauth2_auth_2]} :: Property \"authorizationUrl\" is is required when \"type\" property is 'oauth2' AND \"flow\" property is 'implicit|accessCode'.\n" +
            "[error] {/securityDefinitions[oauth2_auth_2]} :: Property \"scopes\" is required when \"type\" property is 'oauth2'.\n" +
            "[error] {/securityDefinitions[oauth2_auth_3]} :: Property \"authorizationUrl\" is is required when \"type\" property is 'oauth2' AND \"flow\" property is 'implicit|accessCode'.\n" +
            "[error] {/securityDefinitions[oauth2_auth_3]} :: Property \"tokenUrl\" is is required when \"type\" property is 'oauth2' AND \"flow\" property is 'password|application|accessCode'.\n" +
            "[error] {/securityDefinitions[oauth2_auth_3]} :: Property \"scopes\" is required when \"type\" property is 'oauth2'.\n" +
            "[error] {/securityDefinitions[oauth2_auth_4]} :: Property \"tokenUrl\" is is required when \"type\" property is 'oauth2' AND \"flow\" property is 'password|application|accessCode'.\n" +
            "[error] {/securityDefinitions[oauth2_auth_4]} :: Property \"scopes\" is required when \"type\" property is 'oauth2'.\n" +
            "[error] {/securityDefinitions[oauth2_auth_5]} :: Property \"tokenUrl\" is is required when \"type\" property is 'oauth2' AND \"flow\" property is 'password|application|accessCode'.\n" +
            "[error] {/securityDefinitions[oauth2_auth_5]} :: Property \"scopes\" is required when \"type\" property is 'oauth2'.";

        expect(actual).toEqual(expected);
    });

});

