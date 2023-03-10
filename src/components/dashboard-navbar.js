import PropTypes from 'prop-types';

import { AppBar, Avatar, Badge, Box, Button, Fade, IconButton, Toolbar, Tooltip, Typography, Popover, List, ListItemButton, ListItemText, ListItemIcon, ListItem, Grow } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { Bell as BellIcon } from '../icons/bell';
import { UserCircle as UserCircleIcon } from '../icons/user-circle';
import { Users as UsersIcon } from '../icons/users';
import { useRef, useState, forwardRef, useEffect } from 'react';
import LogoutIcon from '@mui/icons-material/Logout';
import { deleteCookie } from 'cookies-next';
import Router from 'next/router'
import { Transition } from 'react-transition-group';
import { styled } from '@mui/styles';

const MyTransition = forwardRef(function MyTransition(props, ref) {
  const duration = 300;

  const defaultStyle = {
    transition: `all ${duration}ms cubic-bezier(0, 0, 0.2, 1)`,
    opacity: 0,
  }

  const transitionStyles = {
    entering: { opacity: 1 },
    entered: { opacity: 1 },
    exiting: { opacity: 0 },
    exited: { opacity: 0 },
  };
  const nodeRef = ref;

  return (
    <Transition nodeRef={ref} timeout={duration} {...props}>
      {state => (
        <div ref={nodeRef} style={{
          ...defaultStyle,
          ...transitionStyles[state]
        }}>
          {props.children}
        </div>
      )}
    </Transition>
  );


});

const DashboardNavbarRoot = styled(AppBar)(({ theme }) => ({
  //backgroundColor: theme.palette.background.paper,
  backgroundColor: "rgb(255, 255, 255)",
  boxShadow: theme.shadows[3]
}));





export const DashboardNavbar = (props) => {

  const { isSidebarOpen, onSidebarOpen, left, ...other } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorMenuEl, setAnchorMenuEl] = useState(null);
  const buttonRef = useRef(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleMenuClick = (event) => {
    //setAnchorMenuEl(event.currentTarget);
    setAnchorMenuEl(buttonRef.current);
  };

  const handleMenuClose = () => {
    setAnchorMenuEl(null);
  };


  const openMenu = Boolean(anchorMenuEl);
  const idMenu = openMenu ? 'menu-popover' : undefined;
  //const [sideWidth, setSideWidth] = useState(0);

  const logout = (e) => {
    deleteCookie("token")
    Router.push('/login')
  }

  return (
    <>
      <DashboardNavbarRoot
        sx={{
          transition: `all 300ms cubic-bezier(0, 0, 0.2, 1)`,
          position: "absolute",
          right: {
            lg: 0
          },
          width: {
            lg: `calc(100% - ${left}px)`
          },
          backgroundColor: "white"
        }}
        {...other}>
        <Toolbar
          disableGutters
          sx={{
            minHeight: 64,
            left: 0,
            px: 2
          }}
        >
          <Box sx={{ position: "relative", width: 50, display: "flex", justifyContent: "center" }}

          >
            <Button
              onClick={() => {
                handleMenuClose()
                onSidebarOpen()
              }}
              ref={buttonRef}
              sx={{
                minWidth: 36,
                width: "52px",
                height: "36px",
                border: "solid #a1a1a1 1px",
                positon: "relative",
                left: "11px",
                zIndex: 2000,
                display: {
                  xs: 'inline-flex',
                  // lg: 'none'
                }
              }}
            >
              <MenuIcon fontSize="small" />
            </Button>
            <Popover
              TransitionComponent={MyTransition}

              id={idMenu}
              open={openMenu}
              anchorEl={anchorMenuEl}
              anchorReference="anchorPosition"
              anchorPosition={{ top: 0, left: Number(`${left + 52}`) }}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
              disablePortal
              PaperProps={{
                onMouseLeave: (e) => {
                  handleMenuClose()
                }
              }}

              sx={{
                top: "-7px"
              }}


            >

              <List
                sx={{
                  paddingTop: 5.5,
                  display: "inline-block",
                  border: "solid #a1a1a1 1px",
                  borderRadius: "7px"
                }}
              >
                <ListItem sx={{
                  padding: "3px"
                }}>
                  <Button sx={{
                    minWidth: 36,
                    width: "52px",
                    height: "36px",
                    border: "solid #a1a1a1 1px"
                  }}>
                    <MenuIcon fontSize="small" />
                  </Button>
                </ListItem>
                <ListItem sx={{
                  padding: "3px"
                }}>
                  <Button sx={{
                    minWidth: 36,
                    width: "52px",
                    height: "36px",
                    border: "solid #a1a1a1 1px"
                  }}>
                    <MenuIcon fontSize="small" />
                  </Button>
                </ListItem>
              </List>

            </Popover>



          </Box>

          <Box sx={{ flexGrow: 1 }} />
          <Tooltip title="Contacts">
            <IconButton sx={{ ml: 1 }}>
              <UsersIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Notifications">
            <IconButton sx={{ ml: 1 }}>
              <Badge
                badgeContent={4}
                color="primary"
                variant="dot"
              >
                <BellIcon fontSize="small" />
              </Badge>
            </IconButton>
          </Tooltip>

          <Avatar
            sx={{
              height: 40,
              width: 40,
              ml: 1,
              cursor: "pointer"
            }}
            aria-describedby={id} variant="contained" onClick={handleClick}
            src="/static/images/avatars/avatar_1.png"
          >
            <UserCircleIcon fontSize="small" />
          </Avatar>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}

          >
            <List component="nav" aria-label="secondary mailbox folder">
              <ListItemButton
                onClick={logout}
              >
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>

            </List>
          </Popover>

        </Toolbar>
      </DashboardNavbarRoot>
    </>
  );
};

DashboardNavbar.propTypes = {
  onSidebarOpen: PropTypes.func
};
