import Vitriol from '../../src/pages/vitriol';

describe('display vitriol page', () => {
  let id = 'V1TR10L#1';
  let result = mq(Vitriol, { id });

  it('Page ID display correctly', () => {
    expect(result.contains(`The page ID is ${id}`)).toBe(true);
  })

});