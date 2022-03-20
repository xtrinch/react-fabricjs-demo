import { createStyles, Dialog, Typography, WithStyles, withStyles } from '@material-ui/core';
import ColoredButton from 'components/ColoredButton';
import { clearError, ErrorContext } from 'context/ErrorContext';
import React, { useContext } from 'react';
import ColorsEnum from 'types/ColorsEnum';

const styles = () =>
  createStyles({
    root: {},
    paper: {
      backgroundColor: ColorsEnum.BGLIGHT,
      borderRadius: '0px',
      padding: '20px',
      maxWidth: '300px',
    },
  });

const ErrorBox: React.FunctionComponent<WithStyles<typeof styles>> = (props) => {
  const { classes } = props;

  const [errorContext, dispatchErrorContext] = useContext(ErrorContext);

  return (
    <Dialog
      onClose={() => clearError(dispatchErrorContext)}
      open={!!errorContext.error}
      className={classes.root}
      classes={{
        paper: classes.paper,
      }}
    >
      <Typography variant="h6" style={{ marginBottom: '25px' }}>
        Error
      </Typography>
      <Typography variant="body2" style={{ marginBottom: '30px' }}>
        {errorContext.error?.statusCode} {errorContext.error?.message}
      </Typography>
      <ColoredButton
        onClick={() => clearError(dispatchErrorContext)}
        fullWidth
        colorVariety={ColorsEnum.BLUE}
      >
        Close
      </ColoredButton>
    </Dialog>
  );
};

export default withStyles(styles)(ErrorBox);
