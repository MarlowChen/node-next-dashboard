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
import { useState } from 'react';
import Link from 'next/link';

export const LandmarkListToolbar = (props) => {
  const [searchValue, setSearchValue] = useState("");
  const { deleteLandmarks, onSearch, ...others } = props;
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
          設備設定
        </Typography>
        <Box sx={{ m: 1 }}>


          <Link href={{ pathname: './landmarks/detail', query: { id: 'new' } }}  >
            <Button
              color="primary"
              variant="contained"
              sx={{ mr: 2 }}
            >
              新增地標
            </Button>
          </Link>
          <Button
            color="error"
            variant="contained"
            onClick={deleteLandmarks}
          >
            刪除地標
          </Button>

        </Box>
      </Box>
    </Box>
  )
};

// LandmarkListToolbar.propTypes = {
//   onSearch: PropTypes.func,
// };
