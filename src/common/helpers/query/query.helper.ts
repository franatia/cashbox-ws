export const makeSelectors = (
    alias: string,
    keys: string[]
) => {
    return keys.map(key => (`${alias}.${key}`));
}