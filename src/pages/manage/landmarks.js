import Head from 'next/head';
import { Box, Container, TextField } from '@mui/material';
import { LandmarkListToolbar } from '../../components/landmark/landmark-list-toolbar';
import { DashboardLayout } from '../../components/dashboard-layout';
import { useEffect, useState } from 'react';
import { publicRequest } from 'src/utils/requestMethods';
import { alertObj } from 'src/components/commonSnackbar';
import { ConfirmationDialog } from 'src/components/confirmationDialog';
import { LandmarkTreeNative } from 'src/components/landmark/landmark-tree-native';


const Landmarks = () => {
  const [open, setOpen] = useState(false);
  const [selectedLandmarkIds, setSelectedLandmarkIds] = useState([]);
  const [parentId, setParentId] = useState([]);
  const [landmarks, setLandmarks] = useState([]);


  useEffect(() => {
    initParentId();
    initLandmark();
  }, [])

  const initParentId = async () => {
    const landmarkId = await publicRequest().get("/permission/permCode/LANDMARK")
    const parentIds = [];
    if (landmarkId.data && landmarkId.data.length > 0) {
      parentIds.push(landmarkId.data[0].id)
    }
    setParentId(parentIds)
  }
  const initLandmark = async () => {

    await publicRequest().get("/landmark/group").then(res => {
      console.log(res.data)
      if (res.data) {
        setLandmarks(res.data.sort((a, b) => a.index - b.index));
      }

    }).catch(err => {
      alertObj.show("查詢攝影機失敗", "error")
    })
  }


  const handleClose = () => {
    setOpen(false)
  };


  const checkDeleteLandmarks = async (e) => {

    if (selectedLandmarkIds.length <= 0) {
      alertObj.show("請至少選擇一筆資料", "info")
      return;
    }
    setOpen(true)

  }

  const updateIndex = async (datas) => {
    if (datas.length == 0) {
      return;
    }
    await publicRequest().post("/permission/list", { list: datas }).then(res => {
      alertObj.show("更新成功", "info")
    }).catch(err => {
      if (err.response?.data?.message) {
        alertObj.show(err.response?.data?.message, "error")
      } else {
        alertObj.show("更新失敗", "error")
      }

    })
  }

  const deleteLandmarks = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await publicRequest().post("/landmark/deleteSelect", { landmarkIds: selectedLandmarkIds }).then(res => {
      alertObj.show("刪除成功", "info")
      initLandmark();
      setOpen(false)
    }).catch(err => {
      if (err.response?.data?.message) {
        alertObj.show(err.response?.data?.message, "error")
      } else {
        alertObj.show("刪除失敗", "error")
      }

    })
  }

  return (
    <>
      <Head>
        <title>
          Landmarks | M-Demo
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
          <LandmarkListToolbar deleteLandmarks={checkDeleteLandmarks} />
          <Box sx={{ mt: 3 }}>
            <LandmarkTreeNative
              parentId={parentId}
              landmarks={landmarks}
              setLandmarks={setLandmarks}
              updateIndex={updateIndex}
              selectedLandmarkIds={selectedLandmarkIds}
              setSelectedLandmarkIds={setSelectedLandmarkIds}
            />
          </Box>
        </Container>
      </Box>

      <ConfirmationDialog
        id="delete-landmarks"
        keepMounted
        title={"刪除設備"}
        open={open}
        onClose={handleClose}
        onConfirm={deleteLandmarks}
      >
        是否確定刪除地標？
      </ConfirmationDialog>

    </>
  )
};


Landmarks.getLayout = (page) => {
  return (
    <DashboardLayout>
      {page}
    </DashboardLayout>
  );
}

export default Landmarks;
