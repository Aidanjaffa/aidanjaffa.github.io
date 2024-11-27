console.log("hi");
const canvas = document.querySelector('canvas');
const preview = document.getElementById('preview');
const ex = document.getElementById('export');

var c = canvas.getContext("2d");
var p = preview.getContext("2d");
var e = ex.getContext("2d");

var picker = document.getElementById('colorPicker');
var Mouse = [0, 0, false, false];
var pan = false;
// Looking out for various mouse Events
canvas.addEventListener("mousedown", mouseEvent);
canvas.addEventListener("mouseup", mouseEvent);
canvas.addEventListener("mousemove", mouseEvent);
window.addEventListener("keydown", mouseEvent);
window.addEventListener("keyup", mouseEvent);

const pickr = Pickr.create({
    el: '#color-picker',
    theme: 'nano', // or 'monolith', 'nano'
    default: '#000000',
  
    swatches: [
      'rgba(244, 67, 54, 1)',
      'rgba(233, 30, 99, 0.95)',
      'rgba(156, 39, 176, 0.9)',
      'rgba(103, 58, 183, 0.85)',
      'rgba(63, 81, 181, 0.8)',
      'rgba(33, 150, 243, 0.75)',
      'rgba(3, 169, 244, 0.7)',
      'rgba(0, 188, 212, 0.7)',
      'rgba(0, 150, 136, 0.75)',
      'rgba(76, 175, 80, 0.8)',
      'rgba(139, 195, 74, 0.85)',
      'rgba(205, 220, 57, 0.9)',
      'rgba(255, 235, 59, 0.95)',
      'rgba(255, 193, 7, 1)'
    ],
    position: 'bottom',
    components: {
      // Main components
      preview: true,
      opacity: true,
      hue: true,
  
      // Input / output Options
      interaction: {
        hex: true,
        rgba: true,
        hsla: true,
        hsva: true,
        cmyk: true,
        input: true,
        clear: true,
        save: true
      }
    }
  });

var draw = false;
var erase = false;
var eyedrop = false;
var fill = false;
document.querySelectorAll('button').forEach(button => {
    button.addEventListener("click", function(){
        switch(this.id){
            case "plus":
                zoom(+0.1);
                break;
            case "minus":
                zoom(-0.1);
                break;
            case "undo":
                break
            case "erase":
                selector(this.id);
                break
            case "draw":
                selector(this.id);
                break
            case "save":
                save();
                break
            case "eyedrop":
                selector(this.id);
                break
            case "settings":
                document.getElementById("file-settings").classList.toggle("expanded");
                break;
            case "fill":
                selector(this.id);
        }
    })
});

function mouseEvent(event){
    if (event.type === "mousedown")
        Mouse[2] = true;
    if (event.type === "mouseup")
        Mouse[2] = false;
    if (event.type === "mousemove"){
        let bounds = event.target.getBoundingClientRect();
        Mouse[0] = event.pageX - bounds.left - window.scrollX - offset[0]
        Mouse[1] = event.pageY - bounds.top - window.scrollY - offset[1]
    }
    if (event.type === "keydown"){
        if (event.key === "Alt"){
            pan = true;
            origin = [Mouse[0], Mouse[1]];
        }
        if (event.key === "="){
            zoom(0.1);
        }
        if (event.key === "-"){
            zoom(-0.1);
            if (grid.zoomSize < 0.2){
                grid.zoomSize = 0.2;
            }
        }
        if (event.key === "z" && event.ctrlKey){
            if (record[undoCount][0] == "add"){
                console.log("undo")
                grid.gridStates[record[undoCount][1]] [record[undoCount][2]] = "";
                undoCount += 1;
            }
        }
        if (event.key === "b")
            selector("draw"); 

        if (event.key === "e")
            selector("erase");

        if (event.key === "i")
            selector("eyedrop");
    }

    if (event.type === "keyup"){
        if (event.key === "Alt"){
            pan = false;
        }
    }
}

