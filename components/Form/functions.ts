/**
 * @description
 * form mit den update values füllen
 *
 * @param {any} values
 * @param {data} data
 */
export const getInitFormValues = (values: any, data: any) => {
  let newObject = values;

  if (data) {
    Object.keys(values).forEach((key) => {
      if (data[key] !== undefined && data[key] !== null) newObject[key] = data[key];
    });
  }

  return newObject;
};
