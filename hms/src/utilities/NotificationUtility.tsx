import { notifications } from "@mantine/notifications";
import {  IconCheck, IconX,} from "@tabler/icons-react";

export const sucessNotification =(message: string) =>{
    notifications.show({
        title: "Sucesso!",
        message: message,
        color: 'green',
        withCloseButton: true,
        icon: <IconCheck />,
        withBorder:true, 
        className:"border-green-500"
    })
}
export const errorNotification =(message: string) =>{
    notifications.show({
        title: "Erro!",
        message: message,
        color: 'red',
        withCloseButton: true,
        icon: <IconX />,
        withBorder:true, 
        
    })
}

