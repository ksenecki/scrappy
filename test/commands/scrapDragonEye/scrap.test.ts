import { expect, test } from '@oclif/test';

describe('scrap', () => {
  test
    .stdout()
    .command(['scrap'])
    .it('Runs Scrappy', (ctx) => {
      expect(ctx.stdout).to.contain('>>> Scrappy runs 1 time <<<');
    });
});
