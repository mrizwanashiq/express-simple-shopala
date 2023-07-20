export const ResponseSchema = ({res, statusCode, ...rest}) => res.status(statusCode).json(rest)
