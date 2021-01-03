import {FormControl, InputLabel, MenuItem} from '@material-ui/core';
import {Field} from 'formik';
import {Select} from 'formik-material-ui';
import React from 'react';

interface IList {
  key: string;
  value: string;
}

interface ISelectField {
  name: string;
  label: string;
  list: IList[];
}

const compare = (a: IList, b: IList) => {
  if (a.value < b.value) {
    return -1;
  }
  if (a.value > b.value) {
    return 1;
  }
  return 0;
};

const SelectField: React.FC<ISelectField> = ({name, label, list}) => {
  const sortedList = list.sort(compare);

  return (
    <FormControl fullWidth>
      <InputLabel htmlFor={`select-field-label-${label}`}>{label}</InputLabel>
      <Field component={Select} name={name} inputProps={{id: `select-${list}`}}>
        <MenuItem value="">None</MenuItem>
        {sortedList.map((item) => (
          <MenuItem key={item.key} value={item.key}>
            {item.value}
          </MenuItem>
        ))}
      </Field>
    </FormControl>
  );
};

export default SelectField;
