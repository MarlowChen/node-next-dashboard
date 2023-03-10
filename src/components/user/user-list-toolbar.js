import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon, Typography
} from '@mui/material';
import { Search as SearchIcon } from '../../icons/search';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useState } from 'react';

export const UserListToolbar = (props) => {
  const { addUser, onSearch, deleteUsers, ...other } = props;
  const [searchValue, setSearchValue] = useState("");
  const handleChange = (event) => {
    setSearchValue(event.target.value);
    onSearch(event.target.value)
  }

  return (
    <Box {...other}>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          m: -1
        }}
      >
        <Typography
          sx={{ m: 1 }}
          variant="h4"
        >
          User
        </Typography>
        <Box sx={{ m: 1 }}>


          <Button
            color="primary"
            variant="contained"
            onClick={addUser}
            sx={{ mr: 2 }}
          >
            新增帳號
          </Button>

          <Link href={{ pathname: './roles/detail', query: { id: "new" } }}>
            <Button
              color="primary"
              variant="contained"
              sx={{ mr: 2 }}

            >
              新增角色
            </Button>
          </Link>

          <Button
            color="error"
            variant="contained"
            onClick={deleteUsers}

          >
            刪除帳號
          </Button>

        </Box>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Card>
          <CardContent>
            <Box sx={{ maxWidth: 500 }}>
              <TextField
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SvgIcon
                        color="action"
                        fontSize="small"
                      >
                        <SearchIcon />
                      </SvgIcon>
                    </InputAdornment>
                  )
                }}
                placeholder="查詢 使用者名稱、Email"
                onChange={handleChange}
                variant="outlined"
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
};

UserListToolbar.propTypes = {
  addUser: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
};