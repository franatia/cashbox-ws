export const extractFromRequest = (request : any, key : string) => {
    const value = request.body[key] ?? request.query[key] ?? request.params[key];
    return value;   
}