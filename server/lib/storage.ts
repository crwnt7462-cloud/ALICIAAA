// import { supabase } from './clients/supabaseServer';
import { v4 as uuidv4 } from 'uuid';

function isDataUri(s?: string) {
  return typeof s === 'string' && /^data:/i.test(s);
}

function parseDataUri(dataUri: string) {
  // Avoid non-supported regex flags; capture greedily the base64 tail
  const m = dataUri.match(/^data:([^;]+);base64,(.+)$/i);
  if (!m || m.length < 3) return null;
  const mime = m[1];
  const b64 = m[2] || '';
  const buffer = Buffer.from(b64, 'base64');
  return { mime, buffer } as { mime: string; buffer: Buffer };
}

export async function uploadDataUriAsPublicUrl(bucket: string, folder: string, dataUri?: string | null) {
  if (!dataUri || !isDataUri(dataUri)) return null;
  const parsed = parseDataUri(dataUri);
  if (!parsed) return null;
  const ext = (parsed.mime && parsed.mime.split('/')[1]) || 'jpg';
  const filename = `${folder}/${uuidv4()}.${ext}`;

  try {
    const storage = (supabase as any).storage;
    // upload accepts a Buffer
    let { error: uploadErr } = await storage.from(bucket).upload(filename, parsed.buffer, { upsert: false });
    if (uploadErr) {
      console.error('storage_upload_err_initial', { bucket, filename, message: uploadErr.message || uploadErr });
      // Try to create the bucket (public) if it doesn't exist, then retry once
      try {
        const { data: cbData, error: cbErr } = await storage.createBucket(bucket, { public: true });
        if (cbErr) {
          console.error('storage_create_bucket_err', { bucket, error: cbErr.message || cbErr });
        } else {
          console.log('storage_bucket_created', { bucket });
          const retry = await storage.from(bucket).upload(filename, parsed.buffer, { upsert: false });
          uploadErr = retry.error;
          if (uploadErr) {
            console.error('storage_upload_err_after_create', { bucket, filename, message: uploadErr.message || uploadErr });
          }
        }
      } catch (e) {
        console.error('storage_create_bucket_exception', { bucket, error: (e as Error).message });
      }
    }
    if (uploadErr) {
      return null;
    }

    const { data: urlData } = storage.from(bucket).getPublicUrl(filename);
    return urlData?.publicUrl || null;
  } catch (err) {
    console.error('storage_upload_exception', { bucket, error: (err as Error).message });
    return null;
  }
}
