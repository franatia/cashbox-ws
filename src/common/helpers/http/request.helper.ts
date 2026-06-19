export const plainRequest = (
    request: any
) => {
    return {
        ...request.body,
        ...request.query,
        ...request.params,
        ...request.user
    }
}