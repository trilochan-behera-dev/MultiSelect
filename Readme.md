# MultiSelect Component Documentation 🌐🔍

A multidropdown is a user interface (UI) element that allows users to select one or more options from a list of available options. The `MultiSelect` component is a React component that facilitates the implementation of a multi-select dropdown in your project.

## Example Usage 🚀

```jsx
<MultiSelect
  options={/* option array */}
  displayValue={/* key from option array */}
  placeholder="Select multiple fields"
  selectedValues={/* Initial selected value array */}
  emptyRecordMsg="No records found"
  onSelect={/* function call */}
/>

```
## Props 🛠

- **options**: An array of options to be displayed in the dropdown.
- **displayValue**: The key from the option array to be used as the display value.
- **placeholder**: Text to be displayed as a placeholder in the dropdown.
- **selectedValues**: An array of initially selected values.
- **emptyRecordMsg**: Message to be displayed when no records are found.
- **onSelect**: A function to be called when the user selects or unselects an option.

## Installation ⚙️

To use the `MultiSelect` component in your project, you can include it and pass the required props as shown in the example. Ensure that you have the necessary dependencies installed.

```bash
npm install /* any other dependencies used in MultiSelect */
