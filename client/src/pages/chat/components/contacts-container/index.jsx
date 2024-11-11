import Logo from "@/components/Logo";
import Title from "@/components/Title";
import ProfileInfo from "./components/profile-info";
import NewContacts from "./components/new-contact";
import { useEffect } from "react";
import { api_client } from "@/lib/api-client";
import { GET_CHANNELS_ROUTE, GET_DM_LIST_ROUTE } from "@/utils/constants";
import { useAppStore } from "@/store";
import ContactList from "@/components/ContactList";
import CreateChannel from "./components/create-channel";

const ContactsContainer = () => {
  const {
    dmList,
    setDmList,
    setChannels,
    channels,
    notificationChats,
    removeNotification,
  } = useAppStore();

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
  }, [dmList, setDmList]);

  useEffect(() => {
    try {
      const getChannels = async () => {
        const response = await api_client.get(GET_CHANNELS_ROUTE, {
          withCredentials: true,
        });
        if (response.status === 200 && response.data.channels) {
          setChannels(response.data.channels);
        }
      };
      getChannels();
    } catch (err) {
      console.log(err);
    }
  }, [channels, setChannels]);

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
          <ContactList
            contacts={dmList}
            notificationChats={notificationChats}
            onChatSelect={(chatId) => removeNotification(chatId)}
          />
        </div>
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-8">
          <Title text="channels" />
          <CreateChannel />
        </div>
        <div className="max-h-[48vh] overflow-y-auto scrollbar-hidden">
          <ContactList
            contacts={channels}
            isChannel
            notificationChats={notificationChats}
            onChatSelect={(channelId) => removeNotification(channelId)}
          />
        </div>
      </div>
      <ProfileInfo />
    </div>
  );
};

export default ContactsContainer;
