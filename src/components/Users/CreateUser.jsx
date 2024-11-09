// import { Formik } from "formik";
// import { useState, useEffect } from "react";
// import * as Yup from 'yup';
// import { Button } from 'primereact/button';
// import { useNavigate } from "react-router-dom"; // Para redirigir si no es admin

// const CreateUser = () => {
//   const [users, setUsers] = useState([]);
//   const [editing, setEditing] = useState(null);
//   const [message, setMessage] = useState("");
//   const token = localStorage.getItem("token");
//   const userRole = localStorage.getItem("userRole"); // Suponiendo que el rol se guarda aquí

//   const navigate = useNavigate();

//   // Verificar si el usuario tiene permisos de administrador
//   useEffect(() => {
//     if (userRole !== "admin") {
//       setMessage("No estás autorizado para gestionar usuarios.");
//     } else {
//       fetchUsers();
//     }
//   }, [userRole]);

//   const ValidationSchema = Yup.object().shape({
//     username: Yup.string()
//       .required('Este campo es requerido')
//       .max(50, 'El username no debe ser mayor a 50 caracteres'),
//     password: Yup.string()
//       .required('Este campo es requerido')
//       .max(50, 'La contraseña no debe ser mayor a 50 caracteres'),
//     admin: Yup.number()
//       .required('Este campo es requerido')
//       .oneOf([0, 1], 'Debe ser 1 para admin o 0 para usuario')
//   });

//   const fetchUsers = async () => {
//     try {
//       const response = await fetch('http://127.0.0.1:5000/users', {
//         headers: { 'Authorization': ` ${token}` },
//       });
//       const data = await response.json();
//       setUsers(Array.isArray(data) ? data : []);
//     } catch (error) {
//       console.error("Error fetching users:", error);
//       setUsers([]);
//     }
//   };

//   const RegisterUser = async (values, { resetForm }) => {
//     const bodyRegisterUser = {
//       username: values.username,
//       password: values.password,
//       is_admin: parseInt(values.admin),
//     };
//     const url = editing 
//       ? `http://127.0.0.1:5000/users/${editing}/update` 
//       : 'http://127.0.0.1:5000/users';

//     const method = editing ? 'PUT' : 'POST'; 

//     const response = await fetch(url, {
//       method,
//       body: JSON.stringify(bodyRegisterUser),
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': ` ${token}`
//       }
//     });

//     if (response.ok) {
//       fetchUsers();
//       resetForm();
//       setEditing(null);
//       setMessage("Usuario guardado exitosamente.");
//     } else {
//       setMessage("Error al guardar el usuario.");
//     }
//   };

//   const handleEditar = (id) => {
//     const userToEdit = users.find(user => user.id === id);
//     if (userToEdit) {
//       setEditing(userToEdit.id);
//     }
//   };

//   const handleEliminar = async (id) => {
//     try {
//       const response = await fetch(`http://127.0.0.1:5000/users/${id}/delete`, {
//         method: "DELETE",
//         headers: { 'Authorization': ` ${token}` },
//       });
      
//       if (!response.ok) throw new Error("Error al eliminar el usuario");
      
//       fetchUsers();
//       setMessage("Usuario eliminado exitosamente.");
//     } catch (error) {
//       console.error(error);
//       setMessage("Error al eliminar el usuario.");
//     }
//   };

//   return (
//     <div className="container">
//       <h4>{editing ? "Editar Usuario" : "Crear Nuevo Usuario"}</h4>
      
//       {/* Mostrar solo el mensaje si el usuario no es admin */}
//       {userRole !== "admin" && message && (
//         <div className="alert alert-warning">
//           {message}
//         </div>
//       )}

//       {/* Solo renderizar formulario si el usuario es admin */}
//       {userRole === "admin" && (
//         <Formik
//           enableReinitialize
//           initialValues={{
//             username: editing ? users.find(user => user.id === editing)?.username : '',
//             password: '',
//             admin: 0,  // Aseguramos que el valor por defecto para admin sea 0
//           }}
//           validationSchema={ValidationSchema}
//           onSubmit={RegisterUser}
//         >
//           {({
//             values,
//             errors,
//             touched,
//             handleChange,
//             handleBlur,
//             handleSubmit,
//             isValid
//           }) => (
//             <form onSubmit={handleSubmit}>
//               <div>
//                 <input
//                   type="text"
//                   name="username"
//                   placeholder="Username"
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   value={values.username}
//                 />
//                 {errors.username && touched.username && (
//                   <div className="text-danger">{errors.username}</div>
//                 )}
//               </div>
//               <div>
//                 <input
//                   type="password"
//                   name="password"
//                   placeholder="Contraseña"
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   value={values.password}
//                 />
//                 {errors.password && touched.password && (
//                   <div className="text-danger">{errors.password}</div>
//                 )}
//               </div>
//               <div>
//                 <select
//                   name="admin"
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   value={values.admin}
//                 >
//                   <option value={0}>Usuario</option>
//                   <option value={1}>Administrador</option>
//                 </select>
//                 {errors.admin && touched.admin && (
//                   <div className="text-danger">{errors.admin}</div>
//                 )}
//               </div>
//               <Button 
//                 label={editing ? "Actualizar Usuario" : "Crear Usuario"} 
//                 icon="pi pi-check" 
//                 type="submit" 
//                 disabled={!isValid} 
//                 className="p-button-success" 
//               />
//             </form>
//           )}
//         </Formik>
//       )}

