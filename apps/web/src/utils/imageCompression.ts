/**
 * Compress an image file to reduce its size while maintaining quality
 * @param file - The image file to compress
 * @param maxSizeMB - Maximum size in MB (default: 0.8MB per image)
 * @param maxWidthOrHeight - Maximum width or height in pixels (default: 1920px)
 * @returns Compressed image file
 */
export async function compressImage(
  file: File,
  maxSizeMB: number = 0.8,
  maxWidthOrHeight: number = 1920
): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidthOrHeight) {
            height = (height * maxWidthOrHeight) / width;
            width = maxWidthOrHeight;
          }
        } else {
          if (height > maxWidthOrHeight) {
            width = (width * maxWidthOrHeight) / height;
            height = maxWidthOrHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Try different quality levels to meet size requirement
        let quality = 0.9;
        const tryCompress = () => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to compress image'));
                return;
              }

              const sizeMB = blob.size / 1024 / 1024;
              
              // If size is good or quality is too low, return the result
              if (sizeMB <= maxSizeMB || quality <= 0.5) {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                // Try again with lower quality
                quality -= 0.1;
                tryCompress();
              }
            },
            'image/jpeg',
            quality
          );
        };

        tryCompress();
      };
      img.onerror = () => reject(new Error('Failed to load image'));
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
  });
}

/**
 * Compress multiple image files
 * @param files - Array of image files to compress
 * @param maxSizeMB - Maximum size in MB per image
 * @param maxWidthOrHeight - Maximum width or height in pixels
 * @returns Array of compressed image files
 */
export async function compressImages(
  files: File[],
  maxSizeMB: number = 0.8,
  maxWidthOrHeight: number = 1920
): Promise<File[]> {
  const compressionPromises = files.map((file) =>
    compressImage(file, maxSizeMB, maxWidthOrHeight)
  );
  return Promise.all(compressionPromises);
}
