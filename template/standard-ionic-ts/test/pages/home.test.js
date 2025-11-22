import Home from '../../src/pages/home';


describe('display home page', () => {
  let result = mq(Home);
  let buttons = result.find(".card ion-button");
  
  it('First Button display correctly', () => {
    expect(buttons[0].innerHTML).toEqual("First count is 100");
  })
  it('Second Button display correctly', () => {
    expect(buttons[1].innerHTML).toEqual("Second count is 100");
  })
  
  it('First Button after click display correctly', () => {
    result.click(".card ion-button");
    expect(buttons[0].innerHTML).toEqual("First count is 101");
    expect(buttons[1].innerHTML).toEqual("Second count is 100");
  })
  
});