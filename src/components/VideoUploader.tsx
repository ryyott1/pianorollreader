import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, FileVideo } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface VideoUploaderProps {
  onUploadProgress: (progress: number) => void;
}

const VideoUploader: React.FC<VideoUploaderProps> = ({ onUploadProgress }) => {
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleSubmit = async () => {
    if (!file) {
      toast({
        title: 'Error',
        description: 'Please select a video file first.',
        variant: 'destructive',
      });
      return;
    }

    const formData = new FormData();
    formData.append('video', file);

    try {
      onUploadProgress(10);
      const response = await fetch('http://localhost:3000/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      onUploadProgress(50);

      const result = await response.json();
      
      onUploadProgress(100);

      toast({
        title: 'Success',
        description: 'Video uploaded and processed successfully!',
      });

      // Offer the MIDI file for download
      const downloadUrl = `http://localhost:3000${result.midiFile}`;
      const downloadLink = document.createElement('a');
      downloadLink.href = downloadUrl;
      downloadLink.download = 'piano_roll.mid';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload and process the video.',
        variant: 'destructive',
      });
    } finally {
      onUploadProgress(0);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="relative flex-grow">
          <Input
            type="file"
            accept="video/mp4,video/mov"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex items-center border rounded-md p-2 bg-white">
            <FileVideo className="text-amber-500 mr-2" size={24} />
            <span className="text-gray-600 truncate">
              {file ? file.name : 'Choose a video file'}
            </span>
          </div>
        </div>
      </div>
      <Button
        onClick={handleSubmit}
        className="w-full bg-amber-500 hover:bg-amber-600 text-white"
        disabled={!file}
      >
        <Upload className="mr-2 h-4 w-4" /> Upload Video
      </Button>
    </div>
  );
};

export default VideoUploader;