import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabase/client'

function Home() {
  const [peticiones, setPeticiones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    cargarPeticiones()
  }, [])

  const cargarPeticiones = async () => {
    try {
      setLoading(true)
      setError('')

      const { data, error } = await supabase
        .from('peticiones')
        .select(`
          id,
          titulo,
          descripcion,
          estado,
          score_urgencia,
          created_at,
          categorias (
            nombre
          ),
          zonas (
            nombre
          ),
          firmas (
            id
          )
        `)
        .eq('estado', 'publicada')
        .order('created_at', { ascending: false })

      if (error) throw error

      setPeticiones(data || [])
    } catch (error) {
      console.error('Error cargando peticiones:', error)
      setError('No se pudieron cargar las peticiones.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container py-5">
        <p>Cargando peticiones...</p>
      </div>
    )
  }

  return (
    <div className="container py-5">
      <div className="mb-5">
        <h1>Everyone Needs To Smile</h1>

        <p className="lead">
          Plataforma de peticiones ciudadanas con análisis y medición de impacto.
        </p>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Peticiones ciudadanas</h2>
          <p className="text-muted mb-0">
            Conocé las problemáticas publicadas por la comunidad.
          </p>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {!error && peticiones.length === 0 && (
        <div className="alert alert-info">
          Todavía no hay peticiones publicadas.
        </div>
      )}

      <div className="row g-4">
        {peticiones.map((peticion) => (
          <div className="col-12 col-md-6" key={peticion.id}>
            <div className="card h-100">
              <div className="card-body d-flex flex-column">
                <div className="mb-3">
                  <span className="badge bg-primary me-2">
                    {peticion.categorias?.nombre || 'Sin categoría'}
                  </span>

                  <span className="badge bg-secondary">
                    {peticion.zonas?.nombre || 'Sin zona'}
                  </span>
                </div>

                <h3 className="h4">
                  {peticion.titulo}
                </h3>

                <p className="text-muted">
                  {peticion.descripcion}
                </p>

                <div className="mt-auto">
                  <hr />

                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>
                        {peticion.firmas?.length || 0}
                      </strong>{' '}
                      {peticion.firmas?.length === 1 ? 'firma' : 'firmas'}

                      <span className="mx-2">•</span>

                      <span>
                        Urgencia: {peticion.score_urgencia ?? 0}/100
                      </span>
                    </div>

                    <Link
                      to={`/peticiones/${peticion.id}`}
                      className="btn btn-outline-primary"
                    >
                      Ver petición
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home