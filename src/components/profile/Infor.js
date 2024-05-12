import React, { useEffect, useState } from "react";
import { formatDDMMYYYYDate } from "../../utils/dateFormat";
import { Link } from "react-router-dom";
import NotFound from "../../pages/NotFound";

const Infor = ({ auth, profile, id }) => {
  const [userData, setUserData] = useState();

  useEffect(() => {
      if (parseInt(id) === auth.user.id) {
        setUserData(auth.user)
      } else {
          const newData = profile.users.find((user) => user.id === parseInt(id));
          setUserData(newData);
      }
  }, [id, auth, profile.users]);

  if (!userData) return <NotFound />
  return (
    <div className="profile-container flex">
      <div className="user-infor-wrapper">
        <section className="w-full overflow-hidden dark:bg-gray-900">
          <div className="flex flex-col">
            <img
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHw5fHxjb3ZlcnxlbnwwfDB8fHwxNzEwNzQxNzY0fDA&ixlib=rb-4.0.3&q=80&w=1080"
              alt="User Cover"
              className="w-full xl:h-[20rem] lg:h-[18rem] md:h-[16rem] sm:h-[14rem] xs:h-[11rem]"
            />

            <div className="sm:w-[80%] xs:w-[90%] mx-auto flex">
              <img
                src={userData.avatar}
                alt="User Profile"
                className="rounded-md lg:w-[12rem] lg:h-[12rem] md:w-[10rem] md:h-[10rem] sm:w-[8rem] sm:h-[8rem] xs:w-[7rem] xs:h-[7rem] outline outline-2 outline-offset-2 outline-blue-500 relative lg:bottom-[5rem] sm:bottom-[4rem] xs:bottom-[3rem]"
              />
              <div className="w-full">
                  <h1 className="w-full text-left my-4 sm:mx-4 xs:pl-4 text-gray-800 dark:text-white lg:text-4xl md:text-3xl sm:text-3xl xs:text-xl font-serif">
                    {userData.fullname}
                  </h1>
                  {
                    parseInt(id) === auth.user.id &&
                    <Link to='/infor/edit' className="edit-profile-btn">Edit profile</Link>
                  }
              </div>
            </div>

            <div className="xl:w-[80%] lg:w-[90%] md:w-[90%] sm:w-[92%] xs:w-[90%] mx-auto flex flex-col gap-4 items-center relative lg:-top-8 md:-top-6 sm:-top-4 xs:-top-4">
              <p className="w-fit text-gray-700 dark:text-gray-400 text-md">
               {userData.bio ? userData.bio : ''}
              </p>

              <div className="w-full my-auto py-6 flex flex-col justify-center gap-2">
                <div className="w-full flex sm:flex-row xs:flex-col gap-2 justify-center">
                  <div className="w-full">
                    <dl className="text-gray-900 divide-y divide-gray-200 dark:text-white dark:divide-gray-700">
                      <div className="flex flex-col pb-3">
                        <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
                          FullName
                        </dt>
                        <dd className="text-lg font-semibold">{userData.fullname}</dd>
                      </div>
                      <div className="flex flex-col py-3">
                        <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
                          Date Of Birth
                        </dt>
                        <dd className="text-lg font-semibold">{formatDDMMYYYYDate(new Date(userData.dateOfBirth))}</dd>
                      </div>
                      <div className="flex flex-col py-3">
                        <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
                          Gender
                        </dt>
                        <dd className="text-lg font-semibold">{userData.gender}</dd>
                      </div>
                    </dl>
                  </div>
                  <div className="w-full">
                    <dl className="text-gray-900 divide-y divide-gray-200 dark:text-white dark:divide-gray-700">

                      <div className="flex flex-col pt-3">
                        <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
                          Phone Number
                        </dt>
                        <dd className="text-lg font-semibold">{userData.phone}</dd>
                      </div>
                      <div className="flex flex-col pt-3">
                        <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
                          Email
                        </dt>
                        <dd className="text-lg font-semibold">
                        {userData.email}
                        </dd>
                      </div>

                      <div className="flex flex-col pt-3">
                        <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
                          Website
                        </dt>
                        <dd className="text-lg font-semibold">
                          https://
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Infor;
