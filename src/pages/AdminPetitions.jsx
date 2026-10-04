import { useEffect, useState } from 'react'
import {
    cambiarEstadoPeticion,
    getPeticionesPendientes,
} from '../services/petitionService'
import { supabase } from '../supabase/client'
function AdminPetitions() {
    const [peticiones, setPeticiones] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [procesando, setProcesando] = useState(null)

    const cargarPeticiones = async () => {
        try {
            setLoading(true)
            setError('')

            const data = await getPeticionesPendientes()

            setPeticiones(data)
        } catch (err) {
            console.error('Error cargando peticiones:', err)
            setError('No se pudieron cargar las peticiones pendientes.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        cargarPeticiones()
    }, [])

    const cambiarEstado = async (peticionId, nuevoEstado) => {
        try {
            const { error } = await supabase
                .from('peticiones')
                .update({
                    estado: nuevoEstado,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', peticionId)

            if (error) throw error

            // La sacamos de la lista porque ya no está pendiente
            setPeticiones((actuales) =>
                actuales.filter((peticion) => peticion.id !== peticionId)
            )
        } catch (error) {
            console.error('Error actualizando petición:', error)
            alert('No se pudo actualizar el estado de la petición.')
        }
    }

    if (loading) {
        return (
            <div className="container py-5">
                <p>Cargando peticiones pendientes...</p>
            </div>
        )
    }

    return (
        <div className="container py-5">

            <div className="mb-5">
                <h1>Moderación de peticiones</h1>

                <p className="text-muted">
                    Revisá las peticiones creadas por los ciudadanos antes
                    de publicarlas.
                </p>
            </div>

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {peticiones.length === 0 && (
                <div className="alert alert-success">
                    No hay peticiones pendientes de revisión.
                </div>
            )}

            {peticiones.map((peticion) => (
                <div
                    className="card mb-4"
                    key={peticion.id}
                >
                    <div className="card-body">

                        <div className="mb-3">
                            <span className="badge text-bg-primary me-2">
                                {peticion.categorias?.nombre}
                            </span>

                            <span className="badge text-bg-secondary">
                                {peticion.zonas?.nombre}
                            </span>
                        </div>

                        <h3 className="card-title">
                            {peticion.titulo}
                        </h3>

                        <p className="card-text">
                            {peticion.descripcion}
                        </p>

                        <p className="text-muted">
                            Creada por:{' '}
                            <strong>
                                {peticion.profiles?.nombre}{' '}
                                {peticion.profiles?.apellido}
                            </strong>
                        </p>

                        <hr />

                        <div className="d-flex gap-2">

                            <button
                                className="btn btn-success"
                                onClick={() => cambiarEstado(peticion.id, 'publicada')}
                            >
                                Aprobar
                            </button>

                            <button
                                className="btn btn-danger"
                                onClick={() => cambiarEstado(peticion.id, 'rechazada')}
                            >
                                Rechazar
                            </button>

                        </div>

                    </div>
                </div>
            ))}

        </div>
    )
}

export default AdminPetitions