import { useEffect, useState } from 'react';
import Head from 'next/head';
import { Box, Container, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, TextField } from '@mui/material';
import * as Yup from 'yup';
import { UserListResults } from '../../components/user/user-list-results';
import { UserListToolbar } from '../../components/user/user-list-toolbar';
import { DashboardLayout } from '../../components/dashboard-layout';
import { publicRequest } from 'src/utils/requestMethods';
import { ConfirmationDialog } from 'src/components/confirmationDialog';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { alertObj } from 'src/components/commonSnackbar';
import { handleAuthSSR } from 'src/utils/auth';
import { useFormik } from 'formik';

const Users = () => {
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [userList, setUserList] = useState([]);
  const [defaultUserList, setDefaultUserList] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const defaultUser = {
    id: -1,
    username: "",
    roleId: "",
    password: "",
    passwordChecked: "",
    email: "",
    showPassword: false,
    showPasswordChecked: false
  }
  const [userInfo, setUserInfo] = useState(defaultUser)
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  useEffect(() => {
    initUser();
  }, [])

  const handleClose = () => {
    setOpen(false)
  };


  const openUserDlg = async () => {
    await initRoleList();
    saveUser.setValues(defaultUser)
    setOpen(true)
  }

  const openUserDlgEdit = async (user) => {

    await initRoleList();
    let defUser = JSON.parse(JSON.stringify(defaultUser))
    defUser.username = user.username;
    defUser.email = user.email;
    defUser.roleId = user.roleId;
    saveUser.setValues(defUser)
    setOpen(true)
  }

  const initUser = async () => {
    await publicRequest().get("/auth").then(res => {
      console.log(res.data)
      groupRoles(res.data.roles, res.data.users)


    }).catch(err => {
      alertObj.show("查詢角色失敗", "error")
    })
  }

  const groupRoles = (roles, users) => {
    const groups = []
    roles.forEach(role => {

      const userInfos = users.filter(user => user.role_id === role.id).map(user => {
        return { id: user.id, username: user.name, roleId: user.role_id, email: user.Email.address, createdAt: user.createdAt }
      })


      groups.push({
        id: role.id,
        role_name: role.role_name,
        role_description: role.role_description,
        createdAt: role.createdAt,
        updatedAt: role.updatedAt,
        userInfo: userInfos
      })
    })
    setUserList(groups)
    setDefaultUserList(groups)
  }

  const initRoleList = async () => {
    await publicRequest().get("/role").then(res => {
      setRoleList(res.data)
    }).catch(err => {
      alertObj.show("查詢角色失敗", "error")
    })
  }

  const handleChange = (event) => {
    setUserInfo({ ...userInfo, [event.target.name]: event.target.value })
  };
  // const handleChangeRoleId = (event) => {

  //   setAge(event.target.value);
  // };

  const filterUsers = (searchValue) => {

    const newData = [];
    defaultUserList.forEach(each => {
      let newItem = JSON.parse(JSON.stringify(each))
      newItem.userInfo = each.userInfo.filter((frontMatter) => {
        const searchContent = frontMatter.username + frontMatter.email
        return searchContent.toLowerCase().includes(searchValue.toLowerCase());
      })
      newData.push(newItem)
    })

    // const filteredUsers= defaultUserList.filter((frontMatter) => {
    //    const searchContent = frontMatter.role_name + frontMatter.role_description 
    //    const roleMatch = searchContent.toLowerCase().includes(searchValue.toLowerCase());

    //   frontMatter.filter()

    //   return 
    // })
    setUserList(newData)
  }


  const handleClickShowPassword = () => {
    setUserInfo({
      ...userInfo,
      showPassword: !userInfo.showPassword,
    });
  };



  const handleClickShowPasswordChecked = () => {
    setUserInfo({
      ...userInfo,
      showPasswordChecked: !userInfo.showPasswordChecked,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const saveUser = useFormik({
    initialValues: userInfo,
    validationSchema: Yup.object({
      username: Yup
        .string()
        .max(255)
        .required(
          '使用者必須填寫'),
      roleId: Yup
        .string()
        .max(255)
        .required(
          '角色必須選擇，無角色請新增角色'),
      password: Yup
        .string()
        .max(255)
        .required(
          '密碼必須填寫'),
      passwordChecked: Yup.string()
        .oneOf([Yup.ref('password'), null], '密碼確認必須與密碼一致'),
      email: Yup
        .string()
        .email('請輸入正確的Email格式')
        .required(
          'Email必須填寫'),
    }),
    onSubmit: async (data) => {
      // router.push('/');
      console.log(data)
      await publicRequest().post("/auth/updateUser", data).then(res => {
        alertObj.show("存檔成功", "info")
        initUser();
        setOpen(false)
      }).catch(err => {
        if (err.response?.data?.name === "SequelizeUniqueConstraintError") {
          alertObj.show("已有相同的群組名稱", "error")
        } else {
          alertObj.show("存檔失敗", "error")
        }
      })
    }
  });

  // const saveUser = async (e) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   if (!userInfo.username || !userInfo.email || !userInfo.password || !userInfo.roleId) {
  //     alertObj.show("尚有欄位未填寫")
  //     return;
  //   }
  //   await publicRequest().post("/auth/createUser", userInfo).then(res => {
  //     alertObj.show("存檔成功", "info")
  //     initUser();
  //     setOpen(false)
  //   }).catch(err => {
  //     if (err.response?.data?.name === "SequelizeUniqueConstraintError") {
  //       alertObj.show("已有相同的群組名稱", "error")
  //     } else {
  //       alertObj.show("存檔失敗", "error")
  //     }
  //   })
  // };

  const checkDeleteUsers = async (e) => {

    if (selectedUserIds.length <= 0) {
      alertObj.show("請至少選擇一筆資料", "info")
      return;
    }
    setOpenDelete(true)

  }

  const handleDeleteClose = () => {
    setOpenDelete(false)
  };

  const deleteUserInfo = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await publicRequest().post("/auth/deleteUsers", { userIds: selectedUserIds }).then(res => {
      alertObj.show("刪除成功", "info")
      initUser();
      setOpenDelete(false)
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
          Users | TwPro-link
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
          <UserListToolbar addUser={openUserDlg} deleteUsers={checkDeleteUsers} onSearch={filterUsers} />
          <Box sx={{ mt: 3 }}>
            <UserListResults users={userList}
              selectedUserIds={selectedUserIds}
              setSelectedUserIds={setSelectedUserIds}
              editUser={openUserDlgEdit} />
          </Box>
        </Container>
      </Box>

      <ConfirmationDialog
        id="ringtone-menu"
        keepMounted
        title={"建立使用者"}
        open={open}
        onClose={handleClose}
        onConfirm={saveUser.handleSubmit}
      >
        {/* <TextField id="outlined-basic"
          name="username"
          onChange={handleChange}
          label="使用者名稱"
          variant="outlined" fullWidth sx={{ mt: 2 }}
          required value={userInfo.username} /> */}

        <TextField
          error={Boolean(saveUser.touched.username && saveUser.errors.username)}
          fullWidth
          helperText={saveUser.touched.username && saveUser.errors.username}
          label="使用者名稱"
          margin="normal"
          name="username"
          onBlur={saveUser.handleBlur}
          onChange={saveUser.handleChange}
          type="username"
          value={saveUser.values.username}
          variant="outlined"
          sx={{ mt: 2 }}
        />

        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="role-select-label">角色選擇</InputLabel>
          <Select
            error={Boolean(saveUser.touched.roleId && saveUser.errors.roleId)}
            helperText={saveUser.touched.roleId && saveUser.errors.roleId}
            labelId="role-select-label"
            id="role-select"
            name="roleId"
            value={saveUser.values.roleId}
            label="角色選擇"
            onBlur={saveUser.handleBlur}
            onChange={saveUser.handleChange}
          >
            {roleList.map(item => { return <MenuItem key={item.id} value={item.id}>{item.role_name}</MenuItem> }
            )}
          </Select>
        </FormControl>

        <FormControl sx={{ mt: 2 }} variant="outlined" fullWidth>
          <InputLabel htmlFor="outlined-adornment-password">使用者密碼</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            error={Boolean(saveUser.touched.password && saveUser.errors.password)}
            type={userInfo.showPassword ? 'text' : 'password'}
            name="password"
            value={saveUser.values.password}
            onBlur={saveUser.handleBlur}
            onChange={saveUser.handleChange}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {userInfo.showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
          {saveUser.touched.password && saveUser.errors.password && (
            <FormHelperText error id="password-error">
              {saveUser.errors.password}
            </FormHelperText>
          )}
        </FormControl>

        <FormControl sx={{ mt: 2 }} variant="outlined" fullWidth>
          <InputLabel htmlFor="checked-password">使用者密碼確認</InputLabel>
          <OutlinedInput
            id="checked-password"
            error={Boolean(saveUser.touched.passwordChecked && saveUser.errors.passwordChecked)}
            type={userInfo.showPasswordChecked ? 'text' : 'password'}
            name="passwordChecked"
            value={saveUser.values.passwordChecked}
            onBlur={saveUser.handleBlur}
            onChange={saveUser.handleChange}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPasswordChecked}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {userInfo.showPasswordChecked ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
          {saveUser.touched.passwordChecked && saveUser.errors.passwordChecked && (
            <FormHelperText error id="password-check-error">
              {saveUser.errors.passwordChecked}
            </FormHelperText>
          )}

        </FormControl>

        <TextField
          error={Boolean(saveUser.touched.email && saveUser.errors.email)}
          fullWidth
          helperText={saveUser.touched.email && saveUser.errors.email}
          label="Email"
          margin="normal"
          name="email"
          onBlur={saveUser.handleBlur}
          onChange={saveUser.handleChange}
          type="email"
          value={saveUser.values.email}
          variant="outlined"
          sx={{ mt: 2 }}
        />


      </ConfirmationDialog>

      <ConfirmationDialog
        formId="delete-user-form"
        id="delete-users"
        keepMounted
        title={"刪除帳號"}
        open={openDelete}
        onClose={handleDeleteClose}
        onConfirm={deleteUserInfo}
      >
        是否確定刪除帳號？
      </ConfirmationDialog>
    </>
  )
};

Users.getLayout = (page) => {
  return (
    <DashboardLayout>
      {page}
    </DashboardLayout>
  );
}

export default Users;
