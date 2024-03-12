import { style, animate, trigger, transition } from '@angular/animations';

const tiempoAnimacion = 250;

export const entradaSalidaVentana = trigger('entradaSalidaVentana', [
  transition('void => *', [
    style({
      opacity: '0',
      transform: 'translateY(20%)'
    }),
    animate(tiempoAnimacion,
      style({
        opacity: '1',
        transform: 'translateY(0%)'
      })
    ),
  ]),
  transition('* => void', [
    style({
      opacity: '1',
      transform: 'translateY(0%)'
    }),
    animate(tiempoAnimacion,
      style({
        opacity: '0',
        transform: 'translateY(20%)'
      })
    ),
  ]),
  transition('* => *', [
    style({
      opacity: '0',
      transform: 'translateY(20%)'
    }),
    animate(tiempoAnimacion,
      style({
        opacity: '1',
        transform: 'translateY(0%)'
      })
    ),
  ])
])
