import { opportunities } from "@/lib/data";
import OpportunityDetailsPage from "./client-page";

export function generateStaticParams() {
  return opportunities.map((item) => ({ id: item.id }));
}

export default function Page() {
  return <OpportunityDetailsPage />;
}
