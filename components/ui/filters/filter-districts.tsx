'use client';

import { districts, postalCodes } from '@/lib/postal-codes-by-district';
import { useState } from 'react';
import { FancyMultiSelect, Option as FancyMultiSelectOption } from '../fancy-multi-select';

type Option = FancyMultiSelectOption & { type: 'district' | 'postalCode' };

const districtOptions: Option[] = districts.map((district) => ({
  value: district,
  label: district,
  type: 'district',
}));

const postalCodeOptions: Option[] = postalCodes.map((postalCode) => ({
  value: `${postalCode}`,
  label: `${postalCode}`,
  type: 'postalCode',
}));

const options = [...districtOptions, ...postalCodeOptions];

export function FilterDistrict() {
  const [selectedValue, setSelectedValue] = useState<Option[]>([]);

  return (
    <FancyMultiSelect
      selectedValue={selectedValue}
      onSelectedValueChange={(value) => setSelectedValue(value)}
      options={options}
      emptyMessage="Keine Ergebnisse gefunden"
      placeholder="Bezirk oder PLZ"
    />
  );
}
