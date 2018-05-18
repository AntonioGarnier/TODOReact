import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { markTaskAsDone } from '../../actions'
import './styles.css'


const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        markTaskAsDone,
    }, dispatch)
}

const mapStateToProps = (state) => {
    return { tasks: state.get('tasks') }
}

function List({
    tasks,
    markTaskAsDone, // eslint-disable-line no-shadow
}) {
    return (
        <ul>
            <TransitionGroup component={null}>
                {
                    tasks
                        .filter(task => !task.get('done'))
                        .map(task => (
                            <CSSTransition
                                key={task.get('id')}
                                timeout={500}
                                classNames="task"
                                appear
                                unmountOnExit
                                mountOnEnter
                            >
                                <li
                                    className={task.get('done') ? 'taskDone' : null}
                                >
                                    {task.get('task')}
                                    <input
                                        className="checkBoxStyle"
                                        type="checkbox"
                                        defaultChecked={task.get('done')}
                                        onClick={() => markTaskAsDone(task.get('id'))}
                                    />
                                </li>
                            </CSSTransition>
                        ))
                }
            </TransitionGroup>
        </ul>
    )
}

List.propTypes = {
    tasks: PropTypes.any.isRequired,
    markTaskAsDone: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(List)
