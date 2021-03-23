let seen_buttons = document.getElementById("btn-container"); 
let seen_list= document.getElementById("seen-list");
let all_btn = document.getElementById("btn-all"); 
let array = JSON.parse(localStorage.getItem("list.key"))||[]; 


function render_all(){ 
    /* Render every list item with a seen attribute of true.
    If no such item exists in the array, display a message to let the user know; 
    */
    clear_elts(seen_list); 
    array = JSON.parse(localStorage.getItem("list.key"))||[];
    for(let i=0; i<array.length;i++){
        if(array[i].seen){
            let li = document.createElement("li");
            let p = document.createElement("p"); 

            li.classList.add("movie-title"); 
            li.innerHTML=array[i].title; 
            p.innerHTML=array[i].category + " - " + array[i].genre; 

            seen_list.appendChild(li); 
            li.appendChild(p); 
        }
    }
    if(!seen_list.firstChild){
        let li = document.createElement("li"); 
        li.innerHTML="No elements have been added to 'Already Watched' yet."; 
        li.classList.add("modal-more"); 
        seen_list.appendChild(li); 
    }
}

function render_by_genre(event){
    /*Render every list item that has been set to seen = true and that fits the genre selected. 
    Also handle the case in which no item is found;
    */
    clear_elts(seen_list); 
    array = JSON.parse(localStorage.getItem("list.key"))||[];
    for(let i=0; i<array.length;i++){
        if(event.target.innerHTML.toLowerCase()===array[i].genre.toLowerCase() && array[i].seen){
            let li = document.createElement("li"); 
            let p = document.createElement("p"); 

            li.classList.add("movie-title"); 
            li.innerHTML=array[i].title; 
            p.innerHTML=array[i].category; 

            seen_list.appendChild(li); 
            li.appendChild(p); 
        }
    }
    if(!seen_list.firstChild && event.target.tagName==="BUTTON"){
        let li = document.createElement("li"); 
        li.innerHTML="No elements found in " + event.target.innerHTML + "."; 
        li.classList.add("modal-more"); 
        seen_list.appendChild(li); 
    }
}

function clear_elts(elt){
    while (elt.firstChild){
        elt.removeChild(elt.firstChild); 
    }
}

render_all(); // On load; 

seen_buttons.addEventListener("click", e=>{
    if(e.target.innerHTML.toLowerCase()==="all"){
        render_all(); 
        all_btn.classList.add("selected-seen-btn"); 
    }
    else{
        render_by_genre(e); 
        all_btn.classList.remove("selected-seen-btn"); 
    }
});

