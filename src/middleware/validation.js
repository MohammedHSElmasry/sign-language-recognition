const datamethod = ["body", "params", "file", "headers", "query"];

export const validition = (schema) => {
  return (req, res, next) => {
    const err = [];

    datamethod.forEach((key) => {
      if (schema[key]) {
        console.log(key);
        const validationResult = schema[key].validate(req[key], {
          abortEarly: false,
        });

        if (validationResult.error) {
          err.push(validationResult.error.details);
        }
      }
    });

    if (err.length > 0) {
      return res.json({ message: err });
    }

    return next();
  };
};
