export const sortEntriesByName = (entries) => {
    return entries.sort((a, b) => {
        const entry1 = a.name.toLowerCase();
        const entry2 = b.name.toLowerCase();

        if (entry1 < entry2) {
            return -1;
        }

        if (entry1 > entry2) {
            return 1;
        }

        return 0;
    });
};
