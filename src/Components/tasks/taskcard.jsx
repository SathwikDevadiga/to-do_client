import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import "./taskcard.css";
const TaskCard = ({ task, onUpdate, onDelete }) => {
    const { attributes, listeners, setNodeRef, transform } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
    };

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [editedTitle, setEditedTitle] = useState(task.title);
    const [editedDescription, setEditedDescription] = useState(task.description);

    const handleUpdate = () => {
        onUpdate(task.id, editedTitle, editedDescription);
        setIsPopupOpen(false);
    };

    const handleDelete = () => {
        onDelete(task.id);
        setIsPopupOpen(false);
    };

    return (
        <>
            <div 
                ref={setNodeRef} 
                {...attributes} 
                {...listeners} 
                className="content-card" 
                style={style}
            >
                <div className="card-content">
                    <div>
                        <div className="card-title">{task.title}</div>
                        <div className="card-value">{task.description}</div>
                    </div>
                   
                </div>
            </div>
            <button 
                        className="edit-btn" 
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsPopupOpen(true);
                        }}
                    >
                        Edit
                    </button>
            {isPopupOpen && (
                <div className="overlay">
                    <div className="pop-up">
                        <div className="pop-up-header">
                            <div className="pop-up-title">Edit Task</div>
                            <div className="pop-up-close" onClick={() => setIsPopupOpen(false)}>X</div>
                        </div>
                        <div className="pop-up-content">
                            <div className="pop-up-field">
                                <label>Task Name</label>
                                <input 
                                    type="text" 
                                    value={editedTitle} 
                                    onChange={(e) => setEditedTitle(e.target.value)} 
                                />
                            </div>
                            <div className="pop-up-field">
                                <label>Task Description</label>
                                <input 
                                    type="text" 
                                    value={editedDescription} 
                                    onChange={(e) => setEditedDescription(e.target.value)} 
                                />
                            </div>
                            <div className="pop-up-actions">
                                <button className="update" onClick={handleUpdate}>Update</button>
                                <button className="delete" onClick={handleDelete}>Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TaskCard;
