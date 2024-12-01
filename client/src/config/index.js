export const registerFormControls = [
    {
        name: 'userName',
        label: 'user Name',
        placeHolder: 'Enter your user name',
        componentType: 'input',
        type:'text',
        
    },
    {
        name: 'email',
        label: 'Email',
        placeHolder: 'Enter your email',
        componentType: 'input',
        type:'email',
        
    },
    {
        name: 'password',
        label: 'Password',
        placeHolder: 'Enter your password',
        componentType: 'input',
        type:'password',
        
    },
]
export const loginFormControls = [
    
    {
        name: 'email',
        label: 'Email',
        placeHolder: 'Enter your email',
        componentType: 'input',
        type:'email',
        
    },
    {
        name: 'password',
        label: 'Password',
        placeHolder: 'Enter your password',
        componentType: 'input',
        type:'password',
        
    },
]

export const shoppingViewHeaderMenuItems = [
    {
      id: "home",
      label: "Home",
      path: "/shop/home",
    },
    {
      id: "products",
      label: "Products",
      path: "/shop/listing",
    },
    {
      id: "Hike & Camp",
      label: "Hike & Camp",
      path: "/shop/listing",
    },
    {
      id: "Bikes & Cycling",
      label: "Bikes & Cycling",
      path: "/shop/listing",
    },
    {
      id: "Women",
      label: "Women",
      path: "/shop/listing",
    },
    {
      id: "Men",
      label: "Men",
      path: "/shop/listing",
    },
    {
      id: "search",
      label: "Search",
      path: "/shop/search",
      isSearch: true,
    },
  ];

  export const filterOptions = {
    category: [
      { id: "men", label: "Men" },
      { id: "women", label: "Women" },
      { id: "kids", label: "Kids" },
      { id: "accessories", label: "Accessories" },
      { id: "footwear", label: "Footwear" },
    ],
  };

  export const sortOptions = [
    { id: "price-lowtohigh", label: "Price: Low to High" },
    { id: "price-hightolow", label: "Price: High to Low" },
    { id: "popularity", label: "Title: Popularity" },
  ];

  export const addressFormControls = [
    {
      label: "Address",
      name: "address",
      componentType: "input",
      type: "text",
      placeholder: "Enter your address",
    },
    {
      label: "City",
      name: "city",
      componentType: "input",
      type: "text",
      placeholder: "Enter your city",
    },
    {
      label: "Pincode",
      name: "pincode",
      componentType: "input",
      type: "text",
      placeholder: "Enter your pincode",
    },
    {
      label: "Phone",
      name: "phone",
      componentType: "input",
      type: "text",
      placeholder: "Enter your phone number",
    },
    {
      label: "Notes",
      name: "notes",
      componentType: "textarea",
      placeholder: "Enter any additional notes",
    },
  ];