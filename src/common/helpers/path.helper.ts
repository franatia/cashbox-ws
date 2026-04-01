export const joinPaths = (...paths : string[]) => {
    return paths.map(path => `/${path}`).join("")
}