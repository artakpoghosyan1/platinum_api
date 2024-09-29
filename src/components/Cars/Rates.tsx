import { ChangeEvent, Dispatch, FC, SetStateAction } from "react";
import { Field } from "formik";
import { Tooltip } from "react-tooltip";
import Loader from "@/components/common/Loader";
import { FormikErrors } from "formik/dist/types";
import { Rates as IRates } from "@/models/cars";

interface Props {
  rates: IRates | null;
  isRatesLoading: boolean;
  usdRateChecked: boolean;
  setUsdRateChecked: Dispatch<SetStateAction<boolean>>;
  rurRateChecked: boolean;
  setRurRateChecked: Dispatch<SetStateAction<boolean>>;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean,
  ) => Promise<void | FormikErrors<any>>;
}

export const Rates: FC<Props> = ({
  isRatesLoading,
  usdRateChecked,
  setUsdRateChecked,
  rurRateChecked,
  setRurRateChecked,
  setFieldValue,
  rates,
}) => {
  const onCheckedChange = (
    e: ChangeEvent<HTMLInputElement>,
    type: keyof IRates,
  ) => {
    if (type === "usd") {
      setUsdRateChecked(e.target.checked);
    } else {
      setRurRateChecked(e.target.checked);
    }

    if (!e.target.checked) {
      setFieldValue(type, (rates as IRates)[type]);
    }
  };

  return (
    <>
      <div className="flex flex-col items-end justify-center">
        <Field
          id="rateCheckbox"
          type="checkbox"
          checked={usdRateChecked}
          onChange={(e: any) => onCheckedChange(e, "usd")}
        />
      </div>
      <div className="relative w-30">
        <label className="mb-2">USD rate</label>
        <div className="relative">
          <Field
            disabled={!usdRateChecked}
            name="usd"
            type="number"
            className="input input-bordered w-full disabled:text-bodydark2 dark:bg-graydark"
          />
          {isRatesLoading && (
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <Loader size="small" />
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col items-end justify-center">
        <Field
          id="rateCheckbox"
          type="checkbox"
          checked={rurRateChecked}
          onChange={(e: any) => onCheckedChange(e, "rur")}
        />
      </div>

      <div className=" w-30">
        <label className="mb-2">RUR rate</label>
        <div className="relative">
          <Field
            disabled={!rurRateChecked}
            name="rur"
            type="number"
            className="input input-bordered w-full disabled:text-bodydark2 dark:bg-graydark"
          />
          {isRatesLoading && (
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <Loader size="small" />
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 items-center justify-end text-info">
        <span className="rate-checkbox">
          <svg
            className="fill-current"
            x="0px"
            y="0px"
            width="30"
            height="30"
            viewBox="0 0 50 50"
          >
            <path d="M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46 4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z M 25 11 A 3 3 0 0 0 22 14 A 3 3 0 0 0 25 17 A 3 3 0 0 0 28 14 A 3 3 0 0 0 25 11 z M 21 21 L 21 23 L 22 23 L 23 23 L 23 36 L 22 36 L 21 36 L 21 38 L 22 38 L 23 38 L 27 38 L 28 38 L 29 38 L 29 36 L 28 36 L 27 36 L 27 21 L 26 21 L 22 21 L 21 21 z" />
          </svg>
        </span>
      </div>

      <Tooltip
        anchorSelect=".rate-checkbox"
        place="top"
        style={{ maxWidth: "300px" }}
      >
        The rate values are got automatically based on the latest exchange rates
        from system of Ameria bank. <br />
        <b>
          If you prefer to set each currency rate manually check the checkboxes.
        </b>
      </Tooltip>
    </>
  );
};
