let genre_buttons = document.getElementById("genre-buttons-container"); 
let genre_list= document.getElementById("genre-list");
let modal = document.getElementById("modal-no-genre-selected"); 
let array = JSON.parse(localStorage.getItem("list.key"))||[]; 

function render_genre(event){ //Render all list items that have the same genre value that the clicked button;
    clear_elts(genre_list); 
    for(let i=0; i<array.length;i++){
        if(event.target.innerHTML.toLowerCase()===array[i].genre.toLowerCase()){
            let li = document.createElement("li"); 
            let p = document.createElement("p"); 

            li.classList.add("movie-title"); 
            li.innerHTML=array[i].title; 
            p.innerHTML=array[i].category; 

            genre_list.appendChild(li); 
            li.appendChild(p); 
        }
    }
    
    if(!genre_list.firstChild && event.target.tagName==="BUTTON"){ // Handle the case in which no genre is selected, by displaying a message in the list container; 
        let li = document.createElement("li"); 
        li.innerHTML="No elements found in " + event.target.innerHTML + "."; 
        li.classList.add("modal-more"); 
        genre_list.appendChild(li); 

    }
}

function clear_elts(elt){
    while (elt.firstChild){
        elt.removeChild(elt.firstChild); 
    }
}

genre_buttons.addEventListener("click", e=>{
    render_genre(e); 
});

