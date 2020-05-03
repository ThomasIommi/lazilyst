import { ElementRef } from '@angular/core';

import { AnimationDirection, AnimationSpeed, AnimationSpeeds } from '../models/animation-models';
import { sleep } from './generic.functions';


/**
 * Animate an HTMLElement by its reference and some options that describes the animation (Animate.css wrapper)
 * @param ref Element to animate reference
 * @param animation Type of the Animate.css animation
 * @param speed Animation speed
 */
export async function animate(ref: ElementRef | HTMLElement,
                              animation: string,
                              speed: AnimationSpeed = AnimationSpeeds.DEFAULT): Promise<void> {
  let element: HTMLElement;
  if (ref instanceof ElementRef) {
    element = ref.nativeElement;
  } else {
    element = ref;
  }
  element.classList.add('animated', animation, speed.name);
  await sleep(speed.duration);
  element.classList.remove('animated', animation, speed.name);
}

/**
 * Function to apply the correct inline style to hide the dragged element
 * @param element Element to hide
 */
export async function dndHide(element: HTMLElement): Promise<void> {
  await sleep(0); // hack not to make the drag&drop ghost invisible, but only the dragged element
  element.style.visibility = 'hidden';
}

/**
 * Function to apply the correct inline styles to make space with an animation for drag&drop
 * @param element Element to animate
 * @param direction Animation direction
 * @param space Space to make in px
 * @param threshold Threashold to trigger the animation
 * @param clientY Current mouse position
 */
export function dndMakeSpace(element: HTMLElement,
                             direction: AnimationDirection,
                             space: number,
                             threshold: number,
                             clientY: number): void {
  if (element != null && isInViewport(element)) {
    element.style.transition = '0.1s ease-in-out';
    switch (direction) {
      case AnimationDirection.UP: {
        if (clientY > threshold) {
          element.style.transform = `translate(0, -${space}px)`;
          element.setAttribute('dnd-moved', direction);
        } else {
          element.style.transform = `translate(0, 0)`;
          element.removeAttribute('dnd-moved');
        }
        break;
      }
      case AnimationDirection.DOWN: {
        if (clientY < threshold) {
          element.style.transform = `translate(0, ${space}px)`;
          element.setAttribute('dnd-moved', direction);
        } else {
          element.style.transform = `translate(0, 0)`;
          element.removeAttribute('dnd-moved');
        }
        break;
      }
    }
  }
}

/**
 * Function to clean used the inline styles for drag&drop animation
 * @param elements Array of elements to clean
 */
export function dndClean(elements: HTMLElement[]): void {
  elements.forEach(element => {
    if (element.style != null) {
      element.style.transform = null;
      element.style.transition = null;
      element.removeAttribute('dnd-moved');
      element.style.visibility = null;
    }
  });
}

/**
 * Checks the dropZone children elements for attributes set by drag&drop operations
 * and trys to decide on which index the element was dropped
 * @param dropZone DropZone element
 * @param draggedElementIndex Index of the element being dragged
 */
export function dndFindDropIndex(dropZone: Element, draggedElementIndex: number): number {
  const children: HTMLElement[] = Array.from(dropZone.children) as HTMLElement[];
  return children.findIndex((element: HTMLElement, index: number, array: HTMLElement[]) => {
    if (element.getAttribute('dnd-moved') === AnimationDirection.DOWN) {
      // dragged element moved UP, just before the 1st element moved DOWN
      return true;
    } else {
      // dragged element moved DOWN, just after the last element moved UP
      const next = array[index + 1];
      return (
        index > draggedElementIndex &&
        element.getAttribute('dnd-moved') === AnimationDirection.UP &&
        (next == null || next.getAttribute('dnd-moved') == null)
      );
    }
  });
}

/**
 * Checks if the element is in the viewport
 * @param element Element to be checked for visibility
 */
export function isInViewport(element: HTMLElement): boolean {
  const bounding = element.getBoundingClientRect();
  return (
    bounding.top >= 0 &&
    bounding.left >= 0 &&
    bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

