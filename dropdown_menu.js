let menu_container = document.getElementById("menu-items"); 
let header = document.getElementById("more-div"); 
let shown = false; 

header.addEventListener("click", e=>{
    if(!shown){
        menu_container.style.visibility="visible"; 
        shown=true; 
    }
    else{
        menu_container.style.visibility="hidden";
        shown=false; 
    }
})