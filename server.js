import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cors from 'cors';
import { extractFramesWithTiming } from './src/utils/videoProcessor.js';
import { processVideoToMIDI } from './src/utils/midiGenerator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

app.use(cors());

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.use(express.static('dist'));
app.use('/output', express.static('output'));

app.post('/api/upload', upload.single('video'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const videoPath = req.file.path;

  try {
    const midiFilePath = await processVideoToMIDI(videoPath);
    const midiFileName = path.basename(midiFilePath);
    res.json({ message: 'Video processed successfully', midiFile: `/output/${midiFileName}` });
  } catch (error) {
    console.error('Error processing video:', error);
    res.status(500).json({ error: 'Failed to process video' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});