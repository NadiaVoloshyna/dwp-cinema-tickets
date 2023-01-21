import TicketService from "../src/pairtest/TicketService.js";

test('should output total amount', () => {
    const obj = new TicketService(15, [{type: 'ADULT', quantity: 2}, {type: 'CHILD', quantity: 2}]);
    const result = obj.purchase();
    expect(result).toBe(true);
});


