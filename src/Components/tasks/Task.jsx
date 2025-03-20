import React, { useState ,useEffect} from 'react';
import './task.css';
import home from '../Assets/home.png';
import stats from '../Assets/graph.png';
import folder from '../Assets/folder.png';
import chat from '../Assets/chat.png';
import calendar from '../Assets/calendar.png';
import logout from '../Assets/logout.png';
import setting from '../Assets/setting.png';
import profile from '../Assets/profile.png';
import { DndContext, closestCorners } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './taskcard';
import axios from 'axios';

const Task = () => {
    const [openPopup, setOpenPopup] = useState(false);
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [selectedColumn, setSelectedColumn] = useState('todo');  // To track which column task is being added to

    const [tasks, setTasks] = useState({
        todo: [],
        inProgress: [],
        completed: []
    });
    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await axios.get('http://localhost:5000/tasks');
            const categorizedTasks = {
                todo: [],
                inProgress: [],
                completed: []
            };

            response.data.forEach(task => {
                categorizedTasks[task.status].push(task);
            });

            setTasks(categorizedTasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };
    const handleTask = async() => {
        const response = await axios.post('http://localhost:5000/tasks', {
            title: taskName,
            description: taskDescription,
            status: selectedColumn
        });
        const newTask = {
            id: Date.now().toString(),
            title: taskName,
            description: taskDescription
        };

        setTasks((prevTasks) => ({
            ...prevTasks,
            [selectedColumn]: [...prevTasks[selectedColumn], newTask]
        }));

        setTaskName('');
        setTaskDescription('');
        setOpenPopup(false);
    };

    const openTaskPopup = (column) => {
        setSelectedColumn(column);
        setOpenPopup(true);
    };

    const onDragEnd = (event) => {
        const { active, over } = event;

        if (!over || active.id === over.id) return;

        let sourceColumn, destinationColumn;

        for (const column in tasks) {
            if (tasks[column].find((task) => task.id === active.id)) {
                sourceColumn = column;
            }
            if (tasks[column].find((task) => task.id === over.id)) {
                destinationColumn = column;
            }
        }

        if (sourceColumn && destinationColumn && sourceColumn !== destinationColumn) {
            const taskToMove = tasks[sourceColumn].find((task) => task.id === active.id);
            setTasks((prevTasks) => ({
                ...prevTasks,
                [sourceColumn]: prevTasks[sourceColumn].filter((task) => task.id !== active.id),
                [destinationColumn]: [...prevTasks[destinationColumn], taskToMove]
            }));
        }
    };
    const handleUpdateTask = async (taskId, newTitle, newDescription) => {
        try{
        await axios.put(`http://localhost:5000/tasks/${taskId}`, {
            title: newTitle,
            description: newDescription,
            status: selectedColumn
        });
    }catch (error) {
    console.error('Error updating task:', error);
}
        setTasks((prevTasks) => {
            const updatedTasks = { ...prevTasks };
            for (let column in updatedTasks) {
                updatedTasks[column] = updatedTasks[column].map(task =>
                    task.id === taskId ? { ...task, title: newTitle, description: newDescription } : task
                );
            }
            return updatedTasks;
        });
    };
    
    const handleDeleteTask = async (taskId) => {
        try{
        await axios.delete(`http://localhost:5000/tasks/${taskId}`);
    }catch (error) {
    console.error('Error deleting task:', error);
    }
        setTasks((prevTasks) => {
            const updatedTasks = { ...prevTasks };
            for (let column in updatedTasks) {
                updatedTasks[column] = updatedTasks[column].filter(task => task.id !== taskId);
            }
            return updatedTasks;
        });
    };
    

    return (
        <div className="container">
            <div className="sidebar">
                <div className="logo">.taskez</div>
                <div className="tabs">
                    <div className="tab"><img src={home} alt="Overview Icon" className="icon" />Overview</div>
                    <div className="tab"><img src={stats} alt="Overview Icon" className="icon" />Stats</div>
                    <div className="tab"><img src={folder} alt="Overview Icon" className="icon" />Project</div>
                    <div className="tab"><img src={chat} alt="Overview Icon" className="icon" />Chat</div>
                    <div className="tab"><img src={calendar} alt="Overview Icon" className="icon" />Calendar</div>
                </div>
                <div className="footer">
                    <div className="tab"><img src={setting} alt="Overview Icon" className="icon" />Settings</div>
                    <div className="tab"><img src={logout} alt="Overview Icon" className="icon" />Logout</div>
                </div>
            </div>
            <div className="navbar">
                <div className="search"><input type="text" placeholder="Search" /></div>
                <div className="profile">
                    <div className="profile-name">Hi Name</div>
                    <div className="profile-pic"><image src={profile} className='profilepic'/></div>
                </div>
            </div>
            <br></br>
            <div className="main">
                <div className="header"><div className="header-title">Projects</div></div>
                <DndContext collisionDetection={closestCorners} onDragEnd={onDragEnd}>
                    <div className="con">
                        {["todo", "inProgress", "completed"].map((column) => (
                            <div className="content" key={column}>
                                <div className="content-title">
                                    <h2>
                                        {column === "todo" ? "To Do" : column === "inProgress" ? "In Progress" : "Completed"}
                                    </h2>
                                </div>
                                <button className="add" onClick={() => openTaskPopup(column)}>+</button>
                                <SortableContext items={tasks[column]} strategy={verticalListSortingStrategy}>
                                    {tasks[column].map((task) => (
                                        <TaskCard key={task.id} task={task}  onUpdate={handleUpdateTask} onDelete={handleDeleteTask}/>
                                    ))}
                                </SortableContext>
                            </div>
                        ))}
                    </div>
                </DndContext>
            </div>
            {openPopup && (
                <div className="overlay">
                    <div className="pop-up">
                        <div className="pop-up-header">
                            <div className="pop-up-title">Add Task</div>
                            <div className="pop-up-close" onClick={() => setOpenPopup(false)}>X</div>
                        </div>
                        <div className="pop-up-content">
                            <div className="pop-up-field">
                                <label>Task Name</label>
                                <input type="text" value={taskName} onChange={(e) => setTaskName(e.target.value)} />
                            </div>
                            <div className="pop-up-field">
                                <label>Task Description</label>
                                <input type="text" value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)} />
                            </div>
                            <div className="pop-up-field">
                                <button className="add" onClick={handleTask}>Add Task</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default Task;