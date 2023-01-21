export default class InvalidPurchaseException extends Error {
  constructor(message) {
    super(message)
  }

  run() {
    throw new Error(this.message);
  }
}



  
 