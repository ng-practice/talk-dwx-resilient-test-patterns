import { defer, throwError } from 'rxjs';

describe('False Positives', () => {
  describe('Observable', () => {
    it('broken: is green because done was forgotten', () => {
      defer(() => throwError('My error') as any).subscribe({
        next: () => expect(true).toBe(false), // should make test red
        error: () => expect(true).toBe(false), // should make test red
      });
    });

    it('done: evaluates error correctly', (done) => {
      defer(() => throwError('My error')).subscribe({
        error: (err) => {
          expect(err).toBe('My error');
          done();
        },
      });
    });

    it('promisify: evaluates error correctly', async () => {
      const promise = defer(() => throwError('My error')).toPromise();

      await expect(promise).rejects.toEqual('My error');
    });
  });
});
