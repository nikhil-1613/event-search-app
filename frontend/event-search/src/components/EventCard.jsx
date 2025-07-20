import { motion } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaClock,
  FaFileAlt,
  FaCheck,
  FaTimes,
  FaHourglassHalf,
  FaBolt,
  FaNetworkWired,
  FaExchangeAlt,
  FaDatabase,
} from "react-icons/fa";

export default function EventCard({ event }) {
  const {
    source_ip,
    destination_ip,
    start_time,
    end_time,
    status,
    action,
    filename,
    interface_id,
    packets,
    bytes,
  } = event;

  const start = Number(start_time);
  const end = Number(end_time);
  const duration = end - start;

  const statusColor =
    status === "REJECT"
      ? "from-red-500 to-red-700"
      : "from-emerald-500 to-emerald-700";

  const statusIcon =
    status === "REJECT" ? (
      <FaTimes className="inline ml-1" />
    ) : (
      <FaCheck className="inline ml-1" />
    );

  // Format date and time separately
  const formatDate = (timestamp) =>
    new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  const formatTime = (timestamp) =>
    new Date(timestamp * 1000).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

  const startDate = start_time ? formatDate(start) : null;
  const startTime = start_time ? formatTime(start) : null;
  const endDate = end_time ? formatDate(end) : null;
  const endTime = end_time ? formatTime(end) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-zinc-900 dark:border-zinc-700 border border-gray-200 shadow-lg rounded-2xl p-6 w-full max-w-sm hover:shadow-2xl transition-all duration-300 group"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-extrabold text-gray-800 dark:text-white flex items-center gap-2">
          <FaBolt className="text-yellow-500 animate-pulse" />
          Event
        </h2>
        <span
          className={`text-xs font-bold text-white px-3 py-1 rounded-full bg-gradient-to-r ${statusColor}`}
        >
          {status} {statusIcon}
        </span>
      </div>

      {/* Body */}
      <div className="space-y-3 text-sm text-gray-700 dark:text-gray-200">
        {source_ip && (
          <p className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-blue-500" />
            <strong>Source:</strong> {source_ip}
          </p>
        )}
        {destination_ip && (
          <p className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-purple-500" />
            <strong>Destination:</strong> {destination_ip}
          </p>
        )}
        {startDate && (
          <p className="flex items-center gap-2">
            <FaClock className="text-green-400" />
            <strong>Start Date:</strong> {startDate}
          </p>
        )}
        {startTime && (
          <p className="flex items-center gap-2">
            <FaClock className="text-green-400" />
            <strong>Start Time:</strong> {startTime}
          </p>
        )}
        {endDate && (
          <p className="flex items-center gap-2">
            <FaClock className="text-red-400" />
            <strong>End Date:</strong> {endDate}
          </p>
        )}
        {endTime && (
          <p className="flex items-center gap-2">
            <FaClock className="text-red-400" />
            <strong>End Time:</strong> {endTime}
          </p>
        )}
        {start_time && end_time && (
          <p className="flex items-center gap-2">
            <FaHourglassHalf className="text-orange-400" />
            <strong>Duration:</strong> {duration} seconds
          </p>
        )}
        {action && (
          <p className="flex items-center gap-2">
            <FaExchangeAlt className="text-indigo-400" />
            <strong>Action:</strong> {action}
          </p>
        )}
        {interface_id && (
          <p className="flex items-center gap-2">
            <FaNetworkWired className="text-pink-400" />
            <strong>Interface:</strong> {interface_id}
          </p>
        )}
        {packets && (
          <p className="flex items-center gap-2">
            <FaDatabase className="text-blue-400" />
            <strong>Packets:</strong> {packets}
          </p>
        )}
        {bytes && (
          <p className="flex items-center gap-2">
            <FaDatabase className="text-teal-400" />
            <strong>Bytes:</strong> {bytes}
          </p>
        )}
        {filename && (
          <p className="flex items-center gap-2">
            <FaFileAlt className="text-gray-500 dark:text-gray-300" />
            <strong>Filename:</strong> {filename}
          </p>
        )}
      </div>
    </motion.div>
  );
}
// import { motion } from "framer-motion";
// import {
//   FaMapMarkerAlt,
//   FaClock,
//   FaFileAlt,
//   FaCheck,
//   FaTimes,
//   FaHourglassHalf,
//   FaBolt,
//   FaNetworkWired,
//   FaExchangeAlt,
//   FaDatabase,
// } from "react-icons/fa";

