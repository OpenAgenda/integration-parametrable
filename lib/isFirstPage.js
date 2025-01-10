export default (req, res, next) => {
  const { data } = req;
  data.isFirstPage = data.pages?.[0]?.page === 1 && data.pages?.[0]?.current;
  next();
};
