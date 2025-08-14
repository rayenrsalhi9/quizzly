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
    quizContainerRef.current.scrollIntoView({behavior: 'smooth'})
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
    <section className="quiz-container" ref={quizContainerRef} role="main" aria-live="polite">
      {
        quiz.length > 0 ?
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          {quiz.map((el, index) => (
            <fieldset key={index} className="question">
              <legend><h2>{decode(el.question)}</h2></legend>
              <div className="choices" role="group" aria-labelledby={`q${index}-label`}>
                {el.choices.map((choice) => {
                  const choiceId = nanoid();
                  const isCorrect = correctAnswers.includes(choice);
                  const isSelected = userAnswers[index] === choice;

                  const choiceClassName = clsx({
                    'correct': isResultRevealed && isCorrect,
                    'incorrect': isResultRevealed && !isCorrect && isSelected
                  });

                  return (
                    <div key={choice}>
                      <input
                        type="radio"
                        name={`answer-${index + 1}`}
                        id={choiceId}
                        value={choice}
                        disabled={isResultRevealed}
                        onChange={() => handleChange(index, choice)}
                        checked={isSelected}
                        aria-describedby={isResultRevealed ? `explanation-${index}` : null}
                      />
                      <label
                        htmlFor={choiceId}
                        className={choiceClassName}
                        tabIndex="0"
                        role="button"
                        onKeyPress={(e) => e.key === 'Enter' && handleChange(index, choice)}
                      >
                        {choice}
                      </label>
                    </div>
                  );
                })}
              </div>
              {isResultRevealed && (
                <p id={`explanation-${index}`} className="sr-only">
                  Correct answer: {decode(el.correct_answer)}
                </p>
              )}
            </fieldset>
          ))} 
          
          {
            isResultRevealed ? 

            <div className="result" aria-live="polite" role="status">
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
        </form>
        : <p className="loading-status">Loading Quiz...</p>
      } 
    </section>
  )
}