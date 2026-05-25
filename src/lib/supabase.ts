import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function uploadCarImage(file: File, carId: string): Promise<string | null> {
  const ext = file.name.split(".").pop();
  const path = `cars/${carId}.${ext}`;

  const { error } = await supabaseAdmin.storage
    .from("car-images")
    .upload(path, file, { upsert: true });

  if (error) {
    console.error("Upload error:", error);
    return null;
  }

  const { data } = supabaseAdmin.storage.from("car-images").getPublicUrl(path);
  return data.publicUrl;
}
