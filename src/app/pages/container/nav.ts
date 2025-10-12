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
  },

{
  label: 'CommonProduct',
  children: [
    { label: 'Brand', route: '/CommonProduct/brand' },
    { label: 'Category', route: '/CommonProduct/category' },
    { label: 'Cess', route: '/CommonProduct/cess' },

    { label: 'Customer Master', route: '/CommonProduct/customer' },
    { label: 'HSN Code', route: '/CommonProduct/hsnCode' },
    { label: 'Product  Master', route: '/CommonProduct/Product' },
    { label: 'Service Master', route: '/CommonProduct/ServiceMaster' },
    { label: 'Sub Category', route: '/CommonProduct/subCategory' },
    { label: 'Supplier', route: '/CommonProduct/supplier' },
    { label: 'Tax Master', route: '/CommonProduct/taxmaster' },
    { label: 'Unit', route: '/CommonProduct/unit' }
  ]
}








];

