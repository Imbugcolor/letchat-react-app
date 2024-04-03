import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNotifications } from 'reapop'
import Loading from '../Loading';

const Notify = () => {
    const alert = useSelector(state => state.alert)

    const { notify } = useNotifications();

    useEffect(() => {
      alert.error && 
            notify({
              title: 'Oh no!',
              message: alert.error,
              status: 'error'
            })
      alert.success && 
            notify({
              title: alert.success,
              status: 'success'
            })
    }, [notify, alert])

  return (
    <div>
       {alert.loading && <Loading />}
    </div>
  )
}

export default Notify