import { Users, LayoutGrid, LucideIcon } from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon;
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          active: pathname.includes("/dashboard"),
          icon: LayoutGrid,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Management Employee",
      menus: [
        {
          href: "",
          label: "Employee",
          active: pathname.includes("/employee"),
          icon: Users,
          submenus: [
            {
              href: "/employee",
              label: "Employee",
              active: pathname === "/employee",
            },
            {
              href: "/role",
              label: "Role",
              active: pathname === "/role",
            },
            {
              href: "/position",
              label: "Position",
              active: pathname === "/position",
            },
          ],
        },
      ],
    },
    // {
    //   groupLabel: "Contents",
    //   menus: [
    //     {
    //       href: "",
    //       label: "Posts",
    //       active: pathname.includes("/posts"),
    //       icon: SquarePen,
    //       submenus: [
    //         {
    //           href: "/posts",
    //           label: "All Posts",
    //           active: pathname === "/posts",
    //         },
    //         {
    //           href: "/posts/new",
    //           label: "New Post",
    //           active: pathname === "/posts/new",
    //         },
    //       ],
    //     },
    //     {
    //       href: "/categories",
    //       label: "Categories",
    //       active: pathname.includes("/categories"),
    //       icon: Bookmark,
    //       submenus: [],
    //     },
    //     {
    //       href: "/tags",
    //       label: "Tags",
    //       active: pathname.includes("/tags"),
    //       icon: Tag,
    //       submenus: [],
    //     },
    //   ],
    // },
    // {
    //   groupLabel: "Settings",
    //   menus: [
    //     {
    //       href: "/users",
    //       label: "Users",
    //       active: pathname.includes("/users"),
    //       icon: Users,
    //       submenus: [],
    //     },
    //     {
    //       href: "/account",
    //       label: "Account",
    //       active: pathname.includes("/account"),
    //       icon: Settings,
    //       submenus: [],
    //     },
    //   ],
    // },
  ];
}
