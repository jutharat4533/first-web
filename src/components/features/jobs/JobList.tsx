// import { EGG, LIME, P, ROSE, STEEL } from "@/styles/theme";
// import { Check, Edit2, MapPin, Stethoscope, Trash2, Zap } from "lucide-react";

// export default function JobList() {
//   return (
//     <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-6">
//       {filtered.length === 0 && (
//         <div
//           className="rounded-2xl px-4 py-8 text-center"
//           style={{ backgroundColor: EGG }}
//         >
//           <AlertCircle
//             size={32}
//             style={{ color: "#5a7a99", margin: "0 auto 8px" }}
//           />
//           <p className="text-sm font-semibold" style={{ color: P }}>
//             ไม่พบประกาศงาน
//           </p>
//           <p className="text-xs mt-1" style={{ color: "#5a7a99" }}>
//             ลองเปลี่ยนคำค้นหาหรือตัวกรอง
//           </p>
//         </div>
//       )}
//       {filtered.map((job) => {
//         const { bg, text } = STATUS_COLOR[job.status];
//         const jobIdNum = Number(job.id);
//         const applied = currentUser?.appliedJobs?.includes(jobIdNum) ?? false;
//         const canApply = job.status === "OPEN" && !applied;

//         return (
//           <div
//             key={job.id}
//             className="rounded-2xl shadow-sm overflow-hidden"
//             style={{ backgroundColor: EGG }}
//           >
//             {job.isHighlighted && (
//               <div
//                 className="px-4 py-1.5 flex items-center gap-1.5"
//                 style={{
//                   background: `linear-gradient(90deg, ${ROSE}22 0%, transparent 100%)`,
//                 }}
//               >
//                 <Zap size={11} style={{ color: ROSE }} />
//                 <span className="text-[10px] font-bold" style={{ color: ROSE }}>
//                   ด่วน
//                 </span>
//               </div>
//             )}
//             <div className="px-4 pb-4 pt-2">
//               <div className="flex items-start justify-between gap-2 mb-2">
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center gap-1.5 mb-0.5">
//                     <MapPin size={12} style={{ color: STEEL }} />
//                     <p
//                       className="text-sm font-bold truncate"
//                       style={{ color: P }}
//                     >
//                       {job.location}
//                     </p>
//                   </div>
//                   <div className="flex items-center gap-1.5">
//                     <Stethoscope size={12} style={{ color: "#5a7a99" }} />
//                     <p
//                       className="text-xs truncate"
//                       style={{ color: "#5a7a99" }}
//                     >
//                       {job.aboutWard}
//                     </p>
//                   </div>
//                 </div>
//                 <span
//                   className="text-xs font-bold px-2.5 py-1 rounded-full shrink-0"
//                   style={{ backgroundColor: bg, color: text }}
//                 >
//                   {STATUS_LABEL[job.status]}
//                 </span>
//               </div>

//               <p
//                 className="text-xs leading-relaxed line-clamp-2 mb-3"
//                 style={{ color: "#5a7a99" }}
//               >
//                 {job.description}
//               </p>

//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <div>
//                     <p className="text-base font-bold" style={{ color: ROSE }}>
//                       ฿{job.compensation.toLocaleString("th-TH")}
//                     </p>
//                     <p className="text-[10px]" style={{ color: "#5a7a99" }}>
//                       ต่อเวร
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-sm font-bold" style={{ color: STEEL }}>
//                       {job.applicants?.length ?? 0}/{job.maxApplicants}
//                     </p>
//                     <p className="text-[10px]" style={{ color: "#5a7a99" }}>
//                       ผู้สมัคร
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex gap-2">
//                   {isAdmin && (
//                     <>
//                       <button
//                         onClick={() => setEditJob(job)}
//                         className="p-2 rounded-xl"
//                         style={{
//                           backgroundColor: STEEL + "15",
//                           color: STEEL,
//                         }}
//                       >
//                         <Edit2 size={14} />
//                       </button>
//                       <button
//                         onClick={() => deleteJob(Number(job.id))}
//                         className="p-2 rounded-xl"
//                         style={{ backgroundColor: ROSE + "15", color: ROSE }}
//                       >
//                         <Trash2 size={14} />
//                       </button>
//                     </>
//                   )}
//                   <button
//                     onClick={() => setDetailJob(job)}
//                     className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
//                     style={{
//                       backgroundColor: canApply
//                         ? ROSE
//                         : applied
//                           ? LIME
//                           : "#f0f0f0",
//                       color: canApply ? "white" : applied ? P : "#888",
//                     }}
//                   >
//                     {applied ? (
//                       <>
//                         <Check size={13} />
//                         สมัครแล้ว
//                       </>
//                     ) : canApply ? (
//                       "สมัคร"
//                     ) : (
//                       <>
//                         <ChevronRight size={13} />
//                         ดูรายละเอียด
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }
