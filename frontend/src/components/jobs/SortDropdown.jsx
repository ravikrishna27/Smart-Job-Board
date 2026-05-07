export default function SortDropdown({ sortBy, onSortChange }) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort" className="text-sm font-medium text-gray-700 whitespace-nowrap">
        Sort by:
      </label>
      <select
        id="sort"
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className="border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none cursor-pointer bg-white"
      >
        <option value="newest">Newest First</option>
        <option value="highest_salary">Highest Salary</option>
        <option value="relevant">Most Relevant</option>
      </select>
    </div>
  );
}
