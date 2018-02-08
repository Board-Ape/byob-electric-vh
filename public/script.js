const userAuth = async () => {
  const email = $('#email').val;
  const appname = $('#appname').val;
  const postUser = await fetch('/api/v1/authenticate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: email,
      appname: appname
    })
  });

  const jwt = await postUser.json();
  saveJWTtoLS(jwt);
  return jwt;
};

const saveJWTtoLS = (jwt) => {
  localStorage.setItem('A-TEAM', jwt);
};

document.querySelector('#submit').addEventListener('click', (event) => {
  event.preventDefault();
  userAuth();
});
