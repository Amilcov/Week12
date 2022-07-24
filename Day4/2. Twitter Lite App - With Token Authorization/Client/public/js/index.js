
document.addEventListener('DOMContentLoaded', async() => {
  try {
                           
    userId = localStorage.getItem("TWITTER_LITE_CURRENT_USER_ID");
    token = localStorage.getItem("TWITTER_LITE_ACCESS_TOKEN")
    
    const res = await fetch(`http://localhost:8080/tweets`, 
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if(res.status === 401) {
      window.location.href = '/log-in';
      return;
    }
    
    const {tweets} = await res.json();
 
    const tweetsContainer = document.querySelector('.tweets-container');
    const tweetsHTLM = tweets.map( ({message, user: {username}}) => `
        <div class='card'>
          <div class='card-header'> 
             ${username} 
          </div>
          <div class='card-body'>
            <p class='card-text'> ${message} </p>
          </div> 
        </div>   
    `);
    tweetsContainer.innerHTML = tweetsHTLM.join('');
  } catch (err) {
    console.error(err);
  }
});




