import { Variant } from "../parser/MarkdownParser.types";
import { Settings } from "../settings";

export function isObject(variant: Variant): boolean {
	return Object.prototype.toString.call(variant) === "[object Object]";
}

let comparator: (a: any, b: any) => number

export async function updateComparator({locale, caseSensitive, numericSort} : Settings) {
    comparator = new Intl.Collator(locale, {
        sensitivity: caseSensitive ? "case" : "base",
        numeric: numericSort,
    }).compare;
}

export const sortBy = (a: any, b: any) => { console.log(a, b, comparator(a,b));  return comparator(a, b); };