// export default function EventCard({ event }) {
//   const {
//     source_ip,
//     destination_ip,
//     start_time,
//     end_time,
//     status,
//     action,
//     filename,
//     interface_id,
//     packets,
//     bytes,
//   } = event;

//   const start = Number(start_time);
//   const end = Number(end_time);
//   const duration = end - start;

//   const statusColor =
//     status === "REJECT"
//       ? "from-red-500 to-red-700"
//       : "from-emerald-500 to-emerald-700";

//   const statusIcon =
//     status === "REJECT" ? (
//       <FaTimes className="inline ml-1" />
//     ) : (
//       <FaCheck className="inline ml-1" />
//     );

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 30 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.4 }}
//       className="bg-white dark:bg-zinc-900 dark:border-zinc-700 border border-gray-200 shadow-lg rounded-2xl p-6 w-full max-w-sm hover:shadow-2xl transition-all duration-300 group"
//     >
//       {/* Header */}
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg font-extrabold text-gray-800 dark:text-white flex items-center gap-2">
//           <FaBolt className="text-yellow-500 animate-pulse" />
//           Event
//         </h2>
//         <span
//           className={`text-xs font-bold text-white px-3 py-1 rounded-full bg-gradient-to-r ${statusColor}`}
//         >
//           {status} {statusIcon}
//         </span>
//       </div>

//       {/* Body */}
//       <div className="space-y-3 text-sm text-gray-700 dark:text-gray-200">
//         {source_ip && (
//           <p className="flex items-center gap-2">
//             <FaMapMarkerAlt className="text-blue-500" />
//             <strong>Source:</strong> {source_ip}
//           </p>
//         )}
//         {destination_ip && (
//           <p className="flex items-center gap-2">
//             <FaMapMarkerAlt className="text-purple-500" />
//             <strong>Destination:</strong> {destination_ip}
//           </p>
//         )}
//         {start_time && (
//           <p className="flex items-center gap-2">
//             <FaClock className="text-green-400" />
//             <strong>Start:</strong> {new Date(start * 1000).toLocaleString()}
//           </p>
//         )}
//         {end_time && (
//           <p className="flex items-center gap-2">
//             <FaClock className="text-red-400" />
//             <strong>End:</strong> {new Date(end * 1000).toLocaleString()}
//           </p>
//         )}
//         {start_time && end_time && (
//           <p className="flex items-center gap-2">
//             <FaHourglassHalf className="text-orange-400" />
//             <strong>Duration:</strong> {duration} seconds
//           </p>
//         )}
//         {action && (
//           <p className="flex items-center gap-2">
//             <FaExchangeAlt className="text-indigo-400" />
//             <strong>Action:</strong> {action}
//           </p>
//         )}
//         {interface_id && (
//           <p className="flex items-center gap-2">
//             <FaNetworkWired className="text-pink-400" />
//             <strong>Interface:</strong> {interface_id}
//           </p>
//         )}
//         {packets && (
//           <p className="flex items-center gap-2">
//             <FaDatabase className="text-blue-400" />
//             <strong>Packets:</strong> {packets}
//           </p>
//         )}
//         {bytes && (
//           <p className="flex items-center gap-2">
//             <FaDatabase className="text-teal-400" />
//             <strong>Bytes:</strong> {bytes}
//           </p>
//         )}
//         {filename && (
//           <p className="flex items-center gap-2">
//             <FaFileAlt className="text-gray-500 dark:text-gray-300" />
//             <strong>Filename:</strong> {filename}
//           </p>
//         )}
//       </div>
//     </motion.div>
//   );
// }
