//Validar que el usuario se haya logueado en la aplicacion
const isLogin = () => {
    if(!sessionStorage.getItem('active'))
    location.href = '/index.html';
}

isLogin();