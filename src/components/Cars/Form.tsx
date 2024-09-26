"use client";

import { FC, useEffect, useMemo, useState } from "react";
import * as Yup from "yup";
import { ErrorMessage, Field, Formik, Form } from "formik";
import { Car } from "@/models/cars";
import ImageUpload from "@/components/Cars/ImageUpload";
import { useAddCar, useEditCar } from "@/services/carsApi";
import Loader from "@/components/common/Loader";
import { Rates } from "@/components/Cars/Rates";
import { toast } from "react-toastify";

interface Props {
  car: Car | null;
  onCloseModal: () => void;
}

interface FormCarData extends Omit<Car, "rates"> {
  usd?: number;
  rur?: number;
}

const validationSchema = Yup.object().shape({
  make: Yup.string().required("Make is required"),
  model: Yup.string().required("Model is required"),
  year: Yup.number()
    .required("Year is required")
    .positive()
    .integer()
    .min(1886, "Year must be 1886 or later") // Assuming 1886 as the earliest year for cars
    .max(
      new Date().getFullYear(),
      `Year must be ${new Date().getFullYear()} or earlier`,
    ),
  vinCode: Yup.string(),
  price: Yup.number().required("Price is required").positive(),
  usd: Yup.number().positive(),
  rur: Yup.number().positive(),
  description: Yup.string().required("Description is required"),
  color: Yup.string().required("Color is required"),
  mileage: Yup.number().required("Mile age is required").positive().integer(),
  images: Yup.array()
    .min(1, "At least one image is required")
    .required("At least one image is required"),
  engine: Yup.string().required("Engine is required"),
  bodyType: Yup.string().required("Body type is required"),
});

const EditForm: FC<Props> = ({ car, onCloseModal }) => {
  const addCarMutation = useAddCar();
  const editCarMutation = useEditCar();
  const [rates, setRates] = useState<{ usd: number; rur: number } | null>(null);
  const [isRatesLoading, setIsRatesLoading] = useState<boolean>(true);
  const [usdRateChecked, setUsdRateChecked] = useState(false);
  const [rurRateChecked, setRurRateChecked] = useState(false);

  const initialValues: FormCarData = useMemo(() => {
    const ratesData = car?.rates || rates ? { ...car?.rates, ...rates } : {};
    return {
      make: car?.make || "",
      model: car?.model || "",
      year: car?.year || "",
      vinCode: car?.vinCode || "",
      price: car?.price || "",
      description: car?.description || "",
      color: car?.color || "",
      images: car?.images || [],
      mileage: car?.mileage || "",
      engine: car?.engine || "",
      bodyType: car?.bodyType || "",
      ...ratesData,
    };
  }, [car, isRatesLoading, rates]);

  useEffect(() => {
    if (car?.rates) {
      setUsdRateChecked(!!car.rates.usd);
      setRurRateChecked(!!car.rates.rur);
    }
  }, [car?.rates]);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch("/api/extractRate");
        const result = await response.json();
        setRates(result);
      } catch (error: any) {
        console.error("Error fetching rates", error.message);
      } finally {
        setIsRatesLoading(false);
      }
    };

    fetchRates();
  }, []);

  const handleSubmit = async (values: FormCarData) => {
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

      const usd = usdRateChecked ? { usd: values.usd } : null;
      const rur = rurRateChecked ? { rur: values.rur } : null;

      if (usd || rur) {
        formData.append("rates", JSON.stringify({ ...usd, ...rur }));
      }

      // Append images to formData
      values.images.forEach((file: File) => {
        formData.append("images", file);
      });

      if (car?.id) {
        editCarMutation.mutate(
          { id: car.id, formData },
          {
            onSuccess: onCloseModal,
            onError: (error) =>
              toast.error(error.message, { position: "top-center" }),
          },
        );
      } else {
        addCarMutation.mutate(formData, {
          onSuccess: onCloseModal,
          onError: (error) => {
            toast.error(error.message, { position: "top-center" });
          },
        });
      }
      console.log("Operation completed successfully");
    } catch (error: any) {
      toast.error(error.message, { position: "top-center" });
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
        {({ setFieldValue, isSubmitting }) => {
          return (
            <Form>
              <div className="flex gap-x-10">
                <div className="form-control mb-4 flex-1">
                  <label className="mb-2 after:text-red after:content-['*']">
                    Make
                  </label>
                  <Field name="make" className="input input-bordered " />
                  <ErrorMessage
                    name="make"
                    component="div"
                    className="text-red"
                  />
                </div>

                <div className="form-control mb-4 flex-1">
                  <label className="mb-2 after:text-red after:content-['*']">
                    Model
                  </label>
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
                  <label className="mb-2 after:text-red after:content-['*']">
                    Year
                  </label>
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
                  <label className="mb-2">Vin code</label>
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
                  <label className="mb-2 after:text-red after:content-['*']">
                    Price <i>(AMD)</i>
                  </label>
                  <Field
                    name="price"
                    type="number"
                    className="input input-bordered w-full"
                  />
                  <ErrorMessage
                    name="price"
                    component="div"
                    className="text-red"
                  />
                </div>

                <div className="form-control mb-4 flex-1">
                  <label className="mb-2 after:text-red after:content-['*']">
                    Mile age
                  </label>
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
                <div className="mb-4 flex flex-1 space-x-4">
                  <Rates
                    isRatesLoading={isRatesLoading}
                    usdRateChecked={usdRateChecked}
                    setUsdRateChecked={setUsdRateChecked}
                    rurRateChecked={rurRateChecked}
                    setRurRateChecked={setRurRateChecked}
                    setFieldValue={setFieldValue}
                    rates={rates}
                  />
                </div>

                <div className="form-control mb-4 flex-1">
                  <label className="mb-2 after:text-red after:content-['*']">
                    Engine
                  </label>
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
              </div>

              <div className="flex gap-x-10">
                <div className="form-control mb-4 flex-1">
                  <label className="mb-2 after:text-red after:content-['*']">
                    Body type
                  </label>
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

                <div className="form-control mb-4 flex-1">
                  <label className="mb-2 after:text-red after:content-['*']">
                    Color
                  </label>
                  <Field name="color" className="input input-bordered" />
                  <ErrorMessage
                    name="color"
                    component="div"
                    className="text-red"
                  />
                </div>
              </div>

              <div className="flex gap-x-10">
                <div className="form-control mb-4 flex-1">
                  <label className="mb-2 after:text-red after:content-['*']">
                    Upload Images
                  </label>
                  <ImageUpload
                    images={initialValues.images}
                    setFieldValue={setFieldValue}
                  />

                  <ErrorMessage
                    name="images"
                    component="div"
                    className="text-red"
                  />
                </div>

                <div className="form-control mb-4 flex-1">
                  <label className="mb-2">Description</label>
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

              <div className="mt-10">
                <button
                  type="submit"
                  className="btn btn-primary mr-4"
                  disabled={isSubmitting || addCarMutation.isPending}
                >
                  {addCarMutation.isPending ? (
                    <Loader size="small" color="border-white" />
                  ) : (
                    "Save"
                  )}
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
