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

  static async getProyectoByID (ctx, event) {
    
    const res = await fetch(`${baseURL}/proyecto/${event.id}`)
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

}

export default MayaMachineAPI
