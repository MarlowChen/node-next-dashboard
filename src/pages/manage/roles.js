import Head from 'next/head';
import { Box, Container, TextField } from '@mui/material';
import { RoleListResults } from '../../components/role/role-list-results';
import { RoleListToolbar } from '../../components/role/role-list-toolbar';
import { DashboardLayout } from '../../components/dashboard-layout';
import { useEffect, useState } from 'react';
import { publicRequest } from 'src/utils/requestMethods';
import { alertObj } from 'src/components/commonSnackbar';
import { handleAuthSSR } from 'src/utils/auth';
import { ConfirmationDialog } from 'src/components/confirmationDialog';

const Roles = () => {
  const [open, setOpen] = useState(false);
  const [selectedRoleIds, setSelectedRoleIds] = useState([]);
  const [roles, setRoles] = useState([]);
  const [defaultRoles, setDefaultRoles] = useState([]);

  useEffect(() => {
    initAllGroup();
  }, [])

  const initAllGroup = async () => {
    await publicRequest().get("/role").then(res => {
      setRoles(res.data);
      setDefaultRoles(res.data)
    }).catch(err => {
      alertObj.show("查詢角色失敗", "error")
    })
  }

  const addRole = async (e) => {
    setOpen(true)

  };

  const handleClose = () => {
    setOpen(false)
  };

  const filterRoles = (searchValue) => {

    const filteredRoles = defaultRoles.filter((frontMatter) => {
      const searchContent = frontMatter.role_name + frontMatter.role_description
      return searchContent.toLowerCase().includes(searchValue.toLowerCase())
    })
    setRoles(filteredRoles)
  }

  const checkDeleteRoles = async (e) => {
    console.log(selectedRoleIds)
    if (selectedRoleIds.length <= 0) {
      alertObj.show("請至少選擇一筆資料", "info")
      return;
    }
    setOpen(true)

  }

  const deleteRoles = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await publicRequest().post("/role/deleteSelect", { roleIds: selectedRoleIds }).then(res => {
      alertObj.show("刪除成功", "info")
      initAllGroup();
      setOpen(false)
    }).catch(err => {
      if (err.response?.data?.name === "SequelizeUniqueConstraintError") {
        alertObj.show("已有相同的群組名稱", "error")
      } else {
        alertObj.show(err.response?.data?.message, "error")
      }
    })
  }

  return (
    <>
      <Head>
        <title>
          Roles | M-Demo
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth={false}>
          <RoleListToolbar deleteRoles={checkDeleteRoles} onSearch={filterRoles} />
          <Box sx={{ mt: 3 }}>
            <RoleListResults roles={roles} selectedRoleIds={selectedRoleIds} setSelectedRoleIds={setSelectedRoleIds} />
          </Box>
        </Container>
      </Box>

      <ConfirmationDialog
        id="delete-roles"
        keepMounted
        title={"刪除角色"}
        open={open}
        onClose={handleClose}
        onConfirm={deleteRoles}
      >
        是否確定刪除角色？
      </ConfirmationDialog>

    </>
  )
};


Roles.getLayout = (page) => {
  return (
    <DashboardLayout>
      {page}
    </DashboardLayout>
  );
}

export default Roles;
