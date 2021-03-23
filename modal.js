let current_clicked_elt;
let current_list_item; 
let modal_container = document.getElementById("modal-container"); 
let modal_form = document.getElementById("modal-form"); 
let edit_input = document.getElementById("title-change"); 
let title_change = document.getElementById("title-change"); 
let genre_change = document.getElementById("genre-change"); 
let delete_btn = document.getElementById("delete-btn"); 
let seen_btn = document.getElementById("seen-btn"); 
let AS_modal = document.getElementById("AS-modal");
const genres = ["Action", "Adventure", "Animation", "Biopic", "Comedy", "Disaster", "Documentary", "Drama", "Horror", "Musical", "Romance","Sci-Fi", "Suspense", "Thriller"]; 
array = JSON.parse(localStorage.getItem(STORAGE_KEY_ITEMS))||[]; 

function find_item(current_clicked_elt){
        return array.find(value => current_clicked_elt.id == value.id); 
    }

function show(){ // Display the modal form, set its position according to the scroll and blur the rest of the page; 
    var y = window.scrollY; 
    modal_container.style.top = y + "px"; 
    modal_container.style.visibility = "visible"; 
    blur_container.style.filter = "blur(6px)";
}

function hide(){ // Hide the modal 
    modal_container.style.visibility="hidden"; 
    blur_container.style.filter="none"; 
}

function delete_item(){ // Find index of item currently selected and remove it from the array; 
    let i = array.indexOf(current_list_item); 
    array.splice(i, 1);  
    hide(); 

}    
    
function update_seen_state(){ // Set seen property of the current item to True and dynamically add a little modal to let user know the operation is successful; 
    current_list_item.seen = true; 
    let p = document.createElement("p"); 
    p.innerHTML = "Item successfully added to Already Watched list"; 
    p.id="AS-modal"; 
    p.classList.add("p-modal"); 
    body.appendChild(p); 

    hide(); 
}

function get_genre_id(name){ //Find ID of selected genre in order to display it in the modal form; 
    for(let i=0; i<genres.length; i++){
        if(name==genres[i]){
            return i; 
        }
    }
}

function update_form(){ // Set default values for genre and title in the modal form; 
    if(current_clicked_elt != undefined){
        edit_input.defaultValue = current_list_item.title; 
        let id = get_genre_id(current_list_item.genre); 
        genre_change.selectedIndex=id; 
    }
}

function set_current_clicked_elt(event){ 
    /*Define the value of current_clicked_elt, so that it is always a li element and not a p element.
    Then display the modal form and set the value of current_list_item.
    The function is called every time the modal pops up; 
    */
    if(event.target.tagName==="LI"){
        current_clicked_elt = event.target; 
        show();
        current_list_item = find_item(current_clicked_elt); 
    }
    else if(event.target.tagName==="P" && event.target.parentElement.tagName==="LI"){
        show(); 
        current_clicked_elt= event.target.parentElement; 
        current_list_item = find_item(current_clicked_elt); 
    }
}

function render_page(){
    if(CURRENT != "custom"){
        render_items(CURRENT); 
    }
    else{
        render_custom_items(); 
    }
}

list.addEventListener("click", e=>{
    if(!e.target.classList.contains("default-message")){
        set_current_clicked_elt(e); 
        update_form(); 
    }
    
}); 

custom_lists_container.addEventListener("click", e=>{
    if(!e.target.classList.contains("default-message")){
        set_current_clicked_elt(e); 
        update_form(); 
    }
});


modal_container.addEventListener("click", e=>{    
    /*Call function according to the modal form element clicked (cross button, already watched button or delete button)
    Render the page if needed and save changes; 
    */
        if(e.target.id==="close"){
            hide(); 
         }
         else if(e.target.id==="seen-btn"){
            update_seen_state();
            save_item(array, STORAGE_KEY_ITEMS);
            render_page(); 

         }
         else if(e.target.id==="delete-btn"){
            delete_item();
            save_item(array, STORAGE_KEY_ITEMS);
            render_page(); 
         }
    
       

});

modal_form.addEventListener("submit", e=>{
    /* Update value of title and genre if needed, 
    Save the changes and render the page, then hide the modal and reset the form;*/
    e.preventDefault(); 
    current_list_item = find_item(current_clicked_elt);

    if(edit_input.value){ 
        current_list_item.title = edit_input.value; 
    }
    if(genre_change.value){
        current_list_item.genre= genre_change.value;
    }

    save_item(array, STORAGE_KEY_ITEMS); 
    if(CURRENT != "custom"){   
        render_items(CURRENT); 
    }
    else{
        render_custom_items(); 
    }
    hide(); 
    modal_form.reset(); 
}); 

