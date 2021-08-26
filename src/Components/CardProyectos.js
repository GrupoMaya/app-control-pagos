
const CardProyectos = ({ name, clientes }) => {
  return (
        <div className="card__proyectos__container">
            <div className="card__proyectos__header">
                <p>{ name }</p>
            </div>
            <section className="card__proyectos__body">
                <img
                    src="https://grupotierramaya.com/wp-content/uploads/2020/08/EDIFICIO1_1-1.jpg"
                    alt="muestra de edificio en venta o renta"
                    />
            </section>
            <div className="card__proyectos__footer">
                <p>Lotes Activos:</p>
                <p>{clientes.length}</p>
            </div>
        </div>
  )
}

export default CardProyectos
