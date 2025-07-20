import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import SearchBar from "../components/SearchBar";
import EventCard from "../components/EventCard";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    page_size: 12, // Match backend
    total_pages: 1,
    total_matches: 0,
  });
  const [lastSearch, setLastSearch] = useState({});
  const [statusFilter, setStatusFilter] = useState({
    accept: true,
    reject: true,
  });
  const [isFiltering, setIsFiltering] = useState(false); // Loader for status filtering

  // Persist dark mode
  useEffect(() => {
    const savedTheme = localStorage.getItem("dark-mode");
    setDarkMode(savedTheme === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("dark-mode", darkMode);
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // Fetch events with React Query
  const fetchEvents = async ({ searchTerm, startTime, endTime, page }) => {
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (startTime) params.start = startTime;
    if (endTime) params.end = endTime;
    params.page = page;
    params.page_size = pagination.page_size;

    if (!params.search && !params.start && !params.end) {
      throw new Error("At least one of search term, start time, or end time is required");
    }

    const response = await axios.get("/api/search/", { params });
    return response.data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["events", lastSearch, pagination.page],
    queryFn: () => fetchEvents({ ...lastSearch, page: pagination.page }),
    enabled: !!lastSearch.searchTerm || !!lastSearch.startTime || !!lastSearch.endTime,
    keepPreviousData: true,
  });

  // Handle search
  const handleSearch = (params, page = 1) => {
    setLastSearch(params);
    setPagination((prev) => ({ ...prev, page }));
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.total_pages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  // Handle status filter changes
  const handleStatusChange = (status) => {
    setIsFiltering(true); // Show loader
    toast.loading(`Filtering by ${status}...`); // Show loading toast
    setTimeout(() => {
      setStatusFilter((prev) => ({ ...prev, [status]: !prev[status] }));
      setIsFiltering(false); // Hide loader
      toast.dismiss(); // Dismiss loading toast
      toast.success(`Filtered to ${status} events`); // Success toast
    }, 500); // Simulate filtering delay (adjust as needed)
  };

  // Memoize filtered events
  const filteredEvents = useMemo(() => {
    if (!data?.results) return [];
    if (isFiltering) return []; // Show no events while filtering
    if (statusFilter.accept && statusFilter.reject) return data.results;
    return data.results.filter((event) =>
      (statusFilter.accept && event.status === "ACCEPT") || (statusFilter.reject && event.status === "REJECT")
    );
  }, [data?.results, statusFilter, isFiltering]);

  // Update pagination and toast on data change
  useEffect(() => {
    if (data) {
      setPagination((prev) => ({
        ...prev,
        page_size: data.summary.page_size,
        total_pages: data.summary.total_pages,
        total_matches: data.summary.matches,
      }));
      if (data.results.length > 0) {
        toast.success(`✨ Found ${data.results.length} result(s) (out of ${data.summary.matches})`);
      } else {
        toast("No events matched your search.", { icon: "🔍" });
      }
    }
    if (error) {
      toast.error(`Error fetching data: ${error.message || "Unknown error"}`);
    }
  }, [data, error]);

  return (
    <div className="min-h-screen px-6 py-10 transition duration-300 bg-gray-50 dark:bg-gray-900 dark:text-white">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-gray-800 dark:text-white">
          Event Explorer
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Search historical IP events in style
        </p>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="mt-4 px-4 py-2 text-sm rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white transition"
        >
          {darkMode ? "🌙 Dark Mode On" : "☀️ Light Mode On"}
        </button>
      </div>

      {/* Search */}
      <div className="max-w-3xl mx-auto">
        <SearchBar onSearch={(params) => handleSearch(params, 1)} />
      </div>

      {/* Status Filters */}
      <div className="max-w-3xl mx-auto mt-4 flex gap-4 justify-center">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={statusFilter.accept}
            onChange={() => handleStatusChange("accept")}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span>ACCEPT</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={statusFilter.reject}
            onChange={() => handleStatusChange("reject")}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span>REJECT</span>
        </label>
      </div>

      {/* Filtering Loader */}
      {isFiltering && (
        <div className="mt-16 flex justify-center">
          <LoadingSpinner />
        </div>
      )}

      {/* Data Loading Spinner */}
      {isLoading && !isFiltering && (
        <div className="mt-16 flex justify-center">
          <LoadingSpinner />
        </div>
      )}

      {/* Event Results */}
      {!isLoading && !isFiltering && filteredEvents.length > 0 && (
        <div className="mt-12">
          <div className="text-center mb-4 text-gray-600 dark:text-gray-300">
            Showing {filteredEvents.length} of {pagination.total_matches} results (Page {pagination.page} of {pagination.total_pages})
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event, idx) => (
              <EventCard key={idx} event={event} />
            ))}
          </div>
          {/* Pagination Controls */}
          <div className="mt-6 flex justify-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-3 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:opacity-50"
            >
              Prev
            </button>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.total_pages}
              className="px-3 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* No Results */}
      {!isLoading && !isFiltering && filteredEvents.length === 0 && (
        <div className="mt-16 text-center text-gray-400 dark:text-gray-500 text-sm">
          🔎 Try searching for something like <code>dstaddr=1.2.3.4</code>
        </div>
      )}
    </div>
  );
}
// import { useState, useEffect, useMemo } from "react";
// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";
// import SearchBar from "../components/SearchBar";
// import EventCard from "../components/EventCard";
// import LoadingSpinner from "../components/LoadingSpinner";
// import toast from "react-hot-toast";

