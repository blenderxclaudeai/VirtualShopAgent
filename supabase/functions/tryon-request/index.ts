import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { buildCorsHeaders } from "../_shared/cors.ts";

interface TryOnPayload {
  pageUrl: string;
  imageUrl: string;
  title: string;
  price?: string;
  retailerDomain: string;
}

serve(async (req: Request): Promise<Response> => {
  const origin = req.headers.get("origin");
  const corsHeaders = buildCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  }

  let payload: TryOnPayload;
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  }

  if (!payload?.pageUrl || !payload?.imageUrl || !payload?.title || !payload?.retailerDomain) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  }

  // MVP: anonymous requests are allowed (no Authorization required).
  const encodedTitle = encodeURIComponent(payload.title.slice(0, 80));
  const resultImageUrl = `https://picsum.photos/seed/${encodedTitle}/900/1200`;

  return new Response(
    JSON.stringify({
      resultImageUrl,
      inputEcho: {
        pageUrl: payload.pageUrl,
        imageUrl: payload.imageUrl,
        title: payload.title,
        price: payload.price ?? "",
        retailerDomain: payload.retailerDomain
      }
    }),
    {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    }
  );
});
