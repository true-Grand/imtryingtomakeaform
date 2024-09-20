"use client";

import { useState, useEffect, useRef, FormEvent } from 'react';

export default function Home() {
  const [userReflection, setUserReflection] = useState<string>('');
  const [quizResult, setQuizResult] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const resultCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Start the video stream for the camera
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.log('Error accessing camera: ', err);
        });
    }
  }, []);

  const submitReflection = () => {
    if (userReflection === '') {
      alert('Please enter your reflection.');
    } else {
      alert('Reflection saved! Now proceed to the quiz.');
    }
  };

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video) {
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, 320, 240);
      }
    }
  };

  const submitQuiz = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let result = '';

    if (formData.get('q1') === 'Investigative') {
      result = 'Investigative';
    } else if (formData.get('q1') === 'Realistic') {
      result = 'Realistic';
    }

    if (formData.get('q2') === 'Artistic') {
      result = result ? result + ' & Artistic' : 'Artistic';
    } else if (formData.get('q2') === 'Conventional') {
      result = result ? result + ' & Conventional' : 'Conventional';
    }

    setQuizResult(result);
    applyEffectToImage(result);
  };

  const applyEffectToImage = (effect: string) => {
    const canvas = canvasRef.current;
    const resultCanvas = resultCanvasRef.current;
    if (canvas && resultCanvas) {
      const resultContext = resultCanvas.getContext('2d');
      if (resultContext) {
        const symbol = new Image();
        // Load the correct symbol based on personality type
        if (effect.includes('Investigative')) {
          symbol.src = '/images/investigative.png';
        } else if (effect.includes('Artistic')) {
          symbol.src = '/images/artistic.png';
        } else if (effect.includes('Realistic')) {
          symbol.src = '/images/realistic.png';
        } else if (effect.includes('Enterprising')) {
          symbol.src = '/images/enterprising.png';
        } else if (effect.includes('Social')) {
          symbol.src = '/images/social.png';
        } else if (effect.includes('Conventional')) {
          symbol.src = '/images/conventional.png';
        }

        // Draw the captured image onto the result canvas
        resultContext.drawImage(canvas, 0, 0, 320, 240);

        // Draw the symbol onto the canvas once it's loaded
        symbol.onload = () => {
          resultContext.drawImage(symbol, 200, 50, 100, 100);
        };

        // Add the user's reflection and personality type as a text overlay
        resultContext.font = '16px Arial';
        resultContext.fillStyle = 'white';
        resultContext.fillText(`Reflection: ${userReflection}`, 10, 220);
        resultContext.fillText(`Personality: ${effect}`, 10, 240);
      }
    }
  };

  const downloadImage = () => {
    const resultCanvas = resultCanvasRef.current;
    if (resultCanvas) {
      const link = document.createElement('a');
      link.download = 'final_image.png';
      link.href = resultCanvas.toDataURL();
      link.click();
    }
  };

  return (
    <div>
      <h1>Reflection and Personality App with Camera</h1>

      {/* Reflection Section */}
      <div>
        <h2>Reflection on 1 Samuel 6-13</h2>
        <textarea
          rows={5}
          cols={50}
          placeholder="Write your reflection here..."
          value={userReflection}
          onChange={(e) => setUserReflection(e.target.value)}
        />
        <br />
        <button onClick={submitReflection}>Submit Reflection</button>
      </div>

      {/* Camera Section */}
      <div>
        <h2>Take a Picture</h2>
        <video ref={videoRef} autoPlay width="320" height="240"></video>
        <br />
        <button onClick={capturePhoto}>Capture Photo</button>
        <canvas ref={canvasRef} width="320" height="240" style={{ display: 'none' }}></canvas>
      </div>

      {/* Quiz Section */}
      <div>
        <h2>Identify Your Personality Type</h2>
        <form onSubmit={submitQuiz}>
          <label>Do you prefer working with ideas?</label><br />
          <input type="radio" name="q1" value="Investigative" /> Yes<br />
          <input type="radio" name="q1" value="Realistic" /> No<br /><br />

          <label>Do you enjoy creative activities?</label><br />
          <input type="radio" name="q2" value="Artistic" /> Yes<br />
          <input type="radio" name="q2" value="Conventional" /> No<br /><br />

          <button type="submit">Submit Quiz</button>
        </form>
      </div>

      {/* Result Section */}
      <div>
        <h2>Your Character Image</h2>
        <canvas ref={resultCanvasRef} width="320" height="240"></canvas>
        <br />
        <button onClick={downloadImage}>Download Image</button>
      </div>
    </div>
  );
}
