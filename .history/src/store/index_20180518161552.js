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

const composeEnhancers =
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?   
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
        }) : compose

const enhancer = composeEnhancers(applyMiddleware(logger, addTaskToFirebase))

export const lol = ''
export const store = createStore(
    rootReducer,
    initialState,
    /* compose(
        applyMiddleware(logger, addTaskToFirebase),
        // applyMiddleware(require('redux-validate-fsa')()),
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
    ), */
)

store.subscribe(() => {
    saveState(store.getState())
})
