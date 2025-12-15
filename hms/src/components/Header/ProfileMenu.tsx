import { Menu, Button, Text, Avatar } from '@mantine/core';
import {
  IconSettings,
  IconSearch,
  IconPhoto,
  IconMessageCircle,
  IconTrash,
  IconArrowsLeftRight,
} from '@tabler/icons-react';
import avatar from '../../assets/avatar.jpg'

const ProfileMenu = () => {
  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
         <div className='flex items-center gap-3 cursor-pointer'>
           <span className='font-medium text-lg text-neutral-900'>Nicolas</span>
           <Avatar variant = "filled" src={avatar} alt="Nicolas" size={50}/>
         </div>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Aplicação</Menu.Label>
        <Menu.Item leftSection={<IconSettings size={14} />}>
          Configurações
        </Menu.Item>
        <Menu.Item leftSection={<IconMessageCircle size={14} />}>
          Mensagens
        </Menu.Item>
        <Menu.Item leftSection={<IconPhoto size={14} />}>
          Galeria
        </Menu.Item>
        <Menu.Item
          leftSection={<IconSearch size={14} />}
          rightSection={
            <Text size="xs" c="dimmed">
              ⌘K
            </Text>
          }
        >
          Pesquisar
        </Menu.Item>

        <Menu.Divider />

        <Menu.Label>Zona de risco</Menu.Label>
        <Menu.Item
          leftSection={<IconArrowsLeftRight size={14} />}
        >
          Transferir meus dados
        </Menu.Item>
        <Menu.Item
          color="red"
          leftSection={<IconTrash size={14} />}
        >
          Deletar minha conta
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
export default ProfileMenu