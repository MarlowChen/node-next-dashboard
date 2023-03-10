import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  Divider,
  Grid,
  InputAdornment,
  IconButton,
  InputLabel,
  OutlinedInput,
  TextField,
  FormControlLabel,
  Select,
  MenuItem,
  Typography,
} from '@mui/material';

import PropTypes from 'prop-types';
import CommonSwitch from '../commonSwitch';
import ClearIcon from "@mui/icons-material/Clear";

export const MapSettingInfo = (props) => {
  const { isEdit, mapSetting, ...other } = props;



  return (
    <form
      autoComplete="off"
      noValidate
      {...other}
    >
      <Card>

        <CardContent>
          <Typography gutterBottom variant="h6" component="div">
            圖資公開版設定
          </Typography>

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
                error={Boolean(mapSetting.touched.public_map_zoom && mapSetting.errors.public_map_zoom)}
                fullWidth
                helperText={mapSetting.touched.public_map_zoom && mapSetting.errors.public_map_zoom}
                label="圖資公開版比例"
                margin="normal"
                name="public_map_zoom"
                onBlur={mapSetting.handleBlur}
                onChange={(e) => {
                  mapSetting.setFieldValue("public_map_zoom", e.target.value)
                }}
                disabled={!isEdit}
                type="number"
                value={mapSetting.values.public_map_zoom}
                variant="outlined"

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
                error={Boolean(mapSetting.touched.public_map_pos && mapSetting.errors.public_map_pos)}
                fullWidth
                helperText={mapSetting.touched.public_map_pos && mapSetting.errors.public_map_pos}
                label="圖資公開版位置(格式 : 緯度Latitude , 經度Longitude)"
                margin="normal"
                name="public_map_pos"
                onBlur={mapSetting.handleBlur}
                disabled={!isEdit}
                onChange={mapSetting.handleChange}

                value={mapSetting.values.public_map_pos}
                variant="outlined"
                sx={{ mt: 2 }}
              />

            </Grid>

          </Grid>
        </CardContent>
      </Card>

      <Card sx={{ mt: 4 }}>

        <CardContent>
          <Typography gutterBottom variant="h6" component="div">
            圖資管理版設定
          </Typography>

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
                error={Boolean(mapSetting.touched.private_map_zoom && mapSetting.errors.private_map_zoom)}
                fullWidth
                helperText={mapSetting.touched.private_map_zoom && mapSetting.errors.private_map_zoom}
                label="圖資管理版比例"
                margin="normal"
                name="private_map_zoom"
                onBlur={mapSetting.handleBlur}
                disabled={!isEdit}
                onChange={(e) => {
                  mapSetting.setFieldValue("private_map_zoom", e.target.value)
                }}
                type="number"
                value={mapSetting.values.private_map_zoom}
                variant="outlined"

              />
            </Grid>

            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={Boolean(mapSetting.touched.private_map_pos && mapSetting.errors.private_map_pos)}
                fullWidth
                helperText={mapSetting.touched.private_map_pos && mapSetting.errors.private_map_pos}
                label="圖資管理版位置(格式 : 緯度Latitude , 經度Longitude)"
                margin="normal"
                name="private_map_pos"
                onBlur={mapSetting.handleBlur}
                disabled={!isEdit}
                onChange={mapSetting.handleChange}

                value={mapSetting.values.private_map_pos}
                variant="outlined"
                sx={{ mt: 2 }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{ mt: 4 }}>

        <CardContent>
          <Box>
            <Typography gutterBottom variant="h6" component="div">
              地圖設定
            </Typography>
            {/* <FormControlLabel
              labelPlacement="start"
              control={<CommonSwitch name="mapsetting" checked={mapSetting.values.weather_pos || mapSetting.values.map_name} onChange={mapSetting.handleChange} defaultChecked />}

              label="是否開啟地圖設定"
            /> */}
          </Box>


          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              md={6}
              xs={12}
            >
              <FormControl sx={{
                mt: 2, width: {
                  xs: "100%",
                  md: "250px"
                }
              }} >
                <InputLabel id="weather_pos-select-label">天氣位置</InputLabel>
                <Select
                  error={Boolean(mapSetting.touched.weather_pos && mapSetting.errors.weather_pos)}
                  helperText={mapSetting.touched.weather_pos && mapSetting.errors.weather_pos}
                  labelId="weather_pos-select-label"
                  id="weather_pos-select"
                  name="weather_pos"
                  value={mapSetting.values.weather_pos}
                  label="天氣位置"
                  disabled={!isEdit}
                  endAdornment={<IconButton disabled={!isEdit} sx={{ display: mapSetting.values.weather_pos ? "" : "none" }}
                    onClick={() => mapSetting.setFieldValue("weather_pos", "")}><ClearIcon /></IconButton>}
                  onBlur={mapSetting.handleBlur}
                  onChange={mapSetting.handleChange}
                >

                  <MenuItem value={"LEFT-TOP"}>左上</MenuItem>
                  <MenuItem value={"RIGHT-TOP"}>右上</MenuItem>
                  <MenuItem value={"LEFT-BOTTOM"}>左下</MenuItem>
                  <MenuItem value={"RIGHT-BOTTOM"}>右下</MenuItem>
                </Select>
              </FormControl>
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
                  error={Boolean(mapSetting.touched.map_name && mapSetting.errors.map_name)}
                  fullWidth
                  helperText={mapSetting.touched.map_name && mapSetting.errors.map_name}
                  label="地圖名稱"
                  margin="normal"
                  name="map_name"
                  disabled={!isEdit}
                  onBlur={mapSetting.handleBlur}
                  onChange={mapSetting.handleChange}
                  value={mapSetting.values.map_name}
                  variant="outlined"
                  sx={{ mt: 2 }}
                />
              </Grid>



            </Grid>
          </Grid>
        </CardContent>
      </Card>


      <Card sx={{ mt: 4 }}>

        <CardContent>
          <Box>
            <Typography gutterBottom variant="h6" component="div">
              攝影機設定
            </Typography>

          </Box>


          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              md={6}
              xs={12}
            >
              <FormControlLabel
                disabled={!isEdit}
                labelPlacement="start"
                control={<CommonSwitch name="camera_name_view"
                  checked={mapSetting.values.camera_name_view}
                  onChange={mapSetting.handleChange} />}

                label="是否顯示地標名稱"
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
              <Grid
                item
                md={6}
                xs={12}
                sx={{
                  display: "flex",
                  // justifyContent: "space-around"
                }}
              >
                <FormControlLabel
                  labelPlacement="start"
                  disabled={!isEdit}
                  control={<CommonSwitch name="sys_time_view"
                    checked={mapSetting.values.sys_time_view}
                    onChange={mapSetting.handleChange} />}

                  label="是否顯示系統時間"
                />
              </Grid>


            </Grid>

          </Grid>
        </CardContent>
      </Card>

    </form>
  )
};

