import express from 'express';
import { streamFromGridFS, getGridFSFileInfo } from '../utils/gridfs.util';

const router = express.Router();

// Serve image from GridFS (public)
router.get('/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;

    // Get file info
    const fileInfo = await getGridFSFileInfo(fileId);
    
    if (!fileInfo) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }

    // Set content type
    res.set('Content-Type', fileInfo.contentType || 'image/jpeg');
    res.set('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year

    // Stream the file
    const downloadStream = streamFromGridFS(fileId);
    downloadStream.pipe(res);

    downloadStream.on('error', (error) => {
      console.error('Stream error:', error);
      if (!res.headersSent) {
        res.status(404).json({ success: false, message: 'Image not found' });
      }
    });
  } catch (error: any) {
    console.error('Get image error:', error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
});

export default router;
