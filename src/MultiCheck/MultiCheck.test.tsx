import React from 'react';
import { MultiCheck } from './MultiCheck';
import { fireEvent, render, screen, cleanup } from '@testing-library/react';

describe('MultiCheck', () => {
  it('renders the label if label provided', () => {
    const onRender = jest.fn();
    const label = 'test label text';
    render(<MultiCheck label={label} options={[]} onRender={onRender} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it('onRender should be called', () => {
    const onRender = jest.fn();
    render(<MultiCheck options={[]} onRender={onRender} />);
    expect(onRender).toBeCalledTimes(2);
  });

  it('render options if provided', () => {
    const onRender = jest.fn();
    const options = [{ label: 'label', value: 'value' }];
    render(<MultiCheck options={options} onRender={onRender} />);
    expect(screen.getByText('label')).toBeInTheDocument();
  });

  it('render default placeholder if no options provided', () => {
    const onRender = jest.fn();
    render(<MultiCheck options={[]} onRender={onRender} />);
    expect(screen.getByText('No options provided')).toBeInTheDocument();
  });

  it('onChange should be called', () => {
    const onRender = jest.fn();
    const onChange = jest.fn();
    const options = [{ label: 'label', value: 'value' }];
    render(<MultiCheck options={options} onChange={onChange} onRender={onRender} />);
    fireEvent.click(screen.getByText('label'));
    expect(onChange).toBeCalledWith(options);
    fireEvent.click(screen.getByText('label'));
    expect(onChange).toBeCalledWith([]);
  });

  it('all options should be checked', () => {
    const onRender = jest.fn();
    const options = [
      { label: 'label1', value: 'value1' },
      { label: 'label2', value: 'value2' },
    ];
    const values = options.map(option => option.value);
    render(<MultiCheck values={values} options={options} onRender={onRender} />);
    const allCheckboxes = screen.getAllByRole('multi-check-option-checkbox');
    const allChecked = allCheckboxes.every((checkbox: HTMLElement) => (checkbox as HTMLInputElement).checked);
    const selectAllCheckbox = screen.getByRole('multi-check-select-all');
    const selectAllChecked = (selectAllCheckbox as HTMLInputElement).checked;
    expect(allChecked).toBe(true);
    expect(selectAllChecked).toBe(true);
  });

  it('partial options should be checked', () => {
    const onRender = jest.fn();
    const options = [
      { label: 'label1', value: 'value1' },
      { label: 'label2', value: 'value2' },
    ];
    const values = [options[0].value];
    render(<MultiCheck values={values} options={options} onRender={onRender} />);
    const targetCheckbox = screen.getByTestId(options[0].label) as HTMLInputElement;
    const selectAllCheckbox = screen.getByRole('multi-check-select-all') as HTMLInputElement;
    expect(targetCheckbox.checked).toBe(true);
    expect(selectAllCheckbox.checked).toBe(false);
  });

  it('select all should work', async () => {
    const onRender = jest.fn();
    const options = [
      { label: 'label1', value: 'value1' },
      { label: 'label2', value: 'value2' },
    ];
    const getAllCheckboxes = () => screen.getAllByRole('multi-check-option-checkbox');
    const isChecked = (checkbox: HTMLElement) => (checkbox as HTMLInputElement).checked;
    render(<MultiCheck options={options} onRender={onRender} />);
    const selectAllCheckbox = screen.getByRole('multi-check-select-all');
    fireEvent.click(selectAllCheckbox);
    const allChecked = getAllCheckboxes().every(isChecked);
    fireEvent.click(selectAllCheckbox);
    const anyChecked = getAllCheckboxes().some(isChecked);
    expect(allChecked).toBe(true);
    expect(anyChecked).toBe(false);
  });

  it('minimum columns is 1', () => {
    const onRender = jest.fn();
    const options = [
      { label: 'label1', value: 'value1' },
      { label: 'label2', value: 'value2' },
      { label: 'label3', value: 'value3' },
      { label: 'label4', value: 'value4' },
      { label: 'label5', value: 'value5' },
      { label: 'label6', value: 'value6' },
    ];
    render(<MultiCheck options={options} onRender={onRender} />);
    const columns1 = screen.getAllByTestId('multi-check-column');
    cleanup();
    render(<MultiCheck columns={-1} options={options} onRender={onRender} />);
    const columns2 = screen.getAllByTestId('multi-check-column');
    cleanup();
    render(<MultiCheck columns={1.1} options={options} onRender={onRender} />);
    const columns3 = screen.getAllByTestId('multi-check-column');
    cleanup();
    expect(columns1.length).toBe(1);
    expect(columns2.length).toBe(1);
    expect(columns3.length).toBe(1);
  });

  it('layout order is up to bottom and left to right', () => {
    const onRender = jest.fn();
    const options = [
      { label: 'label1', value: 'value1' },
      { label: 'label2', value: 'value2' },
      { label: 'label3', value: 'value3' },
      { label: 'label4', value: 'value4' },
      { label: 'label5', value: 'value5' },
      { label: 'label6', value: 'value6' },
    ];
    render(<MultiCheck columns={2} options={options} onRender={onRender} />);
    const columns1 = screen.getAllByTestId('multi-check-column');
    cleanup();
    render(<MultiCheck columns={3} options={options} onRender={onRender} />);
    const columns2 = screen.getAllByTestId('multi-check-column');
    cleanup();
    render(<MultiCheck columns={4} options={options} onRender={onRender} />);
    const columns3 = screen.getAllByTestId('multi-check-column');
    cleanup();
    expect(columns1).toMatchSnapshot();
    expect(columns2).toMatchSnapshot();
    expect(columns3).toMatchSnapshot();
    expect(columns1.length).toBe(2);
    expect(columns2.length).toBe(3);
    expect(columns3.length).toBe(4);
  });
});
