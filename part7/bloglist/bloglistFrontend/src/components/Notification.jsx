import { useSelector } from 'react-redux'
import { Alert } from 'react-bootstrap'

const Notification = () => {
  const notification = useSelector((state) => state.notification)

  if (!notification) {
    return null
  }

  const variant = notification.type === 'error' ? 'danger' : 'success'

  return (
    <Alert variant={variant}>
      {notification.message}
    </Alert>
  )
}

export default Notification
