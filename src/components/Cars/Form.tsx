"use client";

import { FC, useMemo } from "react";
import * as Yup from "yup";
import { ErrorMessage, Field, Formik, Form } from "formik";
import { Car } from "@/models/cars";
import ImageUpload from "@/components/Cars/ImageUpload";
import { useAddCar, useEditCar } from "@/services/carsApi";

interface Props {
  car: Car | null;
  onCloseModal: () => void;
}

const validationSchema = Yup.object().shape({
  make: Yup.string().required("Make is required"),
  model: Yup.string().required("Model is required"),
  year: Yup.number().required("Year is required").positive().integer(),
  vinCode: Yup.string().required("Vin code is required"),
  price: Yup.number().required("Price is required").positive(),
  description: Yup.string().required("Description is required"),
  color: Yup.string().required("Color is required"),
  mileage: Yup.number().required("Mile age is required").positive().integer(),
  images: Yup.array(),
  engine: Yup.string().required("Engine is required"),
  bodyType: Yup.string().required("Body type is required"),
});

const EditForm: FC<Props> = ({ car, onCloseModal }) => {
  const addCarMutation = useAddCar();
  const editCarMutation = useEditCar();

  const initialValues: Car = useMemo(
    () => ({
      make: car?.make || "",
      model: car?.model || "",
      year: car?.year || 0,
      vinCode: car?.vinCode || "",
      price: car?.price || 0,
      description: car?.description || "",
      color: car?.color || "",
      images: car?.images || [],
      mileage: car?.mileage || 0,
      engine: car?.engine || "",
      bodyType: car?.bodyType || "",
    }),
    [car],
  );

  const handleSubmit = async (values: Car) => {
    try {
      const formData = new FormData();

      // Append form fields to formData
      formData.append("make", values.make);
      formData.append("model", values.model);
      formData.append("year", values.year.toString());
      formData.append("vinCode", values.vinCode ?? "");
      formData.append("price", values.price.toString());
      formData.append("description", values.description ?? "");
      formData.append("color", values.color);
      formData.append("mileage", values.mileage.toString());
      formData.append("engine", values.engine.toString());
      formData.append("bodyType", values.bodyType.toString());

      // Append images to formData
      values.images.forEach((file: File) => {
        formData.append("images", file);
      });

      if (car?.id) {
        editCarMutation.mutate({ id: car.id, formData });
      } else {
        addCarMutation.mutate(formData);
      }
      onCloseModal(); // Close modal after adding or editing
      console.log("Operation completed successfully");
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <>
      <h2 className="mb-4 text-2xl font-bold">
        {car ? "Edit Car" : "Create New Car"}
      </h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ setFieldValue }) => {
          return (
            <Form>
              <div className="flex gap-x-10">
                <div className="form-control mb-4 flex-1">
                  <label className="label">Make</label>
                  <Field name="make" className="input input-bordered" />
                  <ErrorMessage
                    name="make"
                    component="div"
                    className="text-red"
                  />
                </div>

                <div className="form-control mb-4 flex-1">
                  <label className="label">Model</label>
                  <Field name="model" className="input input-bordered" />
                  <ErrorMessage
                    name="model"
                    component="div"
                    className="text-red"
                  />
                </div>
              </div>

              <div className="flex gap-x-10">
                <div className="form-control mb-4 flex-1">
                  <label className="label">Year</label>
                  <Field
                    name="year"
                    type="number"
                    className="input input-bordered"
                  />
                  <ErrorMessage
                    name="year"
                    component="div"
                    className="text-red"
                  />
                </div>

                <div className="form-control mb-4 flex-1">
                  <label className="label">Vin code</label>
                  <Field name="vinCode" className="input input-bordered" />
                  <ErrorMessage
                    name="vinCode"
                    component="div"
                    className="text-red"
                  />
                </div>
              </div>

              <div className="flex gap-x-10">
                <div className="form-control mb-4 flex-1">
                  <label className="label">Price</label>
                  <Field
                    name="price"
                    type="number"
                    className="input input-bordered"
                  />
                  <ErrorMessage
                    name="price"
                    component="div"
                    className="text-red"
                  />
                </div>

                <div className="form-control mb-4 flex-1">
                  <label className="label">Mile age</label>
                  <Field
                    name="mileage"
                    type="number"
                    className="input input-bordered"
                  />
                  <ErrorMessage
                    name="mileage"
                    component="div"
                    className="text-red"
                  />
                </div>
              </div>

              <div className="flex gap-x-10">
                <div className="form-control mb-4 flex-1">
                  <label className="label">Engine</label>
                  <Field
                    name="engine"
                    type="text"
                    className="input input-bordered"
                  />
                  <ErrorMessage
                    name="engine"
                    component="div"
                    className="text-red"
                  />
                </div>

                <div className="form-control mb-4 flex-1">
                  <label className="label">Body type</label>
                  <Field
                    name="bodyType"
                    type="text"
                    className="input input-bordered"
                  />
                  <ErrorMessage
                    name="bodyType"
                    component="div"
                    className="text-red"
                  />
                </div>
              </div>
              <div className="flex gap-x-10">
                <div className="form-control mb-4 flex-1">
                  <label className="label">Color</label>
                  <Field name="color" className="input input-bordered" />
                  <ErrorMessage
                    name="color"
                    component="div"
                    className="text-red"
                  />
                </div>

                <div className="form-control mb-4 flex-1">
                  <label className="label">Description</label>
                  <Field
                    name="description"
                    as="textarea"
                    className="input input-bordered"
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-red"
                  />
                </div>
              </div>

              <div className="form-control mb-4 flex-1">
                <label className="label">Upload Images</label>
                <ImageUpload
                  images={initialValues.images}
                  setImages={(images: File[]) =>
                    setFieldValue("images", images)
                  }
                />
                <ErrorMessage
                  name="images"
                  component="div"
                  className="text-red"
                />
              </div>

              <div className="mt-10">
                <button type="submit" className="btn btn-primary mr-4">
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-error"
                  onClick={onCloseModal}
                >
                  Cancel
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default EditForm;
