// components/Common/TableSkeleton.jsx
import React from "react";

const TableSkeleton = ({ rows = 5, columns = 6, showHeader = true }) => {
  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="bg-white shadow-md rounded-lg p-4">
        {/* Skeleton Header */}
        {showHeader && (
          <div className="mb-6">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/6 animate-pulse"></div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            {/* Skeleton Table Header */}
            <thead className="bg-gray-800">
              <tr>
                {[...Array(columns)].map((_, index) => (
                  <th key={index} className="py-3 px-4 text-left">
                    <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {/* Skeleton Rows */}
              {[...Array(rows)].map((_, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={
                    rowIndex % 2 === 0 ? "border-b" : "border-b bg-gray-50"
                  }
                >
                  {/* First column - Task */}
                  <td className="py-4 px-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4 mt-2 animate-pulse"></div>
                  </td>

                  {/* Second column - Description */}
                  <td className="py-4 px-4">
                    <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded mt-1 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3 mt-1 animate-pulse"></div>
                  </td>

                  {/* Third column - Priority */}
                  <td className="py-4 px-4">
                    <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse"></div>
                  </td>

                  {/* Fourth column - Status */}
                  <td className="py-4 px-4">
                    <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse"></div>
                  </td>

                  {/* Fifth column - Created */}
                  <td className="py-4 px-4">
                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                  </td>

                  {/* Sixth column - Actions */}
                  <td className="py-4 px-4">
                    <div className="flex gap-2">
                      <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default TableSkeleton;
