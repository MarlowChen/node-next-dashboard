import { useRouter } from 'next/router'
import Head from 'next/head';
import { Box, Button, Container, Grid, Typography } from '@mui/material';
import { DashboardLayout } from 'src/components/dashboard-layout';
import { useEffect, useState } from 'react';


import { alertObj } from 'src/components/commonSnackbar';
import { LandmarkInfo } from 'src/components/landmark/landmark-info';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { getRealId, publicRequest } from 'src/utils/requestMethods';


const LandmarkEdit = () => {

  const router = useRouter()
  const { query } = router;
  const { id, parentId } = router.query
  const defulatLandmark = {
    id: -1,
    name: "",
    pos: "",
    lat: "",
    lng: "",
    link: "",
    public: true,
    maintain: false,
  }
  const [landmarkInfo, setLandmarkInfo] = useState(defulatLandmark)


  useEffect(() => {
    initLandmark();
  }, [])


  const initLandmark = async () => {

    if (!id || id === "new") {
      return;
    }

    await publicRequest().get(`/landmark/${id}`).then(async (res) => {
      const searchData = res.data;

      saveLandmark.setValues({ ...searchData, pos: `${searchData.lat}, ${searchData.lng}` })

      //setSelected(res.data.permissions.map(item => item.perm_id))
    }).catch(err => {
      console.log(err)
      alertObj.show("查詢角色權限失敗", "error")
    })
  }



  const handleSaveLandmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(":submit")
    saveLandmark.submitForm()
  }

  const saveLandmark = useFormik({
    initialValues: landmarkInfo,
    validationSchema: Yup.object({
      name: Yup
        .string()
        .max(255)
        .required(
          '地標名稱必須填寫'),
      pos: Yup
        .string()
        .max(255)
        .test("pos", function (value) {

          if (!value) {
            return true;
          }
          try {

            const values = value.split(",");
            if (values.length !== 2) {
              throw ("座標長度錯誤")
            }
            let pattern = new RegExp(/^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/);
            if (!pattern.test(value)) {
              throw ("座標格式錯誤")
            }
          } catch (err) {
            return this.createError({
              message: `座標格式錯誤`,
              path: 'pos', // Fieldname
            })

          }

          return true;
        })
        .required(
          '地標位置必須填寫'),
    }),
    onSubmit: async (data) => {
      const pos = data.pos.split(",")
      await publicRequest().post("/landmark", { ...data, parentId: parentId, lat: pos[0], lng: pos[1].trim() }).then(res => {
        alertObj.show("存檔成功", "info")
        router.push("/manage/landmark")
      }).catch(err => {
        if (err.response?.data?.name === "SequelizeUniqueConstraintError") {
          alertObj.show("已有相同的群組名稱", "error")
        } else if (err.response?.data?.msg) {
          alertObj.show(err.response?.data?.msg, "error")
        } else {
          alertObj.show("存檔失敗", "error")
        }
      })
    }
  });




  return (
    <>
      <Head>
        <title>
          地標 | M-Demo
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
              {id === "new" ? "新增地標" : "編輯地標"}
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

              <Button type="submit" form="saveLandmarkForm" variant="contained">存檔</Button>
            </Box>

          </Box>
          <form id="saveLandmarkForm" onSubmit={handleSaveLandmark}>
            <Grid
              container
              spacing={3}
            >

              <Grid
                item
                lg={12}
                md={12}
                xs={12}
              >
                <LandmarkInfo landmarkInfo={landmarkInfo} saveLandmark={saveLandmark} />
              </Grid>

            </Grid>
          </form>
        </Container>
      </Box>
    </>
  )
};

LandmarkEdit.getInitialProps = async (context) => {
  let query = context.query;
  return { query }
}

LandmarkEdit.getLayout = (page) => {
  return (
    <DashboardLayout>
      {page}
    </DashboardLayout>
  );
}

export default LandmarkEdit;
