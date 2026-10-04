import { Link } from 'react-router-dom'

function PetitionCard({ peticion }) {
  const fecha = new Date(
    peticion.created_at
  ).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  const estado = peticion.estado
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (letra) => letra.toUpperCase())

  const cantidadFirmas = peticion.firmas?.length ?? 0

  return (
    <div className="card mb-3">
      <div className="card-body">

        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <span className="badge text-bg-primary me-2">
              {peticion.categorias?.nombre}
            </span>

            <span className="badge text-bg-secondary">
              {peticion.zonas?.nombre}
            </span>
          </div>

          <span className="badge text-bg-light border text-dark">
            {estado}
          </span>
        </div>

        <h4 className="card-title mt-3">
          {peticion.titulo}
        </h4>

        <p className="card-text text-muted">
          {peticion.descripcion.length > 180
            ? `${peticion.descripcion.substring(0, 180)}...`
            : peticion.descripcion}
        </p>

        <div className="d-flex justify-content-between align-items-center mt-4">

          <div className="text-muted">
            <span className="me-3">
              {cantidadFirmas}{' '}
              {cantidadFirmas === 1 ? 'firma' : 'firmas'}
            </span>

            <span>
              {fecha}
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
  )
}

export default PetitionCard