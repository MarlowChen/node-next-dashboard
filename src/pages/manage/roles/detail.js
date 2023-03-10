import { useRouter } from 'next/router'
import Head from 'next/head';
import { Box, Button, Container, Grid, TextField, Typography } from '@mui/material';
import { DashboardLayout } from 'src/components/dashboard-layout';
import { useEffect, useState } from 'react';
import { publicRequest } from 'src/utils/requestMethods';
import { alertObj } from 'src/components/commonSnackbar';
import { RolePermissions } from 'src/components/role/role-permissions';
import { RoleInfo } from 'src/components/role/role-info';
import { getRealId } from 'src/utils/requestMethods';

const RoleEdit = () => {
  const router = useRouter()
  const { id } = router.query
  const [treeNodes, setTreeNodes] = useState([]);
  const [roleInfo, setRoleInfo] = useState({
    role_name: "",
    role_description: ""
  });
  const [selected, setSelected] = useState([]);
  useEffect(() => {
    initDefaultTree();
  }, [])
  useEffect(() => {
    initRole();
  }, [id])

  const initRole = async () => {
    if (!id || id === "new") {
      return;
    }


    await publicRequest().get(`/role/${id}`).then(async (res) => {
      setRoleInfo(res.data.role)
      setSelected(res.data.permissions.map(item => item.perm_id))
    }).catch(err => {
      console.log(err)
      alertObj.show("查詢角色權限失敗", "error")
    })
  }
  const initDefaultTree = async () => {
    await publicRequest().get(`/permission/fullGroup/1`).then(async (res) => {
      const data = res.data;
      const mainNode = data.filter(item => item.id == 1);
      const parentGroup = {
        id: mainNode[0].id,
        name: mainNode[0].perm_name,
        code: mainNode[0].perm_code,
        desc: mainNode[0].perm_description,
        childNodes: []
      };

      const defaultTree = await convertTreeNode(parentGroup, data, 1, "");
      setTreeNodes(defaultTree);


    }).catch(err => {
      console.log(err)
      alertObj.show("初始化權限失敗", "error")
    })

  }

  const convertTreeNode = async (mainNode, treeList, parentId, parentCode) => {
    if (!treeList || treeList.length == 0) {
      return;
    }
    const filterNode = treeList.filter(item => item.parent_id == parentId).sort((a, b) => a.index - b.index)

    for (let i = 0; i < filterNode.length; i++) {
      let nodeName = filterNode[i].perm_name;
      if (filterNode[i].perm_name && parentCode === "MONITOR_IMAGE" || parentCode === "TIME_LAPSE") {
        nodeName = filterNode[i].perm_name.split("-")[0]
      }
      let data = {
        id: filterNode[i].id,
        name: nodeName,
        code: filterNode[i].perm_code,
        desc: filterNode[i].perm_description,
        parentId: filterNode[i].parent_id,
      }

      const childenNode = treeList.filter(item => item.parent_id == filterNode[i].id)

      if (childenNode && childenNode.length > 0) {
        data.childNodes = [];
        await convertTreeNode(data, treeList, filterNode[i].id, filterNode[i].perm_code)
      }
      mainNode.childNodes.push(data);
    }
    return mainNode;
  }

  const handleChange = (event) => {
    setRoleInfo({ ...roleInfo, [event.target.name]: event.target.value })
  };


  const handleSaveRole = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const realId = await getRealId(id);
    if (!realId) {
      alertObj.show("尚無權限", "error")
      router.push('/login');
      return;
    }
    if (!realId) {
      return;
    }

    await publicRequest().post("/role/saveWithPermission", {
      id: realId,
      ...roleInfo,
      permissions: selected

    }).then(res => {
      alertObj.show("存檔成功", "info")
      router.push("./")
    }).catch(err => {
      if (err.response?.data?.name === "SequelizeUniqueConstraintError") {
        alertObj.show("已有相同的群組名稱", "error")
      } else {
        alertObj.show("存檔失敗", "error")
      }
    })
  }
  return (
    <>
      <Head>
        <title>
          Permissions | M-Demo
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",

          }}>
            <Typography
              sx={{ mb: 3 }}
              variant="h4"
            >
              {id === "new" ? "新增角色" : "編輯角色"}
            </Typography>

            <Box>
              <Button
                color="primary"
                variant="outlined"
                onClick={() => router.back()}
                sx={{ mr: 2 }}
              >
                回上頁
              </Button>

              <Button type="submit" form="saveRoleForm" variant="contained">存檔</Button>
            </Box>

          </Box>
          <form id="saveRoleForm" onSubmit={handleSaveRole}>
            <Grid
              container
              spacing={3}
            >

              <Grid
                item
                lg={6}
                md={6}
                xs={12}
              >
                <RoleInfo role={roleInfo} onChangeValue={handleChange} />
              </Grid>
              <Grid
                item
                lg={6}
                md={6}
                xs={12}
              >
                <RolePermissions treeNodes={treeNodes} selected={selected} setSelected={setSelected} />
              </Grid>

            </Grid>
          </form>
        </Container>
      </Box>
    </>
  )
};


RoleEdit.getLayout = (page) => {
  return (
    <DashboardLayout>
      {page}
    </DashboardLayout>
  );
}

export default RoleEdit;
