import React from "react";

export default function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  itemName = "data"
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  if (totalPages <= 1) return null;

  // Generate page numbers to show (maximum 5 pages)
  const pages = [];
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + 4);

  if (endPage - startPage < 4) {
    startPage = Math.max(1, endPage - 4);
  }

  // Adjust startPage to not go below 1
  startPage = Math.max(1, startPage);

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-4 border-t border-gray-100 bg-white">
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">
          Menampilkan <span className="font-semibold text-gray-700">{indexOfFirstItem + 1}</span> -{" "}
          <span className="font-semibold text-gray-700">{Math.min(indexOfLastItem, totalItems)}</span> dari{" "}
          <span className="font-semibold text-gray-700">{totalItems}</span> {itemName}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Sebelumnya
        </button>
        {pages.map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`w-8 h-8 rounded-lg text-xs font-semibold flex items-center justify-center transition-all ${
              currentPage === pageNum
                ? "bg-[#2940D3] text-white shadow-sm font-bold"
                : "border border-gray-200 text-gray-600 hover:bg-gray-50 font-normal"
            }`}
          >
            {pageNum}
          </button>
        ))}
        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Berikutnya
        </button>
      </div>
    </div>
  );
}
