/**
 *
 * @param {string} dest
 * @param {string} content
 */
export function write(dest: string, content: string): Promise<void>;
/**
 *
 * @param {string} file
 */
export function read(file: string): Promise<string>;
/**
 *
 * @param {string} text
 */
export function getJsonIndent(text: string): number;
export function logger(message: any): void;
export function getModules(files: string[]): any[];
