// LOGIN
const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url:'/api/v1/users/login',
      data: {
        email,
        password
      }
    });
    
    if(res.data.status === 'success') {
      //alert(JSON.stringify(res.data));
      showAlert('success', 'Logged in Successfully');
      window.setTimeout(() => {
        location.assign('/dashboard');
      }, 1500);
    };
  } catch (e) {
    //alert(e.response.data.message)
    showAlert('error', e.response.data.message)
  }
  
}




// DOM
const registerForm = document.getElementById('form__lg');

if(registerForm) {
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email__lg').value;
    const password = document.getElementById('password__lg').value;
    
    login(email, password);
  });
}


// LOGOUT
const logout = async () => {
  const res = await axios({
    method: 'GET',
    url: '/api/v1/users/logout'
  });
  
    showAlert('success', 'Logging out');
    window.setTimeout(() => {
      location.reload(true)
    }, 1500)
  /*if(res.data.status === 'success') {
  }*/
}



const logoutBtn = document.querySelector('.nav__logout');

if(logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    logout()
  })
}