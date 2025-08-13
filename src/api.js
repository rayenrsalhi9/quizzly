export async function getQuiz() {
    const res = await fetch('https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple')
    const data = await res.json()
    return data.results || []
}