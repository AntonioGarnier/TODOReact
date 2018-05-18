import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import List from './components/List'
import './App.css'
import {
    addNewTask,
    removeAllTasks,
} from './actions'


const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        addNewTask,
        removeAllTasks,
    }, dispatch)
}

const mapStateToProps = (state) => {
    return {
        loading: state.get('loading'),
    }
}

class App extends Component {
    static propTypes = {
        addNewTask: PropTypes.func.isRequired,
        removeAllTasks: PropTypes.func.isRequired,
        loading: PropTypes.bool.isRequired,
    }

    state = {
        inputValue: '',
    }

    componentDidMount() {
        window.addEventListener('storage', this.handleOnStorageUpdate)
    }

    componentWillUnmount() {
        window.removeEventListener('storage', this.handleOnStorageUpdate)
    }

    isValidInput = () => {
        const { inputValue } = this.state

        return (/\S/.test(inputValue))
    }

    handleOnChange = (value) => {
        this.setState({
            inputValue: value,
        })
    }

    handleAddNewTask = () => {
        const { inputValue } = this.state

        if (/\S/.test(inputValue)) {
            store.dispatch({
                type: 'ADD_NEW_TASK',
                payload: {
                    task: inputValue,
                },
            })

            /* this.props.addNewTask(inputValue)
            this.setState({
                inputValue: '',
            }) */
        }
    }

    render() {
        return (
            <div>
                <List />
                {
                    this.props.loading ? <div className="loader" /> : null
                }
                New task:
                <input
                    type="text"
                    value={this.state.inputValue}
                    onChange={e => this.handleOnChange(e.target.value)}
                />
                <button
                    type="submit"
                    onClick={this.handleAddNewTask}
                >
                    Add new task
                </button>
                <button
                    type="submit"
                    onClick={this.props.removeAllTasks}
                >
                    Clear list
                </button>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
