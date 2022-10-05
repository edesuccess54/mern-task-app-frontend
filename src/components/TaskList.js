import { useEffect, useState } from 'react'
import Task from './Task'
import TaskForm from './TaskForm'
import axios from "axios"
import {URL} from "../App"
import loadingImg from "../assets/loader.gif"

// react toastify
import { toast } from 'react-toastify';

export default function TaskList() {
    const [tasks, setTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [taskId, setTaskId] = useState("")
    const[formData, setFormData] = useState({
        name: "",
        completed: false
    })

    const {name} = formData
    const handleInputChange = (e) => {
        const {name, value} = e.target
        setFormData({...formData, [name]: value})
    }

    // fetching all the task 
    const getTasks = async () => {
        setIsLoading(true);
        try {
            const {data} = await axios.get(`${URL}/api/tasks`);
            setTasks(data);
            console.log(data);
            setIsLoading(false)
        } catch (error) {
            toast.error(error.message);
            setIsLoading(false)
        }
    }

    useEffect(() =>{
        getTasks()
    },[])

    // create task 
    const createTask = async(e) => {
        e.preventDefault();

        if(name === '') {
            return toast.error("input field can not be empty");
        }
        try {
            await axios.post(`${URL}/api/tasks`, formData)
            toast.success("Task added successfully");
            setFormData({...formData, name: ""});
            getTasks();
        } catch (error) {
            toast.error(error.message);
            console.log(error)
        }
    }

    // delete task
    const deletTask = async (id) => {
        try {
            await axios.delete(`${URL}/api/tasks/${id}`);
            toast.success("Task has been deleted");
            getTasks();
        } catch (error) {
            toast.error(error.message);
        }
    }

    // get a single task 
    const getSingleTask = (task) => {
         setFormData({
            name: task.name,
            completed: false
         })

         setTaskId(task._id);
         setIsEditing(true)

    }

    // update task 
    const updateTask = async (e) => {
        e.preventDefault();
        if(name === '') {
            return toast.error("Input field can not be empty");
        }
        try {
            await axios.put(`${URL}/api/tasks/${taskId}`, formData);
            setFormData({...formData, name: ""});
            setIsEditing(false)
            getTasks()
            toast.success("Task updated");
        } catch (error) {
            toast.error(error.message);
        }
    }


    // set task to completed 
    const setTocomplete= async (task) => {
        const newFormData = {
            name: task.name,
            completed: true
        }

        try {
            await axios.put(`${URL}/api/tasks/${task._id}`, newFormData);
            getTasks();
        } catch (error) {
            toast.error(error.message)
        }
    }

    const getCompletedTasks = () => {
        const filtered = tasks.filter((task) => {
            return task.completed;
        })
        setCompletedTasks(filtered);
    }

    useEffect(() =>{
        getCompletedTasks();
    },[tasks])

  return (
    <div>
        <h2>Task Manager</h2>
        <TaskForm 
            name={name} 
            handleInputChange={handleInputChange} 
            createTask={createTask}
            isEditing ={isEditing}
            updateTask = {updateTask}
            />

            {tasks.length > 0 && (
                <div className='--flex-between --pb'>
                <p>
                    <b>Total Tasks: {tasks.length}</b>
                </p>
    
                <p>
                    <b>Completed Tasks tasks: {completedTasks.length}</b>
                </p>
            </div>
            )}
        
        <hr />
        {isLoading && (
            <div className='--flex-center'>
                <img src={loadingImg} alt="loading spinner" />
            </div>
        )}

        {!isLoading && tasks.length === 0 ? (
            <p className='--py'>No task added, please add a task</p>
        ) : (
            <>
                {tasks.map((task, index) => (
                    <Task 
                        key={task._id} 
                        task={task} 
                        index={index} 
                        deletTask={deletTask} 
                        setTocomplete={setTocomplete}
                        getSingleTask={getSingleTask}
                        />
                ))}
            </>
        )}
    </div>
  )
}
