import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { useAuth } from '../contexts/AuthContext'
import { getMisPeticiones } from '../services/petitionService'
import PetitionCard from '../components/PetitionCard'

function Dashboard() {
  const { user, profile } = useAuth()

  const [peticiones, setPeticiones] = useState([])
  const [loadingPeticiones, setLoadingPeticiones] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) {
      return
    }

    const loadPeticiones = async () => {
      try {
        setLoadingPeticiones(true)
        setError('')

        const data = await getMisPeticiones(user.id)

        setPeticiones(data)
      } catch (err) {
        console.error('Error cargando peticiones:', err)
        setError('No se pudieron cargar tus peticiones.')
      } finally {
        setLoadingPeticiones(false)
      }
    }

    loadPeticiones()
  }, [user])

  return (
    <div className="container py-5">

      <h1>Mi cuenta</h1>

      <div className="card mt-4 mb-5">
        <div className="card-body">

          <p>
            <strong>Nombre:</strong>{' '}
            {profile?.nombre} {profile?.apellido}
          </p>

          <p>
            <strong>Correo:</strong>{' '}
            {user?.email}
          </p>

          <p className="mb-0">
            <strong>Rol:</strong>{' '}
            {profile?.rol}
          </p>

        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h2 className="mb-1">
            Mis peticiones
          </h2>

          <p className="text-muted mb-0">
            Peticiones que creaste en la plataforma.
          </p>
        </div>

        <Link
          to="/peticiones/nueva"
          className="btn btn-primary"
        >
          Crear petición
        </Link>

      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {loadingPeticiones && (
        <p>Cargando peticiones...</p>
      )}

      {!loadingPeticiones &&
        !error &&
        peticiones.length === 0 && (
          <div className="card">
            <div className="card-body text-center py-5">

              <h4>
                Todavía no creaste ninguna petición
              </h4>

              <p className="text-muted">
                Creá tu primera petición para visibilizar
                una problemática de tu barrio.
              </p>

              <Link
                to="/peticiones/nueva"
                className="btn btn-primary"
              >
                Crear mi primera petición
              </Link>

            </div>
          </div>
        )}

      {!loadingPeticiones &&
        peticiones.map((peticion) => (
          <PetitionCard
            key={peticion.id}
            peticion={peticion}
          />
        ))}

    </div>
  )
}

export default Dashboard