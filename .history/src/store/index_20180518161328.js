import { createStore, compose, applyMiddleware } from 'redux'
import logger from 'redux-logger'
import thunk from 'redux-thunk'
import Immutable from 'immutable'
import { saveState, loadState } from '../localStorage'
import { rootReducer } from '../reducers'
import addTaskToFirebase from './middlewares'


const initialState = loadState() || Immutable.Map({
    tasks: Immutable.List(),
    loading: false,
})

export const lol = ''
export const store = createStore(
    rootReducer,
    initialState,
    compose(
        applyMiddleware(logger, addTaskToFirebase),
        // applyMiddleware(require('redux-validate-fsa')()),
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
    ),
)

store.subscribe(() => {
    saveState(store.getState())
})
