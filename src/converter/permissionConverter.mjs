const convert = (permission) => ({
  data: {...permission},
  links: [
    {
      rel: 'self',
      method: 'GET',
      href: `/permissions/${permission.id}`,
    },
    {
      rel: 'update',
      method: 'PUT',
      href: `/permissions/${permission.id}`,
    },
    {
      rel: 'delete',
      method: 'DELETE',
      href: `/permissions/${permission.id}`,
    },
  ],
});

export default convert;
