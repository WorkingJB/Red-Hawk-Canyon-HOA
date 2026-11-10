import { buildLlmsFullTxt } from "@/lib/llms";

export const revalidate = 900;

export async function GET() {
  return new Response(await buildLlmsFullTxt(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
