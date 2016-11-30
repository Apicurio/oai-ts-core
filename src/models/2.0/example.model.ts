import {IOasNodeVisitor, IOas20NodeVisitor} from "../../visitors/visitor.iface";
import {OasNode} from "../node.model";
import {Oas20Header} from "./header.model";

/**
 * Models an OAS 2.0 Example object.  Example:
 *
 * {
 *   "application/json": {
 *     "name": "Puma",
 *     "type": "Dog",
 *     "color": "Black",
 *     "gender": "Female",
 *     "breed": "Mixed"
 *   }
 * }
 */
export class Oas20Example extends OasNode {

    private _examples: Oas20ExampleItems;

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas20NodeVisitor = <IOas20NodeVisitor> visitor;
        viz.visitExample(this);
    }

    /**
     * Returns an array of all the example content types.
     * @return {string[]}
     */
    public exampleContentTypes(): string[] {
        let rval: string[] = [];
        for (let ct in this._examples) {
            rval.push(ct);
        }
        return rval;
    }

    /**
     * Gets a single example.
     * @param contentType
     * @return {any}
     */
    public example(contentType: any): any {
        if (this._examples) {
            return this._examples[contentType];
        } else {
            return null;
        }
    }

    /**
     * Adds an example.
     * @param contentType
     * @param example
     */
    public addExample(contentType: any, example: any): void {
        if (!this._examples) {
            this._examples = new Oas20ExampleItems();
        }
        this._examples[contentType] = example;
    }

    /**
     * Removes a single example.
     * @param contentType
     */
    public removeExample(contentType: any): void {
        if (this._examples) {
            delete this._examples[contentType];
        }
    }
}


export class Oas20ExampleItems {

    [key: string]: any;

}
