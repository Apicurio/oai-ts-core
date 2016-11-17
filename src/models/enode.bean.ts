import {OasExtension} from "./extension.bean";
import {OasNode} from "./node.bean";

/**
 * Base class for all extensible OAS nodes.  Most nodes allow extension properties that
 * being with x-* (OAS 2.0).
 */
export abstract class OasExtensibleNode extends OasNode {

    public extensions: OasExtension[];

}
