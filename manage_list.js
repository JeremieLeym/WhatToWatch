let movie_series_form = document.getElementById("form");
let list = document.getElementById("list"); 
let item_name= document.getElementById("movie-title");
let genre= document.getElementById("genre"); 
let series_div = document.getElementById("series-div"); 
let movie_div = document.getElementById("movie-div"); 
let movie_header = document.getElementById("movie-header");
let series_header = document.getElementById("series-header");
let custom_header = document.getElementById("custom-header"); 
let label_title = document.getElementById("label-title"); 
let list_page = document.getElementById("list-page"); 

let custom_page = document.getElementById("custom-page"); 
let list_form = document.getElementById("list-form");
let custom_form = document.getElementById("custom-form"); 
let list_name=document.getElementById("create-list"); 
let custom_lists_container = document.getElementById("custom-lists-container"); 
let list_select = document.getElementById("list-choice");
let custom_title = document.getElementById("custom-title"); 
let custom_genre = document.getElementById("custom-genre");
let blur_container = document.getElementById("blur-container");  

let default_message_custom_1 = document.getElementById("default-message-custom1");
let default_message_custom_2 = document.getElementById("default-message-custom2");



let CURRENT = "Movie"; //This variable is used to refer to the current tab used on main.html (between Movies, Series and Custom); 

class Item{ //The class is used for every item that gets pushed into a list; 
    constructor(id,title, genre, category, list_choice){
        this.id=id; 
        this.title=title; 
        this.genre=genre; 
        this.category=category; 
        this.list_choice = list_choice; 
        this.seen = false; 
        this.last_added= false; 
    }
}

class List{ //This class is used to store the custom lists created in the custom tab; 
    constructor(id, name){
        this.id=id; 
        this.name=name;  
    }
}

const STORAGE_KEY_ITEMS = "list.key";
const STORAGE_KEY_LISTS = "list.key.custom"; 

let array = JSON.parse(localStorage.getItem(STORAGE_KEY_ITEMS))||[]; 
let list_of_lists=JSON.parse(localStorage.getItem(STORAGE_KEY_LISTS))||[]; 

//Display the page when loaded, given a url query, specified in the anchors of index.html; 
const url = window.location.search;  
getCURRENT(url); 
display_tab(CURRENT); 

function save_item(current_array, current_storage_key){ // Stores a list in the local storage.
    localStorage.setItem(current_storage_key, JSON.stringify(current_array));    
}

function render_items(category){ // Render items of the category "Series" or "Movie"; 
    clear_elts(list);
    array = JSON.parse(localStorage.getItem(STORAGE_KEY_ITEMS))||[];

    for(let i = 0; i < array.length; i++){
        if(array[i].category===category && array[i].seen===false){
            // Dynamically create new HTML elements;
            let li = document.createElement("li");
            let p1 = document.createElement("p");
            let p2 = document.createElement("p"); 

            // Update content and classes of the said elts;
            p1.innerHTML=array[i].title;
            p1.classList.add("movie-title");
            li.id=array[i].id; 
            p2.innerHTML=array[i].genre; 
    
            // Add and remove the class of last-added, which triggers a css animation (in style.css);
            if(array[i].last_added === true){
                li.classList.add("last-added"); 
            }
            else{
                li.classList.remove("last-added"); 
            }

            // Append the newly created elts to the DOM;
            list.appendChild(li);
            li.appendChild(p1);
            li.appendChild(p2); 
        }
    }
    if(!list.firstChild){ 
        let li = document.createElement("li"); 
        li.innerHTML="Start building your list by filling the form on the left !"; 
        li.classList.add("default-message"); 
        list.appendChild(li); 
    }
    
    
}

