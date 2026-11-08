import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Local fallback storage directory if R2 credentials are not yet supplied
const LOCAL_UPLOADS_DIR = process.env.VERCEL
  ? '/tmp/uploads'
  : path.resolve(__dirname, '../../data/uploads');

try {
  if (!fs.existsSync(LOCAL_UPLOADS_DIR)) {
    fs.mkdirSync(LOCAL_UPLOADS_DIR, { recursive: true });
  }
} catch (e) {
  console.warn('[R2] Warning: Could not create local uploads dir:', e.message);
}

export function isR2Configured() {
  return Boolean(
    process.env.CLOUDFLARE_ACCOUNT_ID &&
    process.env.CLOUDFLARE_R2_ACCESS_KEY_ID &&
    process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY &&
    process.env.CLOUDFLARE_R2_BUCKET_NAME
  );
}

let s3ClientInstance = null;

function getR2Client() {
  if (!isR2Configured()) return null;

  if (!s3ClientInstance) {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID.trim();
    s3ClientInstance = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID.trim(),
        secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY.trim(),
      },
    });
  }
  return s3ClientInstance;
}

/**
 * Upload a file to Cloudflare R2 (with local disk fallback if unconfigured)
 */
export async function uploadFileToR2({
  buffer,
  originalname = 'document.pdf',
  mimetype = 'application/pdf',
  folder = 'materials',
}) {
  const sanitizedName = originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
  const timestamp = Date.now();
  const fileKey = `${folder}/${timestamp}_${sanitizedName}`;

  // 1. Cloudflare R2 Upload
  if (isR2Configured()) {
    try {
      const client = getR2Client();
      const bucket = process.env.CLOUDFLARE_R2_BUCKET_NAME.trim();

      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: fileKey,
        Body: buffer,
        ContentType: mimetype,
      });

      await client.send(command);

      // Construct public URL
      const publicDomain = (process.env.CLOUDFLARE_R2_PUBLIC_DOMAIN || '').replace(/\/$/, '');
      const fileUrl = publicDomain
        ? `${publicDomain}/${fileKey}`
        : `https://${bucket}.${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com/${fileKey}`;

      console.log(`[Cloudflare R2] Successfully uploaded ${fileKey} to bucket ${bucket}`);

      return {
        fileKey,
        fileUrl,
        storageProvider: 'cloudflare_r2',
        fileName: originalname,
        contentType: mimetype,
      };
    } catch (err) {
      console.error('[Cloudflare R2] Upload failed, reverting to local fallback:', err);
    }
  }

  // 2. Local Fallback Storage
  const localFileName = `${timestamp}_${sanitizedName}`;
  const localFilePath = path.join(LOCAL_UPLOADS_DIR, localFileName);
  fs.writeFileSync(localFilePath, buffer);

  const port = process.env.PORT || 5001;
  const fileUrl = `http://localhost:${port}/uploads/${localFileName}`;

  console.log(`[Storage] Saved file to local repository: ${localFilePath}`);

  return {
    fileKey: localFileName,
    fileUrl,
    storageProvider: 'local_disk',
    fileName: originalname,
    contentType: mimetype,
  };
}

/**
 * Delete a file from Cloudflare R2 or local storage
 */
export async function deleteFileFromR2(fileKey) {
  if (isR2Configured() && fileKey.includes('/')) {
    try {
      const client = getR2Client();
      const bucket = process.env.CLOUDFLARE_R2_BUCKET_NAME.trim();

      await client.send(
        new DeleteObjectCommand({
          Bucket: bucket,
          Key: fileKey,
        })
      );
      console.log(`[Cloudflare R2] Deleted ${fileKey} from bucket ${bucket}`);
      return true;
    } catch (err) {
      console.error('[Cloudflare R2] Delete failed:', err);
      return false;
    }
  }

  // Local fallback deletion
  const localFilePath = path.join(LOCAL_UPLOADS_DIR, path.basename(fileKey));
  if (fs.existsSync(localFilePath)) {
    fs.unlinkSync(localFilePath);
    console.log(`[Storage] Deleted local file: ${localFilePath}`);
    return true;
  }
  return false;
}
