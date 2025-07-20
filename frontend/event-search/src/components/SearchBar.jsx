import { useState } from "react";
import { Combobox } from "@headlessui/react";
import { toast } from "react-hot-toast";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Allow submission if at least one field is filled
    if (!query && !startTime && !endTime) {
      return toast.error("Please provide at least one field (query, start, or end)");
    }

    onSearch({
      searchTerm: query,
      startTime,
      endTime,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex flex-col md:flex-row justify-center gap-4"
    >
      {/* Search Query Input */}
      <div className="relative w-full max-w-md">
        <Combobox>
          <Combobox.Input
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 p-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search by IP or field (e.g., dstaddr=24.57.123.131)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </Combobox>
      </div>

      {/* Start Time Input */}
      <input
        type="number"
        className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 p-3 rounded-xl shadow-sm w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Start time (epoch)"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
      />

      {/* End Time Input */}
      <input
        type="number"
        className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 p-3 rounded-xl shadow-sm w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="End time (epoch)"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
      />

      {/* Submit Button */}
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
      >
        Search
      </button>
    </form>
  );
}
