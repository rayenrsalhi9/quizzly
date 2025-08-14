import { useState, useEffect } from "react"
import { decode } from "html-entities"
import { nanoid } from "nanoid"
import { getQuiz } from "../api"
import { mergeAndShuffle } from "../utils/shuffle"

export default function Questions() {

  const [quiz, setQuiz] = useState([])

  useEffect(() => {
    async function getData() {
      const data = await getQuiz()
      setQuiz(data)
    }
    getData()
  }, [])

  return (
    <form className="quiz-container">
      {
        quiz.length > 0 ?
        quiz.map((el, index) => {

          const choices = mergeAndShuffle(el.incorrect_answers, el.correct_answer)
          .map(el => decode(el))

          return(
            <div className="question" key={index}>
              <h2>{decode(el.question)}</h2>
              <div className="choices">
                {
                  choices.map((choice, i) => {
                    const choiceId = nanoid()
                    return (
                      <>
                        <input 
                          type="radio" 
                          name={`answer-${index + 1}`} 
                          id={choiceId}
                          key={i} 
                          value={choice}
                        />
                        <label htmlFor={choiceId}>{choice}</label>
                      </>
                    )
                  })
                }
              </div>
            </div>
          )
        }) : <p className="loading-status">Loading Quiz...</p>
      } 
    </form>
  )
}