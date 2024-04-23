import React, { useState, useEffect } from 'react';
import api from '../api';
import './PersonList.css';
// import { Link } from 'react-router-dom'; // Importing Link for routing

const PersonList = () => {
    const [persons, setPersons] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editPerson, setEditPerson] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Fetching the list of persons
    useEffect(() => {
        api.get('/api/persons/')
            .then(response => setPersons(response.data))
            .catch(error => console.error('Error fetching persons:', error));
    }, []);

    // Filtering persons based on the search term
    const filteredPersons = persons.filter(person =>
        person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle add button click
    const handleAddPerson = () => {
        setEditPerson({
            name: '',
            email: '',
            education: '',
            address: '',
            phone_number: '',
            gender: '',
            interests: '',
            date_of_birth: '',
        });
        setIsEditing(false);
        setShowModal(true);
    };

    // Handle edit button click
    const handleEditPerson = (person) => {
        setEditPerson(person);
        setIsEditing(true);
        setShowModal(true);
    };

    // Handle delete button click
    const handleDeletePerson = async (personId) => {
        try {
            await api.delete(`/api/persons/${personId}/`);
            setPersons(prevPersons => prevPersons.filter(person => person.id !== personId));
        } catch (error) {
            console.error('Error deleting person:', error);
        }
    };

    // Handle modal close
    const handleCloseModal = () => {
        setEditPerson(null);
        setShowModal(false);
    };

    // Handle save/edit in the modal
    const handleSaveEdit = async () => {
        try {
            if (isEditing) {
                // Editing an existing person
                await api.put('/api/persons/${editPerson.id}/', editPerson);
                setPersons(prevPersons => prevPersons.map(person =>
                    person.id === editPerson.id ? editPerson : person
                ));
            } else {
                // Adding a new person
                const response = await api.post('/api/persons/', editPerson);
                setPersons(prevPersons => [...prevPersons, response.data]);
            }
            handleCloseModal();
        } catch (error) {
            console.error('Error saving/editing person:', error);
        }
    };

    return (
        <div className="person-list-container">
            <h1 className="heading">Person Management</h1>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search persons..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>
            <button className="add-button" onClick={handleAddPerson}>
                Add Person
            </button>
            <ul className="person-list">
                {filteredPersons.map(person => (
                    <li key={person.id} className="person-item">
                        <div className="person-info">
                            <h3 className="person-name">{person.name}</h3>
                            <p className="person-email">Email: {person.email}</p>
                            <p className="person-education">Education: {person.education}</p>
                            <button className="edit-button" onClick={() => handleEditPerson(person)}>
                                Edit
                            </button>
                            <button className="delete-button" onClick={() => handleDeletePerson(person.id)}>
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>{isEditing ? 'Edit Person' : 'Add Person'}</h2>
                        <input
                            type="text"
                            placeholder="Name"
                            value={editPerson?.name || ''}
                            onChange={(e) => setEditPerson({ ...editPerson, name: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Email"
                            value={editPerson?.email || ''}
                            onChange={(e) => setEditPerson({ ...editPerson, email: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Education"
                            value={editPerson?.education || ''}
                            onChange={(e) => setEditPerson({ ...editPerson, education: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Address"
                            value={editPerson?.address || ''}
                            onChange={(e) => setEditPerson({ ...editPerson, address: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Phone Number"
                            value={editPerson?.phone_number || ''}
                            onChange={(e) => setEditPerson({ ...editPerson, phone_number: e.target.value })}
                        />
                        <select
                            value={editPerson?.gender || ''}
                            onChange={(e) => setEditPerson({ ...editPerson, gender: e.target.value })}
                        >
                            <option value="">Select Gender</option>
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                            <option value="O">Other</option>
                        </select>
                        <input
                            type="date"
                            placeholder="Date of Birth"
                            value={editPerson?.date_of_birth || ''}
                            onChange={(e) => setEditPerson({ ...editPerson, date_of_birth: e.target.value })}
                        />
                        <textarea
                            placeholder="Interests"
                            value={editPerson?.interests || ''}
                            onChange={(e) => setEditPerson({ ...editPerson, interests: e.target.value })}
                        />
                        <button onClick={handleSaveEdit}>
                            {isEditing ? 'Save Changes' : 'Add Person'}
                        </button>
                        <button onClick={handleCloseModal}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PersonList;