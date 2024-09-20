"use client";

import { useState, useRef, FormEvent, useEffect } from 'react';

export default function Home() {
  const [userReflection, setUserReflection] = useState('');
  const [quizResult, setQuizResult] = useState('');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(true);
  const [symbolImage, setSymbolImage] = useState<string | null>(null); // Store symbol image path
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (showCamera) {
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
    }
  }, [showCamera]);

  // Capture the photo from the video stream
  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video) {
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, 320, 240);
        const capturedDataURL = canvas.toDataURL('image/png');
        setCapturedImage(capturedDataURL); // Store the captured image
        setShowCamera(false);
        stopCamera(); // Stop the camera after capturing the photo
      }
    }
  };

  // Stop the camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  // Handle the quiz submission and set symbol based on results
  const submitQuiz = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let result = '';

    if (formData.get('q1') === 'Investigative') {
      result = 'Investigative';
      setSymbolImage('/image/investigative.png'); // Set relevant symbol
    } else if (formData.get('q1') === 'Realistic') {
      result = 'Realistic';
      setSymbolImage('/image/realistic.png');
    }

    if (formData.get('q2') === 'Artistic') {
      result = result ? result + ' & Artistic' : 'Artistic';
      setSymbolImage('/image/artistic.png');
    } else if (formData.get('q2') === 'Conventional') {
      result = result ? result + ' & Conventional' : 'Conventional';
      setSymbolImage('/image/conventional.png');
    }

    setQuizResult(result); // Set the final quiz result text

    // Save the result to a text file by calling the API
    try {
      const response = await fetch('/api/saveResults', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reflection: userReflection,
          quizResult: result,
          capturedImageURL: capturedImage, // Base64 image URL
        }),
      });
  
      if (response.ok) {
        alert('Results saved successfully!');
      } else {
        alert('Failed to save results.');
      }
    } catch (error) {
      console.error('Error saving results:', error);
      alert('An error occurred while saving results.');
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-8 bg-gray-100">
      <main className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl space-y-8">
        
        {/* Reflection Section */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="reflection" className="text-lg font-medium text-gray-700">
            Reflection on 1 Samuel 6-13
          </label>
          <textarea
            id="reflection"
            rows={4}
            placeholder="Write your reflection here..."
            value={userReflection}
            onChange={(e) => setUserReflection(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          />
        </div>

        {/* Camera Section */}
        {showCamera && (
          <div className="flex flex-col items-center space-y-4">
            <h3 className="text-lg font-medium text-gray-700">Capture Your Photo</h3>
            <video ref={videoRef} autoPlay className="w-80 h-60 border border-gray-300 rounded-lg" />
            <button
              type="button"
              onClick={capturePhoto}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Capture Photo
            </button>
            <canvas ref={canvasRef} width="320" height="240" className="hidden"></canvas>
          </div>
        )}

        {capturedImage && (
          <div className="flex flex-col items-center space-y-4">
            <h3 className="text-lg font-medium text-gray-700">Your Captured Photo</h3>
            <img src={capturedImage} alt="Captured" className="w-80 h-60 border border-gray-300 rounded-lg" />
          </div>
        )}

        {/* Quiz Section */}
        <form onSubmit={submitQuiz} className="space-y-6">
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-medium text-gray-700">Personality Quiz</h3>

            <div className="flex flex-col space-y-2">
              <label className="text-gray-700">Do you prefer working with ideas?</label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2 text-gray-700">
                  <input type="radio" name="q1" value="Investigative" className="form-radio h-5 w-5 text-blue-600" required />
                  <span>Yes</span>
                </label>
                <label className="flex items-center space-x-2 text-gray-700">
                  <input type="radio" name="q1" value="Realistic" className="form-radio h-5 w-5 text-blue-600" />
                  <span>No</span>
                </label>
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-gray-700">Do you enjoy creative activities?</label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2 text-gray-700">
                  <input type="radio" name="q2" value="Artistic" className="form-radio h-5 w-5 text-blue-600" required />
                  <span>Yes</span>
                </label>
                <label className="flex items-center space-x-2 text-gray-700">
                  <input type="radio" name="q2" value="Conventional" className="form-radio h-5 w-5 text-blue-600" />
                  <span>No</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Submit Quiz & Reflection
            </button>
          </div>
        </form>

        {/* Result Section */}
        {quizResult && (
          <div className="mt-8 p-6 bg-yellow-100 border border-yellow-300 rounded-lg flex flex-col items-center space-y-4">
            <h3 className="text-lg font-medium text-yellow-800">Your Personality Type Result</h3>

            {/* Display Captured Image */}
            {capturedImage && (
              <img src={capturedImage} alt="Captured Result" className="w-80 h-60 border border-gray-300 rounded-lg" />
            )}

            {/* Display Symbol Image */}
            {symbolImage && (
              <img src={symbolImage} alt="Personality Symbol" className="w-20 h-20 border border-gray-300 rounded-lg" />
            )}

            {/* Display Result Text */}
            <p className="text-yellow-800 font-medium">{quizResult}</p>
          </div>
        )}
      </main>
    </div>
  );
}
