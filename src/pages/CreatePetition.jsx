import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  createPeticion,
  getCategorias,
  getZonas,
} from '../services/petitionService'

function CreatePetition() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [categorias, setCategorias] = useState([])
  const [zonas, setZonas] = useState([])

  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    categoriaId: '',
    zonaId: '',
  })

  const [loading, setLoading] = useState(false)
  const [loadingOptions, setLoadingOptions] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [categoriasData, zonasData] = await Promise.all([
          getCategorias(),
          getZonas(),
        ])

        setCategorias(categoriasData)
        setZonas(zonasData)
      } catch (err) {
        setError('No se pudieron cargar las categorías y zonas.')
        console.error(err)
      } finally {
        setLoadingOptions(false)
      }
    }

    loadOptions()
  }, [])

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')
    setLoading(true)

    try {
      const peticion = await createPeticion({
        usuarioId: user.id,
        titulo: form.titulo.trim(),
        descripcion: form.descripcion.trim(),
        categoriaId: Number(form.categoriaId),
        zonaId: Number(form.zonaId),
      })

      navigate(`/peticiones/${peticion.id}`)
    } catch (err) {
      console.error(err)
      setError('No se pudo crear la petición.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">

          <h1 className="mb-2">Crear petición</h1>

          <p className="text-muted mb-4">
            Describí una problemática de tu barrio para que pueda
            ser visibilizada y evaluada.
          </p>

          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="mb-3">
              <label className="form-label">
                Título
              </label>

              <input
                type="text"
                name="titulo"
                className="form-control"
                value={form.titulo}
                onChange={handleChange}
                maxLength="200"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                Descripción
              </label>

              <textarea
                name="descripcion"
                className="form-control"
                rows="6"
                value={form.descripcion}
                onChange={handleChange}
                required
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Categoría
                </label>

                <select
                  name="categoriaId"
                  className="form-select"
                  value={form.categoriaId}
                  onChange={handleChange}
                  disabled={loadingOptions}
                  required
                >
                  <option value="">
                    Seleccionar categoría
                  </option>

                  {categorias.map((categoria) => (
                    <option
                      key={categoria.id}
                      value={categoria.id}
                    >
                      {categoria.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6 mb-4">
                <label className="form-label">
                  Zona / barrio
                </label>

                <select
                  name="zonaId"
                  className="form-select"
                  value={form.zonaId}
                  onChange={handleChange}
                  disabled={loadingOptions}
                  required
                >
                  <option value="">
                    Seleccionar zona
                  </option>

                  {zonas.map((zona) => (
                    <option
                      key={zona.id}
                      value={zona.id}
                    >
                      {zona.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || loadingOptions}
            >
              {loading
                ? 'Creando petición...'
                : 'Crear petición'}
            </button>

          </form>

        </div>
      </div>
    </div>
  )
}

export default CreatePetition