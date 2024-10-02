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
import animationSource from "@/assets/lottie_animation.json";
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
            <LuUserPlus2 className="text-xl text-neutral-500 font-light text-opacity-90 text-start hover:text-neutral-100 duration-300 transition-all" />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1d25] text-white p-3 border-none mb-3">
            Add new contacts
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="h-[400px] w-[400px] text-white border-none bg-[#181920] flex flex-col">
          <DialogHeader>
            <DialogTitle>Select the contacts</DialogTitle>
            <DialogDescription>
              Engage with users and enhance the way of communication using
              synapses
            </DialogDescription>
          </DialogHeader>

          {/* search bar */}
          <div>
            <Input
              placeholder="Search contacts"
              className="rounded-lg text-white p-6 bg-[#2c2e3b] border-none"
              onChange={(e) => searchContacts(e.target.value)}
            />
          </div>

          <ScrollArea className="h-[250px]">
            <div className="flex flex-col gap-5">
              {resultContacts.map((contact) => (
                <div
                  key={contact._id}
                  onClick={() => selectNewContact(contact)}
                  className="flex gap-3 items-center cursor-pointer"
                >
                  <div className="relative h-10 w-10">
                    <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                      {contact.image ? (
                        <img
                          src={`${HOST}/${contact.image}`}
                          className="object-cover h-full w-full rounded-full"
                        />
                      ) : (
                        <div className="uppercase text-lg font-bold h-10 w-10 rounded-full flex justify-center items-center bg-[#712a4c57] text-[#ff006e] border-[1px] border-[#ff006faa] cursor-pointer">
                          {contact.first_name
                            ? contact.first_name.split("").slice(0, 2)
                            : contact.email.split("").slice(0, 2)}
                        </div>
                      )}
                    </Avatar>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-neutral-400">
                      {contact.first_name && contact.last_name
                        ? `${contact.first_name} ${contact.last_name}`
                        : ""}
                    </span>
                    <span className="text-sm text-neutral-400">
                      {contact.email}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {resultContacts.length <= 0 && (
            <Player
              src={animationSource}
              className="player block p-3 h-[200px]"
              loop
              autoplay
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewContacts;
