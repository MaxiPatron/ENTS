import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { logoutUser } from '../services/authService'
function MainLayout() {
  const { user, profile, loading } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logoutUser()
      navigate('/login')
    } catch (error) {
      console.error('Error cerrando sesión:', error)
    }
  }

  return (
    <>
      <header>
        <nav className="navbar navbar-dark bg-dark">
          <div className="container">

            <Link
              className="navbar-brand"
              to="/"
            >
              Everyone Needs To Smile
            </Link>

            {!loading && (
              <div className="d-flex align-items-center gap-3">

                {user ? (
                  <>
                    <span className="text-white">
                      Hola, {profile?.nombre ?? user.email}
                    </span>

                    <Link
                      className="btn btn-primary btn-sm"
                      to="/peticiones/nueva"
                    >
                      Crear petición
                    </Link>

                    <Link
                      className="btn btn-outline-light btn-sm"
                      to="/dashboard"
                    >
                      Mi cuenta
                    </Link>

                    <button
                      className="btn btn-outline-light btn-sm"
                      onClick={handleLogout}
                    >
                      Cerrar sesión
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      className="btn btn-outline-light btn-sm"
                      to="/login"
                    >
                      Iniciar sesión
                    </Link>

                    <Link
                      className="btn btn-light btn-sm"
                      to="/registro"
                    >
                      Registrarse
                    </Link>
                  </>
                )}

              </div>
            )}

          </div>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="border-top mt-5 py-4">
        <div className="container text-center">
          <p className="mb-0">
            Everyone Needs To Smile
          </p>
        </div>
      </footer>
    </>
  )
}

export default MainLayout