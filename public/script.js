const userAuth = async () => {
  const email = document.querySelector('.email').value;
  const appName = document.querySelector('.appName').value;
  const postUser = await fetch('/api/v1/authenticate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      appName
    })
  });

  const jwt = await postUser.json();
  $(".display-jwt").append(`<div>${jwt.token}</div>`);
  return jwt;
};

document.querySelector('.submit').addEventListener('click', (event) => {
  event.preventDefault();
  userAuth();

});
