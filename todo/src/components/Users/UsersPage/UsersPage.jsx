import React, { useState, useEffect } from "react";
import SimpleForm from "./SimpleForm";
import UsersList from "./UsersList";
import {
  fetchUsers as fetchUsersAPI,
  deleteUser as deleteUserAPI,
  updateUser as updateUserAPI,
} from "../../api/users";

function UsersPage() {
  const [usersData, setUsersData] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetchUsersAPI();
      setUsersData(res.data.users);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUserAPI(id);
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const handleUpdateUser = async (id, updatedData) => {
    try {
      await updateUserAPI(id, updatedData);
      setEditingUser(null); // Hide the form
      fetchUsers(); // Refresh list
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-4">
      {/* Show form only when editing */}
      {editingUser && (
        <SimpleForm
          editingUser={editingUser}
          onUpdate={handleUpdateUser}
          onCancel={() => setEditingUser(null)}
        />
      )}

      <UsersList
        usersData={usersData}
        loadingUsers={loadingUsers}
        onDelete={handleDeleteUser}
        onEdit={(user) => setEditingUser(user)}
      />
    </div>
  );
}

export default UsersPage;
