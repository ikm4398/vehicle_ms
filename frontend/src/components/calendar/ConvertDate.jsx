import React, { useEffect, useRef, useState } from "react";
import { adToBs, bsToAd } from "@sbmdkl/nepali-date-converter";

const ConvertDate = ({ value, onChange, placeholder, id }) => {
  const inputRef = useRef(null);
  const [bsValue, setBsValue] = useState("");

  // Convert AD → BS whenever `value` changes
  useEffect(() => {
    if (value) {
      try {
        const bsDate = adToBs(value.split("T")[0]); // ensure only YYYY-MM-DD
        setBsValue(bsDate);
      } catch (err) {
        console.error("Failed to convert AD to BS:", err);
      }
    } else {
      setBsValue("");
    }
  }, [value]);

  // Initialize Nepali datepicker
  useEffect(() => {
    if (window.$ && inputRef.current && inputRef.current.nepaliDatePicker) {
      inputRef.current.nepaliDatePicker({
        ndpYear: true,
        ndpMonth: true,
        onChange: function () {
          const val = inputRef.current.value; // BS date
          setBsValue(val);

          try {
            const adDate = bsToAd(val); // Convert BS → AD
            onChange(adDate);
          } catch (err) {
            console.error("Failed to convert BS to AD:", err);
          }
        },
      });
    } else {
      console.warn(
        "Nepali Datepicker script not loaded or jQuery not available."
      );
    }
  }, [onChange]);

  // Always update the input value when bsValue changes
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = bsValue || "";
    }
  }, [bsValue]);

  return (
    <input
      type="text"
      id={id}
      ref={inputRef}
      placeholder={placeholder}
      defaultValue={bsValue}
      readOnly
    />
  );
};

export default ConvertDate;
