import { supabase } from '../supabase/client'

export async function getPeticionById(id) {
  const { data, error } = await supabase
    .from('peticiones')
    .select(`
      id,
      titulo,
      descripcion,
      estado,
      score_urgencia,
      created_at,
      usuario_id,
      categorias (
        id,
        nombre
      ),
      zonas (
        id,
        nombre
      ),
      profiles (
        nombre,
        apellido
      )
    `)
    .eq('id', id)
    .single()

  if (error) {
    throw error
  }

  return data
}
export async function getCategorias() {
  const { data, error } = await supabase
    .from('categorias')
    .select('id, nombre')
    .eq('activa', true)
    .order('nombre')

  if (error) {
    throw error
  }

  return data
}

export async function getZonas() {
  const { data, error } = await supabase
    .from('zonas')
    .select('id, nombre')
    .eq('activa', true)
    .order('nombre')

  if (error) {
    throw error
  }

  return data
}

export async function createPeticion({
  usuarioId,
  titulo,
  descripcion,
  categoriaId,
  zonaId,
}) {
  const { data, error } = await supabase
    .from('peticiones')
    .insert({
      usuario_id: usuarioId,
      titulo,
      descripcion,
      categoria_id: categoriaId,
      zona_id: zonaId,
      estado: 'pendiente',
    })
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}
export async function getFirmasPeticion(peticionId) {
  const { data, error } = await supabase
    .from('firmas')
    .select('id, usuario_id, created_at')
    .eq('peticion_id', peticionId)

  if (error) {
    throw error
  }

  return data
}

export async function firmarPeticion(peticionId, usuarioId) {
  const { data, error } = await supabase
    .from('firmas')
    .insert({
      peticion_id: peticionId,
      usuario_id: usuarioId,
    })
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function retirarFirma(peticionId, usuarioId) {
  const { error } = await supabase
    .from('firmas')
    .delete()
    .eq('peticion_id', peticionId)
    .eq('usuario_id', usuarioId)

  if (error) {
    throw error
  }
}

export async function getMisPeticiones(usuarioId) {
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
        id,
        nombre
      ),
      zonas (
        id,
        nombre
      ),
      firmas (
        id
      )
    `)
    .eq('usuario_id', usuarioId)
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return data
}

export async function getPeticionesPendientes() {
  const { data, error } = await supabase
    .from('peticiones')
    .select(`
      id,
      titulo,
      descripcion,
      estado,
      score_urgencia,
      created_at,
      profiles (
        nombre,
        apellido
      ),
      categorias (
        id,
        nombre
      ),
      zonas (
        id,
        nombre
      ),
      firmas (
        id
      )
    `)
    .eq('estado', 'pendiente')
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return data
}

export async function cambiarEstadoPeticion(peticionId, nuevoEstado) {
  const { data, error } = await supabase
    .from('peticiones')
    .update({
      estado: nuevoEstado,
      updated_at: new Date().toISOString(),
    })
    .eq('id', peticionId)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}