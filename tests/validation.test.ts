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


function errorsAsString(errors: OasValidationProblem[]): string {
    let es: string[] = [];
    for (let error of errors) {
        es.push(`[${error.errorCode}] |${error.severity}| {${error.nodePath}->${error.property}} :: ${error.message}`);
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


describe("Validation (2.0)", () => {

    let library: OasLibraryUtils;

    beforeEach(() => {
        library = new OasLibraryUtils();
    });

    it("Valid Pet Store Document", () => {
        let json: any = readJSON('tests/fixtures/validation/2.0/valid-pet-store.json');
        let document: Oas20Document = library.createDocument(json) as Oas20Document;

        let node: OasNode = document;
        let errors: OasValidationProblem[] = library.validate(node);

        expect(errors).toEqual([]);
    });

    it("Document (Required Properties)", () => {
        let json: any = readJSON('tests/fixtures/validation/2.0/document-required-properties.json');
        let document: Oas20Document = library.createDocument(json) as Oas20Document;

        let node: OasNode = document;
        let errors: OasValidationProblem[] = library.validate(node);

        let actual: string = errorsAsString(errors);
        let expected: string =
`[R-002] |2| {/->info} :: Property "info" is required.
[R-003] |2| {/->paths} :: Property "paths" is required.`;

        assertValidationOutput(actual, expected);
    });

    it("Document (Invalid Property Format)", () => {
        let json: any = readJSON('tests/fixtures/validation/2.0/document-invalid-property-format.json');
        let document: Oas20Document = library.createDocument(json) as Oas20Document;

        let node: OasNode = document;
        let errors: OasValidationProblem[] = library.validate(node);

        let actual: string = errorsAsString(errors);
        let expected: string =
`[R-004] |2| {/->host} :: Host not properly formatted - only the host name (and optionally port) should be specified.
[R-005] |2| {/->basePath} :: Base Path should being with a '/' character.`;

        assertValidationOutput(actual, expected);
    });

    it("Info (Required Properties)", () => {
        let json: any = readJSON('tests/fixtures/validation/2.0/info-required-properties.json');
        let document: Oas20Document = library.createDocument(json) as Oas20Document;

        let node: OasNode = document;
        let errors: OasValidationProblem[] = library.validate(node);

        let actual: string = errorsAsString(errors);
        let expected: string =
`[INF-001] |2| {/info->title} :: API is missing a title.
[INF-002] |2| {/info->version} :: API is missing a version.`

        assertValidationOutput(actual, expected);
    });

    it("Info (Invalid Property Value)", () => {
        let json: any = readJSON('tests/fixtures/validation/2.0/info-invalid-property-format.json');
        let document: Oas20Document = library.createDocument(json) as Oas20Document;

        let node: OasNode = document;
        let errors: OasValidationProblem[] = library.validate(node);

        let actual: string = errorsAsString(errors);
        let expected: string =
`[CTC-002] |2| {/info/contact->email} :: Contact Email is an incorrect format.
[LIC-002] |2| {/info/license->url} :: License URL is an incorrect format.`;

        assertValidationOutput(actual, expected);
    });

    it("Security Scheme (Required Properties)", () => {
        let json: any = readJSON('tests/fixtures/validation/2.0/security-scheme-required-properties.json');
        let document: Oas20Document = library.createDocument(json) as Oas20Document;

        let node: OasNode = document;
        let errors: OasValidationProblem[] = library.validate(node);

        let actual: string = errorsAsString(errors);

        // console.info("+++++");
        // console.info(actual);
        // console.info("+++++");

        let expected: string =
`[SS-001] |2| {/securityDefinitions[notype_auth]->type} :: Property "type" is required.
[SS-002] |2| {/securityDefinitions[apikey_auth_1]->name} :: API Key Security Scheme is missing a parameter name.
[SS-003] |2| {/securityDefinitions[apikey_auth_1]->in} :: API Key Security Scheme is missing a parameter location.
[SS-004] |2| {/securityDefinitions[oauth2_auth_1]->flow} :: Property "flow" is required when "type" property is 'oauth2'.
[SS-007] |2| {/securityDefinitions[oauth2_auth_1]->scopes} :: OAuth Security Scheme is missing defined scopes.
[SS-005] |2| {/securityDefinitions[oauth2_auth_2]->authorizationUrl} :: OAuth Security Scheme is missing an Authorization URL.
[SS-007] |2| {/securityDefinitions[oauth2_auth_2]->scopes} :: OAuth Security Scheme is missing defined scopes.
[SS-005] |2| {/securityDefinitions[oauth2_auth_3]->authorizationUrl} :: OAuth Security Scheme is missing an Authorization URL.
[SS-006] |2| {/securityDefinitions[oauth2_auth_3]->tokenUrl} :: OAuth Security Scheme is missing a Token URL.
[SS-007] |2| {/securityDefinitions[oauth2_auth_3]->scopes} :: OAuth Security Scheme is missing defined scopes.
[SS-006] |2| {/securityDefinitions[oauth2_auth_4]->tokenUrl} :: OAuth Security Scheme is missing a Token URL.
[SS-007] |2| {/securityDefinitions[oauth2_auth_4]->scopes} :: OAuth Security Scheme is missing defined scopes.
[SS-006] |2| {/securityDefinitions[oauth2_auth_5]->tokenUrl} :: OAuth Security Scheme is missing a Token URL.
[SS-007] |2| {/securityDefinitions[oauth2_auth_5]->scopes} :: OAuth Security Scheme is missing defined scopes.`;

        assertValidationOutput(actual, expected);
    });

    it("Security Scheme (Invalid Property Format)", () => {
        let json: any = readJSON('tests/fixtures/validation/2.0/security-scheme-invalid-property-format.json');
        let document: Oas20Document = library.createDocument(json) as Oas20Document;

        let node: OasNode = document;
        let errors: OasValidationProblem[] = library.validate(node);

        let actual: string = errorsAsString(errors);
        let expected: string =
`[SS-011] |2| {/securityDefinitions[petstore_auth]->authorizationUrl} :: Security Scheme Authorization URL is an incorrect format.
[SS-011] |2| {/securityDefinitions[petstore_auth_accessCode]->authorizationUrl} :: Security Scheme Authorization URL is an incorrect format.
[SS-012] |2| {/securityDefinitions[petstore_auth_accessCode]->tokenUrl} :: Security Scheme Token URL is an incorrect format.`;

        assertValidationOutput(actual, expected);
    });

    it("Invalid Property Name (All)", () => {
        let json: any = readJSON('tests/fixtures/validation/2.0/invalid-property-name.json');
        let document: Oas20Document = library.createDocument(json) as Oas20Document;

        let node: OasNode = document;
        let errors: OasValidationProblem[] = library.validate(node);

        let actual: string = errorsAsString(errors);
        let expected: string =
`[PATH-005] |2| {/paths[pet]->null} :: Paths must start with a '/' character.
[PATH-005] |2| {/paths[pet/findByStatus]->null} :: Paths must start with a '/' character.
[RES-003] |2| {/paths[/pet/findByTags]/get/responses[487]->statusCode} :: "487" is not a valid HTTP response status code.
[RES-003] |2| {/paths[/pet/findByTags]/get/responses[822]->statusCode} :: "822" is not a valid HTTP response status code.
[EX-001] |2| {/paths[/pet/findByTags]/get/responses[822]/examples->produces} :: Example 'text/plain' must match one of the "produces" mime-types.`;

        assertValidationOutput(actual, expected);
    });

    it("Uniqueness (All)", () => {
        let json: any = readJSON('tests/fixtures/validation/2.0/uniqueness.json');
        let document: Oas20Document = library.createDocument(json) as Oas20Document;

        let node: OasNode = document;
        let errors: OasValidationProblem[] = library.validate(node);

        let actual: string = errorsAsString(errors);
        let expected: string =
`[OP-003] |2| {/paths[/pet]/put->operationId} :: Operation IDs must be unique across all operations.
[OP-003] |2| {/paths[/pet]/post->operationId} :: Operation IDs must be unique across all operations.
[PAR-019] |2| {/paths[/pet/findByStatus]/get/parameters[0]->in} :: Duplicate parameter named 'status' found (parameters must be unique by name and location).
[PAR-019] |2| {/paths[/pet/findByStatus]/get/parameters[1]->in} :: Duplicate parameter named 'status' found (parameters must be unique by name and location).
[PAR-019] |2| {/paths[/pet/findByTags]/get/parameters[0]->in} :: Duplicate parameter named 'tags' found (parameters must be unique by name and location).
[PAR-019] |2| {/paths[/pet/findByTags]/get/parameters[1]->in} :: Duplicate parameter named 'tags' found (parameters must be unique by name and location).
[PAR-019] |2| {/paths[/pet/findByTags]/get/parameters[2]->in} :: Duplicate parameter named 'tags' found (parameters must be unique by name and location).
[OP-003] |2| {/paths[/pet/{petId}]/get->operationId} :: Operation IDs must be unique across all operations.
[OP-003] |2| {/paths[/pet/{petId}]/post->operationId} :: Operation IDs must be unique across all operations.
[OP-003] |2| {/paths[/pet/{petId}]/delete->operationId} :: Operation IDs must be unique across all operations.
[PAR-020] |2| {/paths[/store/order]/post/parameters[0]->in} :: Operation has multiple "body" parameters.
[PAR-020] |2| {/paths[/store/order]/post/parameters[1]->in} :: Operation has multiple "body" parameters.
[TAG-003] |2| {/tags[1]->store} :: Duplicate tag 'store' found (every tag must have a unique name).
[TAG-003] |2| {/tags[2]->store} :: Duplicate tag 'store' found (every tag must have a unique name).`;

        assertValidationOutput(actual, expected);
    });

    it("Mutually Exclusive (All)", () => {
        let json: any = readJSON('tests/fixtures/validation/2.0/mutually-exclusive.json');
        let document: Oas20Document = library.createDocument(json) as Oas20Document;

        let node: OasNode = document;
        let errors: OasValidationProblem[] = library.validate(node);

        let actual: string = errorsAsString(errors);
        let expected: string = `[PATH-001] |2| {/paths[/pet]/post->body} :: Operation may not have both Body and Form Data parameters.`;

        assertValidationOutput(actual, expected);
    });

    it("Invalid Reference (All)", () => {
        let json: any = readJSON('tests/fixtures/validation/2.0/invalid-reference.json');
        let document: Oas20Document = library.createDocument(json) as Oas20Document;

        let node: OasNode = document;
        let errors: OasValidationProblem[] = library.validate(node);

        let actual: string = errorsAsString(errors);
        let expected: string =
`[PAR-018] |2| {/paths[/pet]/put/parameters[1]->$ref} :: Parameter Reference must refer to a valid Parameter Definition.
[SCH-001] |2| {/paths[/pet]/post/parameters[0]/schema->$ref} :: Schema Reference must refer to a valid Schema Definition.
[SCH-001] |2| {/paths[/pet/findByStatus]/get/responses[200]/schema/items->$ref} :: Schema Reference must refer to a valid Schema Definition.
[SREQ-001] |2| {/paths[/pet/findByStatus]/get/security[0]->null} :: Security Requirement 'petstore_auth_notfound' must refer to a valid Security Definition.
[RES-002] |2| {/paths[/pet/findByTags]/get/responses[404]->$ref} :: Response Reference must refer to a valid Response Definition.
[SCH-002] |2| {/definitions[Pet]->required} :: Schema lists property "missingProperty" as required, but it does not exist.`;

        assertValidationOutput(actual, expected);
    });

    it("Pet Store (Extra Properties)", () => {
        let json: any = readJSON('tests/fixtures/validation/2.0/pet-store-extra-properties.json');
        let document: Oas20Document = library.createDocument(json) as Oas20Document;

        let node: OasNode = document;
        let errors: OasValidationProblem[] = library.validate(node);

        let actual: string = errorsAsString(errors);
        let expected: string =
`[UNKNOWN-001] |2| {/info->extra-info-property} :: An unexpected property "extra-info-property" was found.  Extension properties should begin with "x-".
[UNKNOWN-001] |2| {/info/license->extra-license-property-1} :: An unexpected property "extra-license-property-1" was found.  Extension properties should begin with "x-".
[UNKNOWN-001] |2| {/info/license->extra-license-property-2} :: An unexpected property "extra-license-property-2" was found.  Extension properties should begin with "x-".`;

        assertValidationOutput(actual, expected);
    });

});




describe("Validation (3.0)", () => {

    let library: OasLibraryUtils;

    beforeEach(() => {
        library = new OasLibraryUtils();
    });

    it("Valid Pet Store Document", () => {
        let json: any = readJSON('tests/fixtures/validation/3.0/valid-pet-store.json');
        let document: Oas30Document = library.createDocument(json) as Oas30Document;

        let node: OasNode = document;
        let errors: OasValidationProblem[] = library.validate(node);

        expect(errors).toEqual([]);
    });

    it("Invalid Property Format", () => {
        let json: any = readJSON('tests/fixtures/validation/3.0/invalid-property-format.json');
        let document: Oas30Document = library.createDocument(json) as Oas30Document;

        let node: OasNode = document;
        let errors: OasValidationProblem[] = library.validate(node);

        let actual: string = errorsAsString(errors);
        let expected: string =
`[CTC-3-004] |2| {/info->termsOfService} :: Terms of Service URL is an incorrect format.
[CTC-3-001] |2| {/info/contact->url} :: Contact URL is an incorrect format.
[CTC-3-002] |2| {/info/contact->email} :: Contact email is an incorrect format.
[LIC-3-002] |2| {/info/license->url} :: License URL is an incorrect format.`;

        assertValidationOutput(actual, expected);
    });

    it("Ignored Property Name", () => {
        let json: any = readJSON('tests/fixtures/validation/3.0/ignored-property-name.json');
        let document: Oas30Document = library.createDocument(json) as Oas30Document;

        let node: OasNode = document;
        let errors: OasValidationProblem[] = library.validate(node);

        let actual: string = errorsAsString(errors);
        let expected: string =
`[HEAD-3-001] |2| {/paths[/pets]/get/responses[200]/content[multipart/form-data]/encoding[id]/headers[Content-Type]->null} :: The "Content-Type" header will be ignored.`;

        assertValidationOutput(actual, expected);
    });

    it("Invalid Property Type", () => {
        let json: any = readJSON('tests/fixtures/validation/3.0/invalid-property-type.json'); 
        let document: Oas30Document = library.createDocument(json) as Oas30Document;

        let node: OasNode = document;
        let errors: OasValidationProblem[] = library.validate(node);

        let actual: string = errorsAsString(errors);
        let expected: string = [
            `[SCH-3-004] |2| {/paths[/pets]/get/responses[200]/content[application/json]/schema->items} :: Schema items must be present only for schemas of type 'array'.`,
            `[SCH-3-003] |2| {/components/schemas[NewPet]/properties[name]->type} :: Schema type value of "invalid" is not allowed.  Must be one of: [string, number, integer, boolean, array, object]`,
            `[SCH-3-004] |2| {/components/schemas[NewPet]/properties[tags]->items} :: Schema items must be present only for schemas of type 'array'.`,
            `[SCH-3-003] |2| {/components/schemas[NewPet]/properties[nickNames]/items->type} :: Schema type value of "invalid" is not allowed.  Must be one of: [string, number, integer, boolean, array, object]`
        ].join('\n')

        assertValidationOutput(actual, expected);
    });

    it("Invalid Property Name", () => {
        let json: any = readJSON('tests/fixtures/validation/3.0/invalid-property-name.json');
        let document: Oas30Document = library.createDocument(json) as Oas30Document;

        let node: OasNode = document;
        let errors: OasValidationProblem[] = library.validate(node);

        let actual: string = errorsAsString(errors);
        let expected: string =
`[ENC-3-006] |2| {/paths[/enc-3-006]/post/requestBody/content[multipart/mixed]/encoding[missingProperty]->missingProperty} :: Encoding Property "missingProperty" not found in the associated schema.
[RES-3-001] |2| {/paths[/pets]/get/responses[Success]->null} :: "Success" is not a valid HTTP response status code.
[PATH-3-004] |2| {/paths[pets/{id}]->null} :: Paths must start with a '/' character.
[COMP-3-001] |2| {/components/schemas[Pet+Foo]->name} :: Schema Definition Name is not valid.
[COMP-3-003] |2| {/components/responses[The Response]->name} :: Response Definition Name is not valid.
[COMP-3-002] |2| {/components/parameters[Some$Parameter]->parameterName} :: Parameter Definition Name is not valid.
[COMP-3-005] |2| {/components/examples[Example|1]->name} :: The Example Definition Name is not valid.
[COMP-3-006] |2| {/components/requestBodies[Request Body]->name} :: The Request Body Definition Name is not valid.
[COMP-3-007] |2| {/components/headers[[Header]]->name} :: The Header Definition Name is not valid.
[COMP-3-004] |2| {/components/securitySchemes[Security%Scheme]->schemeName} :: The Security Scheme Name is not valid.
[COMP-3-008] |2| {/components/links[Link*Twelve]->name} :: The Link Definition Name is not valid.
[COMP-3-009] |2| {/components/callbacks[Invalid Callback Name]->name} :: The Callback Definition Name is not valid.
[SREQ-3-001] |2| {/security[1]->null} :: "MissingAuth" does not match a declared Security Scheme.`;

        assertValidationOutput(actual, expected);
    });

    it("Invalid Property Value", () => {
        let json: any = readJSON('tests/fixtures/validation/3.0/invalid-property-value.json');
        let document: Oas30Document = library.createDocument(json) as Oas30Document;

        let node: OasNode = document;
        let errors: OasValidationProblem[] = library.validate(node);

        let actual: string = errorsAsString(errors);
        let expected: string =
`[SVAR-3-003] |2| {/servers[0]/variables[missingProperty]->null} :: Server Variable "missingProperty" is not found in the server url template.
[ENC-3-001] |2| {/paths[/enc-3-001]/post/requestBody/content[application/x-www-form-urlencoded]/encoding[profileImage]->headers} :: Headers are not allowed for "application/x-www-form-urlencoded" media types.
[ENC-3-002] |2| {/paths[/enc-3-002]/post/requestBody/content[multipart/form-data]/encoding[historyMetadata]->style} :: Encoding Style is not allowed for "multipart/form-data" media types.
[ENC-3-003] |2| {/paths[/enc-3-003]/post/requestBody/content[multipart/form-data]/encoding[historyMetadata]->explode} :: "Explode" is not allowed for "multipart/form-data" media types.
[ENC-3-004] |2| {/paths[/enc-3-004]/post/requestBody/content[multipart/form-data]/encoding[historyMetadata]->allowReserved} :: "Allow Reserved" is not allowed for "multipart/form-data" media types.
[ENC-3-005] |2| {/paths[/enc-3-005]/post/requestBody/content[application/x-www-form-urlencoded]/encoding[historyMetadata]->style} :: Encoding Style is an invalid value.
[HEAD-3-003] |2| {/paths[/head-3-003]/post/requestBody/content[multipart/form-data]/encoding[historyMetadata]/headers[X-Header-1]->style} :: Header Style must be "simple".
[HEAD-3-004] |2| {/paths[/head-3-004]/post/requestBody/content[multipart/form-data]/encoding[historyMetadata]/headers[X-Header-1]->content} :: Header content cannot have multiple media types.
[LINK-3-002] |2| {/paths[/link-3-002]/get/responses[200]/links[address]->operationId} :: The Operation ID does not refer to an existing Operation.
[MT-3-003] |2| {/paths[/mt-3-003]/post/requestBody/content[application/json]->encoding} :: Encoding is not allowed for "application/json" media types.
[OP-3-003] |2| {/paths[/op-3-003]/get->requestBody} :: Request Body is not supported for GET operations.
[OP-3-005] |2| {/paths[/op-3-005]/get->null} :: Operation must have at least one Response.
[PAR-3-002] |2| {/paths[/par-3-002]/parameters[0]->in} :: Parameters must be "in" one of: ["path", "query", "header", "cookie"] (Found: 'side')
[PAR-3-006] |2| {/paths[/par-3-006/{id}]/parameters[0]->required} :: Path Parameters must be marked as "required".
[PAR-3-020] |2| {/paths[/par-3-006/{id}]/parameters[0]->required} :: Path Parameter must be marked as "required".
[PAR-3-007] |2| {/paths[/par-3-007/{id}]/parameters[0]->allowEmptyValue} :: Allow Empty Value is not allowed (only for Query Params).
[PAR-3-009] |2| {/paths[/par-3-009]/parameters[0]->style} :: Parameter Style must be one of: ["matrix", "label", "form", "simple", "spaceDelimited", "pipeDelimited", "deepObject"] (Found "shallowObject").
[PAR-3-011] |2| {/paths[/par-3-009]/parameters[0]->style} :: Query Parameter Style must be one of: ["form", "spaceDelimited", "pipeDelimited", "deepObject"] (Found "shallowObject").
[PAR-3-010] |2| {/paths[/par-3-010/{id}]/parameters[0]->style} :: Path Parameter Style must be one of: ["matrix", "label", "simple"]  (Found "form").
[PAR-3-011] |2| {/paths[/par-3-011]/parameters[0]->style} :: Query Parameter Style must be one of: ["form", "spaceDelimited", "pipeDelimited", "deepObject"] (Found "label").
[PAR-3-012] |2| {/paths[/par-3-012]/parameters[0]->style} :: Cookie Parameter style must be "form". (Found "label")
[PAR-3-013] |2| {/paths[/par-3-013]/parameters[0]->style} :: Header Parameter Style must be "simple". (Found "label").
[PAR-3-014] |2| {/paths[/par-3-014]/parameters[0]->allowReserved} :: Allow Reserved is only allowed for Query Parameters.
[PAR-3-016] |2| {/paths[/par-3-016]/parameters[0]->content} :: Parameter content cannot have multiple media types.
[PAR-3-018] |2| {/paths[/par-3-018/{id}/{sub}]/parameters[1]->name} :: Path Parameter not found in path template.
[PAR-3-019] |2| {/paths[/par-3-019]/parameters[0]->null} :: Header Parameters "Accept", "Content-Type", and "Authorization" are ignored.
[SCH-3-001] |2| {/paths[/sch-3-001]/get/responses[200]/content[application/json]/schema/discriminator->discriminator} :: Schema Discriminator is only allowed when using one of: ["oneOf", "anyOf", "allOf"]
[SREQ-3-002] |2| {/paths[/sreq-3-002]/get/security[0]->api_key} :: Value for Security Requirement "api_key" must be an empty array.
[XML-3-002] |2| {/components/schemas[xml-3-002]/properties[name]/xml->wrapped} :: "Wrapped" is only valid for 'array' property types.
[SS-3-008] |2| {/components/securitySchemes[ss-3-008]->type} :: Security Scheme type must be one of: ["apiKey", "http", "oauth2", "openIdConnect"] (Found: 'invalid')
[SS-3-010] |2| {/components/securitySchemes[ss-3-010]->in} :: Security Scheme API Key must be located "in" one of: ["query", "header", "cookie"] (Found: 'body')
[SS-3-011] |2| {/components/securitySchemes[ss-3-011]->bearerFormat} :: Security Scheme "Bearer Format" only allowed for HTTP Bearer auth scheme.
[SS-3-013] |2| {/components/securitySchemes[ss-3-013]->scheme} :: Security Scheme HTTP security scheme must be one of: ["basic", "bearer", "digest", "hoba", "mutual", "negotiate", "oauth", "vapid", "scram-sha-1", "scram-sha-256"] (Found: 'leveraged')`;

        assertValidationOutput(actual, expected);
    });

    it("Invalid Reference", () => {
        let json: any = readJSON('tests/fixtures/validation/3.0/invalid-reference.json');
        let document: Oas30Document = library.createDocument(json) as Oas30Document;

        let node: OasNode = document;
        let errors: OasValidationProblem[] = library.validate(node);

        let actual: string = errorsAsString(errors);
        let expected: string =
`[CALL-3-001] |2| {/paths[/call-3-001]/get/callbacks[myRefCallback]->$ref} :: Callback Reference must refer to a valid Callback Definition.
[EX-3-003] |2| {/paths[/ex-3-003]/put/requestBody/content[application/json]/examples[bar]->$ref} :: Example Reference must refer to a valid Example Definition.
[HEAD-3-005] |2| {/paths[/head-3-005]/get/responses[200]/headers[X-Rate-Limit-Reset]->$ref} :: Header Reference must refer to a valid Header Definition.
[LINK-3-003] |2| {/paths[/link-3-003]/get/responses[200]/links[MissingLink]->operationRef} :: Link "Operation Reference" must refer to a valid Operation Definition.
[LINK-3-005] |2| {/paths[/link-3-005]/get/responses[200]/links[MissingLink]->$ref} :: Link Reference must refer to a valid Link Definition.
[PAR-3-017] |2| {/paths[/par-3-017]/parameters[1]->$ref} :: Parameter Reference must refer to a valid Parameter Definition.
[RB-3-003] |2| {/paths[/rb-3-003]/post/requestBody->$ref} :: Request Body Reference must refer to a valid Request Body Definition.
[RES-3-004] |2| {/paths[/res-3-004]/get/responses[200]->$ref} :: Response Reference must refer to a valid Response Definition.
[SCH-3-002] |2| {/paths[/sch-3-002]/parameters[0]/schema->$ref} :: Schema Reference must refer to a valid Schema Definition.
[SCH-3-005] |2| {/components/schemas[sch-3-005]->required} :: Schema lists property "missingProperty" as required, but it does not exist.
[SS-3-012] |2| {/components/securitySchemes[BASIC]->$ref} :: Security Scheme Reference must refer to a valid Security Scheme Definition.`;

        assertValidationOutput(actual, expected);
    });

    it("Mutually Exclusive", () => {
        let json: any = readJSON('tests/fixtures/validation/3.0/mutually-exclusive.json');
        let document: Oas30Document = library.createDocument(json) as Oas30Document;

        let node: OasNode = document;
        let errors: OasValidationProblem[] = library.validate(node);

        let actual: string = errorsAsString(errors);
        let expected: string =
`[MT-3-001] |2| {/components/parameters[mt-3-001]/content[text/plain]->example} :: "Example" and "Examples" are mutually exclusive.
[PAR-3-008] |2| {/components/parameters[par-3-008]->schema} :: Parameter cannot have both a Schema and Content.
[PAR-3-015] |2| {/components/parameters[par-3-015]->example} :: "Example" and "Examples" are mutually exclusive.
[EX-3-002] |2| {/components/examples[ex-3-002]->value} :: "Value" and "External Value" are mutually exclusive.
[HEAD-3-007] |2| {/components/headers[head-3-007]->example} :: "Example" and "Examples" are mutually exclusive.
[LINK-3-001] |2| {/components/links[link-3-001]->operationId} :: Operation Reference and Operation cannot both be used.`;
        assertValidationOutput(actual, expected);
    });

    it("Required Property", () => {
        let json: any = readJSON('tests/fixtures/validation/3.0/required-property.json');
        let document: Oas30Document = library.createDocument(json) as Oas30Document;

        let node: OasNode = document;
        let errors: OasValidationProblem[] = library.validate(node);

        let actual: string = errorsAsString(errors);
        let expected: string =
`[INF-3-001] |2| {/info->title} :: The API is missing a title.
[INF-3-002] |2| {/info->version} :: The API is missing a version.
[LIC-3-001] |2| {/info/license->name} :: License must have a name.
[SRV-3-001] |2| {/servers[0]->url} :: Server is missing a template URL.
[SVAR-3-001] |2| {/servers[1]/variables[username]->default} :: Server Variable "username" is missing a default value.
[OP-3-004] |2| {/paths[/op-3-004]/get->responses} :: Operation must have at least one response.
[PAR-3-003] |2| {/paths[/par-3-003]/parameters[0]->name} :: Parameter is missing a name.
[PAR-3-004] |2| {/paths[/par-3-004]/parameters[0]->in} :: Parameter location is missing.
[RES-3-003] |2| {/paths[/res-3-003]/get/responses[200]->description} :: Response (code 200) is missing a description.
[DISC-3-001] |2| {/components/schemas[disc-3-001]/discriminator->propertyName} :: Discriminator must indicate a property (by name).
[ED-3-002] |2| {/components/schemas[ed-3-002]/externalDocs->url} :: External Documentation is missing a URL.
[FLOW-3-001] |2| {/components/securitySchemes[flow-3-001]/flows/implicit->authorizationUrl} :: Implicit OAuth Flow is missing an Authorization URL.
[FLOW-3-001] |2| {/components/securitySchemes[flow-3-001]/flows/authorizationCode->authorizationUrl} :: Auth Code OAuth Flow is missing an Authorization URL.
[FLOW-3-002] |2| {/components/securitySchemes[flow-3-002]/flows/clientCredentials->tokenUrl} :: Client Credentials OAuth Flow is missing a Token URL.
[FLOW-3-002] |2| {/components/securitySchemes[flow-3-002]/flows/authorizationCode->tokenUrl} :: Auth Code OAuth Flow is missing a Token URL.
[FLOW-3-006] |2| {/components/securitySchemes[flow-3-006]/flows/implicit->scopes} :: OAuth Flow is missing defined scopes.
[SS-3-001] |2| {/components/securitySchemes[ss-3-001]->type} :: Property "type" is required.
[SS-3-002] |2| {/components/securitySchemes[ss-3-002]->name} :: API Key Security Scheme is missing a name (e.g. of a header or query param).
[SS-3-003] |2| {/components/securitySchemes[ss-3-003]->in} :: API Key Security Scheme must describe where the Key can be found (e.g. header, query param, etc).
[SS-3-004] |2| {/components/securitySchemes[ss-3-004]->scheme} :: HTTP Security Scheme is missing a scheme (Basic, Digest, etc).
[SS-3-005] |2| {/components/securitySchemes[ss-3-005]->flows} :: OAuth Security Scheme does not define any OAuth flows.
[SS-3-006] |2| {/components/securitySchemes[ss-3-006]->openIdConnectUrl} :: OpenID Connect Security Scheme is missing a Connect URL.
[TAG-3-001] |2| {/tags[0]->name} :: Tag is missing a name.`;
        assertValidationOutput(actual, expected);

        // Now test re-validating just the Info node
        errors = library.validate(document.info);
        actual = errorsAsString(errors);
        expected =
`[INF-3-001] |2| {/info->title} :: The API is missing a title.
[INF-3-002] |2| {/info->version} :: The API is missing a version.
[LIC-3-001] |2| {/info/license->name} :: License must have a name.`
        assertValidationOutput(actual, expected);
    });

    it("Required Property (Root)", () => {
        let json: any = readJSON('tests/fixtures/validation/3.0/required-property-root.json');
        let document: Oas30Document = library.createDocument(json) as Oas30Document;

        let node: OasNode = document;
        let errors: OasValidationProblem[] = library.validate(node);

        let actual: string = errorsAsString(errors);
        let expected: string =
`[R-3-002] |2| {/->info} :: Property "info" is required.
[R-3-003] |2| {/->paths} :: Property "paths" is required.`;
        assertValidationOutput(actual, expected);
    });

    it("Uniqueness", () => {
        let json: any = readJSON('tests/fixtures/validation/3.0/uniqueness.json');
        let document: Oas30Document = library.createDocument(json) as Oas30Document;

        let node: OasNode = document;
        let errors: OasValidationProblem[] = library.validate(node);

        let actual: string = errorsAsString(errors);
        let expected: string =
`[OP-3-002] |2| {/paths[/foo]/get->operationId} :: Operation IDs must be unique across all operations.
[OP-3-002] |2| {/paths[/bar]/get->operationId} :: Operation IDs must be unique across all operations.
[TAG-3-003] |2| {/tags[0]->MyTag} :: Duplicate tag "MyTag" found (every tag must have a unique name).
[TAG-3-003] |2| {/tags[2]->MyTag} :: Duplicate tag "MyTag" found (every tag must have a unique name).`;
        assertValidationOutput(actual, expected);
    });

    it("Uniqueness (Re-Validate)", () => {
        let json: any = readJSON('tests/fixtures/validation/3.0/uniqueness.json');
        let document: Oas30Document = library.createDocument(json) as Oas30Document;

        let node: OasNode = document;
        let errors1: OasValidationProblem[] = library.validate(node);
        let errors2: OasValidationProblem[] = library.validate(node);

        // If we validate twice, the output should be the same!
        expect(errorsAsString(errors1)).toEqual(errorsAsString(errors2));

        let actual: string = errorsAsString(errors2);
        let expected: string =
`[OP-3-002] |2| {/paths[/foo]/get->operationId} :: Operation IDs must be unique across all operations.
[OP-3-002] |2| {/paths[/bar]/get->operationId} :: Operation IDs must be unique across all operations.
[TAG-3-003] |2| {/tags[0]->MyTag} :: Duplicate tag "MyTag" found (every tag must have a unique name).
[TAG-3-003] |2| {/tags[2]->MyTag} :: Duplicate tag "MyTag" found (every tag must have a unique name).`;
        assertValidationOutput(actual, expected);
    });

    it("Custom Severities", () => {
        let json: any = readJSON('tests/fixtures/validation/3.0/mutually-exclusive.json');
        let document: Oas30Document = library.createDocument(json) as Oas30Document;

        let node: OasNode = document;
        let errors: OasValidationProblem[] = library.validate(node, true, new CustomSeverities(OasValidationProblemSeverity.low));

        let actual: string = errorsAsString(errors);
        let expected: string =
`[MT-3-001] |1| {/components/parameters[mt-3-001]/content[text/plain]->example} :: "Example" and "Examples" are mutually exclusive.
[PAR-3-008] |1| {/components/parameters[par-3-008]->schema} :: Parameter cannot have both a Schema and Content.
[PAR-3-015] |1| {/components/parameters[par-3-015]->example} :: "Example" and "Examples" are mutually exclusive.
[EX-3-002] |1| {/components/examples[ex-3-002]->value} :: "Value" and "External Value" are mutually exclusive.
[HEAD-3-007] |1| {/components/headers[head-3-007]->example} :: "Example" and "Examples" are mutually exclusive.
[LINK-3-001] |1| {/components/links[link-3-001]->operationId} :: Operation Reference and Operation cannot both be used.`;
        assertValidationOutput(actual, expected);

        // Test @Ignore of problems.
        errors = library.validate(node, true, new CustomSeverities(OasValidationProblemSeverity.ignore));
        actual = errorsAsString(errors);
        expected = ``;
        assertValidationOutput(actual, expected);

    });

    class CustomSeverities implements IOasValidationSeverityRegistry {

        constructor(private severity: OasValidationProblemSeverity) {}

        public lookupSeverity(ruleCode: string): OasValidationProblemSeverity {
            return this.severity;
        }

    }

    it("Validation Problem List", () => {
        let json: any = readJSON('tests/fixtures/validation/3.0/invalid-property-value.json');
        let document: Oas30Document = library.createDocument(json) as Oas30Document;

        let node: OasNode = document;
        library.validate(node);

        let enode: OasNode = document.paths.pathItem("/par-3-009").parameters[0];
        let errors: OasValidationProblem[] = enode.validationProblems();

        let actual: string = errorsAsString(errors);
        let expected: string =
`[PAR-3-009] |2| {/paths[/par-3-009]/parameters[0]->style} :: Parameter Style must be one of: ["matrix", "label", "form", "simple", "spaceDelimited", "pipeDelimited", "deepObject"] (Found "shallowObject").
[PAR-3-011] |2| {/paths[/par-3-009]/parameters[0]->style} :: Query Parameter Style must be one of: ["form", "spaceDelimited", "pipeDelimited", "deepObject"] (Found "shallowObject").`;
        assertValidationOutput(actual, expected);

        let codes: string[] = enode.validationProblemCodes();
        expect(codes).toEqual([ "PAR-3-009", "PAR-3-011" ]);

        errors = enode.validationProblemsFor("style");
        actual = errorsAsString(errors);
        expected =
`[PAR-3-009] |2| {/paths[/par-3-009]/parameters[0]->style} :: Parameter Style must be one of: ["matrix", "label", "form", "simple", "spaceDelimited", "pipeDelimited", "deepObject"] (Found "shallowObject").
[PAR-3-011] |2| {/paths[/par-3-009]/parameters[0]->style} :: Query Parameter Style must be one of: ["form", "spaceDelimited", "pipeDelimited", "deepObject"] (Found "shallowObject").`;
        assertValidationOutput(actual, expected);

        errors = enode.validationProblemsFor("in");
        expect(errors).toEqual([]);
    });

    it("Unknown Properties", () => {
        let json: any = readJSON('tests/fixtures/validation/3.0/unknown-properties.json');
        let document: Oas30Document = library.createDocument(json) as Oas30Document;

        let node: OasNode = document;
        let errors: OasValidationProblem[] = library.validate(node);

        let actual: string = errorsAsString(errors);
        let expected: string =
`[UNKNOWN-3-001] |2| {/info/license->unknown-license-property} :: An unexpected property "unknown-license-property" was found.  Extension properties should begin with "x-".
[UNKNOWN-3-001] |2| {/components/schemas[Error]->unexpected-property-datatype} :: An unexpected property "unexpected-property-datatype" was found.  Extension properties should begin with "x-".`;

        assertValidationOutput(actual, expected);
    });

});
