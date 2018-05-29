import { createStore, compose, applyMiddleware } from 'redux'
import { createEpicMiddleware } from 'redux-observable'
import Immutable from 'immutable'
import { saveState, loadState } from '../localStorage'
import { rootReducer } from '../reducers'
// import addTaskToFirebase from './middlewares'
import { initializeApp } from '../actions'
import addTaskToFirebaseEpic from './epics'


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

const epicMiddleware = createEpicMiddleware(addTaskToFirebaseEpic)

const enhancer = composeEnhancers(applyMiddleware(epicMiddleware))

const store = createStore(
    rootReducer,
    initialState,
    enhancer,
    /* compose(
        applyMiddleware(logger, addTaskToFirebase),
        // applyMiddleware(require('redux-validate-fsa')()),
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
    ), */
)

store.dispatch(initializeApp())

store.subscribe(() => {
    saveState(store.getState())
})

export default store
