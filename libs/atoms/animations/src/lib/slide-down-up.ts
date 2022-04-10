import { animate, AnimationTriggerMetadata, style, transition, trigger } from '@angular/animations';

export const slideDownUp: AnimationTriggerMetadata = trigger('slideDownUp', [
  transition(':enter', [style({ height: 0 }), animate(300)]),
  transition(':leave', [animate(300, style({ height: 0 }))]),
]);
