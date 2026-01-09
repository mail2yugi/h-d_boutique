import mongoose from 'mongoose';

let bucket: any;

export const initGridFS = () => {
  const db = mongoose.connection.db;
  if (!db) {
    throw new Error('MongoDB connection not established');
  }
  bucket = new mongoose.mongo.GridFSBucket(db, {
    bucketName: 'images',
  });
  return bucket;
};

export const getGridFSBucket = () => {
  if (!bucket) {
    return initGridFS();
  }
  return bucket;
};

export const uploadToGridFS = (buffer: Buffer, filename: string, contentType: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const bucket = getGridFSBucket();
    const uploadStream = bucket.openUploadStream(filename, {
      contentType,
    });

    uploadStream.on('error', (error: any) => {
      reject(error);
    });

    uploadStream.on('finish', () => {
      resolve(uploadStream.id.toString());
    });

    uploadStream.write(buffer);
    uploadStream.end();
  });
};

export const deleteFromGridFS = async (fileId: string): Promise<void> => {
  const bucket = getGridFSBucket();
  const objectId = new mongoose.Types.ObjectId(fileId);
  await (bucket as any).delete(objectId);
};

export const streamFromGridFS = (fileId: string) => {
  const bucket = getGridFSBucket();
  const objectId = new mongoose.Types.ObjectId(fileId);
  return (bucket as any).openDownloadStream(objectId);
};

export const getGridFSFileInfo = async (fileId: string) => {
  const bucket = getGridFSBucket();
  const objectId = new mongoose.Types.ObjectId(fileId);
  const files = await (bucket as any).find({ _id: objectId }).toArray();
  return files.length > 0 ? files[0] : null;
};
