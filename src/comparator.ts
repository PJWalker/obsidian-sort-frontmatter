import { Variant } from "src/parser/MarkdownParser.types";
import { Settings } from "src/settings";

function codepointComparator(a: Variant, b: Variant) {
	// overly complicated code to ensure that if i ever change to a simpler parser, the parsing can still identify numbers.
	if ([a, b].every((item) => /[\d].*/.exec(String(item)))) {
		return parseFloat(a as string) - parseFloat(b as string);
	}
	if ([a, b].every((item) => typeof item === "string")) {
		const letterFore = (a as string).charCodeAt(0);
		const letterAft = (b as string).charCodeAt(0);
		return letterFore - letterAft;
	}
	return 0;
}
let comparator: (a: Variant, b: Variant) => number;
export async function updateComparator({ locale, sortStrategy }: Settings) {
	if (sortStrategy === "codepoint") {
		comparator = codepointComparator;
	} else {
		comparator = new Intl.Collator(locale, {
			numeric: true,
		}).compare;
	}
}
export const sortBy = (a: any, b: any) => comparator(a, b);
