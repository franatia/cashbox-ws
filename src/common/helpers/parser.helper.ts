export const parseRecordToMap = <T>(
    record : Record<string, T>
) => {

    const map = new Map<string, T>();

    Object.entries(record).forEach(([key, value]) => {
        map.set(key, value);
    })

    return map;

}