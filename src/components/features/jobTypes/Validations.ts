export function validateMin(value: string) {
  if (value !== '') {
    const numericValue = Number(value);
    if (Number.isNaN(numericValue)) return 'Min value should be a number';
    if (numericValue < 0 || numericValue > 75) return 'Min value should be in range of 0 - 75';
  }
  return '';
}

export function validateMax(value: string, minValue: string) {
  if (value !== '') {
    const numericValue = Number(value);
    const numericMinValue = Number(minValue);
    if (Number.isNaN(numericValue)) return 'Max value should be a number';
    if (numericValue < 0 || numericValue > 80) return 'Max value should be in range of 0 - 80';
    if (!Number.isNaN(numericMinValue) && numericValue < numericMinValue)
      return 'Max value should be bigger than Min';
  }
  return '';
}

export function validateHoursPerJob(value: string) {
  if (value !== '') {
    const numericValue = Number(value);
    if (Number.isNaN(numericValue)) return 'Value should be a number';
    if (numericValue < 1 || numericValue > 8) return 'Value should be in range of 1 - 8';
  }
  return '';
}

export interface FormValues {
  min: string;
  max: string;
  hours: string;
}

export function validateForm(values: FormValues, recurringJob: boolean, oneTime: boolean) {
  let errors = {};
  if (recurringJob) {
    if (values.min && validateMin(values.min)) {
      errors = { min: validateMin(values.min) };
    }
    if (values.max && validateMax(values.max, values.min)) {
      errors = { max: validateMax(values.max, values.min) };
    }
  }
  if (oneTime) {
    if (values.hours && validateHoursPerJob(values.hours)) {
      errors = { hours: validateHoursPerJob(values.hours) };
    }
  }
  return errors;
}
