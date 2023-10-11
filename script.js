
//  Redux Setup
const addData = (name, location) => ({
    type: 'ADD_DATA',
    payload: { name, location },
});

// const deleteData = (index) => ({
//     type: 'DELETE_DATA',
//     payload: index,
// });
const deleteData = (index) => ({
    type: 'DELETE_DATA',
    payload: index,
});

const updateData = (index, name, location) => ({
    type: 'UPDATE_DATA',
    payload: { index, name, location },
});

const addReducer = (state = [], action) => {
    if (action.type === 'ADD_DATA') {
        return [...state, action.payload];
    } 
   
    else if (action.type === 'DELETE_DATA') {
        const newData = [...state];
        newData.splice(action.payload, 1);
        return newData;
    }
    
    else if (action.type === 'UPDATE_DATA') {
        const updatedData = [...state];
        updatedData[action.payload.index] = { name: action.payload.name, location: action.payload.location };
        return updatedData;
    }
    return state;
};


const deleteReducer = (state = [], action) => {
    if (action.type === 'DELETE_DATA') {
        return [...state, action.payload];
    }
    return state;
};
  


const rootReducer = Redux.combineReducers({
    addedData: addReducer,
    deletedData: deleteReducer,
});

const store = Redux.createStore(rootReducer);

let editingIndex = -1; // Initialize as -1 to indicate that no row is being edited

// Event Listener for Adding Data
document.getElementById('add').addEventListener('click', () => {
    const newName = document.getElementById('name').value;
    const newLocation = document.getElementById('location').value;

    if (editingIndex === -1) {
        // Add a new row
        store.dispatch(addData(newName, newLocation));
    } else {
        // Update the row
        store.dispatch(updateData(editingIndex, newName, newLocation));
        // Reset editingIndex
        editingIndex = -1;
    }

    // Clear input fields
    document.getElementById('name').value = '';
    document.getElementById('location').value = '';
});

// Store Subscription to Update Table
store.subscribe(() => {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '';

    const tableData = store.getState().addedData;
    console.log(store.getState());
    tableData.forEach((data, index) => {
        const row = tableBody.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
        cell1.textContent = data.name;
        cell2.textContent = data.location;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
       // deleteButton.addEventListener('click', () => store.dispatch(deleteData(index)));
       deleteButton.addEventListener('click', () => {
        const deletedData = store.getState().addedData[index];
        store.dispatch(deleteData(deletedData));
    });
       
        cell3.appendChild(deleteButton);

        const updateButton = document.createElement('button');
        updateButton.textContent = 'Update';
        updateButton.addEventListener('click', () => {
            // Set editingIndex to the current index
            editingIndex = index;
            // Populate the input fields with the current row's values
            document.getElementById('name').value = data.name;
            document.getElementById('location').value = data.location;
        });
        deleteButton.className = 'red-button';
        updateButton.className = 'blue-button';
        cell3.appendChild(updateButton);
    });
});
