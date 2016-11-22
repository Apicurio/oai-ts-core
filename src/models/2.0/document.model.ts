
import {OasDocument} from "../document.model";
import {Oas20Info} from "./info.model";

/**
 * Models an OAS 2.0 document.
 */
export class Oas20Document extends OasDocument {

    public readonly swagger: string = "2.0";
    public info: Oas20Info;
    public host: string;
    public basePath: string;
    public schemes: string[];
    public consumes: string[];
    public produces: string[];
    // public paths: Oas20Paths;
    // public definitions: Oas20Definitions;
    // public parameters: Oas20ParametersDefinitions;
    // public responses: Oas20ResponsesDefinitions;
    // public securityDefinitions: Oas20SecurityDefinitions;
    // public security: Oas20SecurityRequirement[];
    // public tags: Oas20Tag[];
    // public externalDocs: Oas20ExternalDocumentation;

    constructor() {
        super();
        this._ownerDocument = this;
    }

    /**
     * Returns the spec version of this document.
     */
    public getSpecVersion(): string {
        return this.swagger;
    }

    /**
     * Creates an OAS 2.0 info object.
     * @return {Oas20Info}
     */
    public createInfo(): Oas20Info {
        let rval: Oas20Info = new Oas20Info();
        rval._ownerDocument = this;
        rval._parent = this;
        return rval;
    }

}
