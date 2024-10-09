import { useState } from 'react';
import { Progress } from '@/components/ui/progress';
import VideoUploader from '@/components/VideoUploader';
import './App.css';

function App() {
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleUploadProgress = (progress: number) => {
    setUploadProgress(progress);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-100 to-amber-200 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-center text-amber-800">Piano Roll Reader</h1>
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col md:flex-row items-center mb-8">
              <div className="w-full md:w-1/2 mb-6 md:mb-0">
                <img
                  src="https://images.unsplash.com/photo-1552422535-c45813c61732?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
                  alt="Vintage Piano"
                  className="rounded-lg shadow-md"
                />
              </div>
              <div className="w-full md:w-1/2 md:pl-8">
                <h2 className="text-2xl font-semibold mb-4 text-amber-700">Upload Your Piano Roll Video</h2>
                <p className="text-gray-600 mb-6">
                  Transform your Ampico piano roll videos into MIDI files. Simply upload your video, and we'll do the rest!
                </p>
                <VideoUploader onUploadProgress={handleUploadProgress} />
                {uploadProgress > 0 && (
                  <Progress value={uploadProgress} className="mt-4" />
                )}
              </div>
            </div>
          </div>
          <div className="bg-amber-50 p-6">
            <h3 className="text-xl font-semibold mb-4 text-amber-800">How It Works</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Upload your Ampico piano roll video</li>
              <li>Our system analyzes the video frames</li>
              <li>We detect the piano roll holes and convert them to MIDI data</li>
              <li>Download your generated MIDI file</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;