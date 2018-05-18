import firebase from '../firebase'
import { ADD_NEW_TASK } from '../../constants'


const db = firebase.firestore()

const addTaskToFirebase = store => next => action => {
    switch (action.type) {
        case ADD_NEW_TASK:
            const newTaskRef = db.collection('tasks').doc()
            newTaskRef.set({
                task,
                done: false,
                id: newTaskRef.id,
            }).then(() => {
                dispatch(gotNewTask(task, newTaskRef.id))
            }).catch(error => (
                // eslint-disable-next-line no-console
                console.log('Error saving task in database: ', error)
            ))
            return next(action)
        default:
            return next(action)
    }    
  }

export default addTaskToFirebase
