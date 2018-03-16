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
import {OasValidationError} from "../src/validation/validation";
import {Oas30Document} from "../src/models/3.0/document.model";

describe("Validation (2.0)", () => {

    let library: OasLibraryUtils;

    function errorsAsString(errors: OasValidationError[]): string {
        let es: string[] = [];
        for (let error of errors) {
            es.push("[" + error.errorCode + "] {" + error.nodePath + "} :: " + error.message);
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
`[R-002] {/} :: Property "info" is required.
[R-003] {/} :: Property "paths" is required.`;

        expect(actual).toEqual(expected);
    });

    it("Document (Invalid Property Format)", () => {
        let json: any = readJSON('tests/fixtures/validation/2.0/document-invalid-property-format.json');
        let document: Oas20Document = <Oas20Document> library.createDocument(json);

        let node: OasNode = document;
        let errors: OasValidationError[] = library.validate(node);

        let actual: string = errorsAsString(errors);
        let expected: string =
`[R-004] {/} :: Invalid format for "host" property - only the host name (and optionally port) should be specified.
[R-005] {/} :: The "basePath" property must start with a '/' character.`;

        expect(actual).toEqual(expected);
    });

    it("Info (Required Properties)", () => {
        let json: any = readJSON('tests/fixtures/validation/2.0/info-required-properties.json');
        let document: Oas20Document = <Oas20Document> library.createDocument(json);

        let node: OasNode = document;
        let errors: OasValidationError[] = library.validate(node);

        let actual: string = errorsAsString(errors);
        let expected: string =
`[INF-001] {/info} :: Property "title" is required.
[INF-002] {/info} :: Property "version" is required.`

        expect(actual).toEqual(expected);
    });

    it("Info (Invalid Property Value)", () => {
        let json: any = readJSON('tests/fixtures/validation/2.0/info-invalid-property-format.json');
        let document: Oas20Document = <Oas20Document> library.createDocument(json);

        let node: OasNode = document;
        let errors: OasValidationError[] = library.validate(node);

        let actual: string = errorsAsString(errors);
        let expected: string =
`[CTC-002] {/info/contact} :: The "email" property must be a valid email address.
[LIC-002] {/info/license} :: The "url" property must be a valid URL.`;

        expect(actual).toEqual(expected);
    });

    it("Security Scheme (Required Properties)", () => {
        let json: any = readJSON('tests/fixtures/validation/2.0/security-scheme-required-properties.json');
        let document: Oas20Document = <Oas20Document> library.createDocument(json);

        let node: OasNode = document;
        let errors: OasValidationError[] = library.validate(node);

        let actual: string = errorsAsString(errors);
        let expected: string =
`[SS-001] {/securityDefinitions[notype_auth]} :: Property "type" is required.
[SS-002] {/securityDefinitions[apikey_auth_1]} :: Property "name" is required when "type" property is 'apiKey'.
[SS-003] {/securityDefinitions[apikey_auth_1]} :: Property "in" is required when "type" property is 'apiKey'.
[SS-004] {/securityDefinitions[oauth2_auth_1]} :: Property "flow" is required when "type" property is 'oauth2'.
[SS-007] {/securityDefinitions[oauth2_auth_1]} :: Property "scopes" is required when "type" property is 'oauth2'.
[SS-005] {/securityDefinitions[oauth2_auth_2]} :: Property "authorizationUrl" is is required when "type" property is 'oauth2' AND "flow" property is 'implicit|accessCode'.
[SS-007] {/securityDefinitions[oauth2_auth_2]} :: Property "scopes" is required when "type" property is 'oauth2'.
[SS-005] {/securityDefinitions[oauth2_auth_3]} :: Property "authorizationUrl" is is required when "type" property is 'oauth2' AND "flow" property is 'implicit|accessCode'.
[SS-006] {/securityDefinitions[oauth2_auth_3]} :: Property "tokenUrl" is is required when "type" property is 'oauth2' AND "flow" property is 'password|application|accessCode'.
[SS-007] {/securityDefinitions[oauth2_auth_3]} :: Property "scopes" is required when "type" property is 'oauth2'.
[SS-006] {/securityDefinitions[oauth2_auth_4]} :: Property "tokenUrl" is is required when "type" property is 'oauth2' AND "flow" property is 'password|application|accessCode'.
[SS-007] {/securityDefinitions[oauth2_auth_4]} :: Property "scopes" is required when "type" property is 'oauth2'.
[SS-006] {/securityDefinitions[oauth2_auth_5]} :: Property "tokenUrl" is is required when "type" property is 'oauth2' AND "flow" property is 'password|application|accessCode'.
[SS-007] {/securityDefinitions[oauth2_auth_5]} :: Property "scopes" is required when "type" property is 'oauth2'.`;

        expect(actual).toEqual(expected);
    });

    it("Security Scheme (Invalid Property Format)", () => {
        let json: any = readJSON('tests/fixtures/validation/2.0/security-scheme-invalid-property-format.json');
        let document: Oas20Document = <Oas20Document> library.createDocument(json);

        let node: OasNode = document;
        let errors: OasValidationError[] = library.validate(node);

        let actual: string = errorsAsString(errors);
        let expected: string =
`[SS-011] {/securityDefinitions[petstore_auth]} :: The "authorizationUrl" property must be a valid URL.
[SS-011] {/securityDefinitions[petstore_auth_accessCode]} :: The "authorizationUrl" property must be a valid URL.
[SS-012] {/securityDefinitions[petstore_auth_accessCode]} :: The "tokenUrl" property must be a valid URL.`;

        expect(actual).toEqual(expected);
    });

    it("Invalid Property Name (All)", () => {
        let json: any = readJSON('tests/fixtures/validation/2.0/invalid-property-name.json');
        let document: Oas20Document = <Oas20Document> library.createDocument(json);

        let node: OasNode = document;
        let errors: OasValidationError[] = library.validate(node);

        let actual: string = errorsAsString(errors);
        let expected: string =
`[PATH-005] {/paths[pet]} :: The path must start with a '/' character.
[PATH-005] {/paths[pet/findByStatus]} :: The path must start with a '/' character.
[RES-003] {/paths[/pet/findByTags]/get/responses[487]} :: Response status code is not a valid HTTP response status code: 487
[RES-003] {/paths[/pet/findByTags]/get/responses[822]} :: Response status code is not a valid HTTP response status code: 822
[EX-001] {/paths[/pet/findByTags]/get/responses[822]/examples} :: Example for type 'text/plain' does not match any of the "produces" mime-types expected by the operation.`;

        expect(actual).toEqual(expected);
    });

    it("Uniqueness (All)", () => {
        let json: any = readJSON('tests/fixtures/validation/2.0/uniqueness.json');
        let document: Oas20Document = <Oas20Document> library.createDocument(json);

        let node: OasNode = document;
        let errors: OasValidationError[] = library.validate(node);

        let actual: string = errorsAsString(errors);
        let expected: string =
`[OP-003] {/paths[/pet]/put} :: The "operationId" property value 'addPet' must be unique across ALL operations.
[OP-003] {/paths[/pet]/post} :: The "operationId" property value 'addPet' must be unique across ALL operations.
[PAR-019] {/paths[/pet/findByStatus]/get/parameters[0]} :: Duplicate 'query' parameter named 'status' found (parameters must be unique by name and location).
[PAR-019] {/paths[/pet/findByStatus]/get/parameters[1]} :: Duplicate 'query' parameter named 'status' found (parameters must be unique by name and location).
[PAR-019] {/paths[/pet/findByTags]/get/parameters[0]} :: Duplicate 'query' parameter named 'tags' found (parameters must be unique by name and location).
[PAR-019] {/paths[/pet/findByTags]/get/parameters[1]} :: Duplicate 'query' parameter named 'tags' found (parameters must be unique by name and location).
[PAR-019] {/paths[/pet/findByTags]/get/parameters[2]} :: Duplicate 'query' parameter named 'tags' found (parameters must be unique by name and location).
[OP-003] {/paths[/pet/{petId}]/get} :: The "operationId" property value 'getPetById' must be unique across ALL operations.
[OP-003] {/paths[/pet/{petId}]/post} :: The "operationId" property value 'getPetById' must be unique across ALL operations.
[OP-003] {/paths[/pet/{petId}]/delete} :: The "operationId" property value 'getPetById' must be unique across ALL operations.
[PAR-020] {/paths[/store/order]/post/parameters[0]} :: An operation may have at most one "body" parameter.
[PAR-020] {/paths[/store/order]/post/parameters[1]} :: An operation may have at most one "body" parameter.
[TAG-003] {/tags[1]} :: Duplicate tag 'store' found (every tag must have a unique name).
[TAG-003] {/tags[2]} :: Duplicate tag 'store' found (every tag must have a unique name).`;

        expect(actual).toEqual(expected);
    });

    it("Mutually Exclusive (All)", () => {
        let json: any = readJSON('tests/fixtures/validation/2.0/mutually-exclusive.json');
        let document: Oas20Document = <Oas20Document> library.createDocument(json);

        let node: OasNode = document;
        let errors: OasValidationError[] = library.validate(node);

        let actual: string = errorsAsString(errors);
        let expected: string = `[PATH-001] {/paths[/pet]/post} :: An operation may not have both a "body" and a "formData" parameter.`;

        expect(actual).toEqual(expected);
    });

    it("Invalid Reference (All)", () => {
        let json: any = readJSON('tests/fixtures/validation/2.0/invalid-reference.json');
        let document: Oas20Document = <Oas20Document> library.createDocument(json);

        let node: OasNode = document;
        let errors: OasValidationError[] = library.validate(node);

        let actual: string = errorsAsString(errors);
        let expected: string =
`[PATH-001] {/paths[/reference]} :: Reference to external path is either invalid or not found: paths.json#/paths/ExternalPath
[PAR-018] {/paths[/pet]/put/parameters[1]} :: The "$ref" property must reference a valid Parameter Definition: #/parameters/FooParam
[SCH-001] {/paths[/pet]/post/parameters[0]/schema} :: The "$ref" property must reference a valid Definition: #/definitions/Not_Available
[SCH-001] {/paths[/pet/findByStatus]/get/responses[200]/schema/items} :: The "$ref" property must reference a valid Definition: #/definitions/SchemaItemsNotFound
[SREQ-001] {/paths[/pet/findByStatus]/get/security[0]} :: Security Requirement name 'petstore_auth_notfound' does not match an item declared in the Security Definitions.
[RES-002] {/paths[/pet/findByTags]/get/responses[404]} :: The "$ref" property must reference a valid Response Definition: #/responses/ResponseNotFound`;

        expect(actual).toEqual(expected);
    });

});




