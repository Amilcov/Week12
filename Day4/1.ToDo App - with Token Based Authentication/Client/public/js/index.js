//console.log("Hello from index.js!");

document.addEventListener('DOMContentLoaded', async() => {
    const res = await fetch('http://localhost:8080/tasks');
    const { tasks } = await res.json();
    console.log(tasks);

    const tasksContainer = document.querySelector('.tasks-container');
    const tasksHTML = tasks.map( ({ name }) => `
        <div class='card'>
           <div class='card-body'>
             <p class='card-text'> ${name} </p>
           </div> 
         </div> 
        `
    );
    tasksContainer.innerHTML = tasksHTML.join("");
});

