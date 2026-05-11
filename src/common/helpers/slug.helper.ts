export const buildSlug = (char: string) => {

    return char
        .toLowerCase()
        .normalize("NFD") // quita acentos
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

}