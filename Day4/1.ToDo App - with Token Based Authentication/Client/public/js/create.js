console.log('_________create a task in client side ');
const form = document.querySelector('.create-form');

form.addEventListener('submit', async(e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const name = formData.get('name');
    const body = { name };


    const res = await  fetch('http://localhost:8080/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
   });

   window.location.href = '/';
});