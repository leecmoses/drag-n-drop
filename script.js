"use strict";

const addBtns = document.querySelectorAll(".add-btn:not(.solid)");
const saveItemBtns = document.querySelectorAll(".solid");
const addItemContainers = document.querySelectorAll(".add-container");
const addItems = document.querySelectorAll(".add-item");
// Item Lists
const listColumns = document.querySelectorAll(".drag-item-list");
const backlogList = document.getElementById("backlog-list");
const progressList = document.getElementById("progress-list");
const completeList = document.getElementById("complete-list");
const onHoldList = document.getElementById("on-hold-list");

// Items
let updatedOnLoad = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// Drag Functionality
let draggedItem;
let dragging = false;
let currentCol;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem("backlogItems")) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ["Release the course", "Sit back and relax"];
    progressListArray = ["Work on projects", "Listen to music"];
    completeListArray = ["Being cool", "Getting stuff done"];
    onHoldListArray = ["Being uncool"];
  }
}

// Set localStorage Arrays
function updateSavedColumns() {
  listArrays = [
    backlogListArray,
    progressListArray,
    completeListArray,
    onHoldListArray,
  ];

  const arrayNames = ["backlog", "progress", "complete", "onHold"];

  arrayNames.forEach((arrayName, i) => {
    localStorage.setItem(`${arrayName}Items`, JSON.stringify(listArrays[i]));
  });
}

// Filter Arrays to remove empty items
const filterArray = (arr) => {
  const filteredArray = arr.filter((item) => item !== null);
  return filteredArray;
};

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // List Item
  const listEl = document.createElement("li");
  listEl.classList.add("drag-item");
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute("ondragstart", "drag(event)");
  listEl.contentEditable = true;
  listEl.id = index;
  listEl.setAttribute("onfocusout", `updateItem(${index}, ${column})`);
  // Append
  columnEl.appendChild(listEl);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if (!updatedOnLoad) {
    getSavedColumns();

    // Run getSavedColumns only once, Update Local Storage
    updatedOnLoad = true;
  }

  // Backlog Column
  backlogList.textContent = "";
  backlogListArray.forEach((backlogItem, i) => {
    createItemEl(backlogList, 0, backlogItem, i);
  });
  backlogListArray = filterArray(backlogListArray);

  // Progress Column
  progressList.textContent = "";
  progressListArray.forEach((progressItem, i) => {
    createItemEl(progressList, 1, progressItem, i);
  });
  progressListArray = filterArray(progressListArray);

  // Complete Column
  completeList.textContent = "";
  completeListArray.forEach((completeItem, i) => {
    createItemEl(completeList, 2, completeItem, i);
  });
  completeListArray = filterArray(completeListArray);

  // On Hold Column
  onHoldList.textContent = "";
  onHoldListArray.forEach((onHoldItem, i) => {
    createItemEl(onHoldList, 3, onHoldItem, i);
  });
  onHoldListArray = filterArray(onHoldListArray);

  // Save
  updateSavedColumns();
}

// Update Item - Delete if necessary, or update Array
const updateItem = (id, col) => {
  const selectedArray = listArrays[col];
  const selectedColumnEl = listColumns[col].children;

  if (!dragging) {
    if (!selectedColumnEl[id].textContent) {
      delete selectedArray[id];
    } else {
      selectedArray[id] = selectedColumnEl[id].textContent;
    }
    updateDOM();
  }
};

// Add to Column List, Reset Textbox
const addToColumn = (col) => {
  const itemText = addItems[col].textContent;
  const selectedArray = listArrays[col];
  selectedArray.push(itemText);
  updateDOM();
  addItems[col].textContent = "";
};

// Show Add Item Input Box
const showInputBox = (col) => {
  addBtns[col].style.visibility = "hidden";
  saveItemBtns[col].style.display = "flex";
  addItemContainers[col].style.display = "flex";
};

// Hide Item Input Box
const hideInputBox = (col) => {
  addBtns[col].style.visibility = "visible";
  saveItemBtns[col].style.display = "none";
  addItemContainers[col].style.display = "none";
  addToColumn(col);
};

const rebuildArrays = () => {
  backlogListArray = [];
  for (let i = 0; i < backlogList.children.length; i++) {
    backlogListArray.push(backlogList.children[i].textContent);
  }

  progressListArray = [];
  for (let i = 0; i < progressList.children.length; i++) {
    progressListArray.push(progressList.children[i].textContent);
  }

  completeListArray = [];
  for (let i = 0; i < completeList.children.length; i++) {
    completeListArray.push(completeList.children[i].textContent);
  }

  onHoldListArray = [];
  for (let i = 0; i < onHoldList.children.length; i++) {
    onHoldListArray.push(onHoldList.children[i].textContent);
  }

  updateDOM();
};

// When Item Starts Dragging
const drag = (e) => {
  draggedItem = e.target;
  dragging = true;
};

// Column Allows for Item to Drop
const allowDrop = (e) => {
  e.preventDefault();
};

// When Item Enters Column Area
const dragEnter = (col) => {
  listColumns[col].classList.add("over");
  currentCol = col;
};

// Dropping Item in Column
const drop = (e) => {
  e.preventDefault();
  // Remove Background Color/Padding
  listColumns.forEach((col) => {
    col.classList.remove("over");
  });

  // Add Item to Column
  const parent = listColumns[currentCol];
  parent.appendChild(draggedItem);

  // Dragging complete
  dragging = false;
  rebuildArrays();
};

// On Load
updateDOM();
