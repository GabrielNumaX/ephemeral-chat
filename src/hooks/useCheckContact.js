import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';


const useCheckContact = (userContact) => {

    const allChats = useSelector(state => state.app.allChats);
    const selectedContact = useSelector(state => state.app.selectedContact);

    const [hasMessages, setHasMessages] = useState(false);
    const [currentChat, setCurrentChat] = useState([]);

    // console.log('CUSTOM HOOK');
    // // console.log({ allChats });
    // // console.log({ selectedContact });
    // console.log({ userContact });


    useEffect(() => {

        // console.log('useFX HOOK');

        const checkContact = allChats.find(item => item.contact === selectedContact);

        if (!checkContact) {

            setHasMessages(false);
            setCurrentChat([]);
        }
        else {

            setHasMessages(true);
            setCurrentChat([...checkContact.messages]);
        }

    }, [allChats, selectedContact, userContact]);

    return [hasMessages, currentChat];
}

export default useCheckContact;