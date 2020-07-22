const signup = async data => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'https://quoteapps.herokuapp.com/api/v1/users/signup',
      data
    });
    
    if(res.data.status === 'success') {
      showAlert('success', 'Signup successfully');
      location.assign('/dashboard');
    }
    
  } catch (e) {
    showAlert('error', e.response.data.message);
  }
};



// DOM
const signupBtn = document.getElementById('form__rg');

if(signupBtn) {
  signupBtn.addEventListener('submit', e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', document.getElementById('fullname__rg').value);
    formData.append('nickname', document.getElementById('nickname__rg').value);
    formData.append('email', document.getElementById('email__rg').value);
    formData.append('photo', document.getElementById('photo').files[0]);
    formData.append('password', document.getElementById('password__rg').value);
    formData.append('passwordConfirm', document.getElementById('passwordConfirm__rg').value);
  
    signup(formData);
  });
}