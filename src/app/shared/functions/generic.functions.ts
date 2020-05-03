/** Creates a new Promise that waits as requested before resolving */
export async function sleep(ms: number): Promise<void> {
  return new Promise<void>(resolve => setTimeout(resolve, ms));
}
