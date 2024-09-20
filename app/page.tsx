"use client";
import { useState, useRef, FormEvent } from 'react';

export default function Home() {
  const [userReflection, setUserReflection] = useState('');
  const [quizResult, setQuizResult] = useState('');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Start the video stream for the camera
  const startVideoStream = () => {
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
  };

  // Capture the photo from the video stream
  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video) {
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, 320, 240);
        setCapturedImage(canvas.toDataURL('image/png'));
      }
    }
  };

  // Handle quiz submission
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
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-8 bg-gray-100">
      <main className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl space-y-8">
        
        {/* Reflection Section */}
        <form onSubmit={submitQuiz} className="space-y-6">
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
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Camera Section */}
          <div className="flex flex-col items-center space-y-4">
            <h3 className="text-lg font-medium text-gray-700">Capture Your Photo</h3>
            <video ref={videoRef} autoPlay className="w-80 h-60 border border-gray-300 rounded-lg" />
            <button
              type="button"
              onClick={startVideoStream}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Camera
            </button>
            <button
              type="button"
              onClick={capturePhoto}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Capture Photo
            </button>

            <canvas ref={canvasRef} width="320" height="240" className="hidden"></canvas>
            {capturedImage && (
              <img src={capturedImage} alt="Captured" className="w-80 h-60 border border-gray-300 rounded-lg" />
            )}
          </div>

          {/* Quiz Section */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-medium text-gray-700">Personality Quiz</h3>

            <div className="flex flex-col space-y-2">
              <label className="text-gray-600">Do you prefer working with ideas?</label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2">
                  <input type="radio" name="q1" value="Investigative" className="form-radio h-5 w-5 text-blue-600" />
                  <span>Yes</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="q1" value="Realistic" className="form-radio h-5 w-5 text-blue-600" />
                  <span>No</span>
                </label>
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-gray-600">Do you enjoy creative activities?</label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2">
                  <input type="radio" name="q2" value="Artistic" className="form-radio h-5 w-5 text-blue-600" />
                  <span>Yes</span>
                </label>
                <label className="flex items-center space-x-2">
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
              Submit Reflection & Quiz
            </button>
          </div>
        </form>

        {/* Quiz Result Display */}
        {quizResult && (
          <div className="mt-8 p-4 bg-blue-100 text-blue-900 rounded-lg">
            <h3 className="text-lg font-medium">Your Personality Type</h3>
            <p>{quizResult}</p>
          </div>
        )}
      </main>
    </div>
  );
}
