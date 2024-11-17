import React, { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LuUserPlus2 } from "react-icons/lu";
import { Input } from "@/components/ui/input";
import { Player } from "@lottiefiles/react-lottie-player";
import animationSource from "@/assets/animations/search_animation.json";
import { api_client } from "@/lib/api-client";
import { SEARCH_CONTACT_ROUTE } from "@/utils/constants";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { HOST } from "@/utils/constants";
import { useAppStore } from "@/store";

const NewContacts = () => {
  const { setSelectedChatType, setSelectedChatData } = useAppStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [resultContacts, setResultContacts] = useState([]);

  // Contact searching handler...
  const searchContacts = async (searchTerm) => {
    try {
      const response = await api_client.post(
        SEARCH_CONTACT_ROUTE,
        { searchTerm },
        { withCredentials: true }
      );
      if (response.status === 200 && response.data.contacts) {
        setResultContacts(response.data.contacts);
      } else {
        setResultContacts([]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Chat selection handler...
  const selectNewContact = (contact) => {
    setModalOpen(false);
    setSelectedChatType("contact");
    setSelectedChatData(contact);
    setResultContacts([]);
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger onClick={() => setModalOpen(true)}>
            <LuUserPlus2 className="font-bold text-opacity-90 text-2xl text-gray-400 mt-1 hover:text-neutral-100 transition-all duration-300" />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1d25] text-white p-3 border-none mb-3">
            Add new contacts
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="h-auto w-[90%] max-w-[450px] sm:max-w-[500px] md:max-w-[600px] text-white border-none bg-[#181920] flex flex-col p-6 rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl text-purple-500 font-semibold">
              Choose Contacts
            </DialogTitle>
            <DialogDescription className="text-sm md:text-base text-neutral-400 mt-2">
              Connect with your network seamlessly and engage with your contacts
              easily.
            </DialogDescription>
          </DialogHeader>

          {/* Search bar */}
          <div className="my-4">
            <Input
              placeholder="Search contacts"
              className="rounded-lg text-white p-4 bg-[#2c2e3b] border-none w-full"
              onChange={(e) => searchContacts(e.target.value)}
            />
          </div>

          {/* Contacts List */}
          <ScrollArea className="h-[250px] md:h-[300px]">
            <div className="flex flex-col gap-5">
              {resultContacts.length > 0 ? (
                resultContacts.map((contact) => (
                  <div
                    key={contact._id}
                    onClick={() => selectNewContact(contact)}
                    className="flex gap-3 items-center cursor-pointer hover:bg-[#242533] p-2 rounded-md transition-all"
                  >
                    <div className="relative h-10 w-10">
                      <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                        {contact.image ? (
                          <img
                            src={`${contact.image}`}
                            className="object-cover h-full w-full rounded-full"
                            alt="contact avatar"
                          />
                        ) : (
                          <div className="uppercase text-lg font-bold h-10 w-10 rounded-full flex justify-center items-center bg-[#712a4c57] text-[#ff006e] border-[1px] border-[#ff006faa] cursor-pointer">
                            {contact.first_name
                              ? contact.first_name.slice(0, 2)
                              : contact.email.slice(0, 2)}
                          </div>
                        )}
                      </Avatar>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-neutral-300">
                        {contact.first_name && contact.last_name
                          ? `${contact.first_name} ${contact.last_name}`
                          : ""}
                      </span>
                      <span className="text-sm text-neutral-400">
                        {contact.email}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <Player
                  src={animationSource}
                  className="player block p-3 h-[250px] mx-auto"
                  loop
                  autoplay
                />
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewContacts;
