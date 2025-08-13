export function mergeAndShuffle(array, string) {

    const mergedArr = [...array, string]

    for(let i = mergedArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [mergedArr[i], mergedArr[j]] = [mergedArr[j], mergedArr[i]];
    }

    return mergedArr
}