// export default function Home() {
//   const [darkMode, setDarkMode] = useState(false);
//   const [pagination, setPagination] = useState({
//     page: 1,
//     page_size: 12, // Match backend
//     total_pages: 1,
//     total_matches: 0,
//   });
//   const [lastSearch, setLastSearch] = useState({});
//   const [statusFilter, setStatusFilter] = useState({
//     accept: true,
//     reject: true,
//   });

//   // Persist dark mode
//   useEffect(() => {
//     const savedTheme = localStorage.getItem("dark-mode");
//     setDarkMode(savedTheme === "true");
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("dark-mode", darkMode);
//     document.documentElement.classList.toggle("dark", darkMode);
//   }, [darkMode]);

//   // Fetch events with React Query
//   const fetchEvents = async ({ searchTerm, startTime, endTime, page }) => {
//     const params = {};
//     if (searchTerm) params.search = searchTerm;
//     if (startTime) params.start = startTime;
//     if (endTime) params.end = endTime;
//     params.page = page;
//     params.page_size = pagination.page_size;

//     if (!params.search && !params.start && !params.end) {
//       throw new Error("At least one of search term, start time, or end time is required");
//     }

//     const response = await axios.get("http://127.0.0.1:8000/api/search/", { params });
//     return response.data;
//   };

//   const { data, isLoading, error } = useQuery({
//     queryKey: ["events", lastSearch, pagination.page],
//     queryFn: () => fetchEvents({ ...lastSearch, page: pagination.page }),
//     enabled: !!lastSearch.searchTerm || !!lastSearch.startTime || !!lastSearch.endTime,
//     keepPreviousData: true,
//   });

//   // Handle search
//   const handleSearch = (params, page = 1) => {
//     setLastSearch(params);
//     setPagination((prev) => ({ ...prev, page }));
//   };

//   // Handle pagination
//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= pagination.total_pages) {
//       setPagination((prev) => ({ ...prev, page: newPage }));
//     }
//   };

//   // Handle status filter changes
//   const handleStatusChange = (status) => {
//     setStatusFilter((prev) => ({ ...prev, [status]: !prev[status] }));
//   };

