const observerAction = action => ({
    next: (value) => {
        action(value)
    },
    error: (error) => {
        console.log(error)
    },
    complete: () => {
        console.log('Completed')
    },
})

export default observerAction
