function Login() {
    return (
        <form className="card">
            <h2>
                INICIAR SESIÓN
            </h2>

            <div className="inputs">
                <fieldset>
                    <legend>Datos de ingreso</legend>

                    <label htmlFor="nombre">Ingresa tus nombres</label>
                    <input
                        type="text"
                        placeholder="Nombre completo"
                        id="nombre"
                        required
                    />

                    <label htmlFor="email">Correo electrónico</label>
                    <input
                        type="email"
                        placeholder="Email"
                        id="email"
                        required
                    />

                    <label htmlFor="clave">Digite su contraseña</label>
                    <input
                        type="password"
                        id="clave"
                        required
                    />
                </fieldset>

                <input type="submit" value="Inicia sesión" />
            </div>
        </form>
    );
}

export default Login;