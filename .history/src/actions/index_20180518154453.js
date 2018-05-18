import firebase from '../firebase'
import {
    ADD_NEW_TASK,
    GOT_NEW_TASK,
    MARK_TASK_AS_DONE,
    REMOVE_ALL_TASKS,
} from '../constants'


const db = firebase.firestore()

export function addNewTask(task) {
    return (dispatch) => {
        dispatch({
            type: ADD_NEW_TASK,
            payload: {
                task,
            },
        })
        const db = firebase.firestore()

    }
}

export function gotNewTask(task, taskId) {
    return {
        type: GOT_NEW_TASK,
        payload: {
            task,
            taskId,
        },
    }
}

export function markTaskAsDone(taskId) {
    return {
        type: MARK_TASK_AS_DONE,
        payload: {
            taskId,
        },
    }
}

export function removeAllTasks() {
    return {
        type: REMOVE_ALL_TASKS,
    }
}
