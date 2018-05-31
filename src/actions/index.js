import {
    ADD_NEW_TASK,
    GOT_NEW_TASK,
    MARK_TASK_AS_DONE,
    REMOVE_ALL_TASKS,
    INITIALIZE_APP,
    ADD_NEW_TASK_CANCELLED,
    FETCH_TASKS_FROM_FIREBASE,
    FETCHING_TASKS_FROM_FIREBASE,
    TEST1,
    TEST2,
} from '../constants'


export function test1() {
    return {
        type: TEST1,
    }
}

export function test2() {
    return {
        type: TEST2,
    }
}

export function fetchTasksFromFirebase() {
    return {
        type: FETCH_TASKS_FROM_FIREBASE,
    }
}

export function fetchingTasksFromFirebase() {
    return {
        type: FETCHING_TASKS_FROM_FIREBASE,
    }
}

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
