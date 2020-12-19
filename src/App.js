import { useState } from "react";
import "./App.css";
import data from "./data.js";

function App() {
  const [questionNumber, setQuestionNumber] = useState(0);
  const [midX, setMidX] = useState(0);
  const [midY, setMidY] = useState(0);

  // States for hint animation
  const [locusX, setLocusX] = useState(0);
  const [locusY, setLocusY] = useState(0);
  const [animate, setAnimate] = useState(false);

  let {
    imageUrl,
    questionText,
    imageHeight,
    imageWidth,
    answerOffsetX,
    answerOffsetY,
    answerHeight,
    answerWidth,
  } = data[questionNumber];

  // Ratio to fit the screen
  const ratio = window.innerWidth / imageWidth;
  imageHeight *= ratio;
  imageWidth *= ratio;
  answerOffsetX *= ratio;
  answerOffsetY *= ratio;
  answerHeight *= ratio;
  answerWidth *= ratio;

  const animateMidPoint = async () => {
    // Wait for a short while to let hint position be set to click position
    await new Promise((resolve) => setTimeout(resolve, 100));
    // Update hint position to midpoint (starts transition animation)
    setLocusX(midX);
    setLocusY(midY);
  };

  // Animate
  if (animate) {
    animateMidPoint();
    setAnimate(false);
  }

  const handleClick = (event) => {
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setLocusX(x);
    setLocusY(y);
    setMidX((x + answerOffsetX) / 2);
    setMidY((y + answerOffsetY) / 2);
    setAnimate(true);
  };

  const resetMidPoint = () => {
    setMidX(0);
    setMidY(0);
  };

  const handlePrev = () => {
    if (questionNumber !== 0) setQuestionNumber(questionNumber - 1);
    resetMidPoint();
  };

  const handleNext = () => {
    if (questionNumber !== data.length - 1)
      setQuestionNumber(questionNumber + 1);
    resetMidPoint();
  };

  const showTransistion = locusX === midX && locusY === midY;
  return (
    <div className="App">
      <div className="dashboard">
        <p>{`Q${questionNumber + 1}. ${questionText}`}</p>
        <button onClick={handlePrev}>Prev</button>
        <button onClick={handleNext}>Next</button>
      </div>
      <img
        onClick={handleClick}
        style={{ width: imageWidth, height: imageHeight }}
        src={imageUrl}
        alt="World Map"
      />
      <div
        className="answer"
        onClick={() => alert("Correct answer!")}
        style={{
          left: answerOffsetX + "px",
          top: answerOffsetY + "px",
          width: answerWidth + "px",
          height: answerHeight + "px",
        }}
      />
      {midX !== 0 && midY !== 0 ? (
        <div
          className="hint"
          style={{
            left: locusX + "px",
            top: locusY + "px",
            transition: showTransistion ? "all 0.5s ease" : "none",
            opacity: showTransistion ? "0" : "100",
          }}
        />
      ) : null}
    </div>
  );
}

export default App;
