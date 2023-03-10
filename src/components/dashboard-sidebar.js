import { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { Box, Button, Divider, Drawer, Typography, useMediaQuery } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { ChartBar as ChartBarIcon } from '../icons/chart-bar';
import { Camera as CameraIcon } from '../icons/camera';
import { Cog as CogIcon } from '../icons/cog';
import { Lock as LockIcon } from '../icons/lock';
import { Selector as SelectorIcon } from '../icons/selector';
import { ShoppingBag as ShoppingBagIcon } from '../icons/shopping-bag';
import { User as UserIcon } from '../icons/user';
import { Users as UsersIcon } from '../icons/users';
import { XCircle as XCircleIcon } from '../icons/x-circle';
import { Logo } from './logo';
import { NavItem } from './nav-item';
import { Play } from 'src/icons/play';
import { Pie } from 'src/icons/pie';
// import logoBig from '../../public/images/logo-big_1.png';

const items = [
  // {
  //   href: '/',
  //   icon: (<ChartBarIcon fontSize="small" />),
  //   title: '儀錶板'
  // },
  {
    href: '/publicmap',
    icon: (<CameraIcon fontSize="small" />),
    title: '監控圖資 公開版'
  },
  {
    href: '/monitormanage',
    icon: (<CameraIcon fontSize="small" />),
    title: '監控圖資 管理版',
    code: "LANDMARK"
  },
  {
    href: '/',
    icon: (<UsersIcon fontSize="small" />),
    title: '系統設定',
    code: "SYSTEM_SETTING",
    children: [
      {
        title: '使用者',
        href: '/manage/users',
      },
      {
        title: '角色',
        href: '/manage/roles',
      },
      {
        title: '圖標設定',
        href: '/manage/landmarks',
      },
      {
        title: '地圖設定',
        href: '/manage/mapsetting',
      },
      
    ]
  },


];



export const DashboardSidebar = (props) => {
  const { open, onClose, permissions, sidebarType } = props;
  const [navItems, setNavItems] = useState([]);
  const router = useRouter();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'), {
    defaultMatches: true,
    noSsr: false
  });

  useEffect(
    () => {
      if (!permissions) {
        return;
      }
      const codeList = permissions.map(perm => perm.Permission.perm_code);
      setNavItems(items.filter(item => !item.code || codeList.indexOf(item.code) >= 0))

      if (!router.isReady) {
        return;
      }

      // if (open) {
      //   onClose?.();
      // }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [permissions]
  );

  const content = (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        <div>
          <Box sx={{ p: 3 }}>
            <NextLink
              href="/monitormanage"
              passHref
            >
              <a>
                <img width={"100%"} src="/images/logo-big_1.png" />

              </a>
            </NextLink>
          </Box>

        </div>
        <Divider
          sx={{
            borderColor: '#2D3748',
            my: 3
          }}
        />
        <Box sx={{ flexGrow: 1 }}>
          {navItems.map((item) => (
            <NavItem
              key={item.title}
              icon={item.icon}
              href={item.href}
              title={item.title}
              children={item.children}
            />
          ))}
        </Box>
        <Divider sx={{ borderColor: '#2D3748' }} />

      </Box>
    </>
  );

  if (lgUp) {
    return (

      <Drawer
        anchor="left"

        open={open}
        PaperProps={{
          sx: {
            backgroundColor: 'neutral.900',
            color: '#FFFFFF',
            width: 280
          }
        }}
        sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
        variant="persistent"
        transitionDuration={300}
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: 'neutral.900',
          color: '#FFFFFF',
          width: 280
        }
      }}
      transitionDuration={300}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

DashboardSidebar.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  permissions: PropTypes.array
};
