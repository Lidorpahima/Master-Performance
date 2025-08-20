import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Grid, Typography } from '@mui/material';

const validationSchema = Yup.object({
  make: Yup.string().required('Make is required'),
  model: Yup.string().required('Model is required'),
  year: Yup.number()
    .required('Year is required')
    .min(1900)
    .max(new Date().getFullYear() + 1),
  engineType: Yup.string().required('Engine type is required'),
});

const VehicleForm = ({ onSubmit, initialValues = {} }) => {
  return (
    <Formik
      initialValues={{
        make: '',
        model: '',
        year: '',
        engineType: '',
        ...initialValues
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ values, errors, touched, handleChange, handleBlur }) => (
        <Form>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Vehicle Details
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="make"
                label="Make"
                value={values.make}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.make && Boolean(errors.make)}
                helperText={touched.make && errors.make}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="model"
                label="Model"
                value={values.model}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.model && Boolean(errors.model)}
                helperText={touched.model && errors.model}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="year"
                label="Year"
                type="number"
                value={values.year}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.year && Boolean(errors.year)}
                helperText={touched.year && errors.year}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="engineType"
                label="Engine Type"
                value={values.engineType}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.engineType && Boolean(errors.engineType)}
                helperText={touched.engineType && errors.engineType}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
              >
                {initialValues._id ? 'Update Vehicle' : 'Add Vehicle'}
              </Button>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default VehicleForm;