function render_custom_items(){ //Render items created in the Custom tab; 
    clear_elts(custom_lists_container); 
    list_of_lists=JSON.parse(localStorage.getItem(STORAGE_KEY_LISTS))||[];
    array = JSON.parse(localStorage.getItem(STORAGE_KEY_ITEMS))||[]; 

    for(let i=0; i < list_of_lists.length; i++){ // Create an ul element for each existing custom list;

        let cancel = document.createElement("img"); 
        let ul = document.createElement("ul"); 
        let h3 = document.createElement("h3"); 


        ul.classList.add("custom-list"); 
        ul.classList.add("list");
        ul.id=list_of_lists[i].id; 
        h3.innerHTML=list_of_lists[i].name; 

        cancel.alt="delete";
        cancel.src="img/cancel.png";
        cancel.classList.add("delete-button"); 
        cancel.classList.add("list-button");
        cancel.title="Click to delete list";

        custom_lists_container.appendChild(ul); 
        ul.appendChild(cancel); 
        ul.appendChild(h3); 
        
        for(let j=0; j<array.length;j++){ // Create, update and append HTML elements to the custom list "ul" we are looping through; 
            if(array[j].seen===false && array[j].list_choice === list_of_lists[i].name){ //Retrieve list items that are not seen and matching the custom list in which we are looping; 
                let li = document.createElement("li"); 
                let p1 = document.createElement("p"); 
                let p2 = document.createElement("p");                
    
                li.id=array[j].id; 
                p1.innerHTML=array[j].title; 
                p1.classList.add("movie-title");
                p2.innerHTML=array[j].genre + " - " + array[j].category;
                
                // Add and remove the class of last-added, which triggers a css animation (in style.css);
                if(array[j].last_added === true){
                    li.classList.add("last-added");  
                }
                else{
                    li.classList.remove("last-added"); 
                }

                ul.appendChild(li);  
                li.appendChild(p1);
                li.appendChild(p2);  
            }
        }
    }
    render_custom_modals(); 
}

function clear_elts(elt){ // Clear a HTML element of its children; 
    while(elt.firstChild){
        elt.removeChild(elt.firstChild); 
    }
}

 
function render_list_choice(){ // Update the select element in the custom form in main.html.
    clear_elts(list_select); 

    list_of_lists=JSON.parse(localStorage.getItem(STORAGE_KEY_LISTS))||[];

    if(list_of_lists.length > 0){
        for(let i = 0; i < list_of_lists.length; i++){ 
            let option = new Option(list_of_lists[i].name,list_of_lists[i].name);
            option.id=list_of_lists[i].id;      
            list_select.add(option, undefined);
        }
    }
    else{
        let option = new  Option("No lists found", "default_option");
        list_select.add(option, undefined); 
    }
}

function display_tab(CURRENT){ 
    /* Update content of main.html given the current selected tab : 
    - Change the label of the form (for Series and Movies only);
    - Change the background image; 
    - Add and remove the class "selected" to the header; 
    - Change the display property of list_page and custom_page; 
    - Call a function to render the page; 
    */
    
    if(CURRENT === "Movie"){
        label_title.innerHTML="Movies title";
        body.style.backgroundImage="url('img/films.jpg')"; 
        series_header.classList.remove("selected"); 
        custom_header.classList.remove("selected");
        movie_header.classList.add("selected");
        list_page.style.display="flex"; 
        custom_page.style.display="none"; 

        render_items(CURRENT);
    }
    else if(CURRENT === "Series"){
        label_title.innerHTML="Series title";
        body.style.backgroundImage="url('img/series.jpg')"; 
        series_header.classList.add("selected"); 
        movie_header.classList.remove("selected");
        custom_header.classList.remove("selected");
        list_page.style.display="flex"; 
        custom_page.style.display="none"; 

        render_items(CURRENT);
    }
    else if(CURRENT = "custom"){
        body.style.backgroundImage="url('img/custom2.jpg')"; 
        list_page.style.display="none"; 
        custom_page.style.display="flex"; 
        custom_header.classList.add("selected");
        movie_header.classList.remove("selected");
        series_header.classList.remove("selected");
        
        render_custom_items();
        render_list_choice();
    }
}

