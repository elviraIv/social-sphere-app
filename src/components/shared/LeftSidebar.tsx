import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { useSignOutAccount } from "@/lib/react-query/queries";
import { INITIAL_USER, useUserContext } from "@/context/AuthContext";
import { sidebarLinks } from "@/constants";
import { INavLink } from "@/types";

const LeftSidebar = () => {
  const { mutate: signOut } = useSignOutAccount();
  const { user, setUser, setIsAuthenticated } = useUserContext();

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault(),
      signOut(),
      setIsAuthenticated(false),
      setUser(INITIAL_USER),
      navigate("/sign-in");
  };

  return (
    <nav className="leftsidebar">
      <div className="flex-col gap-11  ">
        <Link to="/" className="flex gap-3 items-center my">
          <img
            src="/assets/images/logo-removebg-preview.png"
            alt="logo"
            width={170}
            height={36}
          />
        </Link>

        <Link
          to={`/profile/${user.id}`}
          className="flex gap-3 items-center mt-6"
        >
          <img
            src={user.imageUrl || "/assets/icons/profile-placeholder.png"}
            alt="logo"
            className="h-14 w-14 rounded-full"
          />

          <div className="flex flex-col my-6 ">
            <p className="body-bold">{user.name}</p>
            <p className="small-regular text-light-3">@{user.username}</p>
          </div>
        </Link>

        <ul className="flex flex-col gap-6">
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route;

            return (
              <li
                className={`leftsidebar-link group ${
                  isActive && "bg-primary-500"
                }`}
                key={link.label}
              >
                <NavLink
                  to={link.route}
                  className="flex gap-4 items-center p-4"
                >
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    className={`group-hover:invert-white ${
                      isActive && "invert-white"
                    }`}
                  />
                  {link.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>

      <Button
        variant="ghost"
        className="shad-button_ghost"
        onClick={(e) => handleSignOut(e)}
      >
        <img src="/assets/icons/logout.svg" alt="logout" />
        <p className="small-medium lg:base-medium">Logout</p>
      </Button>
    </nav>
  );
};

export default LeftSidebar;
