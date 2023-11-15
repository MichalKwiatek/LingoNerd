class AuthorizationError extends Error {
  statusCode = 403;

  constructor(message: string) {
    super(message);
    this.name = "AuthorizationError";
  }
}

export default AuthorizationError;
