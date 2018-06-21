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
import {OasNode, OasValidationProblem} from "../src/models/node.model";
import {Oas30Document} from "../src/models/3.0/document.model";
import * as JsDiff from "diff";
import {IOasValidationSeverityRegistry, OasValidationProblemSeverity} from "../src/validation/validation";

describe("Validation (2.0)", () => {

    let library: OasLibraryUtils;

    function errorsAsString(errors: OasValidationProblem[]): string {
        let es: string[] = [];
        for (let error of errors) {
            es.push(`[${error.errorCode}] |${error.severity}| {${error.nodePath}} :: ${error.message}`);
        }
        return es.join("\n");
    };

    function assertValidationOutput(actual: string, expected: string): void {
        let theDiff: any[] = JsDiff.diffLines(actual, expected);
        let hasDiff: boolean = false;
        theDiff.forEach( change => {
            if (change.added) {
                console.info("--- EXPECTED BUT MISSING ---\n" + change.value);
                console.info("----------------------------");
                hasDiff = true;
            }
            if (change.removed) {
                console.info("--- FOUND EXTRA ---\n" + change.value);
                console.info("-------------------");
                hasDiff = true;
            }
        });

        expect(hasDiff).toBeFalsy();
    }

    beforeEach(() => {
        library = new OasLibraryUtils();
    });

    it("Valid Pet Store Document", () => {
        let json: any = readJSON('tests/fixtures/validation/2.0/valid-pet-store.json');
        let document: Oas20Document = <Oas20Document> library.createDocument(json);

        let node: OasNode = document;
        let errors: OasValidationProblem[] = library.validate(node);

        expect(errors).toEqual([]);
    });

    it("Document (Required Properties)", () => {
        let json: any = readJSON('tests/fixtures/validation/2.0/document-required-properties.json');
        let document: Oas20Document = <Oas20Document> library.createDocument(json);

        let node: OasNode = document;
        let errors: OasValidationProblem[] = library.validate(node);

        let actual: string = errorsAsString(errors);
        let expected: string =
`[R-002] |2| {/} :: Property "info" is required.
[R-003] |2| {/} :: Property "paths" is required.`;

        assertValidationOutput(actual, expected);
    });

    it("Document (Invalid Property Format)", () => {
        let json: any = readJSON('tests/fixtures/validation/2.0/document-invalid-property-format.json');
        let document: Oas20Document = <Oas20Document> library.createDocument(json);

        let node: OasNode = document;
        let errors: OasValidationProblem[] = library.validate(node);

        let actual: string = errorsAsString(errors);
        let expected: string =
`[R-004] |2| {/} :: Invalid format for "host" property - only the host name (and optionally port) should be specified.
[R-005] |2| {/} :: The "basePath" property must start with a '/' character.`;

        assertValidationOutput(actual, expected);
    });

    it("Info (Required Properties)", () => {
        let json: any = readJSON('tests/fixtures/validation/2.0/info-required-properties.json');
        let document: Oas20Document = <Oas20Document> library.createDocument(json);

        let node: OasNode = document;
        let errors: OasValidationProblem[] = library.validate(node);

        let actual: string = errorsAsString(errors);
        let expected: string =
`[INF-001] |2| {/info} :: Property "title" is required.
[INF-002] |2| {/info} :: Property "version" is required.`

        assertValidationOutput(actual, expected);
    });

    it("Info (Invalid Property Value)", () => {
        let json: any = readJSON('tests/fixtures/validation/2.0/info-invalid-property-format.json');
        let document: Oas20Document = <Oas20Document> library.createDocument(json);

        let node: OasNode = document;
        let errors: OasValidationProblem[] = library.validate(node);

        let actual: string = errorsAsString(errors);
        let expected: string =
`[CTC-002] |2| {/info/contact} :: The "email" property must be a valid email address.
[LIC-002] |2| {/info/license} :: The "url" property must be a valid URL.`;

        assertValidationOutput(actual, expected);
    });

    it("Security Scheme (Required Properties)", () => {
        let json: any = readJSON('tests/fixtures/validation/2.0/security-scheme-required-properties.json');
        let document: Oas20Document = <Oas20Document> library.createDocument(json);

        let node: OasNode = document;
        let errors: OasValidationProblem[] = library.validate(node);

        let actual: string = errorsAsString(errors);
        let expected: string =
`[SS-001] |2| {/securityDefinitions[notype_auth]} :: Property "type" is required.
[SS-002] |2| {/securityDefinitions[apikey_auth_1]} :: Property "name" is required when "type" property is 'apiKey'.
[SS-003] |2| {/securityDefinitions[apikey_auth_1]} :: Property "in" is required when "type" property is 'apiKey'.
[SS-004] |2| {/securityDefinitions[oauth2_auth_1]} :: Property "flow" is required when "type" property is 'oauth2'.
[SS-007] |2| {/securityDefinitions[oauth2_auth_1]} :: Property "scopes" is required when "type" property is 'oauth2'.
[SS-005] |2| {/securityDefinitions[oauth2_auth_2]} :: Property "authorizationUrl" is is required when "type" property is 'oauth2' AND "flow" property is 'implicit|accessCode'.
[SS-007] |2| {/securityDefinitions[oauth2_auth_2]} :: Property "scopes" is required when "type" property is 'oauth2'.
[SS-005] |2| {/securityDefinitions[oauth2_auth_3]} :: Property "authorizationUrl" is is required when "type" property is 'oauth2' AND "flow" property is 'implicit|accessCode'.
[SS-006] |2| {/securityDefinitions[oauth2_auth_3]} :: Property "tokenUrl" is is required when "type" property is 'oauth2' AND "flow" property is 'password|application|accessCode'.
[SS-007] |2| {/securityDefinitions[oauth2_auth_3]} :: Property "scopes" is required when "type" property is 'oauth2'.
[SS-006] |2| {/securityDefinitions[oauth2_auth_4]} :: Property "tokenUrl" is is required when "type" property is 'oauth2' AND "flow" property is 'password|application|accessCode'.
[SS-007] |2| {/securityDefinitions[oauth2_auth_4]} :: Property "scopes" is required when "type" property is 'oauth2'.
[SS-006] |2| {/securityDefinitions[oauth2_auth_5]} :: Property "tokenUrl" is is required when "type" property is 'oauth2' AND "flow" property is 'password|application|accessCode'.
[SS-007] |2| {/securityDefinitions[oauth2_auth_5]} :: Property "scopes" is required when "type" property is 'oauth2'.`;

        assertValidationOutput(actual, expected);
    });

    it("Security Scheme (Invalid Property Format)", () => {
        let json: any = readJSON('tests/fixtures/validation/2.0/security-scheme-invalid-property-format.json');
        let document: Oas20Document = <Oas20Document> library.createDocument(json);

        let node: OasNode = document;
        let errors: OasValidationProblem[] = library.validate(node);

        let actual: string = errorsAsString(errors);
        let expected: string =
`[SS-011] |2| {/securityDefinitions[petstore_auth]} :: The "authorizationUrl" property must be a valid URL.
[SS-011] |2| {/securityDefinitions[petstore_auth_accessCode]} :: The "authorizationUrl" property must be a valid URL.
[SS-012] |2| {/securityDefinitions[petstore_auth_accessCode]} :: The "tokenUrl" property must be a valid URL.`;

        assertValidationOutput(actual, expected);
    });

    it("Invalid Property Name (All)", () => {
        let json: any = readJSON('tests/fixtures/validation/2.0/invalid-property-name.json');
        let document: Oas20Document = <Oas20Document> library.createDocument(json);

        let node: OasNode = document;
        let errors: OasValidationProblem[] = library.validate(node);

        let actual: string = errorsAsString(errors);
        let expected: string =
`[PATH-005] |2| {/paths[pet]} :: The path must start with a '/' character.
[PATH-005] |2| {/paths[pet/findByStatus]} :: The path must start with a '/' character.
[RES-003] |2| {/paths[/pet/findByTags]/get/responses[487]} :: Response status code is not a valid HTTP response status code: 487
[RES-003] |2| {/paths[/pet/findByTags]/get/responses[822]} :: Response status code is not a valid HTTP response status code: 822
[EX-001] |2| {/paths[/pet/findByTags]/get/responses[822]/examples} :: Example for type 'text/plain' does not match any of the "produces" mime-types expected by the operation.`;

        assertValidationOutput(actual, expected);
    });

    it("Uniqueness (All)", () => {
        let json: any = readJSON('tests/fixtures/validation/2.0/uniqueness.json');
        let document: Oas20Document = <Oas20Document> library.createDocument(json);

        let node: OasNode = document;
        let errors: OasValidationProblem[] = library.validate(node);

        let actual: string = errorsAsString(errors);
        let expected: string =
`[OP-003] |2| {/paths[/pet]/put} :: The "operationId" property value 'addPet' must be unique across ALL operations.
[OP-003] |2| {/paths[/pet]/post} :: The "operationId" property value 'addPet' must be unique across ALL operations.
[PAR-019] |2| {/paths[/pet/findByStatus]/get/parameters[0]} :: Duplicate 'query' parameter named 'status' found (parameters must be unique by name and location).
[PAR-019] |2| {/paths[/pet/findByStatus]/get/parameters[1]} :: Duplicate 'query' parameter named 'status' found (parameters must be unique by name and location).
[PAR-019] |2| {/paths[/pet/findByTags]/get/parameters[0]} :: Duplicate 'query' parameter named 'tags' found (parameters must be unique by name and location).
[PAR-019] |2| {/paths[/pet/findByTags]/get/parameters[1]} :: Duplicate 'query' parameter named 'tags' found (parameters must be unique by name and location).
[PAR-019] |2| {/paths[/pet/findByTags]/get/parameters[2]} :: Duplicate 'query' parameter named 'tags' found (parameters must be unique by name and location).
[OP-003] |2| {/paths[/pet/{petId}]/get} :: The "operationId" property value 'getPetById' must be unique across ALL operations.
[OP-003] |2| {/paths[/pet/{petId}]/post} :: The "operationId" property value 'getPetById' must be unique across ALL operations.
[OP-003] |2| {/paths[/pet/{petId}]/delete} :: The "operationId" property value 'getPetById' must be unique across ALL operations.
[PAR-020] |2| {/paths[/store/order]/post/parameters[0]} :: An operation may have at most one "body" parameter.
[PAR-020] |2| {/paths[/store/order]/post/parameters[1]} :: An operation may have at most one "body" parameter.
[TAG-003] |2| {/tags[1]} :: Duplicate tag 'store' found (every tag must have a unique name).
[TAG-003] |2| {/tags[2]} :: Duplicate tag 'store' found (every tag must have a unique name).`;

        assertValidationOutput(actual, expected);
    });

    it("Mutually Exclusive (All)", () => {
        let json: any = readJSON('tests/fixtures/validation/2.0/mutually-exclusive.json');
        let document: Oas20Document = <Oas20Document> library.createDocument(json);

        let node: OasNode = document;
        let errors: OasValidationProblem[] = library.validate(node);

        let actual: string = errorsAsString(errors);
        let expected: string = `[PATH-001] |2| {/paths[/pet]/post} :: An operation may not have both a "body" and a "formData" parameter.`;

        assertValidationOutput(actual, expected);
    });

    it("Invalid Reference (All)", () => {
        let json: any = readJSON('tests/fixtures/validation/2.0/invalid-reference.json');
        let document: Oas20Document = <Oas20Document> library.createDocument(json);

        let node: OasNode = document;
        let errors: OasValidationProblem[] = library.validate(node);

        let actual: string = errorsAsString(errors);
        let expected: string =
`[PAR-018] |2| {/paths[/pet]/put/parameters[1]} :: The "$ref" property must reference a valid Parameter Definition: #/parameters/FooParam
[SCH-001] |2| {/paths[/pet]/post/parameters[0]/schema} :: The "$ref" property must reference a valid Definition: #/definitions/Not_Available
[SCH-001] |2| {/paths[/pet/findByStatus]/get/responses[200]/schema/items} :: The "$ref" property must reference a valid Definition: #/definitions/SchemaItemsNotFound
[SREQ-001] |2| {/paths[/pet/findByStatus]/get/security[0]} :: Security Requirement name 'petstore_auth_notfound' does not match an item declared in the Security Definitions.
[RES-002] |2| {/paths[/pet/findByTags]/get/responses[404]} :: The "$ref" property must reference a valid Response Definition: #/responses/ResponseNotFound`;

        assertValidationOutput(actual, expected);
    });

});




