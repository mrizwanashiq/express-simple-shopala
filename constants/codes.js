const StatusCodes = {
  SUCCESS: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NON_AUTHORATIVE: 203,
  NO_CONTENT: 204,
  NOT_MODIFIED: 304,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  NOT_ALLOWED: 405,
  INTERNAL_SERVER_ERROR: 500
}

export const Codes = {
  SUCCESS: {
    statusCode: StatusCodes.SUCCESS,
    message: "Success",
  },
  CREATED: {
    statusCode: StatusCodes.CREATED,
    message: "Created",
  },
  ACCEPTED: {
    statusCode: StatusCodes.ACCEPTED,
    message: "Accepted",
  },
  NON_AUTHORATIVE: {
    statusCode: StatusCodes.NON_AUTHORATIVE,
    message: "Non-Authoritative Information",
  },
  NO_CONTENT: {
    statusCode: StatusCodes.NO_CONTENT,
    message: "No Content",
  },
  NOT_MODIFIED: {
    statusCode: StatusCodes.NOT_MODIFIED,
    message: "Not Modified.",
  }
};

export default StatusCodes;
