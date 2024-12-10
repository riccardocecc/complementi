'use client';
import React, { useState, useEffect } from 'react';
import { quiz } from '../data.js';
import { toast } from "sonner"
const Page = () => {
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [checked, setChecked] = useState(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState({
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
  });
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);

  
  const shuffleArray = (array) => {
    return array
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  };

 
  useEffect(() => {
    setShuffledQuestions(shuffleArray([...quiz.questions]));
  }, []);

  
  useEffect(() => {
    if (shuffledQuestions.length > 0) {
      setShuffledAnswers(shuffleArray([...shuffledQuestions[activeQuestion].answers]));
    }
  }, [activeQuestion, shuffledQuestions]);

  
  const onAnswerSelected = (answer, idx) => {
    setChecked(true);
    setSelectedAnswerIndex(idx);
    setSelectedAnswer(answer === shuffledQuestions[activeQuestion].correctAnswer);
  };

 
  const nextQuestion = () => {
    if (selectedAnswer) {
      
      setResult((prev) => ({
        ...prev,
        score: prev.score + 5,
        correctAnswers: prev.correctAnswers + 1,
      }));

      
      if (activeQuestion !== shuffledQuestions.length - 1) {
        setActiveQuestion((prev) => prev + 1);
      } else {
        setShowResult(true);
      }

     
      setChecked(false);
      setSelectedAnswerIndex(null);
    } else {
  
      toast("Risposta sbagliata riprova")
      setResult((prev) => ({
        ...prev,
        wrongAnswers: prev.wrongAnswers + 1,
      }));
    }
  };

  return (
    <div className='container'>
      <h1>Quiz Page</h1>
      <div>
        <h2>
          Question: {activeQuestion + 1}
          <span>/{shuffledQuestions.length}</span>
        </h2>
      </div>
      <div>
        {!showResult ? (
          <div className='quiz-container'>
            <h3>{shuffledQuestions[activeQuestion]?.question}</h3>
            {shuffledAnswers.map((answer, idx) => (
              <li
                key={idx}
                onClick={() => onAnswerSelected(answer, idx)}
                className={
                  selectedAnswerIndex === idx ? 'li-selected' : 'li-hover'
                }
              >
                <span>{answer}</span>
              </li>
            ))}
            {checked ? (
              <button onClick={nextQuestion} className='btn'>
                {activeQuestion === shuffledQuestions.length - 1 ? 'Finish' : 'Next'}
              </button>
            ) : (
              <button onClick={nextQuestion} disabled className='btn-disabled'>
                {activeQuestion === shuffledQuestions.length - 1 ? 'Finish' : 'Next'}
              </button>
            )}
          </div>
        ) : (
          <div className='quiz-container'>
            <h3>Results</h3>
            <h3>Overall {(result.score / (shuffledQuestions.length * 5)) * 100}%</h3>
            <p>
              Total Questions: <span>{shuffledQuestions.length}</span>
            </p>
            <p>
              Total Score: <span>{result.score}</span>
            </p>
            <p>
              Correct Answers: <span>{result.correctAnswers}</span>
            </p>
            <p>
              Wrong Answers: <span>{result.wrongAnswers}</span>
            </p>
            <button onClick={() => window.location.reload()}>Restart</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
