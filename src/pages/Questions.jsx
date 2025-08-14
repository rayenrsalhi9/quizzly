import { useState, useEffect, useRef } from "react"
import { decode } from "html-entities"
import { nanoid } from "nanoid"
import { getQuiz } from "../api"
import { mergeAndShuffle } from "../utils/shuffle"
import clsx from "clsx"

export default function Questions() {
  
  // states
  const [quiz, setQuiz] = useState([])
  const [userAnswers, setUserAnswers] = useState(new Array(10).fill(null))
  const [isResultRevealed, setIsResultRevealed] = useState(false)
  const [isGameReplayed, setIsGameReplayed] = useState(false)

  // refs
  const quizContainerRef = useRef(null)

  // side effects
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
  }, [isGameReplayed])

  // derived values from states
  const correctAnswers = quiz.map(el => el.correct_answer)
  const canCheckAnswer = userAnswers.every(answer => answer)

  // function declarations
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

  function playAgain() {
    setIsResultRevealed(false)
    setUserAnswers(new Array(10).fill(null))
    setIsGameReplayed(true)
    quizContainerRef.current.scrollIntoView({behavior: 'smooth'})
  }

  return (
    <section className="quiz-container" ref={quizContainerRef}>
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
              <button className="restart-btn" onClick={playAgain}>Play again</button>
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