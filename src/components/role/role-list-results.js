import { useEffect, useState } from 'react';
import SimpleBar from 'simplebar-react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import {
  Avatar,
  Box,
  Button,
  Card,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import { getInitials } from '../../utils/get-initials';
import Link from 'next/link';
import EditIcon from '@mui/icons-material/Edit';

export const RoleListResults = ({ roles, selectedRoleIds, setSelectedRoleIds, ...rest }) => {

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState([]);
  const [fullRows, setFullRows] = useState([]);

  useEffect(() => {
    setRows(roles)
    setFullRows(roles);
  }, [roles])

  useEffect(() => {
    setRows(fullRows.slice(page * limit, (page + 1) * limit));
  }, [page, fullRows])

  const handleSelectAll = (event) => {
    let newSelectedRoleIds;
    if (selectedRoleIds <= 0) {
      newSelectedRoleIds = roles.map((role) => role.id).filter(role => role !== 1);
    } else {
      newSelectedRoleIds = [];
    }

    setSelectedRoleIds(newSelectedRoleIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedRoleIds.indexOf(id);
    let newSelectedRoleIds = [];

    if (selectedIndex === -1) {
      newSelectedRoleIds = newSelectedRoleIds.concat(selectedRoleIds, id);
    } else if (selectedIndex === 0) {
      newSelectedRoleIds = newSelectedRoleIds.concat(selectedRoleIds.slice(1));
    } else if (selectedIndex === selectedRoleIds.length - 1) {
      newSelectedRoleIds = newSelectedRoleIds.concat(selectedRoleIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedRoleIds = newSelectedRoleIds.concat(
        selectedRoleIds.slice(0, selectedIndex),
        selectedRoleIds.slice(selectedIndex + 1)
      );
    }

    setSelectedRoleIds(newSelectedRoleIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Card {...rest}>
      <SimpleBar>
        <Box sx={{ minWidth: 1050 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedRoleIds.length === roles.length}
                    color="primary"
                    indeterminate={
                      selectedRoleIds.length > 0
                      && selectedRoleIds.length < roles.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>
                  角色名稱
                </TableCell>
                <TableCell>
                  角色說明
                </TableCell>
                {/* <TableCell>
                  權限數量
                </TableCell> */}
                <TableCell>
                  建立日期
                </TableCell>
                <TableCell>
                  編輯權限
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.slice(0, limit).map((role) => (
                <TableRow
                  hover
                  key={role.id}
                  selected={selectedRoleIds.indexOf(role.id) !== -1}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedRoleIds.indexOf(role.id) !== -1}
                      onChange={(event) => handleSelectOne(event, role.id)}
                      disabled={role.id === 1}
                    />
                  </TableCell>

                  <TableCell>
                    {role.role_name}
                  </TableCell>
                  <TableCell>
                    {role.role_description}
                  </TableCell>
                  {/* <TableCell>
                    目前權限
                  </TableCell>                   */}
                  <TableCell>
                    {format(new Date(role.createdAt), 'yyyy/MM/dd hh:mm')}
                  </TableCell>
                  <TableCell>
                    <Link href={{ pathname: './roles/detail', query: { id: role.id } }} >
                      <IconButton
                        color="primary"
                        variant="contained"

                      >
                        <EditIcon />
                      </IconButton>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </SimpleBar>
      <TablePagination
        component="div"
        count={roles.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

RoleListResults.propTypes = {
  roles: PropTypes.array.isRequired
};
