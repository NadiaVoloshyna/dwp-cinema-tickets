import TicketTypeRequest from './lib/TicketTypeRequest.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import TicketPaymentService from '../thirdparty/paymentgateway/TicketPaymentService.js';
import SeatReservationService from '../thirdparty/seatbooking/SeatReservationService.js';

export default class TicketService {
  constructor(accountId, ticketRequests) {
    this.accountId = accountId;
    this.ticketRequests = ticketRequests;
    this.adultPrice = 20;
    this.childPrice = 10;
    this.infantPrice = 0;
    this.accountBalance = 111;

    if (this.accountId <= 0) {
      throw new TypeError('accountId must be greater than zero');
    }
  }

  // TODO database request to check the balance status, this.accountBalance = response.data.balance
  
  // calculate the total amount and number of seats to reserve
  purchase() {
    let totalAmount = 0;
    let adultChildQuantity = 0;
    let infantQuantity = 0;
    let types = [];

    for(let i = 0; i < this.ticketRequests.length; i++) {
      let obj = new TicketTypeRequest(this.ticketRequests[i].type, this.ticketRequests[i].quantity);
      let type = obj.getTicketType();
      let quantity = obj.getNoOfTickets();

      switch(type) {
        case 'ADULT':
          totalAmount += quantity * this.adultPrice
          adultChildQuantity += quantity
          types.push(type)
          break;
        case 'CHILD':
          totalAmount += quantity * this.childPrice
          adultChildQuantity += quantity
          types.push(type)
          break;
        case 'INFANT':
          totalAmount += quantity * this.infantPrice
          infantQuantity += quantity
          types.push(type)
      }
    }

    let totalQuantity = adultChildQuantity + infantQuantity;
    
    // make checks as per constraints
    if(totalQuantity > 20) {
      throw new TypeError('maximum of 20 tickets exceeded');
    }
    if(types.includes('CHILD') && !types.includes('ADULT') || types.includes('INFANT') && !types.includes('ADULT')) {
      throw new TypeError('child and Infant tickets cannot be purchased without purchasing an Adult ticket');
    }
    if(this.accountBalance <= totalAmount) {
      throw new TypeError('insufficient funds');
    }
    
    // make payment and seat reservation requests
    const payment = new TicketPaymentService();
    const paymentResult = payment.makePayment(this.accountId, totalAmount);
    const reservation = new SeatReservationService();
    const reservationResult = reservation.reserveSeat(this.accountId, adultChildQuantity);
    
    if(paymentResult instanceof TypeError || reservationResult instanceof TypeError) {
      throw new InvalidPurchaseException('purchase is invalid');
    } else {
      return {
        response: true,
        totalAmount
      };
    }
  }
}



 