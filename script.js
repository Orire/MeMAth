const canvas = document.getElementById("numberLine");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth * 1.2; // Increase the width for better visibility
canvas.height = 150;

let zoomLevels = [2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50]; // Updated zoom levels
let zoomLevel = 1;
let minX = -10;
let maxX = 10;
let userNumbers = [];

function drawLine() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, height);
    
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
    
    ctx.fillStyle = "black";
    ctx.font = "14px Arial";
    
    const step = (maxX - minX) / 10;
    
    for (let i = minX; i <= maxX; i += step) {
        const x = ((i - minX) / (maxX - minX)) * width;
        const fraction = getFraction(i);
        ctx.fillText(fraction, x - 10, height / 2 + 20);
        ctx.beginPath();
        ctx.moveTo(x, height / 2 - 5);
        ctx.lineTo(x, height / 2 + 5);
        ctx.stroke();
    }
    
    userNumbers.forEach(num => {
        const x = ((num - minX) / (maxX - minX)) * width;
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(x, height / 2, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "black";
        ctx.fillText(num.toFixed(5), x - 10, height / 2 - 15);
    });
}

function getFraction(value) {
    if (value % 1 === 0) return value.toString();
    const precision = 100000;
    for (let denom = 1; denom <= precision; denom++) {
        let num = value * denom;
        if (Math.abs(num - Math.round(num)) < 1e-6) {
            return `${Math.round(num)}/${denom}`;
        }
    }
    return value.toFixed(5);
}

document.getElementById("zoom").addEventListener("change", (event) => {
    zoomLevel = event.target.value;
    minX = -10 / zoomLevel;
    maxX = 10 / zoomLevel;
    drawLine();
});

document.getElementById("reset").addEventListener("click", () => {
    zoomLevel = 1;
    minX = -10;
    maxX = 10;
    drawLine();
});

document.getElementById("resetAll").addEventListener("click", () => {
    userNumbers = [];
    drawLine();
});

document.getElementById("addNumber").addEventListener("click", () => {
    let input = document.getElementById("userNumber").value.trim();
    let value = parseFloat(input);
    
    if (input.includes("/")) {
        let parts = input.split("/");
        if (parts.length === 2) {
            let num = parseInt(parts[0]);
            let denom = parseInt(parts[1]);
            if (!isNaN(num) && !isNaN(denom) && denom !== 0) {
                value = num / denom;
            }
        }
    }
    
    if (!isNaN(value)) {
        userNumbers.push(value);
        drawLine();
    }
});

canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const value = minX + ((x / canvas.width) * (maxX - minX));
    
    alert(`Decimal: ${value.toFixed(5)}`);
});

drawLine();
