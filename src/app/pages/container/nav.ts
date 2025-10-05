export interface NavItem {
  label: string;
  route?: string;
  icon?: string;
  children?: NavItem[];
  expanded?: boolean; 
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Master',
    children: [
      { label: 'Company', route: '/default/master/company' },
      { label: 'Branch', route: '/default/master/branch' },
      { label: 'Department', route: '/default/master/department' },
      { label: 'Role', route: '/default/master/role' },
      { label: 'User', route: '/default/master/user' }

    ]
  },
   {
    label: 'Access Control',
    children: [
      { label: 'User Roles & Permissions', route: '/user/master/accesscontrol' },
  
    ]
  }
];

