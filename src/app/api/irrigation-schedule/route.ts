import { getIrrigationSchedule } from "@/lib/irrigation";

export const revalidate = 900;

export async function GET() {
  const schedule = await getIrrigationSchedule();
  return Response.json(schedule, { headers: { "Access-Control-Allow-Origin": "*" } });
}
