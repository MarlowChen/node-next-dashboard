import {
  Card,
  CardContent,
  Grid,
  TextField,
  FormControlLabel,
} from '@mui/material';

import CommonSwitch from '../commonSwitch';

export const LandmarkInfo = (props) => {
  const { landmarkInfo, saveLandmark, ...other } = props;


  return (
    <form
      autoComplete="off"
      noValidate
      {...other}
    >
      <Card>
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              md={6}
              xs={12}
            >

              <TextField
                error={Boolean(saveLandmark.touched.name && saveLandmark.errors.name)}
                fullWidth
                helperText={saveLandmark.touched.name && saveLandmark.errors.name}
                label="地標名稱"
                margin="normal"
                name="name"
                onBlur={saveLandmark.handleBlur}
                onChange={saveLandmark.handleChange}
                type="name"
                value={saveLandmark.values.name}
                variant="outlined"
                sx={{ mt: 2 }}
              />

            </Grid>

            <Grid
              item
              md={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "space-around"
              }}
            >


              <FormControlLabel
                labelPlacement="start"
                control={<CommonSwitch name="public" checked={saveLandmark.values.public} onChange={saveLandmark.handleChange} defaultChecked />}

                label="是否公開"
              />

              <FormControlLabel
                labelPlacement="start"
                control={<CommonSwitch name="maintain" checked={saveLandmark.values.maintain} onChange={saveLandmark.handleChange} defaultChecked />}

                label="是否維運"
              />


            </Grid>

            <Grid
              item
              md={6}
              xs={12}
              sx={{
                display: "flex",
                // justifyContent: "space-around"
              }}
            >
              <TextField
                error={Boolean(saveLandmark.touched.pos && saveLandmark.errors.pos)}
                fullWidth
                helperText={saveLandmark.touched.pos && saveLandmark.errors.pos}
                label="地標位置(格式 : 緯度Latitude , 經度Longitude)"
                margin="normal"
                name="pos"
                onBlur={saveLandmark.handleBlur}
                onChange={saveLandmark.handleChange}
                value={saveLandmark.values.pos}
                variant="outlined"
                sx={{ mt: 2 }}
              />

            </Grid>

            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={Boolean(saveLandmark.touched.link && saveLandmark.errors.link)}
                fullWidth
                helperText={saveLandmark.touched.link && saveLandmark.errors.link}
                label="link"
                margin="normal"
                name="link"
                onBlur={saveLandmark.handleBlur}
                onChange={saveLandmark.handleChange}
                type="link"
                value={saveLandmark.values.link}
                variant="outlined"
                sx={{ mt: 2 }}
              />
            </Grid>


          </Grid>
        </CardContent>
      </Card>
    </form>
  )
};

// LandmarkInfo.propTypes = {
//   onChangeValue: PropTypes.func,
// };
