import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import {
  Box,
  Card,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow
} from '@mui/material';
import Link from 'next/link';
import EditIcon from '@mui/icons-material/Edit';
import SimpleBar from 'simplebar-react';

export const LandmarkListResults = ({ landmarks, selectedLandmarkIds, setSelectedLandmarkIds, ...rest }) => {

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState([]);
  const [fullRows, setFullRows] = useState([]);

  useEffect(() => {
    setRows(landmarks)
    setFullRows(landmarks);
  }, [landmarks])

  useEffect(() => {
    setRows(fullRows.slice(page * limit, (page + 1) * limit));
  }, [page, fullRows])

  const handleSelectAll = (event) => {
    let newSelectedLandmarkIds;
    if (selectedLandmarkIds <= 0) {
      newSelectedLandmarkIds = landmarks.map((landmark) => landmark.id);
    } else {
      newSelectedLandmarkIds = [];
    }

    setSelectedLandmarkIds(newSelectedLandmarkIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedLandmarkIds.indexOf(id);
    let newSelectedLandmarkIds = [];

    if (selectedIndex === -1) {
      newSelectedLandmarkIds = newSelectedLandmarkIds.concat(selectedLandmarkIds, id);
    } else if (selectedIndex === 0) {
      newSelectedLandmarkIds = newSelectedLandmarkIds.concat(selectedLandmarkIds.slice(1));
    } else if (selectedIndex === selectedLandmarkIds.length - 1) {
      newSelectedLandmarkIds = newSelectedLandmarkIds.concat(selectedLandmarkIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedLandmarkIds = newSelectedLandmarkIds.concat(
        selectedLandmarkIds.slice(0, selectedIndex),
        selectedLandmarkIds.slice(selectedIndex + 1)
      );
    }

    setSelectedLandmarkIds(newSelectedLandmarkIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const getGps = (landmark) => {
    return "(" + landmark.lat + "/" + landmark.lng + ")"
  }

  return (
    <Card {...rest}>
      <SimpleBar>
        <Box sx={{ minWidth: 1050 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedLandmarkIds.length === landmarks.length}
                    color="primary"
                    indeterminate={
                      selectedLandmarkIds.length > 0
                      && selectedLandmarkIds.length < landmarks.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>
                  地標名稱
                </TableCell>
                <TableCell>
                  座標
                </TableCell>
                <TableCell>
                  連結
                </TableCell>
                <TableCell>
                  是否公開
                </TableCell>
                <TableCell>
                  是否維護
                </TableCell>
                <TableCell>
                  建立日期
                </TableCell>
                <TableCell>
                  編輯權限
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.slice(0, limit).map((landmark) => (
                <TableRow
                  hover
                  key={landmark.id}
                  selected={selectedLandmarkIds.indexOf(landmark.id) !== -1}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedLandmarkIds.indexOf(landmark.id) !== -1}
                      onChange={(event) => handleSelectOne(event, landmark.id)}

                    />
                  </TableCell>

                  <TableCell>
                    {landmark.name}
                  </TableCell>
                  <TableCell>
                    {getGps(landmark)}
                  </TableCell>
                  <TableCell>
                    {landmark.link}
                  </TableCell>
                  <TableCell>
                    {landmark.public ? "是" : "否"}
                  </TableCell>
                  <TableCell>
                    {landmark.maintain ? "是" : "否"}
                  </TableCell>
                  <TableCell>
                    {format(new Date(landmark.createdAt), 'yyyy/MM/dd hh:mm')}
                  </TableCell>
                  <TableCell>
                    <Link href={{ pathname: './landmarks/detail', query: { id: landmark.id } }} >
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
        count={landmarks.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

LandmarkListResults.propTypes = {
  landmarks: PropTypes.array.isRequired
};
