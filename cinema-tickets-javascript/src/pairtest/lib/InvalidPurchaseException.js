export default class InvalidPurchaseException extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.name = "InvalidPurchaseException";
  }
}


 