import JobsPageClient from "@/components/features/jobs/JobsPageClient";
import { JobApi } from "@/lib/api/job.api";
import { auth } from "@/lib/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jobs Market",
  description: "ค้นหาและสมัครงานพยาบาลหรือวอร์ดที่เปิดรับสมัครด่วน",
};

export default async function JobsPage() {
  const [jobs, session] = await Promise.all([JobApi.getJobs(), auth()]);
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <div className="pb-30">
      <JobsPageClient jobs={jobs} isAdmin={isAdmin} />
    </div>
  );
}
