export const commonSelectStyles = {
  control: (baseStyles: any, state: any) => ({
    ...baseStyles,
    minHeight: "auto",
    width: "full",
    backgroundColor:
      state.isFocused || state.menuIsOpen ? "#374151" : "transparent",
    borderColor: "#4B5563",
    borderRadius: "0.375rem",
    boxShadow: "none",
    cursor: "pointer",
    fontSize: "0.75rem",
    fontWeight: 500,
    transition: "all 0.2s",
    ":hover": {
      backgroundColor: "#374151",
      borderColor: "#4B5563",
    },
  }),
  valueContainer: (baseStyles: any) => ({
    ...baseStyles,
    padding: "0.375rem 0.5rem",
    gap: "0.375rem",
  }),
  input: (baseStyles: any) => ({
    ...baseStyles,
    margin: 0,
    padding: 0,
    color: "#e5e7eb",
  }),
  placeholder: (baseStyles: any) => ({
    ...baseStyles,
    color: "#9ca3af",
    margin: 0,
  }),

  option: (baseStyles: any, state: any) => ({
    ...baseStyles,
    fontSize: "0.75rem",
    color: "#e5e7eb",
    margin: "2px 0px",
    backgroundColor:
      state.isFocused || state.isSelected ? "#374151" : "transparent",
    padding: "0.375rem 0.5rem",
    borderRadius: "0.125rem",
    cursor: "pointer",
    ":active": {
      backgroundColor: "#374151",
    },
  }),
  dropdownIndicator: (baseStyles: any, state: any) => ({
    ...baseStyles,
    padding: "0 0.5rem",
    color: state.isFocused ? "#e5e7eb" : "#9ca3af",
    ":hover": {
      color: "#e5e7eb",
    },
  }),
  menu: (baseStyles: any) => ({
    ...baseStyles,
    backgroundColor: "#1f2937",
    border: "1px solid #374151",
    borderRadius: "0.375rem",
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)", // shadow-xl
    marginTop: "0.25rem",
    zIndex: 50,
  }),
  menuList: (baseStyles: any) => ({
    ...baseStyles,
    padding: "0.25rem",
  }),
  singleValue: (baseStyles: any) => ({
    ...baseStyles,
    color: "#e5e7eb",
    margin: 0,
  }),
};

import { StylesConfig } from "react-select";

export const commonSelectStyles2: StylesConfig = {
  control: (base, state) => ({
    ...base,
    minHeight: 48,
    height: 48,
    backgroundColor: "var(--card)",
    borderColor: state.isFocused ? "var(--ring)" : "var(--border)",
    borderRadius: 8,
    borderWidth: 1,
    boxShadow: state.isFocused ? "0 0 0 4px rgba(20,184,166,0.18)" : "none",
    transition: "all 0.18s ease",
    cursor: "pointer",
    "&:hover": {
      borderColor: "var(--ring)",
    },
  }),

  valueContainer: (base) => ({
    ...base,
    height: 48,
    padding: "0 14px",
  }),

  input: (base) => ({
    ...base,
    color: "var(--foreground)",
    margin: 0,
    padding: 0,
  }),

  placeholder: (base) => ({
    ...base,
    color: "var(--muted-foreground)",
    fontSize: 14,
  }),

  singleValue: (base) => ({
    ...base,
    color: "var(--foreground)",
    fontSize: 14,
    fontWeight: 500,
  }),

  indicatorSeparator: () => ({
    display: "none",
  }),

  dropdownIndicator: (base, state) => ({
    ...base,
    color: "var(--muted-foreground)",
    transition: "all .18s ease",
    transform: state.selectProps.menuIsOpen ? "rotate(180deg)" : "rotate(0deg)",

    "&:hover": {
      color: "var(--primary)",
    },
  }),

  menu: (base) => ({
    ...base,
    marginTop: 8,
    backgroundColor: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 12px 32px rgba(15,23,42,.12)",
  }),

  menuList: (base) => ({
    ...base,
    padding: 6,
  }),

  option: (base, state) => ({
    ...base,

    padding: "10px 12px",
    margin: "5px 0",
    borderRadius: 8,

    fontSize: 14,
    cursor: "pointer",

    backgroundColor: state.isSelected
      ? "var(--primary)"
      : state.isFocused
        ? "rgba(20, 184, 166, 0.12)"
        : "transparent",

    color: state.isSelected ? "var(--primary-foreground)" : "var(--foreground)",

    transition: "all .15s ease",

    ":active": {
      backgroundColor: state.isSelected
        ? "var(--primary)"
        : "rgba(20, 184, 166, 0.18)",
    },
  }),

  noOptionsMessage: (base) => ({
    ...base,
    color: "var(--muted-foreground)",
    padding: 12,
  }),
};
