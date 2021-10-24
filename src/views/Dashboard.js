import { useEffect, useContext } from 'react'
import { AppContext } from 'context/AppContextProvider'
import { Link } from 'react-router-dom'
import CardProyectos from 'Components/CardProyectos'

import { useMayaDispatch, useMayaState } from 'context/MayaMachine'

const Dashboard = () => {

  const { plataformName, GetInfoData } = useContext(AppContext)

  const state = useMayaState()
  const dispatch = useMayaDispatch()

  console.log({ state, plataformName })

  const { proyectos } = state.context
  useEffect(() => {
    dispatch('GET_PROYECTOS')
    GetInfoData()
  }, [])

  return (
        <div id="Dashboard">
            <section className="dashboard__header">
              <h1>Proyectos Activos:</h1>
              <h2>{`${plataformName}`}</h2>
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
