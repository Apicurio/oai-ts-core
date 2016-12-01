///<reference path="../node_modules/@types/jasmine/index.d.ts"/>

import {OasVisitorUtil} from "../src/visitors/visitor.utils";
import {Oas20JS2ModelReader} from "../src/readers/js2model.reader";
import {Oas20Document} from "../src/models/2.0/document.model";

declare var readJSON

describe("Definitions I/O (2.0)", () => {

    let docReader: Oas20JS2ModelReader;

    beforeEach(() => {
        docReader = new Oas20JS2ModelReader();
    });

    it("Primitive Sample", () => {
        let json: any = readJSON('tests/fixtures/definitions-io/2.0/primitive.json');
        let document: Oas20Document = docReader.read(json);
        let jsObj: any = OasVisitorUtil.model2js(document);
        expect(jsObj).toEqual(json);
    });

});