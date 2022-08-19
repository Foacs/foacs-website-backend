const convert = (role) => ({
  data: {...role},
  links: [
    {
      rel: 'self',
      method: 'GET',
      href: `/roles/${role.id}`,
    },
    {
      rel: 'update',
      method: 'PUT',
      href: `/roles/${role.id}`,
    },
    {
      rel: 'delete',
      method: 'DELETE',
      href: `/roles/${role.id}`,
    },
    {
      rel: 'permissions',
      method: 'GET',
      href: `/roles/${role.id}/permissions`,
    },
  ],
});

export default convert;
