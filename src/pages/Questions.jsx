import { useState, useEffect } from "react"
import { decode } from "html-entities"
import { nanoid } from "nanoid"
import { getQuiz } from "../api"
import { mergeAndShuffle } from "../utils/shuffle"
import clsx from "clsx"

export default function Questions() {

  const [quiz, setQuiz] = useState([])
  const [userAnswers, setUserAnswers] = useState(new Array(10).fill(null))
  const [isResultRevealed, setIsResultRevealed] = useState(false)

  const correctAnswers = quiz.map(el => el.correct_answer)

  const canCheckAnswer = userAnswers.every(answer => answer)

  function handleChange(answerIndex, choosenAnswer) {
    setUserAnswers(prev => prev.map((el, index) => {
      return index === answerIndex ? choosenAnswer : el
    }))
  }

  function handleSubmit() {
    setIsResultRevealed(true)
  }

  function calculateScore() {
    const score = userAnswers.filter(el => correctAnswers.includes(el)).length
    return `You scored ${score}/${correctAnswers.length} correct answers`
  }

  useEffect(() => {
    async function getData() {
      const res = await getQuiz()
      const data = res.map(el => (
        {
          ...el, 
          choices: mergeAndShuffle(el.incorrect_answers, el.correct_answer)
          .map(el => decode(el))
        }
      ))
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

            return(
              <div className="question" key={index}>
                <h2>{decode(el.question)}</h2>
                <div className="choices">
                  {
                    el.choices.map(choice => {

                      const choiceId = nanoid()

                      const choiceClassName = clsx({
                        'correct': isResultRevealed && correctAnswers.includes(choice),
                        'incorrect': isResultRevealed && userAnswers.includes(choice) && !correctAnswers.includes(choice)
                      })

                      return (
                        <div key={choice}>
                          <input 
                            type="radio" 
                            name={`answer-${index + 1}`} 
                            id={choiceId}
                            value={choice}
                            disabled={isResultRevealed}
                            required
                          />
                          <label 
                            htmlFor={choiceId} 
                            onClick={() => handleChange(index, choice)}
                            className={choiceClassName}
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
          
          {
            isResultRevealed ? 

            <div className="result">
              <p>{calculateScore()}</p>
              <button className="restart-btn">Play again</button>
            </div> : 

            <button 
              className="submit-btn" 
              disabled={!canCheckAnswer}
              onClick={handleSubmit}
            >
              Check answers
            </button>
          }
        </>
        : <p className="loading-status">Loading Quiz...</p>
      } 
    </section>
  )
}