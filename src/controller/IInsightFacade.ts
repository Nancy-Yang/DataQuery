/* tslint:disable:max-classes-per-file */

/*
 * This is the primary high-level API for the project. In this folder there should be:
 * A class called InsightFacade, this should be in a file called InsightFacade.ts.
 * You should not change this interface at all or the test suite will not work.
 */

export enum InsightDatasetKind {
    Courses = "courses",
    Rooms = "rooms",
}

export interface InsightDataset {
    id: string;
    kind: InsightDatasetKind;
    numRows: number;
}

export interface InsightGeoResponse {
    lat?: number;
    lon?: number;
    error?: string;
}

export class InsightError extends Error {
    constructor(...args: any[]) {
        super(...args);
        Error.captureStackTrace(this, InsightError);
    }
}

export class NotFoundError extends Error {
    constructor(...args: any[]) {
        super(...args);
        Error.captureStackTrace(this, NotFoundError);
    }
}

export interface IInsightFacade {
    searchElement(document: any, name: string, value: string): any;
    parseHTTP (url: string): object;
    /**
     * Add a dataset to UBCInsight.
     *
     * @param id  The id of the dataset being added.
     * @param content  The base64 content of the dataset. This content should be in the form of a serialized zip file.
     * @param kind  The kind of the dataset
     *
     * @return Promise <string[]>
     *
     * The promise should fulfill on a successful add, reject for any failures.
     * The promise should fulfill with a string array,
     * containing the ids of all currently added datasets upon a successful add.
     * The promise should reject with an InsightError describing the error.
     *
     * After receiving the dataset, it should be processed into a data structure of
     * your design. The processed data structure should be persisted to disk; your
     * system should be able to load this persisted value into memory for answering
     * queries.
     *
     * Ultimately, a dataset must be added or loaded from disk before queries can
     * be successfully answered.
     */
    addDataset(id: string, content: string, kind: InsightDatasetKind): Promise<string[]>;

    /**
     * Remove a dataset from UBCInsight.
     *
     * @param id  The id of the dataset to remove.
     *
     * @return Promise <string>
     *
     * The promise should fulfill upon a successful removal, reject on any error.
     * Attempting to remove a dataset that hasn't been added yet counts as an error.
     *
     * The promise should fulfill the id of the dataset that was removed.
     * The promise should reject with a NotFoundError (if it was not yet added)
     * or an InsightError (any other source of failure) describing the error.
     *
     * This will delete both disk and memory caches for the dataset for the id meaning
     * that subsequent queries for that id should fail unless a new addDataset happens first.
     */
    removeDataset(id: string): Promise<string>;
    applyHelper(newKey: any, content: any, intermediate: any): any;
    isValid(where: any): boolean;
    // isValidTrans(transformation: any): boolean;
    isValid1(option: any, transformation: any): boolean;
    performWhere(filter: any, id: string, sections: string[]): string[];
    performOption(option: any, whereResult: string[]): string[];
    orderHelper(one: any, two: any, key: string, dir: string): number;
    performTrans(trans: any, optionResult: string[]): string[];
    /**
     * Perform a query on UBCInsight.
     *
     * @param query  The query to be performed. This is the same as the body of the POST message.
     *
     * @return Promise <any[]>
     *
     * The promise should fulfill with an array of results for both fulfill and reject.
     * The promise should reject with an InsightError describing the error.
     */
    performQuery(query: any): Promise<any[]>;

    /**
     * List a list of datasets and their types.
     *
     * @return Promise <InsightDataset[]>
     * The promise should fulfill an array of currently added InsightDatasets and will only fulfill.
     */
    listDatasets(): Promise<InsightDataset[]>;
}