describe("Validation (3.0)", () => {

    let library: OasLibraryUtils;

    function errorsAsString(errors: OasValidationProblem[]): string {
        let es: string[] = [];
        for (let error of errors) {
            es.push(`[${error.errorCode}] |${error.severity}| {${error.nodePath}} :: ${error.message}`);
        }
        return es.join("\n");
    };

    function assertValidationOutput(actual: string, expected: string): void {
        let theDiff: any[] = JsDiff.diffLines(actual, expected);
        let hasDiff: boolean = false;
        theDiff.forEach( change => {
            if (change.added) {
                console.info("--- EXPECTED BUT MISSING ---\n" + change.value);
                console.info("----------------------------");
                hasDiff = true;
            }
            if (change.removed) {
                console.info("--- FOUND EXTRA ---\n" + change.value);
                console.info("-------------------");
                hasDiff = true;
            }
        });

        expect(hasDiff).toBeFalsy();
    }

    beforeEach(() => {
        library = new OasLibraryUtils();
    });

    it("Valid Pet Store Document", () => {
        let json: any = readJSON('tests/fixtures/validation/3.0/valid-pet-store.json');
        let document: Oas30Document = <Oas30Document> library.createDocument(json);

        let node: OasNode = document;
        let errors: OasValidationProblem[] = library.validate(node);

        expect(errors).toEqual([]);
    });

    it("Invalid Property Format", () => {
        let json: any = readJSON('tests/fixtures/validation/3.0/invalid-property-format.json');
        let document: Oas30Document = <Oas30Document> library.createDocument(json);

        let node: OasNode = document;
        let errors: OasValidationProblem[] = library.validate(node);

        let actual: string = errorsAsString(errors);
        let expected: string =
`[CTC-3-004] |2| {/info} :: The "termsOfService" property must be a valid URL.
[CTC-3-001] |2| {/info/contact} :: The "url" property must be a valid URL.
[CTC-3-002] |2| {/info/contact} :: The "email" property must be a valid email address.
[LIC-3-002] |2| {/info/license} :: The "url" property must be a valid URL.`;

        assertValidationOutput(actual, expected);
    });

    it("Ignored Property Name", () => {
        let json: any = readJSON('tests/fixtures/validation/3.0/ignored-property-name.json');
        let document: Oas30Document = <Oas30Document> library.createDocument(json);

        let node: OasNode = document;
        let errors: OasValidationProblem[] = library.validate(node);

        let actual: string = errorsAsString(errors);
        let expected: string =
`[HEAD-3-001] |2| {/paths[/pets]/get/responses[200]/content[multipart/form-data]/encoding[id]/headers[Content-Type]} :: The "Content-Type" header will be ignored.`;

        assertValidationOutput(actual, expected);
    });

    it("Invalid Property Name", () => {
        let json: any = readJSON('tests/fixtures/validation/3.0/invalid-property-name.json');
        let document: Oas30Document = <Oas30Document> library.createDocument(json);

        let node: OasNode = document;
        let errors: OasValidationProblem[] = library.validate(node);

        let actual: string = errorsAsString(errors);
        let expected: string =
`[ENC-3-006] |2| {/paths[/enc-3-006]/post/requestBody/content[multipart/mixed]/encoding[missingProperty]} :: The encoding property "missingProperty" cannot be found in the associated schema.
[RES-3-001] |2| {/paths[/pets]/get/responses[Success]} :: Response status code "Success" is not a valid HTTP response status code.
[PATH-3-004] |2| {/paths[pets/{id}]} :: The path must start with a '/' character.
[COMP-3-001] |2| {/components/schemas[Pet+Foo]} :: The Schema Definition name must match the regular expression: ^[a-zA-Z0-9\\.\\-_]+$
[COMP-3-003] |2| {/components/responses[The Response]} :: The Response Definition name must match the regular expression: ^[a-zA-Z0-9\\.\\-_]+$
[COMP-3-002] |2| {/components/parameters[Some$Parameter]} :: The Parameter Definition name must match the regular expression: ^[a-zA-Z0-9\\.\\-_]+$
[COMP-3-005] |2| {/components/examples[Example|1]} :: The Example Definition name must match the regular expression: ^[a-zA-Z0-9\\.\\-_]+$
[COMP-3-006] |2| {/components/requestBodies[Request Body]} :: The Request Body Definition name must match the regular expression: ^[a-zA-Z0-9\\.\\-_]+$
[COMP-3-007] |2| {/components/headers[[Header]]} :: The Header Definition name must match the regular expression: ^[a-zA-Z0-9\\.\\-_]+$
[COMP-3-004] |2| {/components/securitySchemes[Security%Scheme]} :: The Security Scheme name must match the regular expression: ^[a-zA-Z0-9\\.\\-_]+$
[COMP-3-008] |2| {/components/links[Link*Twelve]} :: The Link Definition name must match the regular expression: ^[a-zA-Z0-9\\.\\-_]+$
[COMP-3-009] |2| {/components/callbacks[Invalid Callback Name]} :: The Callback Definition name must match the regular expression: ^[a-zA-Z0-9\\.\\-_]+$
[SREQ-3-001] |2| {/security[1]} :: Security Requirement "MissingAuth" does not correspond to a declared Security Scheme.`;

        assertValidationOutput(actual, expected);
    });

    it("Invalid Property Value", () => {
        let json: any = readJSON('tests/fixtures/validation/3.0/invalid-property-value.json');
        let document: Oas30Document = <Oas30Document> library.createDocument(json);

        let node: OasNode = document;
        let errors: OasValidationProblem[] = library.validate(node);

        let actual: string = errorsAsString(errors);
        let expected: string =
`[SVAR-3-003] |2| {/servers[0]/variables[missingProperty]} :: The server variable "missingProperty" is not found in the server url template.
[ENC-3-001] |2| {/paths[/enc-3-001]/post/requestBody/content[application/x-www-form-urlencoded]/encoding[profileImage]} :: The "headers" property is only allowed for "multipart" request body media type encodings.  Found media type "application/x-www-form-urlencoded" instead.
[ENC-3-002] |2| {/paths[/enc-3-002]/post/requestBody/content[multipart/form-data]/encoding[historyMetadata]} :: The "style" property is only allowed for "application/x-www-form-urlencoded" request body media type encodings.  Found media type "multipart/form-data" instead.
[ENC-3-003] |2| {/paths[/enc-3-003]/post/requestBody/content[multipart/form-data]/encoding[historyMetadata]} :: The "explode" property is only allowed for "application/x-www-form-urlencoded" request body media type encodings.
[ENC-3-004] |2| {/paths[/enc-3-004]/post/requestBody/content[multipart/form-data]/encoding[historyMetadata]} :: The "allowReserved" property is only allowed for "application/x-www-form-urlencoded" request body media type encodings.
[ENC-3-005] |2| {/paths[/enc-3-005]/post/requestBody/content[application/x-www-form-urlencoded]/encoding[historyMetadata]} :: The "style" property value must be one of: ["form", "spaceDelimited", "pipeDelimited", "deepObject"]  Found value "matrix".
[HEAD-3-003] |2| {/paths[/head-3-003]/post/requestBody/content[multipart/form-data]/encoding[historyMetadata]/headers[X-Header-1]} :: The "style" property value must be "simple".  Found value "form".
[HEAD-3-004] |2| {/paths[/head-3-004]/post/requestBody/content[multipart/form-data]/encoding[historyMetadata]/headers[X-Header-1]} :: The "content" property must contain at most one entry.
[LINK-3-002] |2| {/paths[/link-3-002]/get/responses[200]/links[address]} :: The "operationId" property must refer to an existing Operation.  Cannot find operation with ID "getUserAddress".
[MT-3-003] |2| {/paths[/mt-3-003]/post/requestBody/content[application/json]} :: The "encoding" property is only allowed for "multipart" and "application/x-www-form-urlencoded" request body media types.  Found "application/json" instead.
[OP-3-003] |2| {/paths[/op-3-003]/get} :: The "requestBody" property is only supported for POST, PUT, PATCH, and OPTIONS operations.
[OP-3-005] |2| {/paths[/op-3-005]/get} :: There must be at least one Response documented.
[PAR-3-002] |2| {/paths[/par-3-002]/parameters[0]} :: The "in" property value must be one of: ["path", "query", "header", "cookie"] (Found value: 'side')
[PAR-3-006] |2| {/paths[/par-3-006/{id}]/parameters[0]} :: The "required" property is required for "path" parameters, and must have a value of "true".
[PAR-3-007] |2| {/paths[/par-3-007/{id}]/parameters[0]} :: The "allowEmptyValue" property is only allowed for "query" parameters.
[PAR-3-009] |2| {/paths[/par-3-009]/parameters[0]} :: The "style" property value must be one of: ["matrix", "label", "form", "simple", "spaceDelimited", "pipeDelimited", "deepObject"] (Found value "shallowObject").
[PAR-3-011] |2| {/paths[/par-3-009]/parameters[0]} :: For "query" parameters, the "style" property value must be one of: ["form", "spaceDelimited", "pipeDelimited", "deepObject"] (Found value "shallowObject").
[PAR-3-010] |2| {/paths[/par-3-010/{id}]/parameters[0]} :: For "path" parameters, the "style" property value must be one of: ["matrix", "label", "simple"]  (Found value "form").
[PAR-3-011] |2| {/paths[/par-3-011]/parameters[0]} :: For "query" parameters, the "style" property value must be one of: ["form", "spaceDelimited", "pipeDelimited", "deepObject"] (Found value "label").
[PAR-3-012] |2| {/paths[/par-3-012]/parameters[0]} :: For "cookie" parameters, the "style" property value must be "form". (Found value "label")
[PAR-3-013] |2| {/paths[/par-3-013]/parameters[0]} :: For "header" parameters, the "style" property value must be "simple". (Found value "label").
[PAR-3-014] |2| {/paths[/par-3-014]/parameters[0]} :: The "allowReserved" property is only allowed for "query" parameters.
[PAR-3-016] |2| {/paths[/par-3-016]/parameters[0]} :: The "content" property must contain at most one entry.
[PAR-3-018] |2| {/paths[/par-3-018/{id}/{sub}]/parameters[1]} :: The "name" property value for a 'path' style parameter must match one of the items in the path template.  Invalid path property name found: "missing"
[PAR-3-019] |2| {/paths[/par-3-019]/parameters[0]} :: Header parameters "Accept", "Content-Type", and "Authorization" are ignored.
[SCH-3-001] |2| {/paths[/sch-3-001]/get/responses[200]/content[application/json]/schema/discriminator} :: The "discriminator" property is only valid when using one of: ["oneOf", "anyOf", "allOf"]
[SREQ-3-002] |2| {/paths[/sreq-3-002]/get/security[0]} :: The value for security requirement "api_key" must be an empty array (required for Security Schemes of type other than "oauth2" and "openIdConnect").
[XML-3-002] |2| {/components/schemas[xml-3-002]/properties[name]/xml} :: The "wrapped" property is only valid for 'array' types.
[SS-3-008] |2| {/components/securitySchemes[ss-3-008]} :: The "type" property value must be one of: ["apiKey", "http", "oauth2", "openIdConnect"] (Found value: 'invalid')
[SS-3-010] |2| {/components/securitySchemes[ss-3-010]} :: The "in" property value must be one of: ["query", "header", "cookie"] (Found value: 'body')
[SS-3-011] |2| {/components/securitySchemes[ss-3-011]} :: The "bearerFormat" property is only valid for "http" security schemes of type "bearer".
[SS-3-013] |2| {/components/securitySchemes[ss-3-013]} :: The "scheme" property value must be one of: ["basic", "bearer", "digest", "hoba", "mutual", "negotiate", "oauth", "vapid", "scram-sha-1", "scram-sha-256"] (Found value: 'leveraged')`;

        assertValidationOutput(actual, expected);
        //assertValidationOutput(actual, expected);
    });

    it("Invalid Reference", () => {
        let json: any = readJSON('tests/fixtures/validation/3.0/invalid-reference.json');
        let document: Oas30Document = <Oas30Document> library.createDocument(json);

        let node: OasNode = document;
        let errors: OasValidationProblem[] = library.validate(node);

        let actual: string = errorsAsString(errors);
        let expected: string =
`[CALL-3-001] |2| {/paths[/call-3-001]/get/callbacks[myRefCallback]} :: The "$ref" property value "#/components/callbacks/MissingCallback" must reference a valid Callback.
[EX-3-003] |2| {/paths[/ex-3-003]/put/requestBody/content[application/json]/examples[bar]} :: The "$ref" property value "#/components/examples/MissingExample" must reference a valid Example.
[HEAD-3-005] |2| {/paths[/head-3-005]/get/responses[200]/headers[X-Rate-Limit-Reset]} :: The "$ref" property value "#/components/headers/MissingHeader" must reference a valid Header.
[LINK-3-003] |2| {/paths[/link-3-003]/get/responses[200]/links[MissingLink]} :: The "operationRef" property value "undefined" must reference a valid Link.
[LINK-3-005] |2| {/paths[/link-3-005]/get/responses[200]/links[MissingLink]} :: The "$ref" property value "#/components/links/MissingLink" must reference a valid Link.
[PAR-3-017] |2| {/paths[/par-3-017]/parameters[1]} :: The "$ref" property value "#/components/parameters/MissingParameter" must reference a valid Parameter.
[RB-3-003] |2| {/paths[/rb-3-003]/post/requestBody} :: The "$ref" property value "#/components/requestBodies/MissingRequestBody" must reference a valid Request Body.
[RES-3-004] |2| {/paths[/res-3-004]/get/responses[200]} :: The "$ref" property value "#/components/responses/MissingResponse" must reference a valid Response.
[SCH-3-002] |2| {/paths[/sch-3-002]/parameters[0]/schema} :: The "$ref" property value "#/components/schemas/MissingSchema" must reference a valid Schema.
[SS-3-012] |2| {/components/securitySchemes[BASIC]} :: The "$ref" property value "#/components/securitySchemes/MissingSecurityScheme" must reference a valid Security Scheme.`;

        assertValidationOutput(actual, expected);
    });

    it("Mutually Exclusive", () => {
        let json: any = readJSON('tests/fixtures/validation/3.0/mutually-exclusive.json');
        let document: Oas30Document = <Oas30Document> library.createDocument(json);

        let node: OasNode = document;
        let errors: OasValidationProblem[] = library.validate(node);

        let actual: string = errorsAsString(errors);
        let expected: string =
`[MT-3-001] |2| {/components/parameters[mt-3-001]/content[text/plain]} :: The "example" and "examples" properties are mutually exclusive.
[PAR-3-008] |2| {/components/parameters[par-3-008]} :: The "schema" and "content" properties are mutually exclusive.
[PAR-3-015] |2| {/components/parameters[par-3-015]} :: The "example" and "examples" properties are mutually exclusive.
[EX-3-002] |2| {/components/examples[ex-3-002]} :: The "value" and "externalValue" properties are mutually exclusive.
[HEAD-3-007] |2| {/components/headers[head-3-007]} :: The "example" and "examples" properties are mutually exclusive.
[LINK-3-001] |2| {/components/links[link-3-001]} :: The "operationRef" and "operationId" properties are mutually exclusive.`;
        assertValidationOutput(actual, expected);
    });

    it("Required Property", () => {
        let json: any = readJSON('tests/fixtures/validation/3.0/required-property.json');
        let document: Oas30Document = <Oas30Document> library.createDocument(json);

        let node: OasNode = document;
        let errors: OasValidationProblem[] = library.validate(node);

        let actual: string = errorsAsString(errors);
        let expected: string =
`[INF-3-001] |2| {/info} :: Property "title" is required.
[INF-3-002] |2| {/info} :: Property "version" is required.
[LIC-3-001] |2| {/info/license} :: Property "name" is required.
[SRV-3-001] |2| {/servers[0]} :: Property "url" is required.
[SVAR-3-001] |2| {/servers[1]/variables[username]} :: Property "default" is required.
[OP-3-004] |2| {/paths[/op-3-004]/get} :: Property "responses" is required.
[PAR-3-003] |2| {/paths[/par-3-003]/parameters[0]} :: Property "name" is required.
[PAR-3-004] |2| {/paths[/par-3-004]/parameters[0]} :: Property "in" is required.
[DISC-3-001] |2| {/components/schemas[disc-3-001]/discriminator} :: Property "propertyName" is required.
[ED-3-002] |2| {/components/schemas[ed-3-002]/externalDocs} :: Property "url" is required.
[FLOW-3-001] |2| {/components/securitySchemes[flow-3-001]/flows/implicit} :: Property "authorizationUrl" is required.
[FLOW-3-001] |2| {/components/securitySchemes[flow-3-001]/flows/authorizationCode} :: Property "authorizationUrl" is required.
[FLOW-3-002] |2| {/components/securitySchemes[flow-3-002]/flows/clientCredentials} :: Property "tokenUrl" is required.
[FLOW-3-002] |2| {/components/securitySchemes[flow-3-002]/flows/authorizationCode} :: Property "tokenUrl" is required.
[FLOW-3-006] |2| {/components/securitySchemes[flow-3-006]/flows/implicit} :: Property "scopes" is required.
[SS-3-001] |2| {/components/securitySchemes[ss-3-001]} :: Property "type" is required.
[SS-3-002] |2| {/components/securitySchemes[ss-3-002]} :: Property "name" is required when "type" property is "apiKey".
[SS-3-003] |2| {/components/securitySchemes[ss-3-003]} :: Property "in" is required when "type" property is "apiKey".
[SS-3-004] |2| {/components/securitySchemes[ss-3-004]} :: Property "scheme" is required when "type" property is "http".
[SS-3-005] |2| {/components/securitySchemes[ss-3-005]} :: Property "flows" is required when "type" property is "oauth2".
[SS-3-006] |2| {/components/securitySchemes[ss-3-006]} :: Property "openIdConnectUrl" is required when "type" property is "openIdConnect".
[TAG-3-001] |2| {/tags[0]} :: Property "name" is required.`;
        assertValidationOutput(actual, expected);

        // Now test re-validating just the Info node
        errors = library.validate(document.info);
        actual = errorsAsString(errors);
        expected =
`[INF-3-001] |2| {/info} :: Property "title" is required.
[INF-3-002] |2| {/info} :: Property "version" is required.
[LIC-3-001] |2| {/info/license} :: Property "name" is required.`
        assertValidationOutput(actual, expected);
    });

    it("Required Property (Root)", () => {
        let json: any = readJSON('tests/fixtures/validation/3.0/required-property-root.json');
        let document: Oas30Document = <Oas30Document> library.createDocument(json);

        let node: OasNode = document;
        let errors: OasValidationProblem[] = library.validate(node);

        let actual: string = errorsAsString(errors);
        let expected: string =
`[R-3-002] |2| {/} :: Property "info" is required.
[R-3-003] |2| {/} :: Property "paths" is required.`;
        assertValidationOutput(actual, expected);
    });

    it("Uniqueness", () => {
        let json: any = readJSON('tests/fixtures/validation/3.0/uniqueness.json');
        let document: Oas30Document = <Oas30Document> library.createDocument(json);

        let node: OasNode = document;
        let errors: OasValidationProblem[] = library.validate(node);

        let actual: string = errorsAsString(errors);
        let expected: string =
`[OP-3-002] |2| {/paths[/foo]/get} :: The "operationId" property value 'fooId' must be unique across ALL operations.
[OP-3-002] |2| {/paths[/bar]/get} :: The "operationId" property value 'fooId' must be unique across ALL operations.
[TAG-3-003] |2| {/tags[0]} :: Duplicate tag "MyTag" found (every tag must have a unique name).
[TAG-3-003] |2| {/tags[2]} :: Duplicate tag "MyTag" found (every tag must have a unique name).`;
        assertValidationOutput(actual, expected);
    });

    it("Uniqueness (Re-Validate)", () => {
        let json: any = readJSON('tests/fixtures/validation/3.0/uniqueness.json');
        let document: Oas30Document = <Oas30Document> library.createDocument(json);

        let node: OasNode = document;
        let errors1: OasValidationProblem[] = library.validate(node);
        let errors2: OasValidationProblem[] = library.validate(node);

        // If we validate twice, the output should be the same!
        expect(errorsAsString(errors1)).toEqual(errorsAsString(errors2));

        let actual: string = errorsAsString(errors2);
        let expected: string =
`[OP-3-002] |2| {/paths[/foo]/get} :: The "operationId" property value 'fooId' must be unique across ALL operations.
[OP-3-002] |2| {/paths[/bar]/get} :: The "operationId" property value 'fooId' must be unique across ALL operations.
[TAG-3-003] |2| {/tags[0]} :: Duplicate tag "MyTag" found (every tag must have a unique name).
[TAG-3-003] |2| {/tags[2]} :: Duplicate tag "MyTag" found (every tag must have a unique name).`;
        assertValidationOutput(actual, expected);
    });

    it("Custom Severities", () => {
        let json: any = readJSON('tests/fixtures/validation/3.0/mutually-exclusive.json');
        let document: Oas30Document = <Oas30Document> library.createDocument(json);

        let node: OasNode = document;
        let severities: IOasValidationSeverityRegistry = {
            lookupSeverity: function() {
                return OasValidationProblemSeverity.low;
            }
        };
        let errors: OasValidationProblem[] = library.validate(node, true, severities);

        let actual: string = errorsAsString(errors);
        let expected: string =
            `[MT-3-001] |2| {/components/parameters[mt-3-001]/content[text/plain]} :: The "example" and "examples" properties are mutually exclusive.
[PAR-3-008] |2| {/components/parameters[par-3-008]} :: The "schema" and "content" properties are mutually exclusive.
[PAR-3-015] |2| {/components/parameters[par-3-015]} :: The "example" and "examples" properties are mutually exclusive.
[EX-3-002] |2| {/components/examples[ex-3-002]} :: The "value" and "externalValue" properties are mutually exclusive.
[HEAD-3-007] |2| {/components/headers[head-3-007]} :: The "example" and "examples" properties are mutually exclusive.
[LINK-3-001] |2| {/components/links[link-3-001]} :: The "operationRef" and "operationId" properties are mutually exclusive.`;
        assertValidationOutput(actual, expected);
    });

});
