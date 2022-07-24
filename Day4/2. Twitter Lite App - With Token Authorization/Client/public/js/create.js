const createForm = document.querySelector('.create-form');

createForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(createForm);
    const message = formData.get("message");
    const body = { message};

    try {
        const token = localStorage.getItem("TWITTER_LITE_ACCESS_TOKEN");

        const res = await fetch('http://localhost:8080/tweets', {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            
            }    
        });


        if (res.status === 401) {
           window.location.href = '/log-in';
        };

        if(!res.ok) {
           throw res;
        };
      
        window.location.href = '/';
        
    } catch (err) {
      
        if (err.status >= 400 && err.status < 600) {
    
            const errorsJSON = await err.json();
            const errorsContainer = document.querySelector('.errors-container');
            let errorsHTML = [`
             <div class="alert alert-danger">
                Something went wrong.Please try again.
             </div>
            `]

            const {errors} = errorsJSON;
            if (errors && Array.isArray(errors)) {
                errorsHTML = errors.map( err => `
                     <div class="alert alert-danger">
                        ${err}
                     </div>
               `);
            };

            errorsContainer.innerHTML = errorsHTML.join("");

        } else {
            alert('Something went wrong.Please check internet connection and try again!')
        };
 
    };

})