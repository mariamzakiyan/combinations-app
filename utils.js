/**
 * Generates valid combinations of items based on the input array and specified combination length.
 * Each item has a prefix based on its index and a numeric suffix.
 *
 * @param {Array<number>} arr - An array where each element indicates the number of items for each prefix.
 * @param {number} combinationLength - The desired length of the generated combinations.
 * @returns {Array<Array<string>>} - An array of valid combinations.
 */
export const generate = (arr, combinationLength) => {
    const items = createItems(arr);
    const validCombinations = [];

    function findCombinations(start, combination) {
        if (combination.length === combinationLength) {
            validCombinations.push([...combination]);
            return;
        }

        for (let i = start; i < items.length; i++) {
            const currentItem = items[i];
            const currentPrefix = currentItem[0];

            if (!combination.some(item => item[0] === currentPrefix)) {
                combination.push(currentItem);
                findCombinations(i + 1, combination);
                combination.pop();
            }
        }
    }

    findCombinations(0, []);
    return validCombinations;
};

/**
 * Creates an array of item names based on the input array.
 *
 * @param {Array<number>} arr - An array where each element indicates the number of items for each prefix.
 * @returns {Array<string>} - An array of generated item names.
 */
const createItems = (arr) => {
    const items = [];
    for (let i = 0; i < arr.length; i++) {
        for (let j = 1; j <= arr[i]; j++) {
            items.push(`${String.fromCharCode(65 + i)}${j}`);
        }
    }
    return items;
};
