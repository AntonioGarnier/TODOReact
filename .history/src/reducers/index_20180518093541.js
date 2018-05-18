import Immutable from 'immutable'
import {
    ADD_NEW_TASK,
    GOT_NEW_TASK,
    MARK_TASK_AS_DONE,
    REMOVE_ALL_TASKS,
} from '../constants'


export const initialState = Immutable.Map({
    tasks: Immutable.List(),
})

export const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case GOT_NEW_TASK:
            return state.update('tasks', task => task.push(Immutable.Map({
                task: action.payload.task,
                done: false,
                id: action.payload.taskId,
            })))
        case ADD_NEW_TASK:
        
        case MARK_TASK_AS_DONE:
            return state.setIn(['tasks', action.payload.taskId, 'done'], true)
        case REMOVE_ALL_TASKS:
            return initialState
        default:
            return state
    }
}
