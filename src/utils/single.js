import Swal from 'sweetalert2';

const url = "http://localhost:8000"
const urlNoPort  = "http://localhost";
// const url = "http://175.45.204.119:8000";
// const urlNoPort  ="http://175.45.204.119";
const storageURL = "https://kr.object.ncloudstorage.com/bitcamp-edu-bucket-55"

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    },
    customClass: {
        container: 'toastContainer',
    }
});

export {url, urlNoPort, storageURL, Toast};
