import {
    ADD_NEW_TASK,
    GOT_NEW_TASK,
    MARK_TASK_AS_DONE,
    REMOVE_ALL_TASKS,
    INITIALIZE_APP,
    ADD_NEW_TASK_CANCELLED,
} from '../constants'


// const db = firebase.firestore()

export function cancelAddNewTask() {
    return {
        type: ADD_NEW_TASK_CANCELLED,
    }
}

export function addNewTask(task) {
    return {
        type: ADD_NEW_TASK,
        payload: {
            task,
        },
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

export function initializeApp() {
    return {
        type: INITIALIZE_APP,
    }
}
