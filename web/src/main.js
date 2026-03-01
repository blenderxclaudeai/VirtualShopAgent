import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

const canInit = Boolean(supabaseUrl && supabaseAnonKey);
if (canInit) {
  createClient(supabaseUrl, supabaseAnonKey);
}

document.querySelector("#root").innerHTML = `
  <main style="font-family: Arial, sans-serif; max-width: 760px; margin: 2rem auto; padding: 1rem;">
    <h1>VirtualShopAgent Dashboard</h1>
    <p>Lovable/Supabase dashboard placeholder for profile image upload and request logs.</p>
    <ul>
      <li>Supabase URL configured: <strong>${canInit ? "yes" : "no"}</strong></li>
      <li>Next step: connect real Lovable UI from ddsasdkse if available.</li>
    </ul>
  </main>
`;
