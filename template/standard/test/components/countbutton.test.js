import { CountButton } from '../../src/components/countbutton';

describe('Count Button', () => {
  let result, label;
  it('Create count button', () => {
    label = "Count Button Test";
    result = mq(CountButton, { label });
    expect(result.rootEl.innerHTML).matchSnapshot();
  });
  it('Label renders correctly', () => {
    expect(result.first("button").innerHTML).toEqual(label + " is 100");
  })
  it('Count function works correctly', () => {
    result.click("button");
    expect(result.first("button").innerHTML).toEqual(label + " is 101");
  });
  it('Remove component', () => {
    result.onremove();
    expect(result.should.not.have("button")).toBeTruthy;
  });
});