import { useState, useEffect } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import UsersView from './UsersView';

const UsersContainer = () => {
    const [dataUsers, setDataUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [error, setError] = useState(null); // Para manejar errores

    const getDataUsers = async () => {
        try {
            const response = await fetch("http://localhost:5000/users", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                    "Content-Type": "application/json"
                },
            });
    
            // Verifica el código de estado HTTP
            if (!response.ok) {
                console.error("Código de estado:", response.status);
                const errorDetails = await response.text(); // Obtener el contenido como texto
                console.error("Detalles del error:", errorDetails); // Mostrar detalles como texto
                throw new Error(`Hubo un error en la petición: ${response.statusText}`);
            }
    
            const results = await response.json();
            setDataUsers(results);
    
        } catch (error) {
            console.error("Hubo un error en la API:", error);
            setError(error.message); // Establecer el mensaje de error
        } finally {
            setLoadingUsers(false);
        }
    };
    
    

    useEffect(() => {
        getDataUsers();
    }, []);

    return (
        <div>
            {loadingUsers ? (
                <ProgressSpinner />
            ) : error ? (
                <div>{`Error: ${error}`}</div> // Muestra el error si hay
            ) : (
                <UsersView dataUsers={dataUsers} />
            )}
        </div>
    );
};

export default UsersContainer;
