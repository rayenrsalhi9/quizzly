import { useState, useEffect } from "react"
import { decode } from "html-entities"
import { getQuiz } from "../api"

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
    <section className="quiz-container">
      {
        quiz.map(el => {

          const choices = [...el.incorrect_answers, el.correct_answer]

          return(
            <div className="question">
              <h2>{decode(el.question)}</h2>
              <div className="choices">
                {
                  choices.map(choice => <button>{choice}</button>)
                }
              </div>
            </div>
          )
        })
      }
    </section>
  )
}