const getErrorMessage = (error: any) => {
    let message;
  
    switch (error?.status) {
      case 400:
        message = "Bad Request - The server could not understand the request.";
        break;
      case 401:
        message = "Unauthorized - Invalid credentials.";
        break;
      case 403:
        message =
          "Forbidden - You do not have permission to access this resource.";
        break;
      case 404:
        message = "Not Found - The data you are looking for could not be found.";
        break;
      case 409:
        message = "Conflict - The data you are trying to add already exists.";
        break;
      case 422:
        message =
          "Unprocessable Entity - The request data is invalid or cannot be processed.";
        break;
      case 429:
        message =
          "Too Many Requests - You have sent too many requests in a given amount of time.";
        break;
      case 500:
        message = "Internal Server Error - Something went wrong on the server.";
        break;
      case 502:
        message =
          "Bad Gateway - The server received an invalid response from the upstream server.";
        break;
      case 503:
        message =
          "Service Unavailable - The server is currently unavailable. Please try again later.";
        break;
      case 504:
        message = "Gateway Timeout - The server took too long to respond.";
        break;
      default:
        message = error.message || "An unexpected error occurred.";
    }
  
    return message;
  };
  
  export default getErrorMessage;