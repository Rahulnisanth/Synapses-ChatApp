import { supabase } from "./supabase.js";

// Upload file to Supabase Storage
export const uploadToSupabase = async (file, folder) => {
  const filePath = `${folder}/${Date.now()}_${file.originalname}`;
  const { data, error } = await supabase.storage
    .from("all-files") // Replace with your Supabase storage bucket name
    .upload(filePath, file.buffer);

  if (error) throw error;

  // Generate a public URL
  const { data: publicUrlData } = supabase.storage
    .from("all-files")
    .getPublicUrl(filePath);

  return {
    filePath,
    publicUrl: publicUrlData?.publicUrl,
  };
};

// Delete file from Supabase Storage
export const deleteFromSupabase = async (filePath) => {
  const { error } = await supabase.storage
    .from("all-files") // Replace with your Supabase storage bucket name
    .remove([filePath]);

  if (error) throw error;
};
