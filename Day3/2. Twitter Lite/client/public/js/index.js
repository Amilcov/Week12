
document.addEventListener('DOMContentLoaded', async() => {
  try {
    //const tweetsContainer = document.querySelector('.tweets-container');

    const res = await fetch("http://localhost:8080/tweets/");
    const {tweets} = await res.json();
    console.log(tweets);

    // const tweetElement = tweets.map( tweet => `
    //     div.card
    //     p.card-text ${message}
    // `);

    // tweetsContainer.innerHTML = tweetElement.join('');
  } catch (err) {
    console.error(err);
  }
});




