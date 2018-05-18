import firebase from '../firebase'
import {
    ADD_NEW_TASK,
    MARK_TASK_AS_DONE,
    REMOVE_ALL_TASKS,
} from '../constants'


const db = firebase.firestore()


export function uploadNewTask(task) {
    const newTaskRef = db.collection('tasks').doc()
    newTaskRef.set({
        task,
        done: false,
        id: newTaskRef.id,
    }).then(() => {
        // eslint-disable-next-line no-console
        console.log('Document written!')
    }).catch(error => (
        // eslint-disable-next-line no-console
        console.log('Error saving task in database: ', error)
    ))
    return newTaskRef.id
}

export function addNewTask(task, taskId) {
    return (dispatch) => {
        const newTaskRef = db.collection('tasks').doc()
    newTaskRef.set({
        task,
        done: false,
        id: newTaskRef.id,
    }).then(() => {
        // eslint-disable-next-line no-console
        console.log('Document written!')
    }).catch(error => (
        // eslint-disable-next-line no-console
        console.log('Error saving task in database: ', error)
    ))
    }
    return {
        type: ADD_NEW_TASK,
        payload: {
            task,
            taskId,
        },
    }
}

export function gotNewTask(task) {
    return (dispatch) => {

        dispatch(addNewTask(task, uploadNewTask(task)))
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
