const form=document.getElementById("form1"),form_title=document.getElementById("title"),not_title_warning=document.querySelector(".not_title_warning"),html_container=document.querySelector(".html_container"),validate_title=()=>form_title.value.trim().length>0||(not_title_warning.style.display="block",setTimeout(()=>{not_title_warning.style.display="none"},2e3),!1),create_url=(e,t)=>{const o="https://www.googleapis.com/books/v1/volumes?";return"search_for_text"==e?o+"q="+t:o},search_book=(e,t)=>{const o=create_url(e,t);fetch(o).then(e=>e.ok?Promise.resolve(e):Promise.reject(e)).then(e=>e.json()).then(e=>view_book(e.items)).catch(e=>console.log(e))},view_book=e=>{const t=document.createDocumentFragment();for(let o=0;o<e.length;o++){const{imageLinks:n,title:l}=e[o].volumeInfo,{smallThumbnail:r,thumbnail:i}=n,a=document.createElement("DIV"),m=document.createElement("IMG"),c=document.createElement("P");a.setAttribute("class","grid_item"),m.setAttribute("src",r),c.textContent=l,a.appendChild(m),a.appendChild(c),t.appendChild(a)}html_container.appendChild(t)};form.addEventListener("submit",e=>{e.preventDefault();try{form_title.value.trim().length>0||(not_title_warning.style.display="block",setTimeout(()=>{not_title_warning.style.display="none"},2e3),0)?(search_book("search_for_text",form_title.value),form.reset()):console.log("mensaje de error")}catch(e){throw e}}),addEventListener("load",()=>{form_title.focus()});