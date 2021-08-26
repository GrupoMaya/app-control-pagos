import './style.scss'

const Notify = ({ errorType, msg } = {}) => {

  let classError
  if (errorType === 'error') {
    classError = 'ntf__error'
  } else if (errorType === 'success') {
    classError = 'ntf__success'
  }

  return (
    <div className='notify'>
      <span className={classError}>{ msg }</span>
    </div>
  )
}

export default Notify
