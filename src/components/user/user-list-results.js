import * as React from 'react';
import { useState } from 'react';
import SimpleBar from 'simplebar-react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Collapse,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import { getInitials } from '../../utils/get-initials';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import EditIcon from '@mui/icons-material/Edit';



function Row(props) {
  const { row, selectedUserIds, handleSelectOne, handleSelectAll, editUser } = props;
  const [open, setOpen] = useState(false);
  const [filterSelects, setFilterSelects] = useState([]);

  React.useEffect(() => {
    const filterSelects = selectedUserIds.filter(id => row.userInfo.some((element, index, array) => {
      return element.id === id;
    }))
    setFilterSelects(filterSelects)
  }, [selectedUserIds])


  // const check = () =>{

  //   const filterSelects =  selectedUserIds.filter(id => row.userInfo.some((element, index, array) => {
  //     return element.id === id;
  //   }))

  //   return (filterSelects.length > 0 && filterSelects.length < row.userInfo.length)
  // }


  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>

        <TableCell >{row.role_name}</TableCell>
        <TableCell >{row.role_description}</TableCell>
        <TableCell >{format(new Date(row.createdAt), 'yyyy/MM/dd hh:mm')}</TableCell>
        <TableCell>{format(new Date(row.updatedAt), 'yyyy/MM/dd hh:mm')}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                User
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={filterSelects.length === row.userInfo.length}
                        color="primary"
                        indeterminate={filterSelects.length > 0 && filterSelects.length < row.userInfo.length}
                        onChange={(e) => handleSelectAll(e, row.id, (filterSelects.length === row.userInfo.length || filterSelects.length > 0))}
                      />
                    </TableCell>
                    <TableCell>帳號</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>建立日期</TableCell>
                    <TableCell>編輯帳號</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.userInfo.map((user) => (
                    <TableRow key={user.user_id}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedUserIds.indexOf(user.id) !== -1}
                          onChange={(event) => handleSelectOne(event, user.id)}
                        />
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {user.username}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell >{format(new Date(user.createdAt), 'yyyy/MM/dd hh:mm')}</TableCell>
                      <TableCell >
                        <IconButton
                          color="primary"
                          variant="contained"
                          onClick={(e) => editUser(user)}
                        >
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}


export const UserListResults = ({ users, selectedUserIds, setSelectedUserIds, editUser, ...rest }) => {

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState([]);
  const [fullRows, setFullRows] = useState([]);

  React.useEffect(() => {
    setRows(users)
    setFullRows(users);
  }, [users])

  React.useEffect(() => {
    setRows(fullRows.slice(page * limit, (page + 1) * limit));
  }, [page, fullRows])

  const handleSelectAll = (event, roleId, isAllSelect) => {
    let newSelectedUserIds;

    const group = users.filter((u) => u.id === roleId);

    if (!group || group.length <= 0) {
      return
    }

    const filterUsers = group[0].userInfo.map(user => user.id);
    //const groups = JSON.parse(JSON.stringify(selectedGroups));
    const selUsers = JSON.parse(JSON.stringify(selectedUserIds));
    if (isAllSelect) {

      //setSelectedGroups(groups.filter(group => group !== roleId))
      newSelectedUserIds = selUsers.filter(id => !filterUsers.some((element, index, array) => {
        return element === id;
      }))
    } else {

      newSelectedUserIds = selUsers.concat(filterUsers.filter((item) => selUsers.indexOf(item) < 0));
      //groups.push(roleId);
      //setSelectedGroups(groups)
    }

    setSelectedUserIds(newSelectedUserIds);
  };

  const handleSelectOne = (event, id, roleId) => {
    const selectedIndex = selectedUserIds.indexOf(id);

    let newSelectedUserIds = [];

    if (selectedIndex === -1) {
      newSelectedUserIds = newSelectedUserIds.concat(selectedUserIds, id);
      // const selectedRoleIndex = selectedGroups.indexOf(roleId);
      // setSelectedGroups((g) =>  g.splice(selectedRoleIndex, 1))
    } else if (selectedIndex === 0) {
      newSelectedUserIds = newSelectedUserIds.concat(selectedUserIds.slice(1));
    } else if (selectedIndex === selectedUserIds.length - 1) {
      newSelectedUserIds = newSelectedUserIds.concat(selectedUserIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedUserIds = newSelectedUserIds.concat(
        selectedUserIds.slice(0, selectedIndex),
        selectedUserIds.slice(selectedIndex + 1)
      );
    }



    setSelectedUserIds(newSelectedUserIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Card {...rest}>
      <SimpleBar >
        <Box sx={{ minWidth: 1050 }}>

          <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>角色</TableCell>
                  <TableCell>說明</TableCell>
                  <TableCell>建立日期</TableCell>
                  <TableCell>更新日期</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <Row key={row.name} row={row}
                    selectedUserIds={selectedUserIds}
                    handleSelectOne={handleSelectOne}
                    handleSelectAll={handleSelectAll}
                    editUser={editUser} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </SimpleBar>
      <TablePagination
        component="div"
        count={users.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

UserListResults.propTypes = {
  users: PropTypes.array.isRequired
};
