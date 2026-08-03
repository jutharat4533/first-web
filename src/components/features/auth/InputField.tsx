// 'use client';

// import { P, STEEL } from "@/styles/theme";

// export default function InputField({
//   label,
//   type = "text",
//   value,
//   onChange,
//   placeholder,
//   suffix,
// }: {
//   label?: string;
//   type?: string;
//   value?: string;
//   onChange?: (v: string) => void;
//   placeholder?: string;
//   suffix?: React.ReactNode;
// }) {
//   return (
//     <div className="space-y-1">
//       <label className="text-xs font-semibold" style={{ color: "#5a7a99" }}>
//         {label}
//       </label>
//       <div className="relative">
//         <input
//           type={type}
//           value={value}
//           onChange={(e) => (onChange ? e.target.value)}
//           placeholder={placeholder}
//           className="w-full px-4 py-3 rounded-2xl text-sm outline-none border-2 transition-colors"
//           style={{
//             borderColor: "rgba(3,29,68,0.12)",
//             backgroundColor: "#f8fafc",
//             color: P,
//             paddingRight: suffix ? "3rem" : undefined,
//           }}
//           onFocus={(e) => (e.currentTarget.style.borderColor = STEEL)}
//           onBlur={(e) =>
//             (e.currentTarget.style.borderColor = "rgba(3,29,68,0.12)")
//           }
//         />
//         {suffix && (
//           <div className="absolute right-3 top-1/2 -translate-y-1/2">
//             {suffix}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
