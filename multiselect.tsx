import React, { useEffect, useMemo, useRef, useState } from "react";
import Arrow from "./icons/Arrow";
import Close from "./icons/Close";

/**
 * *********************************************************************************************************************
 * @options options is the array which will render as a dropdown list .
 * @className className is passes into the parent component.
 * @id is passed as a props for both input and parent component.
 * @emptyRecordMsg This props is used for showing empty message in the dropdown list.
 * @loading This props is used for showing loading message when data is being fething from API's.
 * @loadingMessage This props is used for showing the loading message as a string or it will be a JSX loader component.
 * @isObject This Props is need to be enable when the @options contain array of object.
 * @onSelect This method is used for getting the seleted value.
 * @displayValue This props is is required when the @isObject is true.
 * @customCloseIcon This props is used for applying the custum icon for selected values.
 * @selectedValues This is the Array of element/object for selected initially from the option given.
 * @hidePlaceholder This is boolean value for hiding the placeholder.
 * @placeholder This is for the placeholder text
 * @name This props is used for giving the name to the dropdown component.
 * @showArrow This is used for showing the extend element in the dropdown.
 * @customArrow This is used for passing the custom extend element in the dropdown.
 * @returns React JSX.
 * *********************************************************************************************************************
 */
interface Props {
  options: any;
  className?: string;
  id?: string;
  disable?: boolean;
  emptyRecordMsg?: string;
  loading?: boolean;
  loadingMessage?: React.ReactNode | string;
  isObject?: boolean;
  onSelect?: (d: any) => void;
  displayValue?: string;
  customCloseIcon?: React.ReactNode | string;
  selectedValues?: any;
  hidePlaceholder?: boolean;
  placeholder?: string;
  name?: string;
  showArrow?: boolean;
  customArrow?: React.ReactNode | string;
}

