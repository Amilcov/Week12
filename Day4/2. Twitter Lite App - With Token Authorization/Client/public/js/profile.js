const token = localStorage.getItem('TWITTER_LITE_ACCESS_TOKEN');

document.addEventListener('DOMContentLoaded', async (e) => {
    e.preventDefault();

    try {
        const userId = localStorage.getItem('TWITTER_LITE_CURRENT_USER_ID');

        const res = await fetch(`http://localhost:8080/users/${userId}/tweets`, {
            method: "GET",
            headers: {
                "Content-Type": "json",
                "Authorization": `Bearer ${token}`
            }
        });

   

        if (res.status === 401) {
            window.location.href = '/log-in';
            return;
        };



        if (!res.ok) {
            throw res;
        }
 
        const tweets = await res.json();
        const tweetsContainer = document.querySelector('.tweets-container');
        
        const tweetsHTLM = tweets.map( ({message, id}) =>  `
          <div class="card" id="tweet-${id}">
            <div class="card-body">
              <p class="card-text"> ${message} </p>
              <button class="btn btn-danger delete-button" id="${id}"> Delete </button>
             </div>
        
          </div>
        ` 
        );
        tweetsContainer.innerHTML = tweetsHTLM.join("");

    } catch(err) {

        if(err.status >= 400 && err.status < 600) {
           console.error(err);
        } else {
           alert('Something went wrong. Please check internet connection and try again');
        }

    };


    const deleteButtons = document.querySelectorAll('.delete-button');
    if (deleteButtons) {
        deleteButtons.forEach( (button) => {
            button.addEventListener('click', handleDelete);
        });
    
    };
    
});


    

  



async function handleDelete(id) {
 console.log(` FC HANDLE Delete this.id= ${this.id}, id= ${id}`);

    try {
    
        const res = await fetch(`http://localhost:8080/tweets/${this.id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        console.log('here1');

        if (res.status === 401) {
           window.location.href = '/log-in';
        };

         console.log('here2');

        if (!res.ok) {
           throw res;
        };

         console.log('here3');
        window.location.href = '/';


    } catch(err) {
         
       if (err.status >= 400 && err.status < 600 ) {

          const errorsJSON = await res.json();
          const errorsContainer = document.querySelector('.errors-container'); 

          let errorsHTML = [`
             <div class="card card-danger">
                <p>  Something went wrong. Please try again.</p>
             </div>
          `];

           const { errors } = errorsJSON;
           if ( errors && Array.isArray(errors)) {
              errorsHTML = errors.map( (message) => {
               ` 
                 <div class="card card-danger"> 
                    <p> ${message}</p>
                  </div>
               `
           });
        }

       errorsContainer.innerHTML = errorsHTML.join("");


       } else {
         console.error('Something went wrong. Please ceck internet connection and try again.')
       }

        // const result = await res.json();
        // if (err.status >= 401 && err.status < 600) {

        // } else {
        //     console.error('Something went wrong. Please check internet connection and try again.')
        // }
    }

    
 
  
      
  
}

