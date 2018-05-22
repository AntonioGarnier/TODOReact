import Immutable from 'immutable'
import {
    ADD_NEW_TASK,
    GOT_NEW_TASK,
    MARK_TASK_AS_DONE,
    REMOVE_ALL_TASKS,
    INITIALIZE_APP,
} from '../constants'


export const initialState = Immutable.Map({
    tasks: Immutable.List(),
    loading: false,
})

export const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_NEW_TASK:
            return state.set('loading', true)
        case GOT_NEW_TASK:
            return state
                .set('loading', false)
                .update('tasks', task => task.push(Immutable.Map({
                    task: action.payload.task,
                    done: false,
                    id: action.payload.taskId,
                })))
        case MARK_TASK_AS_DONE:
            return state.setIn(['tasks', state.get('tasks').findIndex(i => i.get('id') === action.payload.taskId), 'done'], true)
        case REMOVE_ALL_TASKS:
            return initialState
        case INITIALIZE_APP:
            return state
        default:
            return state
    }
}
