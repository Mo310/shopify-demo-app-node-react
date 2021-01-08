import {Field} from 'formik';
import {SimpleFileUpload} from 'formik-material-ui';
import React, {FormEvent} from 'react';

interface IFileUploadField {
  name: string;
  label: string;
}

const FileUploadField: React.FC<IFileUploadField> = ({name, label}) => {
  return <Field component={SimpleFileUpload} name={name} label={label} />;
};

export default FileUploadField;
