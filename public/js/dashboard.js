// Nav
document.querySelector('.menu__icon').addEventListener('click', () => {
  document.querySelector('.dashboard__tab').style.display = "grid";
});

document.querySelector('.close__nav').addEventListener('click', () => {
  document.querySelector('.dashboard__tab').style.display = "none";
});

// Updating Quote
const updateQuote = async (id, currentUpdateBtn, data) => {
  try {
    currentUpdateBtn.textContent = 'updating...';
    const res = await axios({
      method: 'PATCH',
      url: `http://localhost:3000/api/v1/quotes/${id}`,
      data: {
        quote: data
      }
    });
    
    if(res.data.status === 'success') {
      showAlert('success', 'Quote successfully updated');
      currentUpdateBtn.style.display = 'none';
    }
  } catch (e) {
    showAlert('error', e)
    currentUpdateBtn.textContent = 'update';
  }
}

// Deleting Quote
const deleteQuote = async (id, currentDeleteBtn) => {
  try {
    currentDeleteBtn.textContent = 'deleting...';
    const res = await axios({
      method: 'DELETE',
      url: `http://localhost:3000/api/v1/quotes/${id}`
    });
    
    if(res.data.status === 'success') {
      showAlert('success', 'Quote successfully deleted');
      currentDeleteBtn.style.display = 'none';
      location.reload(true);
    }
  } catch (e) {
    showAlert('error', e)
    currentDeleteBtn.textContent = 'delete';
  }
}

// Box Quote Content
const box = Array.from(document.querySelectorAll('.box__quote'));

box.forEach((el, i) => {
 el.addEventListener('click', e => {
   if(e.target.tagName === 'svg' && e.target.id === 'edt' || e.target.tagName === 'use' && e.target.id === 'edt2') {
     const deleteBox = Array.from(document.querySelectorAll('.btn__delete'));
      deleteBox[i].style.display = 'none'
     
      // 1) Focus the textarea
      const content = Array.from(document.querySelectorAll('.quote__content'))
      content[i].focus();
     
      // 2) Display the update button
      const update = Array.from(document.querySelectorAll('.btn__update'));
      update[i].style.display = 'grid'
      
     // 3) Update the content
     update[i].addEventListener('click', e => {
       //alert(`clicked ${i}`);
       //alert(e.target.dataset.id)
       const data = content[i].value;
       updateQuote(e.target.dataset.id, update[i], data);
     });


// Deleting Quote     
   } else if(e.target.tagName === 'svg' && e.target.id === 'del' || e.target.tagName === 'use' && e.target.id === 'del2') {
     const update = Array.from(document.querySelectorAll('.btn__update'));
      update[i].style.display = 'none'
     
     // 1) Select Element
      const deleteBox = Array.from(document.querySelectorAll('.btn__delete'));
     
     // 2) Display the delete button
      deleteBox[i].style.display = 'grid'
 
     // 2) Delete the content
     deleteBox[i].addEventListener('click', e => {
       //alert(`delete ${i}`);
       //alert(e.target.dataset.id)
       //console.log(e.target.dataset);
       deleteQuote(e.target.dataset.id, deleteBox[i])
     })
     
    }
 })
})