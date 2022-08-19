export const handleError = (res, error) => {
  console.error(error);
  res
    .status(error.status ?? StatusCodes.INTERNAL_SERVER_ERROR)
    .json(error.body);
};
