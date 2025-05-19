import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(file: Buffer): Promise<string> {
  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'court-auction',
          format: 'webp',
          transformation: [
            { width: 800, height: 600, crop: 'fill' },
            { quality: 'auto:good' },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(file);
    });

    return (result as any).secure_url;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw error;
  }
}

export async function optimizeImage(url: string): Promise<string> {
  try {
    const optimizedUrl = cloudinary.url(url, {
      format: 'webp',
      quality: 'auto:good',
      fetch_format: 'auto',
      responsive: true,
      width: 'auto',
      dpr: 'auto',
    });

    return optimizedUrl;
  } catch (error) {
    console.error('Error optimizing image:', error);
    return url;
  }
} 