const hideAlert = () => {
  const el = document.querySelector('.alert');
  if(el) el.parentElement.removeChild(el)
}

const showAlert = (type, msg) => {
  hideAlert();
  const html = `<div class='alert ${type}'>${msg}</div>`
  document.querySelector('body').insertAdjacentHTML('afterbegin', html);
  window.setTimeout(hideAlert, 5000);
}
