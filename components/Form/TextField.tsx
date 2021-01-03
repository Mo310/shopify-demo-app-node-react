import {Field} from 'formik';
import {TextField as MuiTextField} from 'formik-material-ui';
import React from 'react';

interface ITextField {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'password';
}

const TextField: React.FC<ITextField> = ({name, label, type}) => (
  <Field component={MuiTextField} name={name} type={type || 'text'} label={label} fullWidth />
);

export default TextField;
