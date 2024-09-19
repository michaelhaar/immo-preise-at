export function getPostalCodeCondition({
  postalCodes,
  postalCodePrefixes,
}: {
  postalCodes: string[];
  postalCodePrefixes: string[];
}) {
  const postalCodesLike = postalCodePrefixes.length ? `${postalCodePrefixes.join('')}%` : '';
  const condition =
    postalCodes.length || postalCodesLike
      ? `
        AND (
          ${postalCodes.length ? 'postalCode IN (:postalCodes)' : ''}
          ${postalCodes.length && postalCodesLike ? 'OR' : ''} 
          ${postalCodesLike ? 'postalCode LIKE (:postalCodesLike)' : ''}
        )
      `
      : '';

  return [condition, { postalCodes, postalCodesLike }] as const;
}
