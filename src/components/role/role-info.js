import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
} from '@mui/material';
import PropTypes from 'prop-types';

export const RoleInfo = (props) => {
  const { role, onChangeValue, ...others } = props;

  return (
    <Card {...others}>
      <CardHeader
        // subheader="The information can be edited"
        title="角色編輯"
      />
      <Divider />
      <CardContent>

        {/* <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column'
          }}
        > */}
        <TextField
          name="role_name"
          onChange={onChangeValue}
          label="角色名稱"
          variant="outlined" fullWidth sx={{ mt: 2 }}
          required value={role?.role_name} />

        <TextField
          name="role_description"
          onChange={onChangeValue}
          label="角色說明"
          variant="outlined"
          multiline
          rows={4}
          fullWidth
          sx={{ mt: 2 }}
          value={role?.role_description}
        />
        {/* </Box> */}
      </CardContent>
      {/* <Divider />
    <CardActions>
      <Button
        color="primary"
        fullWidth
        variant="text"
      >
        Upload picture
      </Button>
    </CardActions> */}
    </Card>
  )
};

RoleInfo.propTypes = {
  onChangeValue: PropTypes.func,
};
