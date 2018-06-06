import 'firebase/firestore'
import Immutable from 'immutable'
import { ofType } from 'redux-observable'
import { interval, Subject } from 'rxjs'
import {
    map,
    take,
    flatMap,
    takeUntil,
} from 'rxjs/operators'
import firebase from '../../firebase'
import {
    ADD_NEW_TASK,
    GOT_NEW_TASK,
    ADD_NEW_TASK_CANCELLED,
    FETCH_TASKS_FROM_FIREBASE,
    // FETCHING_TASKS_FROM_FIREBASE,
    INITIALIZE_APP,
    REMOVE_ALL_TASKS,
    REMOVE_TASK,
    UPDATE_TASK,
    EMPTY_LIST,
} from '../../constants'


const firestore = firebase.firestore()
firestore.settings({ timestampsInSnapshots: true })

const tasksListener$ = new Subject()

firestore.collection('tasks')
    .orderBy('createdAt')
    .onSnapshot((querySnapshot) => {
        console.log('DocChanges', querySnapshot.docChanges())
        if (!querySnapshot.metadata.hasPendingWrites) {
            let tasks = Immutable.List()
            let updateType
            querySnapshot.docChanges().forEach((task) => {
                tasks = tasks.push(Immutable.Map({
                    task: task.doc.data().task,
                    done: task.doc.data().done,
                    id: task.doc.id,
                    createdAt: task.doc.data().createdAt,
                }))
                switch (task.type) {
                    case 'added':
                        updateType = 'added'
                        break
                    case 'modified':
                        updateType = 'modified'
                        break
                    case 'removed':
                        updateType = 'removed'
                        break
                    default:
                        break
                }
            })
            tasksListener$.next({
                tasks,
                updateType,
            })
        }
    })


export const initialzeApp = action$ =>
    action$.pipe(
        ofType(INITIALIZE_APP),
        flatMap(() => (
            tasksListener$.pipe(
                map(({ tasks, updateType }) => {
                    switch (updateType) {
                        case 'added':
                            if (tasks.size > 1)
                                return {
                                    type: FETCH_TASKS_FROM_FIREBASE,
                                    payload: tasks,
                                }
                            return {
                                type: GOT_NEW_TASK,
                                payload: {
                                    task: tasks.get(0).get('task'),
                                    done: tasks.get(0).get('done'),
                                    taskId: tasks.get(0).get('id'),
                                    createdAt: tasks.get(0).get('createdAt'),
                                },
                            }
                        case 'modified':
                            return {
                                type: UPDATE_TASK,
                                payload: {
                                    tasks,
                                },
                            }
                        case 'removed':
                            if (tasks.size > 1)
                                return {
                                    type: REMOVE_ALL_TASKS,
                                }
                            return {
                                type: REMOVE_TASK,
                                payload: {
                                    taskId: tasks.get(0).get('id'),
                                },
                            }
                        default:
                            return {
                                type: EMPTY_LIST,
                            }   
                    }
                })
            ))),
    )

/*export const fetchTasksFromFirebase = action$ =>
    action$.pipe(
        ofType(FETCHING_TASKS_FROM_FIREBASE),
        flatMap(() => (
            firestore.collection('tasks').get().then((querySnapshot) => {
                let tasks = Immutable.List()
                querySnapshot.forEach((doc) => {
                    tasks = tasks.push(Immutable.Map({
                        task: doc.data().task,
                        done: doc.data().done,
                        id: doc.id,
                        createdAt: doc.data().createdAt,
                    }))
                })
                return {
                    type: FETCH_TASKS_FROM_FIREBASE,
                    payload: {
                        tasks,
                    },
                }
            })
        )),
    )*/

export const addTaskToFirebaseEpic = action$ =>
    action$.pipe(
        ofType(ADD_NEW_TASK),
        flatMap(action => (
            interval(3000).pipe(
                takeUntil(action$.ofType(ADD_NEW_TASK_CANCELLED)),
                takeUntil(action$.ofType(ADD_NEW_TASK)),
                take(5),
                map((act) => {
                    const newTaskRef = firestore.collection('tasks').doc()
                    const timestamp = firebase.firestore.FieldValue.serverTimestamp()
                    newTaskRef.set({
                        task: `${action.payload.task} ${act}`,
                        done: false,
                        createdAt: timestamp,
                    })
                    return {
                        type: GOT_NEW_TASK,
                        payload: {
                            task: `${action.payload.task} ${act}`,
                            done: false,
                            taskId: newTaskRef.id,
                            createdAt: timestamp,
                        },
                    }
                }),
            )

        )),
    )

