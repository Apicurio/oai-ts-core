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
import {ValidationRuleMetaData} from "../src/validation/ruleset";


class CustomSeverities implements IOasValidationSeverityRegistry {

    constructor(private severity: OasValidationProblemSeverity) {}

    public lookupSeverity(rule: ValidationRuleMetaData): OasValidationProblemSeverity {
        return this.severity;
    }

}


function errorsAsString(errors: OasValidationProblem[]): string {
    let es: string[] = [];
    for (let error of errors) {
        es.push(`[${error.errorCode}] |${error.severity}| {${error.nodePath}->${error.property}} :: ${error.message}`);
    }
    return es.join("\n");
};


function assertValidationOutput(actual: string, expected: string): void {
    console.info("========== EXPECTED ==========");
    console.info(expected);
    console.info("==============================")
    console.info("==========  ACTUAL  ==========");
    console.info(actual);
    console.info("==============================")

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
`[R-002] |2| {/->info} :: API is missing the 'info' property.
[R-003] |2| {/->paths} :: API is missing the 'paths' property.`;

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
`[SS-001] |2| {/securityDefinitions[notype_auth]->type} :: Security Scheme is missing a type.
[SS-002] |2| {/securityDefinitions[apikey_auth_1]->name} :: API Key Security Scheme is missing a parameter name (e.g. name of a header or query param).
[SS-003] |2| {/securityDefinitions[apikey_auth_1]->in} :: API Key Security Scheme must describe where the Key can be found (e.g. header, query param, etc).
[SS-004] |2| {/securityDefinitions[oauth2_auth_1]->flow} :: OAuth Security Scheme is missing a flow type.
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
`[PATH-005] |2| {/paths[pet]->null} :: Path template "pet" is not valid.
[PATH-005] |2| {/paths[pet/findByStatus]->null} :: Path template "pet/findByStatus" is not valid.
[RES-003] |2| {/paths[/pet/findByTags]/get/responses[487]->statusCode} :: "487" is not a valid HTTP response status code.
[RES-003] |2| {/paths[/pet/findByTags]/get/responses[822]->statusCode} :: "822" is not a valid HTTP response status code.
[EX-001] |2| {/paths[/pet/findByTags]/get/responses[822]/examples->produces} :: Example 'text/plain' must match one of the "produces" mime-types.
[PATH-006] |2| {/paths[//pathstest11]->null} :: Path template "//pathstest11" contains one or more empty segment.
[PATH-005] |2| {/paths[pathstest12]->null} :: Path template "pathstest12" is not valid.
[PATH-005] |2| {/paths[{pathstest13}]->null} :: Path template "{pathstest13}" is not valid.
[PATH-005] |2| {/paths[/{{pathstest14}}]->null} :: Path template "/{{pathstest14}}" is not valid.
[PATH-005] |2| {/paths[/pathstest15/{var1}{var2}]->null} :: Path template "/pathstest15/{var1}{var2}" is not valid.
[PATH-005] |2| {/paths[/pathstest16/{var]->null} :: Path template "/pathstest16/{var" is not valid.
[PATH-005] |2| {/paths[/pathstest17/var}]->null} :: Path template "/pathstest17/var}" is not valid.
[PATH-005] |2| {/paths[/pathstest19/{1var}]->null} :: Path template "/pathstest19/{1var}" is not valid.
[PATH-007] |2| {/paths[/pathstest22/{var}/{var}]->null} :: Path template "/pathstest22/{var}/{var}" contains duplicate variable names (var).
[PATH-007] |2| {/paths[/pathstest23/{var1}/{var2}/a{var2}/{var1}]->null} :: Path template "/pathstest23/{var1}/{var2}/a{var2}/{var1}" contains duplicate variable names (var1, var2).
[PATH-009] |2| {/paths[/pathstest25/]->null} :: Path template "/pathstest25/" is semantically identical to at least one other path.
[PATH-009] |2| {/paths[/pathstest25]->null} :: Path template "/pathstest25/" is semantically identical to at least one other path.
[PATH-009] |2| {/paths[/pathstest26/{var}/]->null} :: Path template "/pathstest26/{var}/" is semantically identical to at least one other path.
[PATH-009] |2| {/paths[/pathstest26/{var}]->null} :: Path template "/pathstest26/{var}/" is semantically identical to at least one other path.
[PATH-009] |2| {/paths[/pathstest27/{var2}/]->null} :: Path template "/pathstest27/{var2}/" is semantically identical to at least one other path.
[PATH-009] |2| {/paths[/pathstest27/{var1}]->null} :: Path template "/pathstest27/{var2}/" is semantically identical to at least one other path.`;

        assertValidationOutput(actual, expected);
    });

    it("Uniqueness (All)", () => {
        let json: any = readJSON('tests/fixtures/validation/2.0/uniqueness.json');
        let document: Oas20Document = library.createDocument(json) as Oas20Document;

        let node: OasNode = document;
        let errors: OasValidationProblem[] = library.validate(node);

        let actual: string = errorsAsString(errors);
        let expected: string =
`[OP-003] |2| {/paths[/pet]/put->operationId} :: Duplicate operationId 'addPet' found (operation IDs must be unique across all operations in the API).
[OP-003] |2| {/paths[/pet]/post->operationId} :: Duplicate operationId 'addPet' found (operation IDs must be unique across all operations in the API).
[PAR-019] |2| {/paths[/pet/findByStatus]/get/parameters[0]->in} :: Duplicate query parameter named 'status' found (parameters must be unique by name and location).
[PAR-019] |2| {/paths[/pet/findByStatus]/get/parameters[1]->in} :: Duplicate query parameter named 'status' found (parameters must be unique by name and location).
[PAR-019] |2| {/paths[/pet/findByTags]/get/parameters[0]->in} :: Duplicate query parameter named 'tags' found (parameters must be unique by name and location).
[PAR-019] |2| {/paths[/pet/findByTags]/get/parameters[1]->in} :: Duplicate query parameter named 'tags' found (parameters must be unique by name and location).
[PAR-019] |2| {/paths[/pet/findByTags]/get/parameters[2]->in} :: Duplicate query parameter named 'tags' found (parameters must be unique by name and location).
[OP-003] |2| {/paths[/pet/{petId}]/get->operationId} :: Duplicate operationId 'getPetById' found (operation IDs must be unique across all operations in the API).
[OP-003] |2| {/paths[/pet/{petId}]/post->operationId} :: Duplicate operationId 'getPetById' found (operation IDs must be unique across all operations in the API).
[OP-003] |2| {/paths[/pet/{petId}]/delete->operationId} :: Duplicate operationId 'getPetById' found (operation IDs must be unique across all operations in the API).
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
        let expected: string = `[PATH-002] |2| {/paths[/pet]/post->body} :: Operation may not have both Body and Form Data parameters.`;

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
[SREQ-001] |2| {/paths[/pet/findByStatus]/get/security[0]->null} :: Security Requirement 'petstore_auth_notfound' must refer to a valid Security Scheme.
[RES-002] |2| {/paths[/pet/findByTags]/get/responses[404]->$ref} :: Response Reference must refer to a valid Response Definition.`;

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

    it("Required operationId if un-ignored", () => {
        let json: any = readJSON('tests/fixtures/validation/2.0/operation-id.json');
        let document: Oas20Document = library.createDocument(json) as Oas20Document;

        let node: OasNode = document;
        let errors: OasValidationProblem[] = library.validate(node, true, new CustomSeverities(OasValidationProblemSeverity.high));

        let actual: string = errorsAsString(errors);
        let expected: string = `[OP-008] |3| {/paths[/path]/post->operationId} :: Operation is missing a operation id.`;

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

        let actual: string = errorsAsString(errors);
        let expected: string = "";

        assertValidationOutput(actual, expected);
    });

    it("Invalid Property Format", () => {
        let json: any = readJSON('tests/fixtures/validation/3.0/invalid-property-format.json');
        let document: Oas30Document = library.createDocument(json) as Oas30Document;

        let node: OasNode = document;
        let errors: OasValidationProblem[] = library.validate(node);

        let actual: string = errorsAsString(errors);
        let expected: string =
`[INF-004] |2| {/info->termsOfService} :: Terms of Service URL is an incorrect format.
[CTC-001] |2| {/info/contact->url} :: Contact URL is an incorrect format.
[CTC-002] |2| {/info/contact->email} :: Contact Email is an incorrect format.
[LIC-002] |2| {/info/license->url} :: License URL is an incorrect format.`;

        assertValidationOutput(actual, expected);
    });

    it("Ignored Property Name", () => {
        let json: any = readJSON('tests/fixtures/validation/3.0/ignored-property-name.json');
        let document: Oas30Document = library.createDocument(json) as Oas30Document;

        let node: OasNode = document;
        let errors: OasValidationProblem[] = library.validate(node);

        let actual: string = errorsAsString(errors);
        let expected: string =
`[PAR-021] |2| {/paths[/pets]/get/parameters[2]->name} :: The "Authorization" header parameter will be ignored.
[HEAD-008] |2| {/paths[/pets]/get/responses[200]/content[multipart/form-data]/encoding[id]/headers[Content-Type]->null} :: The "Content-Type" header will be ignored.`;

        assertValidationOutput(actual, expected);
    });

    it("Invalid Property Type", () => {
        let json: any = readJSON('tests/fixtures/validation/3.0/invalid-property-type.json'); 
        let document: Oas30Document = library.createDocument(json) as Oas30Document;

        let node: OasNode = document;
        let errors: OasValidationProblem[] = library.validate(node);

        let actual: string = errorsAsString(errors);
        let expected: string = [
            `[SCH-004] |2| {/paths[/pets]/get/responses[200]/content[application/json]/schema->items} :: Schema items must be present only for schemas of type 'array'.`,
            `[SCH-003] |2| {/components/schemas[NewPet]/properties[name]->type} :: Schema type value of "invalid" is not allowed.  Must be one of: [string, number, integer, boolean, array, object]`,
            `[SCH-004] |2| {/components/schemas[NewPet]/properties[tags]->items} :: Schema items must be present only for schemas of type 'array'.`,
            `[SCH-003] |2| {/components/schemas[NewPet]/properties[nickNames]/items->type} :: Schema type value of "invalid" is not allowed.  Must be one of: [string, number, integer, boolean, array, object]`
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
`[ENC-006] |2| {/paths[/enc-006]/post/requestBody/content[multipart/mixed]/encoding[missingProperty]->missingProperty} :: Encoding Property "missingProperty" not found in the associated schema.
[RES-003] |2| {/paths[/pets]/get/responses[Success]->statusCode} :: "Success" is not a valid HTTP response status code.
[PATH-005] |2| {/paths[pets/{id}]->null} :: Path template "pets/{id}" is not valid.
[PATH-006] |2| {/paths[//pathstest11]->null} :: Path template "//pathstest11" contains one or more empty segment.
[PATH-005] |2| {/paths[pathstest12]->null} :: Path template "pathstest12" is not valid.
[PATH-005] |2| {/paths[{pathstest13}]->null} :: Path template "{pathstest13}" is not valid.
[PATH-005] |2| {/paths[/{{pathstest14}}]->null} :: Path template "/{{pathstest14}}" is not valid.
[PATH-005] |2| {/paths[/pathstest15/{var1}{var2}]->null} :: Path template "/pathstest15/{var1}{var2}" is not valid.
[PAR-007] |2| {/paths[/pathstest15/{var1}{var2}]/get/parameters[1]->name} :: Path Parameter "var2" not found in path template.
[PATH-005] |2| {/paths[/pathstest16/{var]->null} :: Path template "/pathstest16/{var" is not valid.
[PATH-005] |2| {/paths[/pathstest17/var}]->null} :: Path template "/pathstest17/var}" is not valid.
[PATH-005] |2| {/paths[/pathstest19/{1var}]->null} :: Path template "/pathstest19/{1var}" is not valid.
[PATH-007] |2| {/paths[/pathstest22/{var}/{var}]->null} :: Path template "/pathstest22/{var}/{var}" contains duplicate variable names (var).
[PATH-007] |2| {/paths[/pathstest23/{var1}/{var2}/a{var2}/{var1}]->null} :: Path template "/pathstest23/{var1}/{var2}/a{var2}/{var1}" contains duplicate variable names (var1, var2).
[PATH-009] |2| {/paths[/pathstest25/]->null} :: Path template "/pathstest25/" is semantically identical to at least one other path.
[PATH-009] |2| {/paths[/pathstest25]->null} :: Path template "/pathstest25/" is semantically identical to at least one other path.
[PATH-009] |2| {/paths[/pathstest26/{var}/]->null} :: Path template "/pathstest26/{var}/" is semantically identical to at least one other path.
[PATH-009] |2| {/paths[/pathstest26/{var}]->null} :: Path template "/pathstest26/{var}/" is semantically identical to at least one other path.
[PATH-009] |2| {/paths[/pathstest27/{var2}/]->null} :: Path template "/pathstest27/{var2}/" is semantically identical to at least one other path.
[PATH-009] |2| {/paths[/pathstest27/{var1}]->null} :: Path template "/pathstest27/{var2}/" is semantically identical to at least one other path.
[SDEF-001] |2| {/components/schemas[Pet+Foo]->name} :: Schema Definition Name is not valid.
[RDEF-001] |2| {/components/responses[The Response]->name} :: Response Definition Name is not valid.
[PDEF-001] |2| {/components/parameters[Some$Parameter]->parameterName} :: Parameter Definition Name is not valid.
[EDEF-001] |2| {/components/examples[Example|1]->name} :: Example Definition Name is not valid.
[RBDEF-001] |2| {/components/requestBodies[Request Body]->name} :: Request Body Definition Name is not valid.
[HDEF-001] |2| {/components/headers[[Header]]->name} :: Header Definition Name is not valid.
[SS-013] |2| {/components/securitySchemes[Security%Scheme]->schemeName} :: Security Scheme Name is not valid.
[LDEF-001] |2| {/components/links[Link*Twelve]->name} :: Link Definition Name is not valid.
[CDEF-001] |2| {/components/callbacks[Invalid Callback Name]->name} :: Callback Definition Name is not valid.
[SREQ-001] |2| {/security[1]->null} :: Security Requirement 'MissingAuth' must refer to a valid Security Scheme.`;

        assertValidationOutput(actual, expected);
    });
    
    it("Invalid Property Value", () => {
        let json: any = readJSON('tests/fixtures/validation/3.0/invalid-property-value.json');
        let document: Oas30Document = library.createDocument(json) as Oas30Document;

        let node: OasNode = document;
        let errors: OasValidationProblem[] = library.validate(node);

        let actual: string = errorsAsString(errors);
        let expected: string =
`[SVAR-003] |2| {/servers[0]/variables[missingProperty]->null} :: Server Variable "missingProperty" is not found in the server url template.
[ENC-001] |2| {/paths[/enc-001]/post/requestBody/content[application/x-www-form-urlencoded]/encoding[profileImage]->headers} :: Headers are not allowed for "application/x-www-form-urlencoded" media types.
[ENC-002] |2| {/paths[/enc-002]/post/requestBody/content[multipart/form-data]/encoding[historyMetadata]->style} :: Encoding Style is not allowed for "multipart/form-data" media types.
[ENC-003] |2| {/paths[/enc-003]/post/requestBody/content[multipart/form-data]/encoding[historyMetadata]->explode} :: "Explode" is not allowed for "multipart/form-data" media types.
[ENC-004] |2| {/paths[/enc-004]/post/requestBody/content[multipart/form-data]/encoding[historyMetadata]->allowReserved} :: "Allow Reserved" is not allowed for "multipart/form-data" media types.
[ENC-005] |2| {/paths[/enc-005]/post/requestBody/content[application/x-www-form-urlencoded]/encoding[historyMetadata]->style} :: Encoding Style is an invalid value.
[HEAD-010] |2| {/paths[/head-010]/post/requestBody/content[multipart/form-data]/encoding[historyMetadata]/headers[X-Header-1]->style} :: Header Style must be "simple".
[HEAD-011] |2| {/paths[/head-011]/post/requestBody/content[multipart/form-data]/encoding[historyMetadata]/headers[X-Header-1]->content} :: Header content cannot have multiple media types.
[LINK-002] |2| {/paths[/link-002]/get/responses[200]/links[address]->operationId} :: The Operation ID does not refer to an existing Operation.
[MT-003] |2| {/paths[/mt-003]/post/requestBody/content[application/json]->encoding} :: Encoding is not allowed for "application/json" media types.
[OP-009] |2| {/paths[/op-009]/get->requestBody} :: Request Body is not supported for GET operations.
[OP-013] |2| {/paths[/op-013]/get->null} :: Operation must have at least one Response.
[PAR-022] |2| {/paths[/par-022]/parameters[0]->style} :: Parameter Style must be one of: ["matrix", "label", "form", "simple", "spaceDelimited", "pipeDelimited", "deepObject"] (Found "shallowObject").
[PAR-023] |2| {/paths[/par-022]/parameters[0]->style} :: Query Parameter Style must be one of: ["form", "spaceDelimited", "pipeDelimited", "deepObject"] (Found "shallowObject").
[PAR-003] |2| {/paths[/par-003/{id}]/parameters[0]->required} :: Path Parameter "id" must be marked as required.
[PAR-013] |2| {/paths[/par-013/{id}]/parameters[0]->allowEmptyValue} :: Allow Empty Value is not allowed (only for Query params).
[PAR-027] |2| {/paths[/par-027/{id}]/parameters[0]->style} :: Path Parameter Style must be one of: ["matrix", "label", "simple"]  (Found "form").
[PAR-023] |2| {/paths[/par-023]/parameters[0]->style} :: Query Parameter Style must be one of: ["form", "spaceDelimited", "pipeDelimited", "deepObject"] (Found "label").
[PAR-024] |2| {/paths[/par-024]/parameters[0]->style} :: Cookie Parameter style must be "form". (Found "label")
[PAR-025] |2| {/paths[/par-025]/parameters[0]->style} :: Header Parameter Style must be "simple". (Found "label").
[PAR-028] |2| {/paths[/par-028]/parameters[0]->allowReserved} :: Allow Reserved is only allowed for Query Parameters.
[PAR-029] |2| {/paths[/par-029]/parameters[0]->content} :: Parameter content cannot have multiple media types.
[PAR-019] |2| {/paths[/dupesWithinPathItemInlined]/parameters[0]->in} :: Duplicate query parameter named 'status' found (parameters must be unique by name and location).
[PAR-019] |2| {/paths[/dupesWithinPathItemInlined]/parameters[1]->in} :: Duplicate query parameter named 'status' found (parameters must be unique by name and location).
[PAR-019] |2| {/paths[/dupesWithinPathItemInlineAndRefCombo]/parameters[0]->in} :: Duplicate query parameter named 'status' found (parameters must be unique by name and location).
[PAR-019] |2| {/paths[/dupesWithinPathItemInlineAndRefCombo]/parameters[1]->in} :: Duplicate query parameter named 'status' found (parameters must be unique by name and location).
[PAR-019] |2| {/paths[/dupesWithinPathItemIndirectReference]/parameters[0]->in} :: Duplicate query parameter named 'status' found (parameters must be unique by name and location).
[PAR-019] |2| {/paths[/dupesWithinPathItemIndirectReference]/parameters[1]->in} :: Duplicate query parameter named 'status' found (parameters must be unique by name and location).
[PAR-018] |2| {/paths[/incorrectReferenceWithinPathItem]/parameters[1]->$ref} :: Parameter Reference must refer to a valid Parameter Definition.
[PAR-019] |2| {/paths[/dupesWithinOpInlined]/get/parameters[0]->in} :: Duplicate query parameter named 'status' found (parameters must be unique by name and location).
[PAR-019] |2| {/paths[/dupesWithinOpInlined]/get/parameters[1]->in} :: Duplicate query parameter named 'status' found (parameters must be unique by name and location).
[PAR-019] |2| {/paths[/dupesWithinOpInlineAndRefCombo]/get/parameters[0]->in} :: Duplicate query parameter named 'status' found (parameters must be unique by name and location).
[PAR-019] |2| {/paths[/dupesWithinOpInlineAndRefCombo]/get/parameters[1]->in} :: Duplicate query parameter named 'status' found (parameters must be unique by name and location).
[PAR-007] |2| {/paths[/par-007/operation/{id}]/get/parameters[1]->name} :: Path Parameter "missing" not found in path template.
[PAR-007] |2| {/paths[/par-007/pathItem/{id}]/parameters[0]->name} :: Path Parameter "missing" not found in path template.
[OP-011] |2| {/paths[/op-011/{id}/{sub}]/get->null} :: No definition found for path variable "sub" for path '/op-011/{id}/{sub}' and method 'GET'.
[PAR-021] |2| {/paths[/par-021]/parameters[0]->name} :: The "Content-Type" header parameter will be ignored.
[SCH-002] |2| {/paths[/sch-002]/get/responses[200]/content[application/json]/schema/discriminator->discriminator} :: Schema Discriminator is only allowed when using one of: ["oneOf", "anyOf", "allOf"]
[SREQ-002] |2| {/paths[/sreq-002]/get/security[0]->null} :: Security Requirement 'api_key' scopes must be an empty array because the referenced Security Definition not "oauth2" or "openIdConnect".
[XML-002] |2| {/components/schemas[xml-002]/properties[name]/xml->wrapped} :: XML Wrapped elements can only be used for "array" properties.
[SS-008] |2| {/components/securitySchemes[ss-008]->type} :: Security Scheme Type must be one of: http, apiKey, oauth2, openIdConnect
[SS-009] |2| {/components/securitySchemes[ss-009]->in} :: API Key Security Scheme must be located "in" one of: query, header, cookie
[SS-017] |2| {/components/securitySchemes[ss-017]->bearerFormat} :: Security Scheme "Bearer Format" only allowed for HTTP Bearer auth scheme.
[SS-016] |2| {/components/securitySchemes[ss-016]->scheme} :: HTTP Security Scheme must be one of: ["basic", "bearer", "digest", "hoba", "mutual", "negotiate", "oauth", "vapid", "scram-sha-1", "scram-sha-256"] (Found: 'leveraged')`;

        assertValidationOutput(actual, expected);
    });

    it("Invalid Reference", () => {
        let json: any = readJSON('tests/fixtures/validation/3.0/invalid-reference.json');
        let document: Oas30Document = library.createDocument(json) as Oas30Document;

        let node: OasNode = document;
        let errors: OasValidationProblem[] = library.validate(node);

        let actual: string = errorsAsString(errors);
        let expected: string =
`[CALL-001] |2| {/paths[/call-001]/get/callbacks[myRefCallback]->$ref} :: Callback Reference must refer to a valid Callback Definition.
[EX-003] |2| {/paths[/ex-003]/put/requestBody/content[application/json]/examples[bar]->$ref} :: Example Reference must refer to a valid Example Definition.
[HEAD-012] |2| {/paths[/head-005]/get/responses[200]/headers[X-Rate-Limit-Reset]->$ref} :: Header Reference must refer to a valid Header Definition.
[LINK-003] |2| {/paths[/link-003]/get/responses[200]/links[MissingLink]->operationRef} :: Link "Operation Reference" must refer to a valid Operation Definition.
[LINK-005] |2| {/paths[/link-005]/get/responses[200]/links[MissingLink]->$ref} :: Link Reference must refer to a valid Link Definition.
[PAR-018] |2| {/paths[/par-018]/parameters[1]->$ref} :: Parameter Reference must refer to a valid Parameter Definition.
[RB-003] |2| {/paths[/rb-003]/post/requestBody->$ref} :: Request Body Reference must refer to a valid Request Body Definition.
[RES-002] |2| {/paths[/res-002]/get/responses[200]->$ref} :: Response Reference must refer to a valid Response Definition.
[SCH-001] |2| {/paths[/sch-001]/parameters[0]/schema->$ref} :: Schema Reference must refer to a valid Schema Definition.
[SCH-001] |2| {/paths[/ref-loop]/parameters[0]/schema->$ref} :: Schema Reference must refer to a valid Schema Definition.
[SCH-001] |2| {/paths[/missing-indirect-ref]/parameters[0]/schema->$ref} :: Schema Reference must refer to a valid Schema Definition.
[SCH-001] |2| {/components/schemas[SchemaRef1]->$ref} :: Schema Reference must refer to a valid Schema Definition.
[SCH-001] |2| {/components/schemas[SchemaRef2]->$ref} :: Schema Reference must refer to a valid Schema Definition.
[SCH-001] |2| {/components/schemas[MissingIndirectSchemaRef]->$ref} :: Schema Reference must refer to a valid Schema Definition.
[SS-018] |2| {/components/securitySchemes[BASIC]->$ref} :: Security Scheme Reference must refer to a valid Security Scheme Definition.`;

        assertValidationOutput(actual, expected);
    });

    it("Mutually Exclusive", () => {
        let json: any = readJSON('tests/fixtures/validation/3.0/mutually-exclusive.json');
        let document: Oas30Document = library.createDocument(json) as Oas30Document;

        let node: OasNode = document;
        let errors: OasValidationProblem[] = library.validate(node);

        let actual: string = errorsAsString(errors);
        let expected: string =
`[MT-001] |2| {/components/parameters[mt-001]/content[text/plain]->example} :: Media Type "Example" and "Examples" are mutually exclusive.
[PAR-030] |2| {/components/parameters[par-030]->schema} :: Parameter cannot have both a Schema and Content.
[PAR-031] |2| {/components/parameters[par-031]->example} :: Parameter "Example" and "Examples" are mutually exclusive.
[EX-004] |2| {/components/examples[ex-004]->value} :: Example "Value" and "External Value" are mutually exclusive.
[HEAD-014] |2| {/components/headers[head-014]->schema} :: Header cannot have both a Schema and Content.
[HEAD-013] |2| {/components/headers[head-013]->example} :: Header "Example" and "Examples" are mutually exclusive.
[LINK-001] |2| {/components/links[link-001]->operationId} :: Link Operation Reference and Operation ID cannot both be used.`;
        assertValidationOutput(actual, expected);
    });

    it("Required Property", () => {
        let json: any = readJSON('tests/fixtures/validation/3.0/required-property.json');
        let document: Oas30Document = library.createDocument(json) as Oas30Document;

        let node: OasNode = document;
        let errors: OasValidationProblem[] = library.validate(node);

        let actual: string = errorsAsString(errors);
        let expected: string =
`[INF-001] |2| {/info->title} :: API is missing a title.
[INF-002] |2| {/info->version} :: API is missing a version.
[LIC-001] |2| {/info/license->name} :: License is missing a name.
[SRV-001] |2| {/servers[0]->url} :: Server is missing a template URL.
[SVAR-001] |2| {/servers[1]/variables[username]->default} :: Server Variable "username" is missing a default value.
[OP-007] |2| {/paths[/op-007]/get->responses} :: Operation must have at least one response.
[PAR-001] |2| {/paths[/par-001]/parameters[0]->name} :: Parameter is missing a name.
[PAR-002] |2| {/paths[/par-002]/parameters[0]->in} :: Parameter is missing a location (Query, Header, etc).
[RES-001] |2| {/paths[/res-001]/get/responses[200]->description} :: Response (code 200) is missing a description.
[DISC-001] |2| {/components/schemas[disc-001]/discriminator->propertyName} :: Discriminator must indicate a property (by name).
[ED-001] |2| {/components/schemas[ed-001]/externalDocs->url} :: External Documentation is missing a URL.
[FLOW-001] |2| {/components/securitySchemes[flow-001]/flows/implicit->authorizationUrl} :: Implicit OAuth Flow is missing an Authorization URL.
[FLOW-001] |2| {/components/securitySchemes[flow-001]/flows/authorizationCode->authorizationUrl} :: Auth Code OAuth Flow is missing an Authorization URL.
[FLOW-002] |2| {/components/securitySchemes[flow-002]/flows/clientCredentials->tokenUrl} :: Client Credentials OAuth Flow is missing a Token URL.
[FLOW-002] |2| {/components/securitySchemes[flow-002]/flows/authorizationCode->tokenUrl} :: Auth Code OAuth Flow is missing a Token URL.
[FLOW-006] |2| {/components/securitySchemes[flow-006]/flows/implicit->scopes} :: OAuth Flow is missing defined scopes.
[SS-001] |2| {/components/securitySchemes[ss-001]->type} :: Security Scheme is missing a type.
[SS-002] |2| {/components/securitySchemes[ss-002]->name} :: API Key Security Scheme is missing a parameter name (e.g. name of a header or query param).
[SS-003] |2| {/components/securitySchemes[ss-003]->in} :: API Key Security Scheme must describe where the Key can be found (e.g. header, query param, etc).
[SS-019] |2| {/components/securitySchemes[ss-019]->scheme} :: HTTP Security Scheme is missing a scheme (Basic, Digest, etc).
[SS-020] |2| {/components/securitySchemes[ss-020]->flows} :: OAuth Security Scheme does not define any OAuth flows.
[SS-021] |2| {/components/securitySchemes[ss-021]->openIdConnectUrl} :: OpenID Connect Security Scheme is missing a Connect URL.
[TAG-001] |2| {/tags[0]->name} :: Tag is missing a name.`;
        assertValidationOutput(actual, expected);

        // Now test re-validating just the Info node
        errors = library.validate(document.info);
        actual = errorsAsString(errors);
        expected =
`[INF-001] |2| {/info->title} :: API is missing a title.
[INF-002] |2| {/info->version} :: API is missing a version.
[LIC-001] |2| {/info/license->name} :: License is missing a name.`
        assertValidationOutput(actual, expected);
    });

    it("Required Property (Root)", () => {
        let json: any = readJSON('tests/fixtures/validation/3.0/required-property-root.json');
        let document: Oas30Document = library.createDocument(json) as Oas30Document;

        let node: OasNode = document;
        let errors: OasValidationProblem[] = library.validate(node);

        let actual: string = errorsAsString(errors);
        let expected: string =
`[R-002] |2| {/->info} :: API is missing the 'info' property.
[R-003] |2| {/->paths} :: API is missing the 'paths' property.`;
        assertValidationOutput(actual, expected);
    });

    it("Uniqueness", () => {
        let json: any = readJSON('tests/fixtures/validation/3.0/uniqueness.json');
        let document: Oas30Document = library.createDocument(json) as Oas30Document;

        let node: OasNode = document;
        let errors: OasValidationProblem[] = library.validate(node);

        let actual: string = errorsAsString(errors);
        let expected: string =
`[OP-003] |2| {/paths[/foo]/get->operationId} :: Duplicate operationId 'fooId' found (operation IDs must be unique across all operations in the API).
[OP-003] |2| {/paths[/bar]/get->operationId} :: Duplicate operationId 'fooId' found (operation IDs must be unique across all operations in the API).
[TAG-003] |2| {/tags[0]->MyTag} :: Duplicate tag 'MyTag' found (every tag must have a unique name).
[TAG-003] |2| {/tags[2]->MyTag} :: Duplicate tag 'MyTag' found (every tag must have a unique name).`;
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
`[OP-003] |2| {/paths[/foo]/get->operationId} :: Duplicate operationId 'fooId' found (operation IDs must be unique across all operations in the API).
[OP-003] |2| {/paths[/bar]/get->operationId} :: Duplicate operationId 'fooId' found (operation IDs must be unique across all operations in the API).
[TAG-003] |2| {/tags[0]->MyTag} :: Duplicate tag 'MyTag' found (every tag must have a unique name).
[TAG-003] |2| {/tags[2]->MyTag} :: Duplicate tag 'MyTag' found (every tag must have a unique name).`;
        assertValidationOutput(actual, expected);
    });

    it("Custom Severities", () => {
        let json: any = readJSON('tests/fixtures/validation/3.0/mutually-exclusive.json');
        let document: Oas30Document = library.createDocument(json) as Oas30Document;

        let node: OasNode = document;
        let errors: OasValidationProblem[] = library.validate(node, true, new CustomSeverities(OasValidationProblemSeverity.low));

        let actual: string = errorsAsString(errors);
        let expected: string =
`[MT-001] |1| {/components/parameters[mt-001]/content[text/plain]->example} :: Media Type "Example" and "Examples" are mutually exclusive.
[PAR-030] |1| {/components/parameters[par-030]->schema} :: Parameter cannot have both a Schema and Content.
[PAR-031] |1| {/components/parameters[par-031]->example} :: Parameter "Example" and "Examples" are mutually exclusive.
[EX-004] |1| {/components/examples[ex-004]->value} :: Example "Value" and "External Value" are mutually exclusive.
[HEAD-014] |1| {/components/headers[head-014]->schema} :: Header cannot have both a Schema and Content.
[HEAD-013] |1| {/components/headers[head-013]->example} :: Header "Example" and "Examples" are mutually exclusive.
[LINK-001] |1| {/components/links[link-001]->operationId} :: Link Operation Reference and Operation ID cannot both be used.`;
        assertValidationOutput(actual, expected);

        // Test @Ignore of problems.
        errors = library.validate(node, true, new CustomSeverities(OasValidationProblemSeverity.ignore));
        actual = errorsAsString(errors);
        expected = ``;
        assertValidationOutput(actual, expected);

    });

    it("Validation Problem List", () => {
        let json: any = readJSON('tests/fixtures/validation/3.0/invalid-property-value.json');
        let document: Oas30Document = library.createDocument(json) as Oas30Document;

        let node: OasNode = document;
        library.validate(node);

        let enode: OasNode = document.paths.pathItem("/par-022").parameters[0];
        let errors: OasValidationProblem[] = enode.validationProblems();

        let actual: string = errorsAsString(errors);
        let expected: string =
`[PAR-022] |2| {/paths[/par-022]/parameters[0]->style} :: Parameter Style must be one of: ["matrix", "label", "form", "simple", "spaceDelimited", "pipeDelimited", "deepObject"] (Found "shallowObject").
[PAR-023] |2| {/paths[/par-022]/parameters[0]->style} :: Query Parameter Style must be one of: ["form", "spaceDelimited", "pipeDelimited", "deepObject"] (Found "shallowObject").`;
        assertValidationOutput(actual, expected);

        let codes: string[] = enode.validationProblemCodes();
        expect(codes).toEqual([ "PAR-022", "PAR-023" ]);

        errors = enode.validationProblemsFor("style");
        actual = errorsAsString(errors);
        expected =
`[PAR-022] |2| {/paths[/par-022]/parameters[0]->style} :: Parameter Style must be one of: ["matrix", "label", "form", "simple", "spaceDelimited", "pipeDelimited", "deepObject"] (Found "shallowObject").
[PAR-023] |2| {/paths[/par-022]/parameters[0]->style} :: Query Parameter Style must be one of: ["form", "spaceDelimited", "pipeDelimited", "deepObject"] (Found "shallowObject").`;
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
`[UNKNOWN-001] |2| {/info/license->unknown-license-property} :: An unexpected property "unknown-license-property" was found.  Extension properties should begin with "x-".
[UNKNOWN-001] |2| {/components/schemas[Error]->unexpected-property-datatype} :: An unexpected property "unexpected-property-datatype" was found.  Extension properties should begin with "x-".`;

        assertValidationOutput(actual, expected);
    });

    it("Required operationId if un-ignored", () => {
        let json: any = readJSON('tests/fixtures/validation/3.0/operation-id.json');
        let document: Oas30Document = library.createDocument(json) as Oas30Document;

        let node: OasNode = document;
        let errors: OasValidationProblem[] = library.validate(node, true, new CustomSeverities(OasValidationProblemSeverity.high));

        let actual: string = errorsAsString(errors);
        let expected: string = `[OP-008] |3| {/paths[/path]/post->operationId} :: Operation is missing a operation id.`;

        assertValidationOutput(actual, expected);
    });
});