function resizeCanvas() {
    const viewportHeight = window.innerHeight;
    const viewportWidth = Math.max(window.innerWidth / 2, 400);
    const canvasHeight = Math.max(viewportHeight - 50, 500);

    canvas.height = canvasHeight;
    canvas.width = viewportWidth;
}

function save(){
    editor();
    const dataUrl = ex.toDataURL("image/png");
    const link = document.createElement("a");
    let title = document.querySelector("#title").value;
    console.log(title)
    link.href = dataUrl;
    link.download = title + ".png";
    link.click();
}

function zoom(factor){
    grid.zoomSize += factor;
    if (factor > 0) {
        offset[0] -=  grid.w;
        offset[1] -= grid.h;
    }
    else{
        offset[0] +=  grid.w;
        offset[1] += grid.h; 
    }

}

function eyedopper() {
    let pixel = c.getImageData(Mouse[0] + offset[0], Mouse[1] + offset[1], 1, 1).data;
    color = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
    pickr.setColor(color);
}

function selector(ID){
    draw = false;
    erase = false;
    eyedrop = false;
    fill = false;
    document.querySelectorAll("button").forEach(button =>{
        button.classList.remove('active')
        })
    switch (ID){
        case "erase":
            erase = true;
            document.getElementById(ID).classList.add("active");
            break
        case "draw":
            draw = true;
            document.getElementById(ID).classList.add("active");
            break
        case "eyedrop":
            eyedrop = true
            document.getElementById(ID).classList.add("active");
            break
        case "fill":
            fill = true
            document.getElementById(ID).classList.add("active");
    }
}

