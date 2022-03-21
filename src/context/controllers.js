export const baseURL = process.env.REACT_APP_URL

class MayaMachineAPI {
  // todos los proyectos
  static async createProyectos (ctx, { payload }) {

    const res = await fetch(`${baseURL}/add/proyecto`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(res => res)
      .catch(error => console.log(error))
      
    if (res.error) throw new Error('No se puede crear el documento')
    return res
  }

  static async getProyectos () {
    const res = await fetch(`${baseURL}/proyectos`)
      .then(res => res.json())
      .then(res => res.message)

    return res
  }

  static async getProyectoByID ({ currentProjectId }, event) {

    const res = await fetch(`${baseURL}/proyecto/${currentProjectId}`)
      .then(res => res.json())
      .then(res => res.message)
    
    return res
  }

  static async getAllLotesByProjectID ({ proyecto }, event) {
    const request = await fetch(`${baseURL}/lotes/proyecto/${proyecto._id}`)
      .then(res => res.json())
      .then(res => res.message)
    return request

  }

  static async getLotes ({ _id }) {
    const request = await fetch(`${baseURL}/lotes/${_id}`)
      .then(res => res.json())
      .then(res => res.message)
    return request

  }

  static async createCLient (ctx, { payload }) {
    const res = await fetch(`${baseURL}/add/cliente`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(res => res)
      .catch(error => error)
      
    if (res.error) throw new Error('No se puedo guardar el cliente')
    return res
  }

  static async getAllClients () {
    const res = await fetch(`${baseURL}/cliente`)
      .then(res => res.json())
      .then(res => res.message)

    return res
  }

  static async patchCliente ({ id, body }) {
    const res = await fetch(`${baseURL}/modify/cliente/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
      .then(res => res.json())
      .then(res => res)

    return res
  }

  static async getAllProjetcs () {
    const projects = await fetch(`${baseURL}/proyectos`)
      .then(res => res.json())
      .then(res => res.message)
    
    return projects
  }

}

export default MayaMachineAPI
