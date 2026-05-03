import { redirect } from "next/navigation";

// Legacy /results page contained hard-coded mock data and was not connected to
// the real tally pipeline. Real results live at /elections/[id]/results.
// We redirect any old links here to the elections index so users can pick the
// election whose results they want to see.
export default function LegacyResultsRedirect() {
  redirect("/elections");
}
