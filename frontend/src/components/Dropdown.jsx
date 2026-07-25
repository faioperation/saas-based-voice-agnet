"use client";
import React, { useState, useEffect, useRef } from "react";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";

const Dropdown = ({
  label = "",
  placeholder = "",
  options = [],
  onSelect,
  className,
  inputClass,
  spanClass,
  optionClass,
  labelClass,
  icon,
  value
}) => {
  const [selected, setSelected] = useState(value || "");

  useEffect(() => {
    if (value) {
      setSelected(value);
    }
  }, [value]);
  const [show, setShow] = useState(false);
  const dropdownRef = useRef(null);

  const handleSelect = (item) => {
    const val = typeof item === "object" && item !== null ? item.value : item;
    setSelected(val);
    setShow(false);
    if (onSelect) onSelect(val);
  };

  const getDisplayValue = () => {
    if (!selected) return "";
    const option = options.find(
      (opt) => (typeof opt === "object" && opt !== null ? opt.value : opt) === selected
    );
    if (option) {
      return typeof option === "object" && option !== null ? option.label : option;
    }
    return selected;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShow(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={dropdownRef}
      className={`flex flex-col gap-2   relative ${className}`}
    >
      {/* Label */}
      {label && (
        <label className={`font-inter text-[#364153]   ${labelClass}`}>
          {label}
        </label>
      )}


      {/* Input Box */}
      <div className="relative">
        <div onClick={() => setShow(!show)}>
          <input
            readOnly
            value={getDisplayValue()}
            className={`w-full bg-white outline-none text-sky-950 border border-sky-200 py-2.5 px-4 rounded-lg placeholder:text-gray-400 cursor-pointer shadow-sm hover:border-sky-300 transition-colors ${inputClass || ''}`}
            placeholder={placeholder}
          />

          {/* Arrow Icon */}
          <div className={`w-6 h-6 flex items-center justify-center absolute top-1/2 -translate-y-1/2 right-3 text-sky-500 pointer-events-none ${icon}`}>
            {show ? <FaCaretUp /> : <FaCaretDown />}
          </div>
        </div>

        {/* Dropdown Menu */}
        <div
          className={`absolute left-0 top-[105%] w-full bg-white border border-sky-100 rounded-xl shadow-lg text-sky-950 z-30 transition-all duration-300 text-center overflow-hidden hide-scrollbar ${optionClass} ${
            show
              ? "opacity-100 visible max-h-60 mt-1"
              : "opacity-0 invisible max-h-0"
          }`}
        >
          {options.map((item, index) => {
            const isObj = typeof item === "object" && item !== null;
            const label = isObj ? item.label : item;
            const val = isObj ? item.value : item;
            return (
              <div
                key={index}
                onClick={() => handleSelect(item)}
                className={`py-2.5 px-4 cursor-pointer transition-colors duration-200 hover:bg-sky-50 hover:text-sky-700 ${selected === val ? 'bg-sky-50 text-sky-700 font-medium' : 'text-sky-950'}`}
              >
                {label}
              </div>
            );
          })} 
        </div>
      </div>
    </div>
  );
};

export default Dropdown;



