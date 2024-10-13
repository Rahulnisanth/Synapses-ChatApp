import Logo from "@/components/Logo";
import Title from "@/components/Title";
import ProfileInfo from "./components/profile-info";
import NewContacts from "./components/new-contact";
import { useEffect, useState } from "react";
import { api_client } from "@/lib/api-client";
import { GET_DM_LIST_ROUTE } from "@/utils/constants";
import { useAppStore } from "@/store";
import ContactList from "@/components/ContactList";

const ContactsContainer = () => {
  const { dmList, setDmList } = useAppStore();
  useEffect(() => {
    try {
      const getDMList = async () => {
        const response = await api_client.get(GET_DM_LIST_ROUTE, {
          withCredentials: true,
        });
        if (response.data.contacts) {
          setDmList(response.data.contacts);
        }
      };
      getDMList();
    } catch (err) {
      console.log(err);
    }
  }, [setDmList]);

  return (
    <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full">
      <div className="pt-3">
        <Logo />
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-8">
          <Title text="direct messages" />
          <NewContacts />
        </div>
        <div className="max-h-[48vh] overflow-y-auto scrollbar-hidden">
          <ContactList contacts={dmList} />
        </div>
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-8">
          <Title text="channels" />
        </div>
      </div>
      <ProfileInfo />
    </div>
  );
};

export default ContactsContainer;
