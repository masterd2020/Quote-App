const updateLove = async (id, num, doc) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/quotes/updateLove/${id}`,
      data: {
        love: num
      }
    })
    
    if(res.data.status === 'success') {
      doc.textContent = num
    }
  } catch (e) {
    showAlert('error', e.response.data.message);
  }
}

const container = Array.from(document.querySelectorAll('.quotes__template--content'));

if(container) {
  container.forEach( (lv, i) => {
    lv.addEventListener('click', e => {
      if(e.target.id === 'lv__heart' || e.target.id === 'lv__hearted') {
        const id = e.target.dataset.id;
        const love = Array.from(document.querySelectorAll('.love'));
        
        if(e.target.style.fill === '') {
          e.target.style.fill = 'red'
          const inc = (love[i].textContent * 1) + 1;
          //love[i].textContent = inc;
          const docInc = love[i];
          
          updateLove(id, inc, docInc)
        } else if(e.target.style.fill === 'red') {
          e.target.style.fill = ''
          const dec = (love[i].textContent * 1) - 1;
        //love[i].textContent = dec;
        const docDec = love[i];
          
          updateLove(id, dec, docDec)
        } 
      }
    });
  });
}