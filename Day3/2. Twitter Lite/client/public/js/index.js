
document.addEventListener('DOMContentLoaded', async() => {
  try {
                                                  
    const res = await fetch("http://localhost:8080/tweets");
    const {tweets} = await res.json();
 
    const tweetsContainer = document.querySelector('.tweets-container');
    const tweetsHTLM = tweets.map( ({message}) => `
        <div class='card'>
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




