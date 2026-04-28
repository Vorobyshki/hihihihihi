const btn = document.getElementById('btn');        
const result = document.getElementById('result');  

function getRandomColor() {
    const r = Math.floor(Math.random() * 256);  
    const g = Math.floor(Math.random() * 256);  
    const b = Math.floor(Math.random() * 256);  
    return `rgb(${r}, ${g}, ${b})`;
}

btn.addEventListener('click', () => {
    const color = getRandomColor();     
    document.body.style.backgroundColor = color;  
    result.textContent = color;         
});