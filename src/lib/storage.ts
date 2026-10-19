import { supabase } from './supabase';

/**
 * Uploads a local file (blob or base64 data) or imports an external URL image
 * into the Supabase 'product-images' storage bucket.
 * 
 * Returns the public URL of the uploaded image.
 */
export async function uploadProductImage(
  fileName: string,
  fileBody: ArrayBuffer | Blob,
  contentType: string = 'image/jpeg'
): Promise<{ publicUrl: string | null; error: Error | null }> {
  try {
    const cleanFileName = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(cleanFileName, fileBody, {
        contentType,
        upsert: true,
      });

    if (error) {
      console.warn('Supabase storage upload error:', error.message);
      return { publicUrl: null, error };
    }

    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(data.path);

    return { publicUrl: urlData.publicUrl, error: null };
  } catch (err: any) {
    return { publicUrl: null, error: err };
  }
}
