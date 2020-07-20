/* Update Profile */
const updateProfile = async formData => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: 'http://localhost:3000/api/v1/users/updateProfile',
      data: formData
    });
    
    if(res.data.status === 'success') {
      showAlert('success', 'User settings successfully updated');
      location.reload(true);
    }
  } catch (e) {
    showAlert('error', e.response.data.message);
  }
}

const updateProfileForm = document.getElementById('update__profile');

if(updateProfileForm) {
  updateProfileForm.addEventListener('submit', e => {
  e.preventDefault();
  const formData = new FormData();
  formData.append('name', document.getElementById('update__name').value);
  formData.append('email', document.getElementById('update__email').value);
  formData.append('photo', document.getElementById('update__photo').files[0]);
  
  updateProfile(formData);
}); 
}

/* Update Password */
const updatePassword = async (curPassword, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: 'http://localhost:3000/api/v1/users/updateMyPassword',
      data: {
        passwordCurrent: curPassword,
        password,
        passwordConfirm
      }
    })
    
    if(res.data.status === 'success') {
      showAlert('success', 'User password successfully updated');
    }
  } catch (e) {
    showAlert('error', e.response.data.message);
  }
}


const passwordUpdateBtn = document.getElementById('update__password');

if(passwordUpdateBtn) {
  passwordUpdateBtn.addEventListener('submit', e => {
    e.preventDefault();
    const currentPassword = document.getElementById('currentPassword').value;
    const password = document.getElementById('password__update').value;
    const passwordConfirm = document.getElementById('passwordConfirm__update').value;
    
    updatePassword(currentPassword, password, passwordConfirm);
  });
}