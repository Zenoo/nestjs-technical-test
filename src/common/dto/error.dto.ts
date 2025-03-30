export class ErrorDto {
  /**
   * Error message
   * @example 'The error message'
   */
  message: string;

  /**
   * HTTP status code
   * @example 401
   */
  statusCode: number;
}
