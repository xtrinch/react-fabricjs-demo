import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import { observer } from 'mobx-react-lite';
import React from 'react';
import ColorsEnum from 'types/ColorsEnum';
import SensorDraggablePage from './SensorDraggablePage';

const styles = () =>
  createStyles({
    '@global': {
      '*::-webkit-scrollbar': {
        width: '0.4em',
      },
      '*::-webkit-scrollbar-track': {
        '-webkit-box-shadow': `inset 0 0 6px ${ColorsEnum.BGDARK}`,
      },
      '*::-webkit-scrollbar-thumb': {
        backgroundColor: ColorsEnum.BGLIGHTER,
        outline: '0px solid slategrey',
      },
    },
  });

const Pages: React.FunctionComponent<WithStyles<typeof styles>> = (props) => {
  return (
    <div>
      <SensorDraggablePage />
    </div>
  );
};

export default withStyles(styles)(observer(Pages));
