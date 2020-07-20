const createQuote = async text => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:3000/api/v1/quotes',
      data: {
        quote: text
      }
    });
    
    if(res.data.status === 'success') {
      showAlert('success', 'Quote successfully created');
      location.assign('/dashboard');
    }
  } catch (e) {
    showAlert('error', e.response.data.message);
  }
};

const createQuoteForm = document.getElementById('create__quote--form');

createQuoteForm.addEventListener('submit', e => {
  e.preventDefault();
  const text = document.querySelector('.create__quote--content').value;
  createQuote(text);
})