import { StyledEngineProvider, ThemeProvider } from '@mui/material';
import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import theme from 'layout/Theme';
import { observer } from 'mobx-react-lite';
import Pages from 'pages/Pages';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import ColorsEnum from 'types/ColorsEnum';

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
    app: {
      minHeight: '100vh',
      backgroundColor: ColorsEnum.BGDARK,
      width: '100%',
    },
    main: {
      flex: '1',
    },
  });

const App: React.FunctionComponent<WithStyles<typeof styles>> = (props) => {
  return (
    <BrowserRouter>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <Pages />
        </ThemeProvider>
      </StyledEngineProvider>
    </BrowserRouter>
  );
};

export default withStyles(styles)(observer(App));
