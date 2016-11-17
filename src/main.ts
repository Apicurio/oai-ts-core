
import {OasDocument} from "./models/document.bean";
import {Oas20Document} from "./models/2.0/document.bean";

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

        throw new Error("Unsupported OAS version: " + oasVersion);
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
        return null;
    }

}