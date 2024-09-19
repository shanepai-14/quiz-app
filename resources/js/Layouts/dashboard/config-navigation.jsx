import SvgColor from '../../Components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = (role) => {
  if (role === 'teacher') {
    return [
      {
        title: 'classroom',
        path: 'teacher.classroom',
        icon: icon('ic_user'),
      },
      {
        title: 'subjects',
        path: 'teacher.subject',
        icon: icon('ic_user'),
      },
    ];
  } else if (role === 'student') {
    return [
      {
        title: 'dashboard',
        path: 'dashboard',
        icon: icon('ic_analytics'),
      },
      // {
      //   title: 'Subject',
      //   path: 'student.classroom',
      //   icon: icon('ic_user'),
      // },
      {
        title: 'subjects',
        path: 'student.subject',
        icon: icon('ic_user'),
      },
    ];
  } else if (role === 'admin') {
    return [
      {
        title: 'manage users',
        path: 'admin.users',
        icon: icon('ic_user'),
      },
      {
        title: 'manage classes',
        path: 'admin.classes',
        icon: icon('ic_user'),
      },
    ];
  }

  // Return an empty array or a default if no role matches
  return [];
};

export default navConfig
