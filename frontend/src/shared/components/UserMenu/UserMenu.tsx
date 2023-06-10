import { Fragment, useContext } from "react";
import { Popover, Transition } from "@headlessui/react";
import {
  ChevronDownIcon,
} from "@heroicons/react/20/solid";
import {
  UserIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";
import {
  UserInfo,
  authContext,
} from "../../../contexts/authContext/authContext";

export default function UserMenu({ user }: { user: UserInfo }) {
  const { logout } = useContext(authContext);
  const solutions = [
    {
      name: "My Profile",
      description: "Update profile info and picture",
      href: `/user/${user.id}`,
      icon: UserIcon,
    },
  ];
  const callsToAction = [
    { name: "Logout", onClick: logout, icon: ArrowLeftOnRectangleIcon },
  ];

  return (
    <Popover className="relative">
      <Popover.Button className="inline-flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900 outline-none">
        <img
          src={user.picture}
          className="w-10 h-10 rounded-full object-cover"
        />
        <ChevronDownIcon className="h-5 w-5 mr-10" aria-hidden="true" />
      </Popover.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel className="absolute left-1/2 z-10 mt-3 flex w-[320px] max-w-max -translate-x-full">
          <div className="w-screen max-w-md flex-auto overflow-hidden rounded-xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
            <div className="">
              {solutions.map((item) => (
                <div
                  key={item.name}
                  className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                    <item.icon
                      className="h-6 w-6 text-gray-600 group-hover:text-indigo-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <a href={item.href} className="font-semibold text-gray-900">
                      {item.name}
                      <span className="absolute inset-0" />
                    </a>
                    <p className="mt-1 text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col w-full bg-gray-100">
              {callsToAction.map((item) => (
                <button
                  key={item.name}
                  onClick={item.onClick}
                  className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-900 hover:bg-red-100"
                >
                  <item.icon
                    className="h-5 w-5 flex-none text-gray-400"
                    aria-hidden="true"
                  />
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}
