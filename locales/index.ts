// import { flatten } from "flat";
import en from "./en";
import uk from "./uk";
import ru from "./ru";
import fr from "./fr";
import de from "./de";

const flattenMessages = (
  nestedMessages: Record<string, any>,
  prefix = ""
): Record<string, string> => {
  let result: Record<string, string> = {};

  Object.keys(nestedMessages).forEach(key => {
    const value = nestedMessages[key];
    const prefixedKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === "object" && value !== null) {
      result = { ...result, ...flattenMessages(value, prefixedKey) };
    } else {
      result[prefixedKey] = value;
    }
  });

  return result;
};

const messages = {
  en: flattenMessages(en),
  uk: flattenMessages(uk),
  ru: flattenMessages(ru),
  fr: flattenMessages(fr),
  de: flattenMessages(de),
} as const;

// console.log("Flattened messages:", messages);

export default messages;
