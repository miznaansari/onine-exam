import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Table, Container, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { resultss } from "../Redux/CartSlice";
import { useNavigate } from 'react-router-dom';

import axios from "axios";

function Result() {
  const navigate = useNavigate();
  const location = useLocation();
  const { resultsData } = location.state || { resultsData: [] };
  const tests = useSelector((state) => state.cart.enrollmentnum);
  const enroll = tests[0].enrollmentNumber;
  console.log(enroll);
  

  const totalQuestions = resultsData.length;
  const totalMarksArray = resultsData.filter(item => item.totalmarks !== undefined).map(item => item.totalmarks);
  const paperTitleArray = resultsData.filter(item => item.papertitle !== undefined).map(item => item.papertitle);
  const paperIDArray = resultsData.filter(item => item.paperID !== undefined).map(item => item.paperID);

  const totalMarks = totalMarksArray[0] || 0;
  const paperTitle = paperTitleArray[0] || 0;
  const paperID = paperIDArray[0] || 0;

  const correctAnswers = resultsData.filter(item => item.yourAnswer === item.correctAnswer).length;
  const wrongAnswers = totalQuestions - correctAnswers;
  const obtainedMarks = correctAnswers * totalMarks;
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);

  let grade = "";
  if (percentage >= 90) grade = "A+";
  else if (percentage >= 80) grade = "A";
  else if (percentage >= 70) grade = "B+";
  else if (percentage >= 60) grade = "B";
  else if (percentage >= 50) grade = "C+";
  else if (percentage >= 40) grade = "C";
  else grade = "Fail";

  const dispatch = useDispatch();
  const testData = {
    totalQuestions,
    correctAnswers,
    wrongAnswers,
    obtainedMarks,
    grade,
    percentage,
  };
  dispatch(resultss(testData));

  const submitResults = async () => {
    const payload = {
      enrollmentNumber: enroll,
      papertitless: paperTitle,
      paperidsss: paperID,
      totalMarks,
      grade,
      percentage,
    };

    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/results`, payload);
      alert('Succefullt Result Uploaded')
      navigate('/userloginsucc')
    } catch (error) {
      console.error("Error submitting results:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <Container>
      <h1 className="text-center">Quiz Results</h1>
      <Table bordered className="mb-4">
        <tbody>
          <tr>
            <td>Paper Title:</td>
            <td>{paperTitle}</td>
          </tr>
          <tr>
            <td>Paper ID:</td>
            <td>{paperID}</td>
          </tr>
          <tr>
            <td>Total Questions:</td>
            <td>{totalQuestions}</td>
          </tr>
          <tr>
            <td>Total Marks:</td>
            <td>{totalMarks}</td>
          </tr>
          <tr>
            <td>Right Answers:</td>
            <td>{correctAnswers}</td>
          </tr>
          <tr>
            <td>Wrong Answers:</td>
            <td>{wrongAnswers}</td>
          </tr>
          <tr>
            <td>Obtained Marks:</td>
            <td>{obtainedMarks}</td>
          </tr>
          <tr>
            <td>Grade:</td>
            <td>{grade}</td>
          </tr>
        </tbody>
      </Table>

      <h2 className="text-center mt-4">Detailed Results</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Question</th>
            <th>Your Answer</th>
            <th>Correct Answer</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {resultsData.map((result, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{result.question}</td>
              <td>{result.yourAnswer}</td>
              <td>{result.correctAnswer}</td>
              <td>
                {result.yourAnswer === result.correctAnswer ? (
                  <span className="text-success">Correct</span>
                ) : (
                  <span className="text-danger">Wrong</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Button variant="primary" onClick={submitResults}>Submit Results</Button>
    </Container>
  );
}

export default Result;
