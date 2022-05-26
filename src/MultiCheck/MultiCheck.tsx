import './MultiCheck.css';

import React, { useEffect, FC, useState, ChangeEvent } from 'react';

export type Option = {
  label: string,
  value: string
}

/**
 * Notice:
 * 1. There should be a special `Select All` option with checkbox to control all passing options
 * 2. If columns > 1, the options should be placed from top to bottom in each column
 *
 * @param {string} label - the label text of this component
 * @param {Option[]} options - options. Assume no duplicated labels or values
 * @param {string[]} values - If `undefined`, makes the component in uncontrolled mode with no options checked;
 *                            if not undefined, makes the component to controlled mode with corresponding options checked.
 *                            The values CAN be duplicated or NOT in the provided options
 * @param {number} columns - default value is 1. If it's bigger than all options count, make it same as the count of all options 
 * @param {Function} onChange - if not undefined, when checked options are changed, they should be passed to outside;
 *                              if undefined, the options can still be selected, but won't notify the outside
 * @param {Function} onRender - will be called if current component rendered. Determine the balance between a reasonable
 *                              render count and readable code
 */
export type Props = {
  label?: string,
  options: Option[],
  columns?: number,
  values?: string[]
  onChange?: (options: Option[]) => void,
  onRender: () => void
}

export const MultiCheck: FC<Props> = (props) => {
  const {onRender} = props;

  {
    // NOTE Don't modify the code block, it can be considered as a performance hint,
    //      you need to find a way to avoid triggering it infinitely
    console.log('### > MultiCheck');
    useEffect(() => {
      onRender()
    })
  }

  const [layout, setLayout] = useState<number[]>([]);
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  const [selectedValues, setSelectedValues] = useState<string[]>(props.values || []);

  function onSelectAllChange(event: ChangeEvent<HTMLInputElement>) {
    const checked = event.target.checked;
    const finialSelectedValues = checked ? props.options.map(option => option.value) : [];
    setSelectAllChecked(checked);
    setSelectedValues(finialSelectedValues);
    outsideOnChange(finialSelectedValues);
  }

  function onCheckboxChange(option: Option, event: ChangeEvent<HTMLInputElement>) {
    const checked = event.target.checked;
    const finalSelectedValues = checked
      ? selectedValues.concat(option.value)
      : selectedValues.filter(value => value !== option.value);
    setSelectedValues(finalSelectedValues);
    shouldSelectAllChecked(finalSelectedValues);
    outsideOnChange(finalSelectedValues);
  }

  function shouldSelectAllChecked(finalSelectedValues: string[]) {
    const allOptionsChecked = (props.options || []).every(option => finalSelectedValues.includes(option.value));
    setSelectAllChecked(allOptionsChecked);
  }

  function outsideOnChange(finalSelectedValues: string[]) {
    if (props.onChange) {
      props.onChange(props.options.filter(option => finalSelectedValues.includes(option.value)));
    }
  }

  function renderOptions() {
    const finalOptions = [...props.options];
    return layout.map((count, column) => {
      const options = finalOptions.splice(0, count);
      return (
        <div key={`column-${column}`} className='multi-check-column'>
          {/* The "Select All" option */}
          {column === 0
            ? (
              <div className='multi-check-option multi-check-select-all'>
                <input
                  type='checkbox'
                  id='multi-check-select-all'
                  name='multi-check-select-all'
                  checked={selectAllChecked}
                  onChange={onSelectAllChange}
                />
                <label htmlFor='multi-check-select-all'>Select&nbsp;All</label>
              </div>
            ) : null
          }
          {options.map(option => {
            const checked = selectedValues.includes(option.value);
            return (
              <div key={option.value} className='multi-check-option'>
                <input
                  type='checkbox'
                  id={option.label}
                  checked={checked}
                  name={option.label}
                  onChange={e => onCheckboxChange(option, e)}
                />
                <label htmlFor={option.label}>{option.label}</label>
              </div>
            );
          })}
        </div>
      );
    });
  }

  useEffect(function setValuesIfChanged() {
    setSelectedValues(props.values || []);
    shouldSelectAllChecked(props.values || []);
  }, [props.values]);

  useEffect(function geneLayout() {
    // don't forget the extra "Select All" option
    const optionsTotalCount = props.options.length + 1;
    // in case of negative or float number
    const columnCount = props.columns && props.columns > 0 ? parseInt(props.columns.toString()) : 1;
    const intactRows = parseInt((optionsTotalCount / columnCount).toString());
    const restOptionsCount = optionsTotalCount % columnCount;
    // each item is the number of the option that should be rendered for each column
    let layout = Array(columnCount).fill(intactRows);
    // put rest options in order into each column
    for (let i = 0; i < restOptionsCount; i++) {
      layout[i] += 1;
    }
    // then, remove the count for the "Select All" option
    layout.splice(0, 1, layout[0] - 1);
    setLayout(layout);
  }, [props.columns, props.options]);

  return (
    <div className='multi-check'>
      {props.label
        ? <div className='multi-check-label'>{props.label}</div>
        : null
      }
      {props.options && props.options.length
        ? (
          <div className='multi-check-options-outer'>
            <div className='multi-check-options-inner'>
              {renderOptions()}
            </div>
          </div>
        )
        : 'No options provided'
      }
    </div>
  );
};
