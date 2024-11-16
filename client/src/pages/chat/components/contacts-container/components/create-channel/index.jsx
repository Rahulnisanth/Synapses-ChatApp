import React, { useEffect, useState } from "react";
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
import { BiMessageSquareAdd } from "react-icons/bi";
import { Input } from "@/components/ui/input";
import { api_client } from "@/lib/api-client";
import {
  CREATE_CHANNEL_ROUTE,
  GET_ALL_CONTACTS_ROUTE,
} from "@/utils/constants";
import { useAppStore } from "@/store";
import { Button } from "@/components/ui/button";
import MultipleSelector from "@/components/ui/multipleselect";
import { toast } from "sonner";

const CreateChannel = () => {
  const { addChannels } = useAppStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [allContacts, setAllContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [channelName, setChannelName] = useState("");

  useEffect(() => {
    try {
      const getAllContacts = async () => {
        const response = await api_client.get(GET_ALL_CONTACTS_ROUTE, {
          withCredentials: true,
        });
        if (response.status === 200 && response.data.contacts) {
          setAllContacts(response.data.contacts);
        }
      };
      getAllContacts();
    } catch (err) {
      console.log(err);
    }
  }, []);

  const createChannel = async () => {
    try {
      if (channelName.length > 0 && selectedContacts.length > 1) {
        const response = await api_client.post(
          CREATE_CHANNEL_ROUTE,
          {
            name: channelName,
            members: selectedContacts.map((contact) => contact.value),
          },
          { withCredentials: true }
        );
        if (response.status === 200 && response.data.channel) {
          setChannelName("");
          setSelectedContacts([]);
          setModalOpen(false);
          addChannels(response.data.channel);
        }
      } else {
        toast.error("Members in the channel must be more than 2");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger onClick={() => setModalOpen(true)}>
            <BiMessageSquareAdd className="font-bold text-opacity-90 text-2xl text-gray-400 mt-1 hover:text-neutral-100 transition-all duration-300" />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1d25] text-white p-3 border-none mb-3">
            Create new channel
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
              placeholder="Type the Channel Name"
              className="rounded-lg text-white p-4 bg-[#2c2e3b] border-none w-full"
              onChange={(e) => setChannelName(e.target.value)}
              value={channelName}
            />
          </div>
          <MultipleSelector
            className="rounded-lg text-white p-4 bg-[#2c2e3b] border-none w-full"
            defaultOptions={allContacts}
            placeholder="Add contacts"
            value={selectedContacts}
            onChange={setSelectedContacts}
            emptyIndicator={
              <p className="text-center font-bold text-opacity-90 text-2xl text-gray-400 ">
                No results found
              </p>
            }
          />
          <div>
            <Button
              className="rounded-lg mt-2 p-4 text-white bg-purple-700 hover:bg-purple-900 transition-all duration-300"
              onClick={createChannel}
            >
              Create Channel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateChannel;
