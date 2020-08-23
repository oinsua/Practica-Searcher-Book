 //Validar objeto Sorage en el navegador
 if(typeof(localStorage) == undefined)
 {
   alert('The browser does not support the localStorage API');
 }

//Inicializar las variables del DOM
const form = document.getElementById('form1');
const form_user = document.getElementById('user');
const form_pass = document.getElementById('password');
const not_user_warning = document.querySelector('.not_user_warning');
const not_password_warning = document.querySelector('.not_password_warning');

//Inicializo el objeto de validaccion del formulario
const formIsValid = {
    user: false,
    password: false
}

//Generar la key para el usuario
const key_Generator = (user, pass) => {
    return user+pass;
}
//Crear el objeto usuario
const user_Info = (user, pass) => {
    return {
        user,
        pass
    }
}
//Valida si los input user y password se les ha asignado algun valor
const validate = () => {

    if(form_user.value.trim().length == 0) 
    { 
        not_user_warning.style.display = 'block';
        setTimeout(() => {
          not_user_warning.style.display = 'none';
        }, 2000);
        return false;
    }else if(form_pass.value.trim().length == 0) 
    { 
        not_password_warning.style.display = 'block';
        setTimeout(() => {
          not_password_warning.style.display = 'none';
        }, 2000);
        return false;
    }
    return true;        
}

//Validar si el usuario existe
const user_Exits = (key) => {
    if(localStorage.getItem(key))
     return true;
    else
     return false;
}

//Crear una session para el usuario que se ha logueado
const create_sessionStorage = (key) => {
    sessionStorage.setItem('active', key);
}

//Crear el perfil del usuario en el localStorage
const create_Perfil = (user, pass) => {
    const key = key_Generator(user, pass); //Genera la clave user+pass
    create_sessionStorage(key); //Crear la session para el control
    if(validate()) 
    {    
        if(user_Exits(key)) //Valida si el usuario existe en el localStorage
        location.href = '/search.html'; //Redireccionar a la pagina de buscar libros
       else
        {
         localStorage.setItem(key,JSON.stringify(user_Info(user,pass)));
         location.href = '/search.html'; //Redireccionar a la pagina de buscar libros
        }
    }
    
}

//Evento que se encarga de asignar true al objeto de validacion
form_user.addEventListener('change', (e) => {
    if(form_user.value.trim().length != 0) 
      formIsValid.user = true;
    else
    {
        not_user_warning.style.display = 'block';
        setTimeout(() => {
          not_user_warning.style.display = 'none';
        }, 2000);
    }
})
//Evento que se encarga de asignar true al objeto de validacion
form_pass.addEventListener('change', (e) => {
    if(form_pass.value.trim().length != 0) 
      formIsValid.password = true;
    else
    {
        not_password_warning.style.display = 'block';
        setTimeout(() => {
          not_password_warning.style.display = 'none';
        }, 2000);
    }
})

//Evento que se encarga de validar y agregar el usuario
form.addEventListener('submit', (e) => {
    e.preventDefault(); //Prevenir el comportamiento por defecto
    try 
    {
        create_Perfil(form_user.value, form_pass.value);
    } 
    catch (error) 
    {
        throw error;
    }   
})

//Poner el foco en el input que corresponde al user
addEventListener('load', () => {
    form_user.focus();
}) 