//   // Memoize filtered events
//   const filteredEvents = useMemo(() => {
//     if (!data?.results) return [];
//     if (statusFilter.accept && statusFilter.reject) return data.results;
//     return data.results.filter((event) =>
//       statusFilter.accept && event.status === "ACCEPT" ? true : statusFilter.reject && event.status === "REJECT"
//     );
//   }, [data?.results, statusFilter]);

//   // Update pagination and toast on data change
//   useEffect(() => {
//     if (data) {
//       setPagination((prev) => ({
//         ...prev,
//         page_size: data.summary.page_size,
//         total_pages: data.summary.total_pages,
//         total_matches: data.summary.matches,
//       }));
//       if (data.results.length > 0) {
//         toast.success(`✨ Found ${data.results.length} result(s) (out of ${data.summary.matches})`);
//       } else {
//         toast("No events matched your search.", { icon: "🔍" });
//       }
//     }
//     if (error) {
//       toast.error(`Error fetching data: ${error.message || "Unknown error"}`);
//     }
//   }, [data, error]);

//   return (
//     <div className="min-h-screen px-6 py-10 transition duration-300 bg-gray-50 dark:bg-gray-900 dark:text-white">
//       {/* Header */}
//       <div className="text-center mb-10">
//         <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-gray-800 dark:text-white">
//           Event Explorer
//         </h1>
//         <p className="text-gray-500 dark:text-gray-400 text-sm">
//           Search historical IP events in style
//         </p>
//         <button
//           onClick={() => setDarkMode(!darkMode)}
//           className="mt-4 px-4 py-2 text-sm rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white transition"
//         >
//           {darkMode ? "🌙 Dark Mode On" : "☀️ Light Mode On"}
//         </button>
//       </div>

//       {/* Search */}
//       <div className="max-w-3xl mx-auto">
//         <SearchBar onSearch={(params) => handleSearch(params, 1)} />
//       </div>

//       {/* Status Filters */}
//       <div className="max-w-3xl mx-auto mt-4 flex gap-4 justify-center">
//         <label className="flex items-center gap-2">
//           <input
//             type="checkbox"
//             checked={statusFilter.accept}
//             onChange={() => handleStatusChange("accept")}
//             className="form-checkbox h-5 w-5 text-blue-600"
//           />
//           <span>ACCEPT</span>
//         </label>
//         <label className="flex items-center gap-2">
//           <input
//             type="checkbox"
//             checked={statusFilter.reject}
//             onChange={() => handleStatusChange("reject")}
//             className="form-checkbox h-5 w-5 text-blue-600"
//           />
//           <span>REJECT</span>
//         </label>
//       </div>

//       {/* Loading Spinner */}
//       {isLoading && (
//         <div className="mt-16 flex justify-center">
//           <LoadingSpinner />
//         </div>
//       )}

//       {/* Event Results */}
//       {!isLoading && filteredEvents.length > 0 && (
//         <div className="mt-12">
//           <div className="text-center mb-4 text-gray-600 dark:text-gray-300">
//             Showing {filteredEvents.length} of {pagination.total_matches} results (Page {pagination.page} of {pagination.total_pages})
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filteredEvents.map((event, idx) => (
//               <EventCard key={idx} event={event} />
//             ))}
//           </div>
//           {/* Pagination Controls */}
//           <div className="mt-6 flex justify-center gap-4">
//             <button
//               onClick={() => handlePageChange(pagination.page - 1)}
//               disabled={pagination.page === 1}
//               className="px-4 py-2 text-sm rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:opacity-50"
//             >
//               Previous
//             </button>
//             <button
//               onClick={() => handlePageChange(pagination.page + 1)}
//               disabled={pagination.page === pagination.total_pages}
//               className="px-4 py-2 text-sm rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:opacity-50"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       )}

//       {/* No Results */}
//       {!isLoading && filteredEvents.length === 0 && (
//         <div className="mt-16 text-center text-gray-400 dark:text-gray-500 text-sm">
//           🔎 Try searching for something like <code>dstaddr=1.2.3.4</code>
//         </div>
//       )}
//     </div>
//   );
// }