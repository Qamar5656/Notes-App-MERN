import React from "react";

const Table = () => {
  return (
    <>
      {/* Table / Records */}
      <main className="flex-1 overflow-auto p-6">
        <div className="bg-white shadow-md rounded-lg p-4">
          {/* Example Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="py-2 px-4 text-left">Title</th>
                  <th className="py-2 px-4 text-left">Description</th>
                  <th className="py-2 px-4 text-left">Created By</th>
                  <th className="py-2 px-4 text-left">Updated</th>
                  <th className="py-2 px-4 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 px-4">Dashboard Layout</td>
                  <td className="py-2 px-4">Complete the main dashboard UI</td>
                  <td className="py-2 px-4">John Doe</td>
                  <td className="py-2 px-4">2025-12-10</td>
                  <td className="py-2 px-4">Edit / Delete</td>
                </tr>
                <tr className="border-b bg-gray-50">
                  <td className="py-2 px-4">API Endpoints</td>
                  <td className="py-2 px-4">Write backend API routes</td>
                  <td className="py-2 px-4">Jane Smith</td>
                  <td className="py-2 px-4">2025-12-12</td>
                  <td className="py-2 px-4">Edit / Delete</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4">User Authentication</td>
                  <td className="py-2 px-4">
                    Implement login/logout functionality
                  </td>
                  <td className="py-2 px-4">Alice Brown</td>
                  <td className="py-2 px-4">2025-12-14</td>
                  <td className="py-2 px-4">Edit / Delete</td>
                </tr>
                <tr className="border-b bg-gray-50">
                  <td className="py-2 px-4">Sidebar Component</td>
                  <td className="py-2 px-4">
                    Build collapsible sidebar with icons
                  </td>
                  <td className="py-2 px-4">Bob Lee</td>
                  <td className="py-2 px-4">2025-12-15</td>
                  <td className="py-2 px-4">Edit / Delete</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
};

export default Table;
