import Dashboard from "@/components/dashboard";
import { getSnapshot } from "@/lib/snapshot";
export const dynamic = "force-dynamic";
export default function Home() { return <Dashboard snapshot={getSnapshot()} />; }
