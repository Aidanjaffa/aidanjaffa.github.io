//const div = document.querySelector(".gradient")

const about = false;
const exp = false;
const tech = false;
const projects = false;


document.addEventListener("mousemove", e =>{
    let x = e.clientX;
    let y = e.clientY;

    x = (x / window.innerWidth) * 100;
    y = (y / window.innerHeight) * 100;
    //div.style.background = `radial-gradient(circle 800px at ${x}% ${y}%, rgb(75, 147, 94), rgb(33, 28, 106))`;
    //div.style.background = `radial-gradient(circle 800px at 10% 90%, rgb(89, 180, 195), rgb(33, 28, 106))`;

})

// MENU BUTTONS
document.querySelectorAll("a").forEach(e => {
    e.addEventListener("click", function(x){
        switcher(e.id);
    })
})

function switcher(id){
    document.getElementById("about").classList.remove("visible");
    document.getElementById("experience").classList.remove("visible")
    document.getElementById("technologies").classList.remove("visible")
    document.getElementById("projects").classList.remove("visible")

    let div;
    switch (id){
        case "a":
            div = document.getElementById("about");
            break;
        case "e":
            div = document.getElementById("experience");
            break;
        case "t":
            div = document.getElementById("technologies");
            break;
        case "p":
            div = document.getElementById("projects");
            break;
    }
    document.getElementById(id).scrollIntoView({ behavior: 'auto', block: 'start' });
    div.classList.add("visible");
    AOS.refresh();
}


document.querySelectorAll("#card").forEach(e => {
    e.addEventListener("mouseover", function(x) {
        const overlay = document.createElement('div');
        overlay.className = "overlay";
        overlay.style.background = "rgba(240, 248, 255, 0.2)";
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.position = "absolute";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.pointerEvents = "none"; // Add this line
        overlay.style.borderRadius = "10px";
        e.style.position = "relative";
        e.appendChild(overlay);
        let id = e.querySelector("h2").id;
        document.getElementById(id).style.visibility = "visible";
        writeText(id);
        
    });
    e.addEventListener("mouseout", function(x) {
        const overlay = e.querySelector('.overlay');
        let id = e.querySelector("h2").id;
        if (overlay) {
            e.removeChild(overlay);
            document.getElementById(id).style.visibility = "hidden";
        }
    });
});

function writeText(id){
    let div = document.querySelector(".display-card");
    let h1 = div.querySelector("h1");
    let p = div.querySelectorAll("p");
    h1.textContent = "";
    h1.style.textAlign = "center"

    for (x of p)
        x.textContent = "";
    switch (id){
        case "1":
            h1.textContent = "Edge Brawlers"

            p[0].textContent = "Edge Brawlers is a fast-paced video game I built in python. It requires a controller to play and allows as many players as you can plug in controllers. It is a free for all fighting style game where the aim is to dash into the other players to knock them off the edge and be the last one standing."
            p[1].textContent = "Controls: A - Jump, X - Dash, Y - Change Colour"
            break;
        case "2":
            h1.textContent = "Pixel Art Editor"
            p[0].textContent = "A web based pixel art editor written with html, css and vanilla JavaScript. Currently in the process of adding more features, it allows the user to draw on a predetermined grid size, change colour, use the eyedropper to select a previous colours, erase, zoom, rename the document and save it as a png to your desktop"
            p[1].textContent = "Controls are on the side bar but also there are keyboard shortcuts. B = Draw, E = Erase, I = Eyedropper. You can also use the plus and minus keys on your keyboard to zoom in and out and hold the Alt key and click to pan the grid around."
            break;
        case "3":
            h1.style.textAlign = "center"
            h1.textContent = "dSchool Africa"
            p[0].textContent = "dSchool Africa is a Charity based in Kenya providing schooling to underprivelidged individuals. I overhauled the old website to look more professional and line with the design documentation I was sent as well fix some bugs that were present on the site"
            break;
    }
}