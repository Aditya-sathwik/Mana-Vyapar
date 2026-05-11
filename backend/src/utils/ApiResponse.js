class ApiResponse {
    constructor(statusCode, data, message = "success") {
       this.statusCode = statusCode;
       this.data = data;
       this.message = message; // Corrected typo: 'messa' -> 'message'
       this.success = statusCode < 400;
    }
 }
 
 export { ApiResponse };