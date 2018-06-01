import Immutable from 'immutable'
import {
    ADD_NEW_TASK,
    GOT_NEW_TASK,
    MARK_TASK_AS_DONE,
    REMOVE_ALL_TASKS,
    REMOVE_TASK,
    INITIALIZE_APP,
    ADD_NEW_TASK_CANCELLED,
    FETCH_TASKS_FROM_FIREBASE,
    FETCHING_TASKS_FROM_FIREBASE,
    UPDATE_TASK,
} from '../constants'


export const initialState = Immutable.Map({
    tasks: Immutable.List(),
    loading: false,
    fetching: false,
})

export const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_NEW_TASK:
            return state
                .set('loading', true)
        case GOT_NEW_TASK:
            return state
                .set('loading', false)
                .update('tasks', task => task.push(Immutable.Map({
                    task: action.payload.task,
                    done: false,
                    id: action.payload.taskId,
                })))
        case MARK_TASK_AS_DONE:
            return state
                .setIn(['tasks', state.get('tasks').findIndex(i => i.get('id') === action.payload.taskId), 'done'], true)
        case ADD_NEW_TASK_CANCELLED:
            return state
                .set('loading', false)
        case REMOVE_ALL_TASKS:
            return initialState
        case REMOVE_TASK:
            return state
                .deleteIn(['tasks', state.get('tasks').findIndex(i => i.get('id') === action.payload.taskId)])
        case UPDATE_TASK:
            console.log('action: ', state.get('tasks').findIndex(i => i.get('id') === action.payload.tasks.get('0').get('id')))
            return state
                .setIn(['tasks', state.get('tasks').findIndex(i => i.get('id') === action.payload.tasks.get('0').get('id'))], action.payload.tasks.get('0'))
        case INITIALIZE_APP:
            return state
        case FETCHING_TASKS_FROM_FIREBASE:
            return state
                .set('fetching', true)
        case FETCH_TASKS_FROM_FIREBASE:
            return state
                .set('fetching', false)
                .set('tasks', action.payload)
        default:
            return state
    }
}
