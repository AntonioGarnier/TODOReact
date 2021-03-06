import 'firebase/firestore'
import firebase from '../../firebase'
import { gotNewTask } from '../../actions'
import { ADD_NEW_TASK } from '../../constants'


const firestore = firebase.firestore()
firestore.settings({ timestampsInSnapshots: true })
let newTaskRef

const addTaskToFirebase = store => next => (action) => {
    switch (action.type) {
        case ADD_NEW_TASK:
            newTaskRef = firestore.collection('tasks').doc()
            newTaskRef.set({
                task: action.payload.task,
                done: false,
                id: newTaskRef.id,
            }).then(() => {
                store.dispatch(gotNewTask(action.payload.task, newTaskRef.id))
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
