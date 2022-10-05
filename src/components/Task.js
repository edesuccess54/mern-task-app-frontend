import {FaCheckDouble, FaEdit, FaRegTrashAlt } from "react-icons/fa";
export default function Task({task, index, deletTask, completeTask, getSingleTask, setTocomplete}) {
  return (
    <div className={task.completed ? "task completed" : "task"}>
        <p>
            <b>{index + 1}. </b>
            {task.name}
        </p>

        <div className="task-icons">
            <FaCheckDouble color="green" onClick={() => setTocomplete(task)}/>
            <FaEdit color="purple" onClick={() => getSingleTask(task)}/>
            <FaRegTrashAlt color="red" onClick={() => deletTask(task._id)}/>
        </div>
    </div>
  )
}
