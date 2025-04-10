import { Variant } from "../parser/MarkdownParser.types";

export function isObject(variant: Variant): boolean {
	return Object.prototype.toString.call(variant) === "[object Object]";
}
