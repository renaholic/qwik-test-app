import {
  useOnWindow,
  $
} from '@builder.io/qwik';
import Toastify from 'toastify-js';


export const useOnline = () => {
  useOnWindow(
    'offline',
    $((event) => {
      Toastify({
        text: 'I am offline!',
        duration: 3000,
        close: true,
      }).showToast();
      // if (event) window.location.reload() // reload the page on back or forward
    })
  );
  useOnWindow(
    'online',
    $((event) => {
      Toastify({
        text: 'I am back!',
        duration: 3000,
        close: true,
        // gravity: 'top', // `top` or `bottom`
        // position: 'left', // `left`, `center` or `right`
        // stopOnFocus: true, // Prevents dismissing of toast on hover
      }).showToast();
      // if (event) window.location.reload() // reload the page on back or forward
    })
  );
};
