import { ElementRef } from '@angular/core';

import { AnimationSpeed, AnimationSpeeds } from '../models/animation-speed';
import { sleep } from './generic.functions';


/** Animate an HTMLElement by its reference and some options that describes the animation (Animate.css wrapper) */
export async function animate(element: ElementRef,
                              animation: string,
                              speed: AnimationSpeed = AnimationSpeeds.DEFAULT): Promise<void> {
  element.nativeElement.classList.add('animated', animation, speed.name);
  await sleep(speed.duration);
  element.nativeElement.classList.remove('animated', animation, speed.name);
}