const MultiSelect = ({
  options = [],
  className = "",
  id = "",
  disable = false,
  emptyRecordMsg = "No Option Available",
  loading = false,
  loadingMessage = "loading...",
  isObject = false,
  onSelect = (d: any) => {},
  displayValue = "",
  customCloseIcon = "",
  selectedValues = [],
  hidePlaceholder = false,
  placeholder = "Select",
  name = "",
  showArrow = true,
  customArrow = "",
  ...props
}: Props) => {
  // Create reference for opening dropdown and making focus and blur of input field.
  let searchBox: any = useRef();
  let multiSelectRef: any = useRef();

  // This is the required state to store and update the states values.
  const [state, setState] = useState<any>({
    toggleOptionsList: false,
    inputValue: "",
    options: [],
    filteredOptions: [],
    unfilteredOptions: [],
    selectedValues: Object.assign([], selectedValues),
  });

  useMemo(() => {
    if (options && options.length) {
      state.options = options;
      state.unfilteredOptions = options;
      state.filteredOptions = options;
    }
  }, [options.length]);

  useEffect(() => {
    const selectedValuesProps = Object.assign([], selectedValues);
    if (selectedValuesProps) {
      state.selectedValues = selectedValuesProps;
      removeSelectedValuesFromOptions(true);
    }
  }, [selectedValues?.length]);

  /**
   * This function is used for added focus and remove focus.
   */
  const focusSearch = (focus: boolean) => {
    focus ? searchBox.current.blur() : searchBox.current.focus();
  };

  /**
   * This function is used for toggle the dropdown list.
   */
  const toggelOptionList = () => {
    const focus = state.toggleOptionsList;
    setState({
      ...state,
      toggleOptionsList: !focus,
    });
    focusSearch(focus);
  };

  /**
   * This function is used for removing the options from the dropdown list which is being not selected.
   */
  const removeSelectedValuesFromOptions = (skipCheck: boolean) => {
    if (!state.selectedValues.length && !skipCheck) {
        return;
      }
      
      if (isObject) {
        setState((prev) => {
          let optionList = state.unfilteredOptions.filter((item: any) => (state.selectedValues.findIndex((v: any) => v[displayValue] === item[displayValue]) === -1 ? true : false));
          return {
            ...prev,
            options: optionList,
            filteredOptions: optionList,
          };
        });
      } else {
        let optionList = state.unfilteredOptions.filter((item) => state.selectedValues.indexOf(item) === -1);
        setState({ ...state, options: optionList, filteredOptions: optionList });
      }
      
  };

  /**
   * This function is used for checking does the seleced item is already present or not.
   */
  const isSelectedValue = (item) => {
    return isObject ? state.selectedValues.some((i: any) => i[displayValue] === item[displayValue]) : state.selectedValues.some((i: any) => i === item);
  };

  /**
   * This function is used for removing the corresponding selected item from the dropdown list.
   */
  const onRemoveSelectedItem = (item) => {
    focusSearch(false);
    const index = isObject ? state.selectedValues.findIndex((i) => i[displayValue] === item[displayValue]) : state.selectedValues.indexOf(item);
    state.selectedValues.splice(index, 1);
    onSelect(state.selectedValues);
    state.toggleOptionsList = true;
    removeSelectedValuesFromOptions(true);
  };

  /**
   * This function is used for selecting the item from dropdown list and send the total selected data
   * to the user with removal of selected item from dropdown list.
   */
  const onSelectItem = (item: any) => {
    let newSelectedvalue = [...state.selectedValues, ...[item]];

    if (isSelectedValue(item)) {
      onRemoveSelectedItem(item);
      return;
    }
    onSelect(newSelectedvalue);
    state.selectedValues.push(item);
    removeSelectedValuesFromOptions(true);
    return;
  };

  /**
   * This function is used for searching the item in the dropdown list and render data accordingly.
   */
  const onChange = (event) => {
    const { value } = event.target;
    const option = isObject
    ? state.filteredOptions.filter((i: any) => i[displayValue].toLowerCase().indexOf(value.toLowerCase()) > -1)
    : state.filteredOptions.filter((i: any) => i.toLowerCase().indexOf(value.toLowerCase()) > -1);
    setState({ ...state, toggleOptionsList: true, inputValue: value, options: option });
  };

  /**
   * This function is used for removinng the selected value in the selected list while using back space if the input field is empty.
   */
  const onArrowKeyNavigation = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Backspace" && e.key === "Backspace" && !state.inputValue && state.selectedValues.length) {
      state.selectedValues.pop();
      removeSelectedValuesFromOptions(true);
      onSelect(state.selectedValues);
    }
  };

  /**
   * This useEffect is used for opening or closing the dropdown list when clickded on outside rater than the dropdown.
   */
  useEffect(() => {
    function handleClickOutside(event) {
      if (state.toggleOptionsList && !multiSelectRef.current.contains(event.target)) {
        removeSelectedValuesFromOptions(true);
        setState({ ...state, toggleOptionsList: false });
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [state]);

  return (
    <div
      className="relative w-full
    h-full"
      ref={multiSelectRef}
    >
      <div
        className={`${disable ? `cursor-not-allowed` : "cursor-pointer"} ${
          className || "bg-artisan-grey-15 rounded-full font-medium text-artisan-grey relative box-border w-full h-full overflow-hidden"
        }`}
        id={id || "artisan-multi-select"}
        onClick={(e) => {
          e.stopPropagation();
          if (disable) {
            return false;
          }
          toggelOptionList();
        }}
      >
        <div className={`h-9 w-full p-[5px] relative flex flex-wrap items-center justify-start overflow-y-auto hide_scrollbar`}>
          {state.selectedValues.map((value: any, index: any) => (
            <span
              key={`selected-${index}`}
              className={`py-[4px] px-[10px] gap-1 mt-[1px] mb-[1px] mr-[5px] inline-flex items-center text-[13px] text-white whitespace-nowrap leading-[16px] rounded-[11px]`}
              style={{ backgroundColor: "#614b79" }}
            >
              {isObject ? value[displayValue] : (value || "").toString()}
              {!customCloseIcon ? (
                <span
                  className={`${disable ? `cursor-not-allowed` : "cursor-pointer"}`}
                  onClick={(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
                    e.stopPropagation();
                    if (disable) {
                      return false;
                    }
                    onRemoveSelectedItem(value);
                  }}
                >
                  <Close />
                </span>
              ) : (
                <span
                  className={`${disable ? `cursor-not-allowed` : "cursor-pointer"}`}
                  onClick={(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
                    e.stopPropagation();
                    if (disable) {
                      return false;
                    }
                    onRemoveSelectedItem(value);
                  }}
                >
                  {customCloseIcon}
                </span>
              )}
            </span>
          ))}
          <input
            type="text"
            id={`${id || "search"}_input`}
            ref={searchBox}
            name={`${name || "search_name"}_input`}
            placeholder={hidePlaceholder && selectedValues.length ? "" : placeholder}
            className={`${disable ? `cursor-not-allowed` : "cursor-pointer"} text-sm text-artisan-grey border-none bg-transparent focus:outline-none ${state.selectedValues.length ? "pl-0" : "pl-2"}`}
            value={state.inputValue}
            autoComplete="off"
            disabled={disable}
            onChange={onChange}
            onKeyDown={onArrowKeyNavigation}
          />
        </div>
        {showArrow && (
          <>
            {customArrow ? (
              <span className={`${state?.toggleOptionsList ? "rotate-180" : "rotate-0"} absolute right-[12px] top-[50%] w-[14px] -translate-y-[50%]`}>{customArrow}</span>
            ) : (
              <span className={`${state?.toggleOptionsList ? "rotate-180" : "rotate-0"} absolute right-[12px] top-[50%] w-[14px] -translate-y-[50%]`}>
                <Arrow />
              </span>
            )}
          </>
        )}
      </div>
      <div
        id="multiselect_dropdown"
        className={`absolute w-full bg-white z-[2] rounded-[5px] drop-shadow-lg text-artisan-grey font-medium ${state.toggleOptionsList ? "block" : "hidden"}`}
        onMouseDown={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => e.preventDefault()}
      >
        {loading ? (
          <ul className={`w-full h-36 block`}>
            {typeof loadingMessage === "string" && <span className={`w-full text-artisan-grey p-[8px] block`}>{loadingMessage}</span>}
            {typeof loadingMessage !== "string" && loadingMessage}
          </ul>
        ) : (
          <ul id="lists" className={`w-full max-h-[250px] overflow-y-auto p-0 m-0 block`}>
            {state.options?.length === 0 && <span className={`w-full text-artisan-grey p-[8px] block`}>{emptyRecordMsg}</span>}
            {state?.options?.map((option: any, i: number) => {
              return (
                <li
                  key={`option-${i}`}
                  id={`lists_label${i}`}
                  className="py-3 px-4 bg-white hover:bg-artisan-grey-15 text-sm drop-shadow-lg cursor-pointer text-ellipsis overflow-hidden"
                  onClick={() => onSelectItem(option)}
                >
                  {isObject ? option[displayValue] : (option || "").toString()}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MultiSelect;
