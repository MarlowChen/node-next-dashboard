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
import { Upload as UploadIcon } from '../../icons/upload';
import { Download as DownloadIcon } from '../../icons/download';
import PropTypes from 'prop-types';
import { useState } from 'react';
import Link from 'next/link';

export const RoleListToolbar = (props) => {
  const { deleteRoles, onSearch, ...others } = props;
  const handleChange = (event) => {
    setSearchValue(event.target.value);
    onSearch(event.target.value)
  }
  return (
    <Box {...others}>
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
          角色
        </Typography>
        <Box sx={{ m: 1 }}>


          <Link href="./roles/new">
            <Button
              color="primary"
              variant="contained"
              sx={{mr:2}}
            >
              新增角色
            </Button>
          </Link>
          <Button
            color="error"
            variant="contained"
            onClick={deleteRoles}
          >
            刪除角色
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
                onChange={handleChange}
                placeholder="查詢 角色名稱, 角色說明"
                variant="outlined"

              />
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
};

RoleListToolbar.propTypes = {
  onSearch: PropTypes.func,
};
