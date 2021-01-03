import {ApolloQueryResult, FetchResult, MutationFunctionOptions} from '@apollo/client';
import {Button, LinearProgress} from '@material-ui/core';
import {Form as FormikForm, Formik} from 'formik';
import React from 'react';

interface IForm {
  children: React.ReactNode;
  initValues: {[key: string]: any};
  validation: {[key: string]: any};
  submitFunction: (
    options?: MutationFunctionOptions<any, Record<string, any>>
  ) => Promise<FetchResult<any, Record<string, any>, Record<string, any>>>;
  refetch?: (variables?: Partial<{[key: string]: any}>) => Promise<ApolloQueryResult<any>>;
}

const Form: React.FC<IForm> = ({children, initValues, validation, submitFunction, refetch}) => {
  return (
    <Formik
      initialValues={initValues}
      validationSchema={validation}
      enableReinitialize
      onSubmit={async (values, {setSubmitting}) => {
        console.log(refetch);
        await submitFunction(values)
          .then((result) => {
            setSubmitting(false);
            console.log(result);
            if (refetch) refetch();
          })
          .catch((error) => {
            setSubmitting(false);
            console.error(error);
          });
      }}
    >
      {({submitForm, isSubmitting}) => (
        <FormikForm>
          {children}
          {isSubmitting && <LinearProgress />}
          <Button
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            onClick={() => {
              console.log('button click');
              submitForm();
            }}
          >
            Submit
          </Button>
        </FormikForm>
      )}
    </Formik>
  );
};

export default Form;
