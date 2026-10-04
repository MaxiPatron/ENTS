import { useState } from 'react'
import { registerUser } from '../services/authService'

function Register() {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
  })

  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setMensaje('')
    setError('')
    setLoading(true)

    try {
      await registerUser(
        form.nombre,
        form.apellido,
        form.email,
        form.password
      )

      setMensaje(
        'Cuenta creada. Revisá tu correo electrónico para confirmar la cuenta.'
      )

      setForm({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">

          <h1 className="mb-4">
            Crear cuenta
          </h1>

          {mensaje && (
            <div className="alert alert-success">
              {mensaje}
            </div>
          )}

          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="mb-3">
              <label className="form-label">
                Nombre
              </label>

              <input
                type="text"
                className="form-control"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                Apellido
              </label>

              <input
                type="text"
                className="form-control"
                name="apellido"
                value={form.apellido}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                Correo electrónico
              </label>

              <input
                type="email"
                className="form-control"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label">
                Contraseña
              </label>

              <input
                type="password"
                className="form-control"
                name="password"
                value={form.password}
                onChange={handleChange}
                minLength="6"
                required
              />
            </div>

            <button
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? 'Creando cuenta...' : 'Registrarse'}
            </button>

          </form>

        </div>
      </div>
    </div>
  )
}

export default Register