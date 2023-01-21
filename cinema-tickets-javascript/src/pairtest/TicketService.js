import TicketTypeRequest from './lib/TicketTypeRequest.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import TicketPaymentService from '../thirdparty/paymentgateway/TicketPaymentService.js';
import SeatReservationService from '../thirdparty/seatbooking/SeatReservationService.js';

export default class TicketService {
  /**
   * Should only have private methods other than the one below.
   */
  
  constructor(accountId, ticketRequests) {
    this.accountId = accountId
    this.ticketRequests = ticketRequests
    this.adultPrice = 20
    this.childPrice = 10
    this.infantPrice = 0

    if (this.accountId <= 0) {
      throw new TypeError('accountId must be greater than zero');
    }
  }

  purchase() {
    let totalAmount = 0;
    let adultChildQuantity = 0;
    let infantQuantity = 0;
    let typesArray = [];

    for(let i = 0; i < this.ticketRequests.length; i++) {
      let obj = new TicketTypeRequest(this.ticketRequests[i].type, this.ticketRequests[i].quantity);
      let type = obj.getTicketType();
      let quantity = obj.getNoOfTickets();

      switch(type) {
        case 'ADULT':
          totalAmount += quantity * this.adultPrice
          adultChildQuantity += quantity
          typesArray.push(type)
          break;
        case 'CHILD':
          totalAmount += quantity * this.childPrice
          adultChildQuantity += quantity
          typesArray.push(type)
          break;
        case 'INFANT':
          totalAmount =+ quantity * this.infantPrice
          infantQuantity += quantity
          typesArray.push(type)
      }
    }

    let totalQuantity = adultChildQuantity + infantQuantity;

    if(totalQuantity > 20) {
      throw new TypeError('maximum of 20 tickets exceeded');
    }
    if(typesArray.includes('CHILD') && !typesArray.includes('ADULT') || typesArray.includes('INFANT') && !typesArray.includes('ADULT')) {
      throw new TypeError('child and Infant tickets cannot be purchased without purchasing an Adult ticket');
    }
    if(this.accountId.balance <= totalAmount) {
      throw new TypeError('insufficient funds');
    }

    const payment = new TicketPaymentService();
    const res = payment.makePayment(this.accountId, totalAmount);
    const seats = new SeatReservationService();
    const resp = seats.reserveSeat(this.accountId, adultChildQuantity)
    
    if(res !== TypeError && resp !== TypeError) {
      return true;
    } else {
      throw new InvalidPurchaseException('purchase is invalid');
    }
  }

  // purchaseTickets(accountId, ...ticketTypeRequests) {
  //   // throws InvalidPurchaseException
  // }
}



 