describe("Validation (3.0)", () => {

    let library: OasLibraryUtils;

    function errorsAsString(errors: OasValidationError[]): string {
        let es: string[] = [];
        for (let error of errors) {
            es.push("[" + error.errorCode + "] {" + error.nodePath + "} :: " + error.message);
        }
        return es.join("\n");
    };

    beforeEach(() => {
        library = new OasLibraryUtils();
    });

    it("Valid Pet Store Document", () => {
        let json: any = readJSON('tests/fixtures/validation/3.0/valid-pet-store.json');
        let document: Oas30Document = <Oas30Document> library.createDocument(json);

        let node: OasNode = document;
        let errors: OasValidationError[] = library.validate(node);

        expect(errors).toEqual([]);
    });

    it("Invalid Property Format", () => {
        let json: any = readJSON('tests/fixtures/validation/3.0/invalid-property-format.json');
        let document: Oas30Document = <Oas30Document> library.createDocument(json);

        let node: OasNode = document;
        let errors: OasValidationError[] = library.validate(node);

        let actual: string = errorsAsString(errors);
        let expected: string =
`[CTC-3-004] {/info} :: The "termsOfService" property must be a valid URL.
[CTC-3-001] {/info/contact} :: The "url" property must be a valid URL.
[CTC-3-002] {/info/contact} :: The "email" property must be a valid email address.
[LIC-3-002] {/info/license} :: The "url" property must be a valid URL.
[SRV-3-002] {/servers[0]} :: The "url" property must be a valid URL.`;

        expect(actual).toEqual(expected);
    });

    it("Ignored Property Name", () => {
        let json: any = readJSON('tests/fixtures/validation/3.0/ignored-property-name.json');
        let document: Oas30Document = <Oas30Document> library.createDocument(json);

        let node: OasNode = document;
        let errors: OasValidationError[] = library.validate(node);

        let actual: string = errorsAsString(errors);
        let expected: string =
`[HEAD-3-011] {/paths[/pets]/get/responses[200]/content[application/json]/encoding[id][Content-Type]} :: The "Content-Type" header will be ignored.`;

        expect(actual).toEqual(expected);
    });

    it("Invalid Property Name", () => {
        let json: any = readJSON('tests/fixtures/validation/3.0/invalid-property-name.json');
        let document: Oas30Document = <Oas30Document> library.createDocument(json);

        let node: OasNode = document;
        let errors: OasValidationError[] = library.validate(node);

        let actual: string = errorsAsString(errors);
        let expected: string =
`[RES-3-001] {/paths[/pets]/get/responses[Success]} :: Response status code "Success" is not a valid HTTP response status code.
[PATH-3-004] {/paths[pets/{id}]} :: The path must start with a '/' character.
[COMP-3-001] {/components/schemas[Pet+Foo]} :: The Schema Definition name must match the regular expression: ^[a-zA-Z0-9\\.\\-_]+$
[COMP-3-003] {/components/responses[The Response]} :: The Response Definition name must match the regular expression: ^[a-zA-Z0-9\\.\\-_]+$
[COMP-3-002] {/components/parameters[Some$Parameter]} :: The Parameter Definition name must match the regular expression: ^[a-zA-Z0-9\\.\\-_]+$
[COMP-3-005] {/components/examples[Example|1]} :: The Example Definition name must match the regular expression: ^[a-zA-Z0-9\\.\\-_]+$
[COMP-3-006] {/components/requestBodies[Request Body]} :: The Request Body Definition name must match the regular expression: ^[a-zA-Z0-9\\.\\-_]+$
[COMP-3-007] {/components/headers[[Header]]} :: The Header Definition name must match the regular expression: ^[a-zA-Z0-9\\.\\-_]+$
[COMP-3-004] {/components/securitySchemes[Security%Scheme]} :: The Security Scheme name must match the regular expression: ^[a-zA-Z0-9\\.\\-_]+$
[COMP-3-008] {/components/links[Link*Twelve]} :: The Link Definition name must match the regular expression: ^[a-zA-Z0-9\\.\\-_]+$
[COMP-3-009] {/components/callbacks[Invalid Callback Name]} :: The Callback Definition name must match the regular expression: ^[a-zA-Z0-9\\.\\-_]+$
[SREQ-3-001] {/security[1]} :: Security Requirement "MissingAuth" does not correspond to a declared Security Scheme.`;

        expect(actual).toEqual(expected);
    });

});
