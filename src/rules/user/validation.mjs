export const validateUser = (fact) => {
  const violations = [];

  if (undefined === fact.name || null === fact.name) {
    violations.push('name is mandatory');
  }
  if (undefined === fact.email || null === fact.email) {
    violations.push('email is mandatory');
  }
  if (undefined === fact.password || null === fact.password) {
    violations.push('password is mandatory');
  }

  return violations;
};
