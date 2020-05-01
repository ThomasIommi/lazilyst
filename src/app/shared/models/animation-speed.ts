/** Set of available animations speeds */
export class AnimationSpeeds {
  static SLOWER: AnimationSpeed = {name: 'slower', duration: 3000};
  static SLOW: AnimationSpeed = {name: 'slow', duration: 2000};
  static DEFAULT: AnimationSpeed = {name: 'default', duration: 1000};
  static FAST: AnimationSpeed = {name: 'fast', duration: 800};
  static FASTER: AnimationSpeed = {name: 'faster', duration: 500};
}

/** Interface for animation speeds */
export interface AnimationSpeed {
  /** Name */
  name: string;
  /** Duration in milliseconds */
  duration: number;
}
