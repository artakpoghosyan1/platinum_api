"use client";

import { FC, useMemo } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAboutData, useGetAboutData } from "@/services/carsApi";
import Loader from "@/components/common/Loader";

// Yup validation schema
const validationSchema = Yup.object().shape({
  about: Yup.string().required("about is required"),
  phoneNumber: Yup.string()
    .matches(
      /^(055|095|077|010|033|041|060|099|091|094|093|011)\d{6}$/,
      "Phone number must be in the correct format",
    )
    .required("Phone number is required"),
});

interface AboutUsFormValues {
  about: string;
  phoneNumber: string;
}

const AboutForm: FC = () => {
  const aboutDataMutation = useAboutData();
  const { data: aboutData } = useGetAboutData();

  const initialValues: AboutUsFormValues = useMemo(() => {
    return {
      about: aboutData?.content?.about || "",
      phoneNumber: aboutData?.content?.phoneNumber || "",
    };
  }, [aboutData]);

  const handleSubmit = async (values: AboutUsFormValues) => {
    aboutDataMutation.mutate(values);
  };

  return (
    <div className="mx-auto my-10 bg-white p-6 shadow-md dark:bg-boxdark">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <div className="form-control">
              <label className="label">About Us about</label>
              <Field
                as="textarea"
                name="about"
                className="textarea textarea-bordered h-67 w-full dark:bg-graydark"
              />
              <ErrorMessage name="about" component="div" className="text-red" />
            </div>

            <div className="form-control">
              <label className="label">Phone Number</label>
              <Field
                name="phoneNumber"
                className="input input-bordered w-full dark:bg-graydark"
                placeholder="055000000"
              />
              <ErrorMessage
                name="phoneNumber"
                component="div"
                className="text-red"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting || aboutDataMutation.isPending}
              >
                {aboutDataMutation.isPending ? (
                  <Loader size="small" color="border-white" />
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AboutForm;
