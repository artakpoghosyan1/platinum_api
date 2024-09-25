import { FC, useState } from "react";
import { Field } from "formik";
import { Tooltip } from "react-tooltip";

export const Rates: FC = () => {
  const [usdRateChecked, setUsdRateChecked] = useState(false);
  const [rurRateChecked, setRurRateChecked] = useState(false);

  return (
    <>
      <div className="flex flex-col items-end justify-center">
        <Field
          id="rateCheckbox"
          type="checkbox"
          checked={usdRateChecked}
          onChange={(e: any) => setUsdRateChecked(e.target.checked)}
        />
      </div>
      <div className="w-30">
        <label className="mb-2">USD rate</label>
        <Field
          disabled={!usdRateChecked}
          name="usd"
          type="number"
          className="input input-bordered w-full"
        />
      </div>

      <div className="flex flex-col items-end justify-center">
        <Field
          id="rateCheckbox"
          type="checkbox"
          checked={rurRateChecked}
          onChange={(e: any) => setRurRateChecked(e.target.checked)}
        />
      </div>

      <div className="w-30">
        <label className="mb-2">RUR rate</label>
        <Field
          disabled={!rurRateChecked}
          name="rur"
          type="number"
          className="input input-bordered w-full"
        />
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
        from Ameria bank's system. <br />
        <b>
          If you prefer to set each currency rate manually check the checkboxes.
        </b>
      </Tooltip>
    </>
  );
};
