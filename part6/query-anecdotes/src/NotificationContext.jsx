import { createContext, useReducer, useContext } from 'react'

const initialState = {
  message: '',
  isVisible: false
}

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return {
        message: action.payload,
        isVisible: true
      }
    case 'HIDE_NOTIFICATION':
      return {
        ...state,
        isVisible: false
      }
    default:
      return state
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, initialState)
  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export const useNotificationText = () => {
  const [state, dispatch] = useContext(NotificationContext)
  return state.message
}

export const useNotificationVisible = () => {
  const [state, dispatch] = useContext(NotificationContext)
  return state.isVisible

}

export const useNotificationDispatch = () => {
  const [state, dispatch] = useContext(NotificationContext)
  return dispatch
}

export default NotificationContext
