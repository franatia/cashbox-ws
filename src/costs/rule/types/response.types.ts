/**
 * 
 * Here we save the data structures that will be used
 * to organize the information returned through
 * controller
 * 
 */

export type CreateResponse = {
    firstRule?: string;
    rules: Map<string, string>;
}