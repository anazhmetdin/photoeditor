$(function() {
    const canvas = document.querySelector("canvas"),
        toolBtns = document.querySelectorAll(".tool"),
        fillColor = document.querySelector("#fill-color"),
        sizeSlider = document.querySelector("#size-slider"),
        colorBtns = document.querySelectorAll(".colors .option"),
        colorPicker = document.querySelector("#color-picker"),
        clearCanvas = document.querySelector(".clear-canvas"),
        saveImg = document.querySelector(".save-img"),
        ctx = canvas.getContext("2d");
    
    // global variables with default value
    let prevMouseX,
        prevMouseY,
        snapshot,
        initWidth,
        initHeight,
        lastWidth,
        lastHeight,
        isDrawing = false,
        selectedTool = "brush",
        brushWidth = 5,
        selectedColor = "#000";
    
    const setCanvasBackground = () => {
        // setting whole canvas background to white, so the downloaded img background will be white
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = selectedColor; // setting fillstyle back to the selectedColor, it'll be the brush color
    };
    
    function resizeCanvas(canvas) {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        ctx.putImageData(snapshot, 0, 0);
    
        // ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height);
        /*
        ratio = 658 / 1362;
        canvas.width = document.body.clientWidth < 1362 ? document.body.clientWidth : 1362;
        canvas.height = canvas.width * ratio;
        */
    }
    
    window.addEventListener("resize", () => {
        resizeCanvas(canvas);
        //ctx.putImageData(snapshot, 0, 0);
        // ctx.drawImage(base_image, 0, 0, canvas.width, canvas.height);
    });
    
    window.addEventListener("load", () => {
        // setting canvas width/height.. offsetwidth/height returns viewable width/height of an element
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        initWidth = canvas.width;
        initHeight = canvas.height;
        setCanvasBackground();
        //console.log("offsetWidth is = " + canvas.offsetWidth);
        //console.log("document.body.clientWidth = " + document.body.clientWidth);
    });
    
    const drawRect = (e) => {
        // if fillColor isn't checked draw a rect with border else draw rect with background
        if (!fillColor.checked) {
            // creating circle according to the mouse pointer
            return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
        }
        ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    };
    
    const drawCircle = (e) => {
        ctx.beginPath(); // creating new path to draw circle
        // getting radius for circle according to the mouse pointer
        let radius = Math.sqrt(
            Math.pow(prevMouseX - e.offsetX, 2) + Math.pow(prevMouseY - e.offsetY, 2)
        );
        ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI); // creating circle according to the mouse pointer
        fillColor.checked ? ctx.fill() : ctx.stroke(); // if fillColor is checked fill circle else draw border circle
    };
    
    const drawLine = (e) => {
        // Draw Line
        ctx.beginPath();
        ctx.moveTo(mousedown.x, mousedown.y);
        ctx.lineTo(loc.x, loc.y);
        ctx.stroke();
    };
    const drawTriangle = (e) => {
        ctx.beginPath(); // creating new path to draw circle
        ctx.moveTo(prevMouseX, prevMouseY); // moving triangle to the mouse pointer
        ctx.lineTo(e.offsetX, e.offsetY); // creating first line according to the mouse pointer
        ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY); // creating bottom line of triangle
        ctx.closePath(); // closing path of a triangle so the third line draw automatically
        fillColor.checked ? ctx.fill() : ctx.stroke(); // if fillColor is checked fill triangle else draw border
    };
    
    const startDraw = (e) => {
        isDrawing = true;
        prevMouseX = e.offsetX; // passing current mouseX position as prevMouseX value
        prevMouseY = e.offsetY; // passing current mouseY position as prevMouseY value
        ctx.beginPath(); // creating new path to draw
        ctx.lineWidth = brushWidth; // passing brushSize as line width
        ctx.strokeStyle = selectedColor; // passing selectedColor as stroke style
        ctx.fillStyle = selectedColor; // passing selectedColor as fill style
        // copying canvas data & passing as snapshot value.. this avoids dragging the image
        snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
        // console.log(e.offsetX, e.offsetY);
        // console.log(e.clientX, e.clientY);
        // console.log(snapshot);
        // console.log(mousedown.x, mousedown.y);
    };
    
    const drawing = (e) => {
        if (!isDrawing) return; // if isDrawing is false return from here
        // console.log(snapshot);
        ctx.putImageData(snapshot, 0, 0); // adding copied canvas data on to this canvas
        // console.log("offsetWidth is = " + canvas.offsetWidth);
        if (selectedTool === "brush" || selectedTool === "eraser") {
            // if selected tool is eraser then set strokeStyle to white
            // to paint white color on to the existing canvas content else set the stroke color to selected color
            ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
            ctx.lineTo(e.offsetX, e.offsetY); // creating line according to the mouse pointer
            ctx.stroke(); // drawing/filling line with color
        } else if (selectedTool === "rectangle") {
            drawRect(e);
        } else if (selectedTool === "circle") {
            drawCircle(e);
        } else if (selectedTool === "line") {
            // Draw Line
            ctx.beginPath();
            ctx.moveTo(mousedown.x, mousedown.y);
            ctx.lineTo(loc.x, loc.y);
            ctx.stroke();
        } else {
            drawTriangle(e);
        }
    };
    
    toolBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            // adding click event to all tool option
            // removing active class from the previous option and adding on current clicked option
            document.querySelector(".options .active").classList.remove("active");
            btn.classList.add("active");
            selectedTool = btn.id;
        });
    });
    
    sizeSlider.addEventListener("change", () => (brushWidth = sizeSlider.value)); // passing slider value as brushSize
    
    colorBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            // adding click event to all color button
            // removing selected class from the previous option and adding on current clicked option
            document.querySelector(".options .selected").classList.remove("selected");
            btn.classList.add("selected");
            // passing selected btn background color as selectedColor value
            selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
        });
    });
    
    colorPicker.addEventListener("change", () => {
        // passing picked color value from color picker to last color btn background
        colorPicker.parentElement.style.background = colorPicker.value;
        colorPicker.parentElement.click();
    });
    
    clearCanvas.addEventListener("click", () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // clearing whole canvas
        setCanvasBackground();
    });
    
    saveImg.addEventListener("click", () => {
        const link = document.createElement("a"); // creating <a> element
        link.download = `canvas.jpg`; // passing current date as link download value
        canvas.width = initWidth;
        canvas.height = initHeight;
        link.href = canvas.toDataURL(); // passing canvasData as link href value
        link.click(); // clicking link to download image
        //console.log(canvas);
        // canvas.width = lastWidth;
        // canvas.height = lastHeight;
        //console.log(canvas);
    });
    
    canvas.addEventListener("mousedown", startDraw);
    canvas.addEventListener("mousemove", drawing);
    canvas.addEventListener("mouseup", function () {
        snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
        //ctx.putImageData(snapshot, 0, 0);
        isDrawing = false;
    });
    
    /*
    let ratio;
    function resizeCanvas(canvas) {
        ratio = 658 / 1362;
        canvas.width = document.body.clientWidth < 1362 ? document.body.clientWidth : 1362;
        canvas.height = canvas.width * ratio;
    }
    
    window.addEventListener("resize", () => {
        resizeCanvas(canvas);
        ctx.putImageData(snapshot, 0, 0);
        // ctx.drawImage(base_image, 0, 0, canvas.width, canvas.height);
    });
    */
    /*
    ratio = 400 / 800;
    canvas.width = document.body.clientWidth < 800 ? document.body.clientWidth : 800;
    canvas.height = canvas.width * ratio;
    */
    
    /*
    let base_image = new Image();
            base_image.crossOrigin = "anonymous"
            base_image.src = document.getElementById('image_' + fieldId).src
            base_image.onload = function() {
                ctx.drawImage(base_image,0,0,canvas.width, canvas.height);
    */

})
