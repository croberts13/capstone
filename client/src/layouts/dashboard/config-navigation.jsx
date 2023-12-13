import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'dashboard',
    path: '/',
    icon: icon('ic_analytics'),
  },
  {
    title: 'user',
    path: '/user',
    icon: icon('ic_user'),
  },

  {
    // appointments config
    title: 'appointments',
    path: '/appointments',
    icon: icon('ic_list'),
  },
  {
    // appointments config
    title: 'add appointment',
    path: '/appointments/add',
    icon: icon('ic_list'),
  },
];

export default navConfig;
