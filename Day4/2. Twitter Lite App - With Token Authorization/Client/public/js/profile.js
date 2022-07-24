document.addEventListener('DOMContentLoaded', async (e) => {
    e.preventDefault();

    try {
        const token = localStorage.getItem('TWITTER_LITE_ACCESS_TOKEN');
        const userId = localStorage.getItem('TWITTER_LITE_CURRENT_USER_ID');

        const res = await fetch(`http://localhost:8080/users/${userId}/tweets`, {
            method: "GET",
            headers: {
                "Content-Type": "json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (res.status == 401) {
            window.location.href  ='/log-in';
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
             </div>
          </div>
        ` 
        );
        tweetsContainer.innerHTML = tweetsHTLM.join("");

    } catch(err) {

        if(err.status >= 400 && err.status<600) {
           console.error(err);
        } else {
            alert('Someting went wrong.Check internet connection and try again');
        }

    };

})
