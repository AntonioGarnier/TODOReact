import firebase from '../firebase'
import { ADD_NEW_TASK } from '../../constants'


const db = firebase.firestore()

const addTaskToFirebase = store => next => action => {
    switch (action.type) {
        case ADD_NEW_TASK:
        
        default:
            return next(action)
    }    
  }

export default addTaskToFirebase
