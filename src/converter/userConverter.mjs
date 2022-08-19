const convert = (user) => ({
  data: {...user},
  links: [
    {
      rel: 'self',
      method: 'GET',
      href: `/users/${user.id}`,
    },
    {
      rel: 'update',
      method: 'PUT',
      href: `/users/${user.id}`,
    },
    {
      rel: 'delete',
      method: 'DELETE',
      href: `/users/${user.id}`,
    },
    {
      rel: 'roles',
      method: 'GET',
      href: `/users/${user.id}/roles`,
    },
    {
      rel: 'permissions',
      method: 'GET',
      href: `/users/${user.id}/permissions`,
    },
  ],
});

export default convert;
