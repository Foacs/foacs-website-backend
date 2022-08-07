export const validateRole = (fact) => {
  const violations = [];

  if (undefined === fact.name || null === fact.name) {
    violations.push('name is mandatory');
  }
  if (undefined === fact.slug || null === fact.slug) {
    violations.push('slug is mandatory');
  }

  return violations;
};
