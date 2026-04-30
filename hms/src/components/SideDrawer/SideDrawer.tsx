import { ActionIcon, Drawer } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {IconMenu2} from '@tabler/icons-react';
import AdminSideBar from '../Admin/SideBar/AdminSideBar';
import DoctorSideBar from '../Doctor/SideBar/DoctorSideBar';
import SideBar from '../Patient/SideBar/SideBar';

const SideDrawer = ({user}: {user: any}) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Drawer opened={opened} onClose={close} withCloseButton={false} padding={0} size="auto">
        {user == "ADMIN" ? <AdminSideBar collapsed={false} /> : user == "DOCTOR" ? <DoctorSideBar collapsed={false} /> : <SideBar collapsed={false} />}
      </Drawer>

      <ActionIcon onClick={open} variant="transparent" aria-label="Settings" size="xl">
        <IconMenu2 size={50} style={{ width: '90%', height: '90%' }} stroke={1.5} />
      </ActionIcon>
    </>
  );
}

export default SideDrawer