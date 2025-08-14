import React, { useEffect, useRef } from "react";

// You need to either host this script or import it separately in your index.html or public folder
// For example, you can put the nepali.datepicker.v4.0.8.min.js in public/js and include it

const NepaliDatePicker = ({ value, onChange, id, placeholder }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    // Check if NepaliDatePicker plugin is loaded
    if (window.$ && inputRef.current && inputRef.current.nepaliDatePicker) {
      // Initialize datepicker with options
      inputRef.current.nepaliDatePicker({
        ndpYear: true,
        ndpMonth: true,
        onChange: function () {
          // Get the Nepali date string value
          const val = inputRef.current.value;
          onChange(val);
        },
      });

      // Set initial value if present
      if (value) {
        inputRef.current.value = value;
      }
    } else {
      console.warn(
        "Nepali Datepicker script not loaded or jQuery not available."
      );
    }
  }, [value, onChange]);

  return (
    <input
      type="text"
      ref={inputRef}
      id={id}
      placeholder={placeholder}
      defaultValue={value}
      //readOnly // Usually the Nepali datepicker inputs are readonly so user uses the picker
    />
  );
};

export default NepaliDatePicker;
