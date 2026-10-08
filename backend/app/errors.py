class AppError(Exception):
    """An error with an HTTP status, returned as { error: { message, details? } }."""

    def __init__(self, status_code, message, details=None):
        super().__init__(message)
        self.status_code = status_code
        self.message = message
        self.details = details
