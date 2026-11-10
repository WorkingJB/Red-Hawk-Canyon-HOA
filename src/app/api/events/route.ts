import { getEvents } from "@/lib/calendar";
import { site } from "@/content/site";

export const revalidate = 900;

export async function GET() {
  const { upcoming, past } = await getEvents();
  return Response.json({ timeZone: site.timeZone, upcoming, past }, { headers: { "Access-Control-Allow-Origin": "*" } });
}
