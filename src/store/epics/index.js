import 'firebase/firestore'
import { ofType } from 'redux-observable'
import { interval } from 'rxjs'
import {
    map,
    take,
    flatMap,
    tap,
    takeUntil,
} from 'rxjs/operators'
import firebase from '../../firebase'
import {
    ADD_NEW_TASK,
    GOT_NEW_TASK,
    ADD_NEW_TASK_CANCELLED,
} from '../../constants'


const firestore = firebase.firestore()
firestore.settings({ timestampsInSnapshots: true })

const addTaskToFirebaseEpic = action$ =>
    action$.pipe(
        ofType(ADD_NEW_TASK),
        tap(v => console.log('Hey, lets go to add new task:', v.payload.task)),
        flatMap(action => (
            interval(3000).pipe(
                takeUntil(action$.ofType(ADD_NEW_TASK_CANCELLED)),
                takeUntil(action$.ofType(ADD_NEW_TASK)),
                take(5),
                map((act) => {
                    const newTaskRef = firestore.collection('tasks').doc()
                    newTaskRef.set({
                        task: `${action.payload.task} ${act}`,
                        done: false,
                        id: newTaskRef.id,
                    })
                    return {
                        type: GOT_NEW_TASK,
                        payload: {
                            task: `${action.payload.task} ${act}`,
                            done: false,
                            taskId: newTaskRef.id,
                        },
                    }
                }),
                tap(v => console.log('Sending task:', v.payload.task)),
            )

        )),


        /* delay(1000),
        tap(x => console.log('Epic before:', x)),
        map((action) => {
            const newTaskRef = firestore.collection('tasks').doc()
            newTaskRef.set({
                task: action.payload.task,
                done: false,
                id: newTaskRef.id,
            })
            return {
                type: GOT_NEW_TASK,
                payload: {
                    task: action.payload.task,
                    taskId: newTaskRef.id,
                },
            }
        }),
        tap(x => console.log('Epic after:', x)),
        takeUntil(action$.ofType(ADD_NEW_TASK_CANCELLED)), */
    )

export default addTaskToFirebaseEpic
