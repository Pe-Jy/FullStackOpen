import { useNotificationText, useNotificationVisible } from '../NotificationContext'

const Notification = () => {
  const notification = useNotificationText()
  const isVisible = useNotificationVisible()

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
    display: isVisible ? 'block' : 'none'
  }

  return (
    <div style={style}>
      {notification}
    </div>
  )
}

export default Notification
