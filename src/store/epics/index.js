import 'firebase/firestore'
import Immutable from 'immutable'
import { ofType } from 'redux-observable'
import { interval, Subject } from 'rxjs'
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
    FETCH_TASKS_FROM_FIREBASE,
    FETCHING_TASKS_FROM_FIREBASE,
    INITIALIZE_APP,
    // TEST1,
    // TEST2,
} from '../../constants'


const firestore = firebase.firestore()
firestore.settings({ timestampsInSnapshots: true })

const tasksListener$ = new Subject()

firestore.collection('tasks')
    .onSnapshot((querySnapshot) => {
        // console.log('Current data: ', querySnapshot.docChanges())
        let tasks = Immutable.List()
        querySnapshot.docChanges().forEach((task) => {
            tasks = tasks.push(Immutable.Map({
                task: task.doc.data().task,
                done: task.doc.data().done,
                id: task.doc.id,
            }))
            // console.log('Current data2: ', task.doc.data())
        })
        tasksListener$.next(tasks)
    })


/* firestore.collection('tasks')
    .onSnapshot((querySnapshot) => {
        console.log('Current data: ', querySnapshot.docChanges())
        querySnapshot.docChanges().forEach((doc2) => {
            console.log('Current data2: ', doc2.doc.data())
        })
    }) */

/*
of(firestore.collection('tasks')
                .onSnapshot((querySnapshot) => {
                    let tasks = Immutable.List()
                    console.log('Current data: ', querySnapshot.docChanges().length)
                    querySnapshot.docChanges().forEach((task) => {
                        tasks = tasks.push(Immutable.Map({
                            task: task.doc.data().task,
                            done: task.doc.data().done,
                            id: task.doc.id,
                        }))
                        console.log('Current data2: ', task.doc.data(), 'id: ', task.doc.id, 'tasks: ', tasks.toJS())
                    })
                    if (querySnapshot.docChanges().length > 1)
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
                        },
                    }
                })).pipe(tap(v => console.log('!!!!!!!', v)))
*/


export const initialzeApp = action$ =>
    action$.pipe(
        ofType(INITIALIZE_APP),
        flatMap(() => (
            tasksListener$.pipe(
                // tap(v => console.log('primero: ', v)),
                map((task) => {
                    if (task.size > 1)
                        return {
                            type: FETCH_TASKS_FROM_FIREBASE,
                            payload: task,
                        }
                    return {
                        type: GOT_NEW_TASK,
                        payload: {
                            task: task.get(0).get('task'),
                            done: task.get(0).get('done'),
                            taskId: task.get(0).get('id'),
                        },
                    }
                }),
                // tap(v => console.log('heya: ', v))
            )
            /* tasksListener$.subscribe({
                next: (value) => {
                    if (value.size > 1)
                        return {
                            type: FETCH_TASKS_FROM_FIREBASE,
                            payload: value,
                        }
                    return {
                        type: GOT_NEW_TASK,
                        payload: {
                            task: value.get(0).get('task'),
                            done: value.get(0).get('done'),
                            taskId: value.get(0).get('id'),
                        },
                    }
                },
                error: (error) => {
                    console.log(error)
                },
                complete: () => {
                    console.log('Completed')
                },
            }) */

            /* of(firestore.collection('tasks')
                .onSnapshot((querySnapshot) => {
                    let tasks = Immutable.List()
                    console.log('Current data: ', querySnapshot.docChanges().length)
                    querySnapshot.docChanges().forEach((task) => {
                        tasks = tasks.push(Immutable.Map({
                            task: task.doc.data().task,
                            done: task.doc.data().done,
                            id: task.doc.id,
                        }))
                        console.log('Current data2: ', task.doc.data(), 'id: ', task.doc.id, 'tasks: ', tasks.toJS())
                    })
                    if (querySnapshot.docChanges().length > 1)
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
                        },
                    }
                })).pipe(tap(v => console.log(v))) */

            /* of(
                {
                    type: FETCHING_TASKS_FROM_FIREBASE,
                },
                {
                    type: TEST1,
                },
                {
                    type: TEST2,
                },
            ) */ 
        )),
        // tap(v => console.log('out', v))
    )

export const fetchTasksFromFirebase = action$ =>
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
    )

export const addTaskToFirebaseEpic = action$ =>
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

