
import {IOasNodeVisitor, IOas20NodeVisitor} from "../../visitors/visitor.iface";
import {OasExtensibleNode} from "../enode.model";

/**
 * Models an OAS 2.0 XML object.  Example:
 *
 * {
 *   "Person": {
 *     "type": "object",
 *     "properties": {
 *       "id": {
 *         "type": "integer",
 *         "format": "int32",
 *         "xml": {
 *           "attribute": true
 *         }
 *       },
 *       "name": {
 *         "type": "string",
 *         "xml": {
 *           "namespace": "http://swagger.io/schema/sample",
 *           "prefix": "sample"
 *         }
 *       }
 *     }
 *   }
 * }
 */
export class Oas20XML extends OasExtensibleNode {

    public name: string;
    public namespace: string;
    public prefix: string;
    public attribute: boolean;
    public wrapped: boolean;

    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    public accept(visitor: IOasNodeVisitor): void {
        let viz: IOas20NodeVisitor = <IOas20NodeVisitor> visitor;
        viz.visitXML(this);
    }

}
