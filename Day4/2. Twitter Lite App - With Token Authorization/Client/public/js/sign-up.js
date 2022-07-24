const signUpForm = document.querySelector('.sign-up-form');

signUpForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(signUpForm);

    const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');

    const body = { username, email, password };

    try {
       const res = await fetch('http://localhost:8080/users', {
          method: "POST",
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json"
          }
        });

        if (!res.ok) {
            throw res;
        }
       
        const result = await res.json();
        const { user: { id }, token } = result;

        localStorage.setItem('TWITTER_LITE_ACCESS_TOKEN', token);
        localStorage.setItem('TWITTER_LITE_CURRENT_USER_ID', id);

        window.location.href = '/';

    } catch(err) {
      
        if(err.status >= 400 && err.status < 600) {
            const errorsJSON = await err.json();
            let errorsContainer = document.querySelector('.errors-container');
            let errorsHTML = [`
              <div class='alert alert-danger'>
                 Something went wrong. Please try again.
              </div>
            `];

            const { errors } = errorsJSON;
            if (errors && Array.isArray(errors)) {
                errorsHTML = errors.map( message => `
                    <div class='alert alert-danger'>
                        ${message}
                   </div>`);
            }       
            errorsContainer.innerHTML = errorsHTML.join("");
        } else {
            alert('Something went wrong. Please check your internet connection and try again!');
        };

    };



});