import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import CardProyectos from 'Components/CardProyectos'

import { useMayaDispatch, useMayaState } from 'context/MayaMachine'

const Dashboard = () => {

  const state = useMayaState()
  const dispatch = useMayaDispatch()

  const { proyectos } = state.context
  useEffect(() => {
    dispatch('GET_PROYECTOS')
  }, [])

  return (
        <div id="Dashboard">
            <section className="dashboard__header">
              <h1>Proyectos Activos</h1>
            </section>
            <section className="cards">
                {
                  state.matches('success') && proyectos.map(({ title, _id, activos }) => {
                    return (
                      <Link key={_id} to={`/proyecto/${_id}/${title}`} >
                          <CardProyectos name={ title.toUpperCase() } clientes={activos}/>
                      </Link>
                    )
                  })
                }
                {
                  
                }
                {
                  state.matches('getProyectos') && <span className="logo__loader__await" />
                }
            </section>
        </div>
  )
}

export default Dashboard
