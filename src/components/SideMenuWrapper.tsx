import {
  createStyles,
  CssBaseline,
  Drawer,
  Hidden,
  withStyles,
  WithStyles,
} from '@material-ui/core';
import SideMenu from 'components/SideMenu';
import { AppContext } from 'context/AppContext';
import React, { useContext } from 'react';
import ColorsEnum from 'types/ColorsEnum';
import { observer } from 'mobx-react-lite';

const menuWidth = 270;

const styles = (theme) =>
  createStyles({
    drawer: {
      [theme.breakpoints.up('md')]: {
        width: menuWidth,
        flexShrink: 0,
      },
    },
    drawerPaper: {
      backgroundColor: ColorsEnum.BGLIGHT,
    },
  });

const SideMenuWrapper: React.FunctionComponent<WithStyles<typeof styles>> = (props) => {
  const appContext = useContext(AppContext);

  const { classes } = props;

  return (
    <div>
      <CssBaseline />
      <Hidden smDown>
        <Drawer
          variant="permanent"
          anchor="left"
          className={`${classes.drawer}`}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <SideMenu />
        </Drawer>
      </Hidden>
      <Hidden mdUp>
        <Drawer
          variant="temporary"
          anchor="left"
          open={appContext.menuOpen}
          onClose={appContext.drawerToggle}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true,
          }}
        >
          <SideMenu />
        </Drawer>
      </Hidden>
    </div>
  );
};

export default withStyles(styles)(observer(SideMenuWrapper));
