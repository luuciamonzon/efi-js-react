import { Fragment } from "react"
import { ProgressSpinner } from "primereact/progressspinner"

const UsersView = ({ loadingUsers, dataUsers }) => {
    return (
        <Fragment>  
            {loadingUsers ?
                <ProgressSpinner />
                :
                dataUsers.map((user) => (
                    <div key={user.id}>
                        <h3>Nombre: {user.username}</h3>
                    </div>
                ))
            }
        </Fragment>
    )
}
export default UsersView