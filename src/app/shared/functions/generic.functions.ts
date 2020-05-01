import * as deepmerge from 'deepmerge';
import { Options } from 'deepmerge';
import { Activity } from '../models/activity';


/** Creates a new Promise that waits as requested before resolving */
export async function sleep(ms: number): Promise<void> {
  return new Promise<void>(resolve => setTimeout(resolve, ms));
}

/** Deep merges two arrays of activities overriding the target one */
export function overwriteMerge(target: Activity[], source: Activity[], options: Options): Activity[] {
  const result = target.slice();
  source.forEach((item, index) => {
    if (typeof result[index] === 'undefined') {
      result[index] = item;
    } else {
      result[index] = deepmerge(target[index], item != null ? item : new Activity(), options);
    }
  });
  return result;
}
