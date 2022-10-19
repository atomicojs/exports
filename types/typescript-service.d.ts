/**
 *
 * @param {string[]} entries
 * @param {boolean} useExit
 */
export function createService(entries: string[], useExit: boolean): {
    service: ts.LanguageService;
    /**
     *
     * @param {string[]} change
     * @return {string[]}
     */
    output(change?: string[]): string[];
};
export type Files = {
    [file: string]: {
        version: number;
    };
};
import ts from "typescript";
