import { JobPost } from "@/@types/types";
import { useState, useEffect, useCallback } from "react";

export function useJobMarket() {
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [currentUser, setCurrentUser] = useState<unknown>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // 1. ดึงข้อมูลประกาศงานทั้งหมดจาก Backend API
  const fetchJobs = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:3000/jobs", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch jobs");
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
    // ดึงข้อมูล User ปัจจุบัน (จำลองจาก LocalStorage หรือ Auth Context)
    const storedUser = localStorage.getItem("current_user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, [fetchJobs]);

  // 2. ฟังก์ชันเพิ่มงานใหม่ (POST /jobs) - เฉพาะ Admin
  const addJob = async (newJobData: unknown) => {
    try {
      const res = await fetch("http://localhost:3000/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
        },
        body: JSON.stringify(newJobData),
      });
      if (res.ok) fetchJobs(); // โหลดข้อมูลใหม่หลังบันทึกสำเร็จ
    } catch (error) {
      console.error("Failed to add job:", error);
    }
  };

  // 3. ฟังก์ชันอัปเดตงาน (PUT /jobs/:id) - เฉพาะ Admin
  const updateJob = async (id: number, updatedData: unknown) => {
    try {
      const res = await fetch(`http://localhost:3000/jobs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
        },
        body: JSON.stringify(updatedData),
      });
      if (res.ok) fetchJobs();
    } catch (error) {
      console.error("Failed to update job:", error);
    }
  };

  // 4. ฟังก์ชันลบงาน (DELETE /jobs/:id) - เฉพาะ Admin
  const deleteJob = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:3000/jobs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
        },
      });
      if (res.ok) fetchJobs();
    } catch (error) {
      console.error("Failed to delete job:", error);
    }
  };

  // 5. ฟังก์ชันสมัครงาน
  const applyJob = async (id: number) => {
    // ลอจิกการกดสมัครงาน
  };

  return {
    currentUser,
    jobs,
    loading,
    addJob,
    updateJob,
    deleteJob,
    applyJob,
  };
}
