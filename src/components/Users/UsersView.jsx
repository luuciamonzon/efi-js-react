const UsersView = ({ dataUsers }) => {
    return (
      <div>
        <h4>Lista de Usuarios</h4>
        <table className="p-datatable p-datatable-responsive">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Rol</th>
            </tr>
          </thead>
          <tbody>
            {dataUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.is_admin ? "Administrador" : "Usuario"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default UsersView;
  