function delete_list(event){ // If the clicked element is the cross, find the list in the right list, and delete the items put in it; 
    array = JSON.parse(localStorage.getItem(STORAGE_KEY_ITEMS))||[]; 
    if(event.target.classList.contains("delete-button")){ 
        for(let i = 0; i<list_of_lists.length; i++){
            if(event.target.parentElement.id==list_of_lists[i].id){
                for(let j = array.length-1; j>-1; j--){
                    if(array[j].list_choice==list_of_lists[i].name){
                        array.splice(j, 1); 
                    }
                } 
                list_of_lists.splice(i, 1); 
            }
        }
        
        save_item(list_of_lists, STORAGE_KEY_LISTS);
        save_item(array, STORAGE_KEY_ITEMS); 
        render_custom_items(); 
        render_list_choice(); 
    }
}

function handle_last_added(){ // Update last_added property of array items, in order to trigger animation;
    if(array.length > 1){
        array[array.length-1].last_added = true;
        array[array.length-2].last_added = false; 
    }
    else{
        array[0].last_added = true; // Handle the case where no item has been added yet; 
    }
}

function render_custom_modals(){ // Display modals that explain how the page works; 
    if(!custom_lists_container.firstChild){ 
        
        default_message_custom_1.style.top = (list_form.clientHeight -50)/2+ "px";
        default_message_custom_1.style.left = (list_form.clientWidth + list_form.clientLeft + 20) + "px";  
        default_message_custom_2.style.top = (custom_form.clientHeight-30) + "px";
        default_message_custom_2.style.left = (custom_form.clientWidth + custom_form.clientLeft + 20) + "px";  
        
        default_message_custom_1.style.display="inline-block"; 
        default_message_custom_2.style.display="inline-block"; 

        let media_query = window.matchMedia("(max-width : 600px)"); // Hide the modals if the window is too small; 
        if(media_query.matches){
            default_message_custom_1.style.display = "none"; 
            default_message_custom_2.style.display = "none"; 

        }
    }
    else{
        default_message_custom_2.style.display="none"; 
        default_message_custom_1.style.display="none"; 
    }
}

function getCURRENT (url){
    switch(url){
        case "?movies":
            CURRENT = "Movie"; 
            break;
        case "?series": 
            CURRENT = "Series"; 
            break;
        case "?custom": 
            CURRENT ="custom";
            break; 
        default : 
            break; 
    }
} 

movie_series_form.addEventListener("submit", e=>{
    /* Handle submission of the form in Movies and Series tab :
    - Create new item; 
    - Push into the array; 
    - Save and render the page; 
    - Reset the form so that it stays blank; 
    */
    e.preventDefault(); 
    let new_item = new Item(Date.now(),item_name.value, genre.value, CURRENT, "none"); //Create new Item 
    array.push(new_item);
    handle_last_added();
    save_item(array, STORAGE_KEY_ITEMS);
    render_items(new_item.category); 
    movie_series_form.reset();  
});

custom_lists_container.addEventListener("click", e=>{
    delete_list(e); 
});

window.addEventListener("locationchange", e=>{ // Updates CURRENT and render
   
    url = window.location.search; 
    getCURRENT(url); 
    display_tab(CURRENT); 
});

list_form.addEventListener("submit", e=>{ 
    /* When a list is created : 
    - Create a new list; 
    - Push it into list_of_lists; 
    - Save and render; 
    - Reset the form;  
    */
    e.preventDefault(); 
    let new_list = new List(Date.now(),list_name.value);
    list_of_lists.push(new_list); 
    save_item(list_of_lists, STORAGE_KEY_LISTS); 
    render_list_choice();
    render_custom_items(); 
    list_form.reset(); 

});

custom_form.addEventListener("submit", e=>{ 
    /*When an item is pushed into a list;
    - Get value of category (Movie or Series); 
    - Create a new item if the a list is selected, or else display error message; 
    - Push item into array; 
    - Reset form; 
    */
    e.preventDefault(); 
    let category = document.querySelector("input[name='category']:checked").value;
    if(list_select.value !="default_option"){
        let new_item = new Item(Date.now(), custom_title.value, custom_genre.value, category, list_select.value); 
        array.push(new_item); 
        handle_last_added(); 
    
        save_item(array, STORAGE_KEY_ITEMS); 
        render_custom_items();
    }  
    else{
        alert("You must create a list first..."); 
    }

    custom_form.reset(); 
});

window.addEventListener("resize", e=>{
    render_custom_modals(); 
});