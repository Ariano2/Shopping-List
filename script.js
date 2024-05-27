const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn=itemForm.querySelector('button');
let isEditMode=false;

function displayItems(){
    const itemsFromStorage=getItemsFromStorage();
    itemsFromStorage.forEach(item => {
        addItemToDOM(item);
    });
    checkUI();
}

function onAddItemSubmit(e) {
    e.preventDefault();
    const newItem=itemInput.value;
    if(isEditMode){
        const itemToEdit=itemList.querySelector('.edit-mode');
        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();
        isEditMode=false;
    }
    else{
        if(checkIfItemExists(newItem)){
            alert('That item already exists!');
            return;
        }
    }
    addItemToDOM(newItem);
    addItemToStorage(newItem);
    checkUI();
    itemInput.value = '';
}

function addItemToDOM(item){
    if (item === '') {
        alert('Please add an item');
        return;
    }
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));
    const button = createButton('remove-item btn-link text-red');
    li.appendChild(button);
    itemList.appendChild(li);
}

function createButton(classes) {
    const button = document.createElement('button');
    button.className = classes;
    const icon = createIcon('fa-solid fa-xmark');
    button.appendChild(icon);
    return button;
}

function createIcon(classes) {
    const icon = document.createElement('icon');
    icon.className = classes;
    return icon;
}

function addItemToStorage(item){
    const itemsFromStorage=getItemsFromStorage();
    itemsFromStorage.push(item);
    // convert to JSON string and set to local Storage
    localStorage.setItem('items',JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage(){
    let itemsFromStorage;
    if(localStorage.getItem('items') === null){
        itemsFromStorage=[];
    }
    else{
        itemsFromStorage=JSON.parse(localStorage.getItem('items'));
    }
    return itemsFromStorage
}

function onClickItem(e){
    if (e.target.parentElement.classList.contains('remove-item')) {
        removeItem(e.target.parentElement.parentElement);
    }
    else{
        setItemToEdit(e.target);
    }
}

function checkIfItemExists(item){
    const itemsFromStorage=getItemsFromStorage();
    return itemsFromStorage.includes(item);
}

function setItemToEdit(item){
    isEditMode=true;
    itemList.querySelectorAll('li').forEach((item) =>{
        item.classList.remove('edit-mode');
    })
    item.classList.add('edit-mode');
    formBtn.innerHTML='<i class="fa-solid fa-pen"></i> Update Item'
    itemInput.value=item.textContent;
    formBtn.style.backgroundColor='#228b22';
}

function removeItemFromStorage(item){
    let itemsFromStorage=getItemsFromStorage();
    // filter out item to be removed
    itemsFromStorage=itemsFromStorage.filter((i)=> i!== item);
    // reset localstorage
    localStorage.setItem('items',JSON.stringify(itemsFromStorage));
}

function removeItem(item) {
   if(confirm('Are you sure ?')){
        item.remove();
   // remove from storage
   removeItemFromStorage(item.textContent);
   checkUI();
   }
}

function clearItems() {
    itemList.replaceChildren();
    localStorage.removeItem('items');
    checkUI();
}

function checkUI() {
    itemInput.value='';
    formBtn.innerHTML='<i class="fa-solid fa-plus"></i> Add Item';
    formBtn.style.backgroundColor='#333';
    const items = itemList.querySelectorAll('li');
    if (items.length === 0) {
        clearBtn.style.display = 'none';
        itemFilter.style.display = 'none';
    }
    else {
        clearBtn.style.display = 'block';
        itemFilter.style.display = 'block';
    }
    isEditMode=false;
}

function filterItems(e) {
    const text=e.target.value.toLowerCase();
    // access itemList 
    const items=itemList.querySelectorAll('li');
    items.forEach(item =>{
        const itemName=item.firstChild.textContent.toLowerCase();
        if(itemName.indexOf(text)!=-1){ 
            item.style.display='flex';
        }
        else{
            item.style.display='none';
        }
    });
}

// initialize app
function init(){
    // event listeners
    itemForm.addEventListener('submit', onAddItemSubmit);
    itemList.addEventListener('click', onClickItem);
    clearBtn.addEventListener('click', clearItems);
    itemFilter.addEventListener('input', filterItems);
    document.addEventListener('DOMContentLoaded',displayItems); 
    checkUI();
}

init();
