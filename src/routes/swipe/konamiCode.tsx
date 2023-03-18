import { $, useOnDocument, useStore } from '@builder.io/qwik';
import _ from 'lodash';
import Toastify from 'toastify-js';


export const konamiCode = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

export const useKonamiCode = () => {
  const keyPresses = useStore({
    presses: [] as string[],
  });
  useOnDocument(
    'keydown',
    $((ev) => {
      const event = ev as KeyboardEvent;
      keyPresses.presses = _.takeRight([...keyPresses.presses, event.key], 10);
      if (_.isEqual(keyPresses.presses, konamiCode)) {
        Toastify({
          text: 'Konami code!',
          duration: 3000,
          close: true,
          gravity: 'top',
          position: 'left',
          stopOnFocus: true, // Prevents dismissing of toast on hover
        }).showToast();
      }
    })
  );
};
