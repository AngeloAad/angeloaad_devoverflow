export class RequestError extends Error {
  statusCode: number;
  errors?: Record<string, string[]>;

  constructor(
    statusCode: number,
    message: string,
    errors?: Record<string, string[]> // Optional object (or dictionary) of errors  of key string and value array of strings, Record<K, V>
  ) {
    super(message); // Call the constructor of the parent class (Error)
    this.statusCode = statusCode;
    this.errors = errors;
    this.name = "RequestError"; // This is a custom property, override the "name" property of the Error class
  }
}

// Class that extends RequestError class and is used to handle validation errors
export class ValidationError extends RequestError {
  constructor(fieldErrors: Record<string, string[]>) {
    const message = ValidationError.formatFieldErrors(fieldErrors);
    super(400, message, fieldErrors);
    this.name = "ValidationError";
    this.errors = fieldErrors;
  }

  static formatFieldErrors(errors: Record<string, string[]>): string {
    const formattedMessages = Object.entries(errors).map(
      ([field, messages]) => {
        const fieldName = field.charAt(0).toUpperCase() + field.slice(1);

        if (messages[0] === "Required") {
          return `${fieldName} is required`;
        } else {
          return messages.join(" and ");
        }
      }
    );

    return formattedMessages.join(", ");
  }
}

// class that extends RequestError class and is used to handle not found errors
export class NotFoundError extends RequestError {
  constructor(resource: string) {
    super(404, `${resource} not found`);
    this.name = "NotFoundError";
  }
}

// class that extends RequestError class and is used to handle forbidden errors
export class ForbiddenError extends RequestError {
  constructor(message: string = "Forbidden") {
    super(403, message);
    this.name = "ForbiddenError";
  }
}

// class that extends RequestError class and is used to handle unauthorized errors
export class UnauthorizedError extends RequestError {
  constructor(message: string = "Unauthorized") {
    super(401, message);
    this.name = "UnauthorizedError";
  }
}
