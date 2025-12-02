import Vitriol from '../../src/pages/vitriol';

describe('display vitriol page', () => {
  const id = 'V1TR10L#1';
  const result = mq(Vitriol, { id });

  it('Page ID display correctly', () => {
    expect(result.contains(`The page ID is ${id}`)).toBe(true);
  });
});
