const createQuote = async (text, author, tag) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/quotes',
      data: {
        quote: text,
        author,
        tag
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
  const author = document.querySelector('.author__input').value;
  const tag = document.querySelector('.tag__input').value;
  
  createQuote(text, author, tag);
})