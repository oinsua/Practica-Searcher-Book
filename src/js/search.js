const form = document.getElementById('form1');
const form_title = document.getElementById('title');
const not_title_warning = document.querySelector('.not_title_warning');
const html_container = document.querySelector('.html_container');

//Validar que se ha intorducido algun texto en el input
const validate_title = () => {
    if(form_title.value.trim().length > 0)
      return true;
    else{
        not_title_warning.style.display = 'block';
        setTimeout(() => {
          not_title_warning.style.display = 'none';
        }, 2000);
        return false;
    }
}

const create_url = (action,text) => {
    const url = 'https://www.googleapis.com/books/v1/volumes?';
    if(action == 'search_for_text')
      return url+'q='+text;
    return url;
}

//Buscar los libros en la API
const search_book = (action, text) => {
    const url = create_url(action,text);
    fetch(url)
        .then(res => res.ok ? Promise.resolve(res) : Promise.reject(res))
        .then(res => res.json())
        .then(res => view_book(res.items))
        .catch(error => console.log(error));
}

const view_book = (items) => {
    const fragment = document.createDocumentFragment();
    for (let index = 0; index < items.length; index++) {
        const {imageLinks, title} = items[index].volumeInfo;
        const {smallThumbnail, thumbnail} = imageLinks;
        const html_div = document.createElement('DIV');
        const html_img = document.createElement('IMG');
        const html_p = document.createElement('P');
        html_div.setAttribute('class', 'grid_item');
        html_img.setAttribute('src',smallThumbnail);
        html_p.textContent = title;
        html_div.appendChild(html_img);
        html_div.appendChild(html_p);
        fragment.appendChild(html_div);
    }
      html_container.appendChild(fragment);
}

//Evento que se encarga de realizar la busqueda de los libros en la API
form.addEventListener('submit', (e) => {
    e.preventDefault();
    try 
    {
        if(validate_title())
        {   
           search_book('search_for_text', form_title.value);
           
            form.reset(); 
        }
        else
        {
            console.log('mensaje de error')
        } 
    } 
    catch (error) 
    {
      throw error;    
    }
})

//Poner el foco en el input que corresponde al user
addEventListener('load', () => {
    form_title.focus();
})
