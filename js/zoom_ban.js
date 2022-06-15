document.body.addEventListener("wheel", e=>{
if(e.ctrlKey)
    e.preventDefault();//prevent zoom
},{passive:false});

document.body.addEventListener("keydown", function(event) {
    if (event.ctrlKey==true && (event.which == '61' || event.which == '107' || event.which == '173' || event.which == '109'  || event.which == '187'  || event.which == '189'  ) ) {
        event.preventDefault();
    } 
},{passive:false});