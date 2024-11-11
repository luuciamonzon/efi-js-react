import { useState, useEffect } from "react";
import UsersView from "./UsersView";
import { ProgressSpinner } from "primereact/progressspinner";

const UserContainer = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const isAdmin = JSON.parse(localStorage.getItem("isAdmin"));

  // Fetch users desde la API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://127.0.0.1:5000/users", {
        headers: {
          Authorization: token,
        },
      });
      const data = await response.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Se ejecuta al cargar el componente para obtener los usuarios
  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  return (
    <div className="container">

      {/* Solo mostrar la lista de usuarios si estamos en el modo de visualización */}
      {isAdmin ? (
        <>
          {loading ? (
            <ProgressSpinner />
          ) : (
            <UsersView dataUsers={users} />
          )}
        </>
      ) : (
        <p>No tienes permisos para gestionar usuarios.</p>
      )}
    </div>
  );
};

export default UserContainer;