function floodFill(indey, index, x, y){
    const rows = grid.gridStates.length;
    const columns = grid.gridStates[0].length;
    const targetColor = grid.gridStates[y][x].color;

    if (targetColor === color) return;

    function dfs(c, r){
        if (r < 0 || c < 0 || r >= rows || c >= columns || grid.gridStates[c][r] !== targetColor){
            
        }
    }    

    //grid.gridStates[indey][index] = new Block(x / grid.zoomSize , y / grid.zoomSize, color);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // Initial call to set the size

// Pixel Class
class Block {
    constructor(x, y, colour) {
        this.originalX = x;
        this.originalY = y;
        this.width = 20;
        this.height = 20;
        this.color = colour;
    }

    draw() {
        const scaledX = (this.originalX * grid.zoomSize) + offset[0];
        const scaledY = (this.originalY * grid.zoomSize) + offset[1];
        const scaledWidth = this.width * grid.zoomSize;
        const scaledHeight = this.height * grid.zoomSize;

        console.log("scaled", scaledX, scaledY, "original", this.originalX, this.originalY);
        c.fillStyle = this.color;
        c.fillRect(scaledX, scaledY, scaledWidth, scaledHeight);
    }
    draw_preview() {
        const scaledX = (this.originalX * (preview_grid.zoomSize / 2));
        const scaledY = (this.originalY * (preview_grid.zoomSize / 2));
        const scaledWidth = this.width * (preview_grid.zoomSize / 2);
        const scaledHeight = this.height * (preview_grid.zoomSize / 2);

        p.fillStyle = this.color;
        p.fillRect(scaledX, scaledY, scaledWidth, scaledHeight);
    }
    draw_export() {
        const scaledX = (this.originalX * 0.05);
        const scaledY = (this.originalY * 0.05);
        e.fillStyle = this.color;
        e.fillRect(scaledX, scaledY, 1, 1);
    }
}

class Grid{
    constructor(){
        this.w = 32;
        this.h = 32;
        this.zoomSize = 32 / this.h;
        this.show = true;
        this.gridSize = 20 * this.zoomSize;
        this.gridStates = []
        for (let i = 0; i < this.w; i++){
            this.gridStates[i] = new Array(this.h).fill("");
        }
    }
    draw(){
        this.gridSize = 20 * this.zoomSize;

        c.beginPath()
        for (let x = 0; x <= this.w * this.gridSize; x += this.gridSize) {
            c.moveTo(x + offset[0], 0 + offset[1]);
            c.lineTo(x + offset[0], this.h * this.gridSize + offset[1]);
        }
        
        for (let y = 0; y <= this.h * this.gridSize; y += this.gridSize) {
            c.moveTo(0 + offset[0], y + offset[1]);
            c.lineTo(this.w * this.gridSize + offset[0], y + offset[1]);
        }
        c.strokeStyle = "#000000";
        c.stroke();

    }
}

class PreviewGrid extends Grid{
    constructor(){
        super()
        this.gridSize = 200 / this.gridSize;
        this.zoomSize = this.gridSize / (this.h / 8) ** 2; //quadratic formula so that the zoom is properly on the preview canvas
        this.show = false;
  
    }
    draw(){
        if (this.show){
            p.beginPath()
            for (let x = 0; x <= this.w * this.gridSize; x += this.gridSize) {
                p.moveTo(x, 0);
                p.lineTo(x, this.h * this.gridSize);
            }
            
            for (let y = 0; y <= this.h * this.gridSize; y += this.gridSize) {
                p.moveTo(0, y);
                p.lineTo(this.w * this.gridSize, y);
            }
            p.strokeStyle = "#000000";
            p.stroke();
        }
    }
}


// Always have the editor in a certain position on the viewport

var grid = new Grid();
var preview_grid = new PreviewGrid();
var color = "#000000"
var offset = [(canvas.width / 2) - ((grid.w * grid.gridSize) / 2), (canvas.height / 2) - ((grid.h * grid.gridSize) / 2)];
var record = [grid.gridStates];

ex.height = grid.h
ex.width = grid.w;
preview.height = 200;
preview.width = 200;
console.log(record);

// Main "game" loop
function editor(){
    c.clearRect(0, 0, canvas.width, canvas.height);
    p.clearRect(0, 0, preview.width, preview.height);
    c.fillRect(0, 0, grid.w * grid.gridSize, grid.y * grid.gridSize);

    color = pickr.getColor().toHEXA().toString();
    pickr.setColor(color);

    // Panning logic
    if (pan && Mouse[2]){
        let distx = origin[0] - Mouse[0];
        let disty = origin[1] - Mouse[1];
        offset[0] -= distx / 2;
        offset[1] -= disty / 2;
    }

    // Pixel Drawing Logic
    for (row of grid.gridStates){
        for (rect of row){
            if (rect !== ""){
                //console.log("rect", rect);
                rect.draw_export();
                rect.draw_preview();
                rect.draw();
            }
        }
    }
    if (Mouse[2] && !pan){
        let index = Math.floor(Mouse[0] / grid.gridSize);
        let indey = Math.floor(Mouse[1] / grid.gridSize);
        let x = index * grid.gridSize;
        let y = indey * grid.gridSize;
        if (Mouse[0] < grid.gridSize * grid.w && Mouse[1] < grid.gridSize * grid.h && Mouse[0] > 0 && Mouse[1] > 0)
            {
            if (draw)
            {
                if (grid.gridStates[indey][index].color !== color)
                {
                    grid.gridStates[indey][index] = new Block(x / grid.zoomSize , y / grid.zoomSize, color);
                    record.push(JSON.parse(JSON.stringify(grid.gridStates)));
                    console.log(record);
                }
            }
            
            else if(erase)
            {
                grid.gridStates[indey][index] = "";
                record.push(JSON.parse(JSON.stringify(grid.gridStates)));
            }

            else if (fill)
            {
                floodFill(indey, index, x, y);
            }
            } 
        }

    if (eyedrop && Mouse[2]){
        eyedopper();
    }
    // Pixel Grid Logic
    if (grid.show)
        grid.draw();
        preview_grid.draw();


    requestAnimationFrame(editor);
}
editor();