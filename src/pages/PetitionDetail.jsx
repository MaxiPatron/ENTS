import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { useAuth } from '../contexts/AuthContext'

import {
  getPeticionById,
  getFirmasPeticion,
  firmarPeticion,
  retirarFirma,
} from '../services/petitionService'

function PetitionDetail() {
  const { id } = useParams()
  const { user } = useAuth()

  const [peticion, setPeticion] = useState(null)
  const [firmas, setFirmas] = useState([])

  const [loading, setLoading] = useState(true)
  const [procesandoFirma, setProcesandoFirma] = useState(false)

  const [error, setError] = useState('')
  const [errorFirma, setErrorFirma] = useState('')

  useEffect(() => {
    const loadPeticion = async () => {
      try {
        setLoading(true)
        setError('')

        const peticionData = await getPeticionById(id)

        setPeticion(peticionData)

        if (user) {
          const firmasData = await getFirmasPeticion(id)
          setFirmas(firmasData)
        }
      } catch (err) {
        console.error('Error cargando petición:', err)
        setError('No se pudo cargar la petición.')
      } finally {
        setLoading(false)
      }
    }

    loadPeticion()
  }, [id, user])

  const usuarioYaFirmo = user
    ? firmas.some((firma) => firma.usuario_id === user.id)
    : false

  const handleFirmar = async () => {
    if (!user) {
      return
    }

    try {
      setProcesandoFirma(true)
      setErrorFirma('')

      const nuevaFirma = await firmarPeticion(
        peticion.id,
        user.id
      )

      setFirmas((firmasActuales) => [
        ...firmasActuales,
        nuevaFirma,
      ])
    } catch (err) {
      console.error('Error firmando petición:', err)
      setErrorFirma('No se pudo registrar tu firma.')
    } finally {
      setProcesandoFirma(false)
    }
  }

  const handleRetirarFirma = async () => {
    if (!user) {
      return
    }

    try {
      setProcesandoFirma(true)
      setErrorFirma('')

      await retirarFirma(
        peticion.id,
        user.id
      )

      setFirmas((firmasActuales) =>
        firmasActuales.filter(
          (firma) => firma.usuario_id !== user.id
        )
      )
    } catch (err) {
      console.error('Error retirando firma:', err)
      setErrorFirma('No se pudo retirar tu firma.')
    } finally {
      setProcesandoFirma(false)
    }
  }

  if (loading) {
    return (
      <div className="container py-5">
        <p>Cargando petición...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          {error}
        </div>

        <Link
          to="/"
          className="btn btn-outline-secondary"
        >
          Volver al inicio
        </Link>
      </div>
    )
  }

  if (!peticion) {
    return (
      <div className="container py-5">
        <h2>Petición no encontrada</h2>
      </div>
    )
  }

  const fecha = new Date(
    peticion.created_at
  ).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  const estadoFormateado = peticion.estado
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (letra) => letra.toUpperCase())

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-9">

          <Link
            to="/"
            className="text-decoration-none"
          >
            ← Volver
          </Link>

          <div className="mt-4 mb-3">
            <span className="badge text-bg-primary me-2">
              {peticion.categorias?.nombre}
            </span>

            <span className="badge text-bg-secondary">
              {peticion.zonas?.nombre}
            </span>
          </div>

          <h1 className="mb-3">
            {peticion.titulo}
          </h1>

          <div className="mb-4">
            <span className="text-muted">
              Estado:
            </span>{' '}

            <strong>
              {estadoFormateado}
            </strong>
          </div>

          <hr />

          <div className="py-3">
            <h5>Descripción</h5>

            <p
              className="mt-3"
              style={{ whiteSpace: 'pre-line' }}
            >
              {peticion.descripcion}
            </p>
          </div>

          <hr />

          {/* FIRMAS */}

          <div className="py-4">

            <h4>
              {firmas.length}{' '}
              {firmas.length === 1 ? 'firma' : 'firmas'}
            </h4>

            <p className="text-muted">
              Personas que apoyan esta petición.
            </p>

            {errorFirma && (
              <div className="alert alert-danger">
                {errorFirma}
              </div>
            )}

            {!user && (
              <div>
                <p>
                  Iniciá sesión para apoyar esta petición.
                </p>

                <Link
                  to="/login"
                  className="btn btn-primary"
                >
                  Iniciar sesión
                </Link>
              </div>
            )}

            {user && !usuarioYaFirmo && (
              <button
                className="btn btn-primary"
                onClick={handleFirmar}
                disabled={procesandoFirma}
              >
                {procesandoFirma
                  ? 'Registrando firma...'
                  : 'Firmar petición'}
              </button>
            )}

            {user && usuarioYaFirmo && (
              <div>
                <div className="alert alert-success">
                  ✓ Ya firmaste esta petición.
                </div>

                <button
                  className="btn btn-outline-danger"
                  onClick={handleRetirarFirma}
                  disabled={procesandoFirma}
                >
                  {procesandoFirma
                    ? 'Retirando firma...'
                    : 'Retirar firma'}
                </button>
              </div>
            )}

          </div>

          <hr />

          <div className="row mt-4">

            <div className="col-md-6 mb-3">
              <div className="card h-100">
                <div className="card-body">

                  <h5 className="card-title">
                    Información
                  </h5>

                  <p className="mb-2">
                    <strong>Creada por:</strong>{' '}
                    {peticion.profiles?.nombre}{' '}
                    {peticion.profiles?.apellido}
                  </p>

                  <p className="mb-0">
                    <strong>Fecha:</strong>{' '}
                    {fecha}
                  </p>

                </div>
              </div>
            </div>

            <div className="col-md-6 mb-3">
              <div className="card h-100">
                <div className="card-body">

                  <h5 className="card-title">
                    Score de urgencia
                  </h5>

                  <div className="display-6">
                    {Number(peticion.score_urgencia)}

                    <small className="fs-5 text-muted">
                      {' '}/ 100
                    </small>
                  </div>

                  <p className="text-muted mb-0">
                    El score será calculado automáticamente
                    según la actividad de la petición.
                  </p>

                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}

export default PetitionDetail