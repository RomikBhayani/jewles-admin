/**
 * Generates Cartesian product of multiple arrays.
 * Useful for generating all possible variant combinations.
 */
function cartesianProduct(arrays) {
    return arrays.reduce((acc, curr) => {
        return acc.flatMap(a => curr.map(b => [...a, b]));
    }, [[]]);
}

module.exports = { cartesianProduct };
