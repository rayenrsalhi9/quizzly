import { useState, useEffect } from "react"
import { decode } from "html-entities"
import { nanoid } from "nanoid"
import { getQuiz } from "../api"
import { mergeAndShuffle } from "../utils/shuffle"

export default function Questions() {

  const [quiz, setQuiz] = useState([])
  const [userAnswers, setUserAnswers] = useState(new Array(10).fill(null))

  const correctAnswers = quiz.map(el => el.correct_answer)

  const canCheckAnswer = userAnswers.every(answer => answer)

  function handleChange(answerIndex, choosenAnswer) {
    setUserAnswers(prev => prev.map((el, index) => {
      return index === answerIndex ? choosenAnswer : el
    }))
  }

  useEffect(() => {
    async function getData() {
      const data = await getQuiz()
      setQuiz(data)
    }
    getData()
  }, [])

  return (
    <section className="quiz-container">
      {
        quiz.length > 0 ?
        <>
          {quiz.map((el, index) => {

            const choices = mergeAndShuffle(el.incorrect_answers, el.correct_answer)
            .map(el => decode(el))

            return(
              <div className="question" key={index}>
                <h2>{decode(el.question)}</h2>
                <div className="choices">
                  {
                    choices.map(choice => {
                      const choiceId = nanoid()
                      return (
                        <div key={choice}>
                          <input 
                            type="radio" 
                            name={`answer-${index + 1}`} 
                            id={choiceId}
                            value={choice}
                            required
                          />
                          <label 
                            htmlFor={choiceId} 
                            onClick={() => handleChange(index, choice)}
                          >
                            {choice}
                          </label>
                        </div>
                      )
                    })
                  }
                </div>
              </div>
            )
          })} 
          <button 
            className="submit-btn" 
            disabled={!canCheckAnswer}
          >
            Check answers
          </button>
        </>
        : <p className="loading-status">Loading Quiz...</p>
      } 
    </section>
  )
}