//       {message && userRole === "admin" && (
//         <div className="alert alert-info mt-3">{message}</div>
//       )}

//       <h4>Lista de Usuarios</h4>
//       <ul>
//         {users.map(user => (
//           <li key={user.id}>
//             <span>{user.username} - {user.is_admin ? "Admin" : "Usuario"}</span>
//             <Button 
//               icon="pi pi-pencil" 
//               className="p-button-warning p-button-sm me-2" 
//               onClick={() => handleEditar(user.id)} 
//               label="Editar" 
//             />
//             <Button 
//               icon="pi pi-trash" 
//               className="p-button-danger p-button-sm" 
//               onClick={() => handleEliminar(user.id)} 
//               label="Eliminar" 
//             />
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default CreateUser;

import { useState, useEffect } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Button } from "primereact/button";

const CreateUser = () => {
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");
  const isAdmin = JSON.parse(localStorage.getItem("isAdmin"));

  useEffect(() => {
    console.log("isAdmin:", isAdmin);  // Verificar el valor de isAdmin
    console.log("token:", token);  // Verificar si el token es válido
    if (isAdmin && token) {
      fetchUsers();
    }
  }, [isAdmin, token]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/users", {
        headers: { Authorization: token },
      });

      const data = await response.json();
      console.log("Datos recibidos:", data); // Verificar los datos

      if (data && Array.isArray(data.users)) {
        setUsers(data.users);
      } else {
        setMessage("No se encontraron usuarios.");
      }
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      setMessage("Error al cargar usuarios.");
    }
  };

  const handleGuardar = async (values, { resetForm }) => {
    try {
      const url = editing
        ? `http://127.0.0.1:5000/user/${editing}/editar`
        : "http://127.0.0.1:5000/users";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Error al guardar el usuario");
      }

      setEditing(null);
      fetchUsers(); // Recargar la lista de usuarios después de crear o editar
      resetForm();
      setMessage("Usuario guardado exitosamente.");
    } catch (error) {
      setMessage("Error al guardar el usuario.");
    }
  };

  const handleEliminar = async (userId) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/user/${userId}/eliminar`, {
        method: "DELETE",
        headers: { Authorization: token },
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el usuario");
      }

      fetchUsers(); // Recargar la lista de usuarios después de eliminar
      setMessage("Usuario eliminado exitosamente.");
    } catch (error) {
      setMessage("Error al eliminar el usuario.");
    }
  };

  if (isAdmin === null || token === null) {
    return <div>Verificando permisos...</div>;
  }

  if (isAdmin === false) {
    return <div>No tienes permisos para gestionar usuarios.</div>;
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <h4>{editing ? "Editar Usuario" : "Crear un Nuevo Usuario"}</h4>
          <Formik
            enableReinitialize
            initialValues={{
              username: editing ? users.find((user) => user.id === editing)?.username : "",
              password: "",
            }}
            validationSchema={Yup.object({
              username: Yup.string().required("Campo requerido"),
              password: Yup.string().required("Campo requerido"),
            })}
            onSubmit={handleGuardar}
          >
            {({ values, handleChange, handleBlur, handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    type="text"
                    name="username"
                    className="form-control"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.username}
                    placeholder="Nombre de Usuario"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                    placeholder="Contraseña"
                  />
                </div>
                <Button label={editing ? "Actualizar" : "Guardar"} type="submit" />
              </form>
            )}
          </Formik>
        </div>
        <div className="col-md-6">
          <h4>Lista de Usuarios</h4>
          <ul className="list-group">
            {users && users.length > 0 ? (
              users.map((user) => (
                <li key={user.id} className="list-group-item">
                  <span>{user.username}</span>
                  <Button label="Editar" onClick={() => setEditing(user.id)} />
                  <Button
                    label="Eliminar"
                    className="ml-2"
                    onClick={() => handleEliminar(user.id)}
                  />
                </li>
              ))
            ) : (
              <li className="list-group-item">No hay usuarios disponibles.</li>
            )}
          </ul>
          {message && <div className="alert alert-info">{message}</div>}
        </div>
      </div>
    </div>
  );
};

export default CreateUser;

