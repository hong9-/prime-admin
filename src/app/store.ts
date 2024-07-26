import { configureStore } from '@reduxjs/toolkit'
import { legacy_createStore as createStore } from 'redux'

export interface state {
  sidebarShow: boolean,
  theme: string,
  userInfo: UserInfo,
}

const initialState:state = {
  sidebarShow: true,
  theme: 'light',
  userInfo: {
    email: '',
    name: '',
    role: '',
  },
}

export interface Notification {
  id: string,
  message: string,
  link: string,
  confirmed: boolean,
}

export interface nextState {
  type: string,
  [key: string]: string,
}

export interface UserInfo {
  email: string,
  name: string,
  role: string,
  Notifications?: Array<Notification>
  managers?: Array<UserInfo>,
  workers?: Array<UserInfo>,
}

const changeState = (state = initialState, { type, ...rest }: nextState) => {
  switch (type) {
    case 'set':
      console.log({ ...state, ...rest });
      return { ...state, ...rest }
    default:
      return state
  }
}

export const makeStore = () => {
  // let store = createStore(changeState);
  // let _store = configureStore({
  //   reducer: {}
  // });
  // console.log(store, _store)
  // return createStore(changeState);
  return configureStore({
    reducer: changeState
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

// const store = createStore(changeState)
// export default store
