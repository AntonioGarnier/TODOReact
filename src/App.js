import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import List from './components/List'
import './App.css'
import {
    addNewTask,
    removeAllTasks,
    cancelAddNewTask,
} from './actions'


const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        addNewTask,
        removeAllTasks,
        cancelAddNewTask,
    }, dispatch)
}

const mapStateToProps = (state) => {
    return {
        loading: state.get('loading'),
        fetching: state.get('fetching'),
    }
}

class App extends Component {
    static propTypes = {
        addNewTask: PropTypes.func.isRequired,
        removeAllTasks: PropTypes.func.isRequired,
        cancelAddNewTask: PropTypes.func.isRequired,
        loading: PropTypes.bool.isRequired,
        fetching: PropTypes.bool.isRequired,
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

    handleAddNewTask = () => {
        const { inputValue } = this.state
        if (/\S/.test(inputValue)) {
            this.props.addNewTask(inputValue)
            this.setState({
                inputValue: '',
            })
        }
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

    handleCancel = () => {
        this.props.cancelAddNewTask()
    }

    render() {
        return (
            <div className="container" >
                <div className="layout-add-task" >
                    <input
                        className="text-field-input"
                        type="text"
                        placeholder="Add new task"
                        value={this.state.inputValue}
                        onChange={e => this.handleOnChange(e.target.value)}
                    />
                    <button
                        className="btn-task"
                        type="submit"
                        onClick={this.handleAddNewTask}
                    >
                        Add
                    </button>
                    <button
                        className="btn-task"
                        type="submit"
                        onClick={this.props.removeAllTasks}
                    >
                        Clear
                    </button>
                    <button
                        className="btn-task"
                        type="submit"
                        onClick={this.handleCancel}
                    >
                        Cancel
                    </button>
                </div>
                {
                    this.props.fetching
                        ? <div><div className="loader" /><p>Fetching data</p></div>
                        : null
                }
                <List />
                {
                    this.props.loading ? <div className="loader" /> : null
                }
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
