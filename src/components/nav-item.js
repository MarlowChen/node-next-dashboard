import NextLink from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { Box, Button, Collapse, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { TransitionGroup } from 'react-transition-group';

export const NavItem = (props) => {
  const { href, icon, title, children, ...others } = props;
  const router = useRouter();
  const active = href ? (router.pathname !== "/" && router.pathname === href) : false;

  const [open, setOpen] = useState(true);
  const handleClick = () => {
    setOpen(!open);
  };

  const menu = () => {
    if (!children) {
      return (
        <ListItem
          disableGutters
          sx={{
            display: 'flex',
            mb: 0.5,
            py: 0,
            px: 2
          }}
          {...others}
        >
          <NextLink
            href={href}
            passHref
          >
            <Button
              component="a"
              startIcon={icon}
              disableRipple
              sx={{
                backgroundColor: active && 'rgba(255,255,255, 0.08)',
                borderRadius: 1,
                color: active ? 'secondary.main' : 'neutral.300',
                fontWeight: active && 'fontWeightBold',
                justifyContent: 'flex-start',
                px: 3,
                textAlign: 'left',
                textTransform: 'none',
                width: '100%',
                '& .MuiButton-startIcon': {
                  color: active ? 'secondary.main' : 'neutral.400'
                },
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255, 0.08)'
                }
              }}
            >
              <Box sx={{ flexGrow: 1 }}>
                {title}
              </Box>
            </Button>
          </NextLink>
        </ListItem>
      )
    } else {

      return (
        <List component="ul" disablePadding>
          <ListItem
            disableGutters
            sx={{
              display: 'flex',
              mb: 0.5,
              py: 0,
              px: 2
            }}
            {...others}
          >
            <Button
              component="button"
              startIcon={icon}
              disableRipple
              onClick={handleClick}
              sx={{
                backgroundColor: active && 'rgba(255,255,255, 0.08)',
                borderRadius: 1,
                color: active ? 'secondary.main' : 'neutral.300',
                fontWeight: active && 'fontWeightBold',
                justifyContent: 'flex-start',
                px: 3,
                textAlign: 'left',
                textTransform: 'none',
                width: '100%',
                '& .MuiButton-startIcon': {
                  color: active ? 'secondary.main' : 'neutral.400'
                },
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255, 0.08)'
                }
              }}
            >
              <Box sx={{ flexGrow: 1 }}>
                {title}
              </Box>
              {open ? <ExpandLess /> : <ExpandMore />}
            </Button>
          </ListItem>

          <Collapse in={open} timeout="auto" unmountOnExit>

            <List component="ul" disablePadding
              sx={{
                px: 3
              }}>
              {children.map(item => {
                const childActive = item.href ? (router.pathname !== "/" && router.pathname === item.href) : false;

                return (

                  <NextLink
                    key={item.title}
                    href={item.href}
                    passHref
                  >
                    <Button
                      component="a"

                      disableRipple
                      sx={{
                        backgroundColor: childActive && 'rgba(255,255,255, 0.08)',
                        borderRadius: 1,
                        color: childActive ? 'secondary.main' : 'neutral.300',
                        fontWeight: childActive && 'fontWeightBold',
                        justifyContent: 'flex-start',
                        px: 6,
                        textAlign: 'left',
                        textTransform: 'none',
                        width: '100%',
                        '& .MuiButton-startIcon': {
                          color: childActive ? 'secondary.main' : 'neutral.400'
                        },
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255, 0.08)'
                        }
                      }}
                    >
                      <Box sx={{ flexGrow: 1 }}>
                        {item.title}
                      </Box>
                    </Button>
                  </NextLink>

                )
              })}
            </List>

          </Collapse>

        </List>
      )
    }
  }

  return (
    menu()
  );
};

NavItem.propTypes = {
  href: PropTypes.string,
  icon: PropTypes.node,
  title: PropTypes.string
};
