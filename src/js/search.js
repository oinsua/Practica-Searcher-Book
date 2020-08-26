const form = document.getElementById('form1');
const form_title = document.getElementById('title');
const not_title_warning = document.querySelector('.not_title_warning');
const html_container = document.querySelector('.html_container');
const html_info_book = document.querySelector('.info_container');
const html_favorite_img = document.querySelector('.img_favorite');
const html_fav_book = document.querySelector('.info_container_fav');
const html_back = document.querySelector('.img_start');

//CODIGO DE LA VENTANA MODAL
// Get the modal
const modal = document.getElementById("myModal");
const modal_fav = document.getElementById('myModal_fav'); 

// Get the button that opens the modal
const btn = document.querySelector('.html_container');
const btn_fav = document.querySelector('.img_favorite');
// Get the <span> element that closes the modal
const span = document.getElementsByClassName("close")[0];
const span_fav = document.getElementsByClassName("close_fav")[0];

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
//Funcion que se encarga de concatenar la url de busqueda de la API
const create_url = (action,text) => {
    const url = 'https://www.googleapis.com/books/v1/volumes';
    if(action == 'search_for_text')
      return url+'?q='+text;
    else if(action == 'search_for_info')
      return url+'/'+text;
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

//Funcion que comprueba si existe una tupla en localStorage, que coincida con la combinacion user+key
const read_favorite = (user, key) => {
    if(localStorage.getItem(user+'_'+key))
     return true;
    return false;
}

//Funcion que se encarga de crear las etiquetas HTML y mostrar los resultados de la busqueda en la interfaz
const view_book = (items) => {
    if(!items)
    {   
        const html_error = document.createElement('DIV');
        html_error.textContent = 'There are no results found for the search ';
        html_error.classList.add('result_warning');
        html_container.appendChild(html_error);
    }
    else
    {  
        const fragment = document.createDocumentFragment();
        let count_favorite = 0;
        for (let index = 0; index < items.length; index++) { //Bucle para recorrer los items
            const {imageLinks, title} = items[index].volumeInfo;  //Destructurar los atributos
            const html_div = document.createElement('DIV'); //Crear las etiquetas correspondientes
            const html_img = document.createElement('IMG');
            const html_icons = document.createElement('IMG');
            const html_p = document.createElement('P');
            let thumbnail = './images/descarga (3).png';
            html_div.setAttribute('class', 'grid_item'); //Asignar atributos a las etiquetas
            if(imageLinks) //comprobrar si el objeto tiene la imagen asociada
            {
                const {smallThumbnail} = imageLinks; //Destruturar la imagen del libro
                html_img.setAttribute('src',smallThumbnail);
                thumbnail = smallThumbnail;
            }
            else  //sino existe el objeto imagen se le asigna un valor por defecto
            {
                html_img.setAttribute('src',thumbnail);
            }
            html_img.setAttribute('class','img');
            if(read_favorite(sessionStorage.getItem('active'), items[index].id)) //comprobar si es favorito o no para asignar una imagen u otra con su correspondiente estilo css
            {
                html_icons.setAttribute('src', './images/images (3).jfif');
                html_icons.setAttribute('class', 'select_favorite');
                count_favorite++;
            }
            else
            {
                html_icons.setAttribute('src', './images/images.png');
                html_icons.setAttribute('class', 'favorite');
            }
            html_icons.dataset.key= items[index].id;
            html_icons.dataset.action = 'favorite';
            html_icons.dataset.img = thumbnail;
            html_icons.dataset.title = title;
            html_img.dataset.key = items[index].id;
            html_img.dataset.action = 'info';
            html_p.setAttribute('class','p_title');
            html_p.textContent = title;
            html_div.appendChild(html_img);
            html_div.appendChild(html_icons);
            html_div.appendChild(html_p);
            fragment.appendChild(html_div);
        }
        html_container.appendChild(fragment); //Agregar todos los libros a la interfaz
        if(count_favorite > 0)  //Comprobar si existen favoritos, de ser asi, activar el icono
         html_favorite_img.src = './images/images (3).jfif';
        else
        html_favorite_img.src = './images/descarga.png';
    }
}

//Funcion que se encarga de eliminar los resultados de la busqueda, del elemento contenedor
const delete_node_book = () => {
    if(html_container.children.length > 0)
    {
        const count_items = html_container.children.length;
        for (let index = 0; index < count_items; index++) 
        {
            html_container.removeChild(html_container.children[0]); 
        }  
    }  
}

//Buscar la informacion del libro
const search_info = (action, text) => {
    const url = create_url(action,text);
    fetch(url)
        .then(res => res.ok ? Promise.resolve(res) : Promise.reject(res))
        .then(res => res.json())
        .then(res => view_info(res))
        .catch(error => console.log(error));
}

const view_info = (items) => {
    const fragment = document.createDocumentFragment();
    const {authors, categories, description, dimensions, imageLinks, language, pageCount, publishedDate, publisher, title} = items.volumeInfo;
    const {smallThumbnail} = imageLinks; //Destruturar la imagen del libro
    const {width, height} = dimensions;

    const html_img = document.createElement('IMG'); //Crea el primer div con la imagen y titulo del libro
    html_img.setAttribute('src',smallThumbnail);
    const html_h_title = document.createElement('H3');
    html_h_title.textContent = 'Title: '+title;
    const html_div_1 = document.createElement('DIV');
    html_div_1.appendChild(html_img);
    html_div_1.appendChild(html_h_title);
    fragment.appendChild(html_div_1); //Se agrega al fragment el primer bloque de etiquetas
    
    const html_div_2 = document.createElement('DIV');
    const html_p_authors = document.createElement('P');
    for (const author of authors) {
         html_p_authors.textContent = 'Authors: '+author+' ';
    }
    html_div_2.appendChild(html_p_authors);
    const html_p_categories = document.createElement('P');
    for (const category of categories) {
        html_p_categories.textContent = 'Categories: '+category+' ';
    }
    html_div_2.appendChild(html_p_categories);
    const html_p_dimensions = document.createElement('P');
    html_p_dimensions.textContent = 'Dimensions : Width ='+width+' Height ='+height;
    html_div_2.appendChild(html_p_dimensions);
    const html_p_language = document.createElement('P');
    html_p_language.textContent = 'Language: '+language;
    html_div_2.appendChild(html_p_language);
    const html_p_pageCount = document.createElement('P');
    html_p_pageCount.textContent = 'Page Count: '+pageCount;
    html_div_2.appendChild(html_p_pageCount);
    const html_p_publisedDate = document.createElement('P');
    html_p_publisedDate.textContent = 'Published Date: '+publishedDate;
    html_div_2.appendChild(html_p_publisedDate);
    const html_p_publiser = document.createElement('P');
    html_p_publiser.textContent = 'Publisher: '+publisher;
    html_div_2.appendChild(html_p_publiser);
    fragment.appendChild(html_div_2); //Se agrega al fragment el segundo bloque de etiquetas

    const html_div_3 = document.createElement('DIV'); //
    const html_p_description = document.createElement('P');
    html_p_description.textContent = 'Description: '+description;
    html_div_3.appendChild(html_p_description);
    fragment.appendChild(html_div_3); //Se agrega al fragment el tercer bloque de etiquetas

    html_info_book.appendChild(fragment);    
}

//Crear el objeto favorite
const create_favorite = (key, img, user, title) => {
    return {key, img, user, title};
}

//Adicionar un libro a favoritos, insertando los datos en el localStorage
const add_favorite = (key, img, title) => {
     if( sessionStorage.getItem('active'))
     {
         const favorite = create_favorite(key, img, sessionStorage.getItem('active'), title)
         localStorage.setItem(sessionStorage.getItem('active')+'_'+key, JSON.stringify(favorite));
     }
}

//Funcion que cambia el icono de favorito y reemplaza con un nuevo estilo
const style_favorite = (e) => {
    e.target.src = './images/images (3).jfif';
    e.target.classList.replace('favorite','select_favorite')
    if(html_favorite_img.src == 'http://localhost:3000/images/descarga.png')
    {                     
        html_favorite_img.src = './images/images (3).jfif';
    }
     
}

//Evento que se encarga de determinar donde se ha producido el click y ejecutar la busqueda de informacion del libro
html_container.addEventListener('click', (e) => {
    e.preventDefault();
    const key_book = e.target.dataset.key;
    const action = e.target.dataset.action;
    if(key_book.length > 0 && action == 'info')
    {
      modal.style.display = "block";
      search_info('search_for_info',key_book);
    }
    else if(key_book.length > 0 && action == 'favorite')
    {
      add_favorite(key_book, e.target.dataset.img, e.target.dataset.title);
      style_favorite(e);
    } 
    else
    {
      console.log('the key does not exist');
    }

})

//Funcion que elimina los nodos que se crearon para mostrar la informacion del libros
const delete_node_info = () => {
    if(html_info_book.children.length > 0)
    {  
        const count_items = html_info_book.children.length;
        for (let index = 0; index < count_items; index++) 
        {
            html_info_book.removeChild(html_info_book.children[0]); 
        }  
    }
}

//Evento que se encarga de realizar la busqueda de los libros en la API
form.addEventListener('submit', (e) => {
    e.preventDefault();
    delete_node_book(); //Se encarga de limpiar el contenedor de la busqueda de libros si tiene elementos
    try 
    {
        if(validate_title()) //validar si se puede realizar una busqueda
        {   
           search_book('search_for_text', form_title.value); //Realiza la busqueda y muestra los resultados
           
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

//Funcion que recorre los items del localStorage para seleccionar todos los favoritos asociados a un user
const select_favorite = (user) => {
    let array_favorite = [];
    let count_fav = 0;
    //Bucle for para recorrer los item que se encuentran almacenados en localStorage
    for (let index = 0; index < localStorage.length; index++) 
    {
        const clave = localStorage.key(index); //Almacenar la clave de cada tupla
        if(clave.includes(user+'_')) //Comprobar que la clave contiene el user
          {   
             array_favorite[count_fav] = JSON.parse(localStorage.getItem(clave));
             count_fav++;
          }
    }
    return array_favorite; 
}

//Funcion que elimina los nodos que se crearon para mostrar los favoritos en la intefaz modal
const delete_node_fav = () => {
    if(html_fav_book.children.length > 0)
    {  
        const count_items = html_fav_book.children.length;
        for (let index = 0; index < count_items; index++) 
        {
            html_fav_book.removeChild(html_fav_book.children[0]); 
        }  
    }
}
//Evento que gestiona el click para levantar una ventana modal y mostrar todos los libros favoritos
html_favorite_img.addEventListener('click', (e) => {
    e.preventDefault();
    const array_favorite = select_favorite(sessionStorage.getItem('active'));
    if(array_favorite.length > 0) //Devuelve un array de favoritos
     {
        modal_fav.style.display = "block";
        delete_node_fav(); //Eliminar los nodos de la ventana modal
        const fragment = document.createDocumentFragment();
        for (let index = 0; index < array_favorite.length; index++) {
            const {key, img, user, title} =array_favorite[index];
            const html_div = document.createElement('DIV'); //Crear los nodos correspondientes a la interfaz modal
            const html_img = document.createElement('IMG');
            const html_icons = document.createElement('IMG');
            const html_p = document.createElement('P');
            html_div.setAttribute('id', key); //Asignar los atributos correspondientes a cada nodo
            html_img.setAttribute('src', img);
            html_icons.setAttribute('src', './images/descarga (4).png');
            html_icons.setAttribute('class', 'icons_fav');
            html_icons.dataset.id = key;  //Asignar los datos que se requieren para realizar la accion de eliminar
            html_icons.dataset.action = 'delete';
            html_icons.dataset.key = user+'_'+key;
            html_p.textContent = title;
            html_div.appendChild(html_img); //Agregar al fragment todos los nodos de la interfaz de favoritos
            html_div.appendChild(html_icons);
            html_div.appendChild(html_p);
            fragment.appendChild(html_div);
        }
        html_fav_book.appendChild(fragment);
     }
})

//Funcion que elimina un favorito de la interfaz modal donde se muestran todos los libros favoritos.
html_fav_book.addEventListener('click', (e) => {
    e.preventDefault();
    if(e.target.dataset.action == 'delete')
    {
        localStorage.removeItem(e.target.dataset.key);
        html_fav_book.removeChild(document.getElementById(e.target.dataset.id));
        if(html_fav_book.children.length == 0) //Comprobar si se han eliminado todos los favoritos para cerrar la interfaz modal
        {
            modal_fav.style.display = "none";
            html_favorite_img.src = './images/descarga.png';
            let count_items = html_container.children.length;
            for (let index = 0; index < count_items; index++) {
                const div_parent = html_container.children[index]; //posicion del div padre
                const img_child =   div_parent.firstChild; //posicion del primer hijo del padre div
                img_child.nextSibling.src = './images/images.png';  //posicion del hermano de la derecha
            }
        }
          
    }
})

//Poner el foco en el input que corresponde al title
addEventListener('load', () => {
    form_title.focus();
    if(select_favorite(sessionStorage.getItem('active')).length > 0)
      html_favorite_img.src = './images/images (3).jfif';
})

html_back.addEventListener('click', () => {
    location.href = '/index.html';
    sessionStorage.removeItem('active');
})
/*********************************************************************************************** */
/* CODIGO DE LA VENTANA MODAL */

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
  delete_node_info();
}

// When the user clicks on <span> (x), close the modal
span_fav.onclick = function() {
    modal_fav.style.display = "none";
    delete_node_info();
  }