export const sortByIdToFirst = (arr, id) => {
    arr.sort((a, b) => {
        // Compare function to sort objects with id equal to 1 first
        if (a.id === id && b.id !== id) {
            return -1; // a comes before b
        } else if (a.id !== id && b.id === id) {
            return 1; // b comes before a
        } else {
            return 0; // maintain the original order
        }
    });

    return arr;
}