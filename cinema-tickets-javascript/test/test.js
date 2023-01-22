import TicketService from "../src/pairtest/TicketService.js";

test("purchase() returns when called", () => {
  const obj = new TicketService(15, [{type: 'ADULT', quantity: 2}, {type: 'CHILD', quantity: 2}]);
  const result = obj.purchase();
  expect(typeof result).toBe("object");
});

test('should output total amount 60', () => {
  const obj = new TicketService(15, [{type: 'ADULT', quantity: 2}, {type: 'CHILD', quantity: 2}]);
  const result = obj.purchase();
  expect(result).toStrictEqual({response: true, totalAmount: 60});
});

test('should output total amount 110', () => {
    const obj = new TicketService(15, [{type: 'ADULT', quantity: 4}, {type: 'CHILD', quantity: 3}, {type: 'INFANT', quantity: 1}]);
    const result = obj.purchase();
    expect(result).toStrictEqual({response: true, totalAmount: 110});
  });

test('computation goes as expected, number of tickets', () => {
    const obj = new TicketService(15, [{type: 'ADULT', quantity: 22}, {type: 'CHILD', quantity: 2}]);
    expect(() => obj.purchase()).toThrow('maximum of 20 tickets exceeded');
});

test('computation goes as expected, adult ticket', () => {
    const obj = new TicketService(15, [{type: 'CHILD', quantity: 2}, {type: 'CHILD', quantity: 2}]);
    expect(() => obj.purchase()).toThrow('child and Infant tickets cannot be purchased without purchasing an Adult ticket');
});


