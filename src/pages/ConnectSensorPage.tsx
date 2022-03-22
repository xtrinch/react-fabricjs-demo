import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Close from '@mui/icons-material/Close';
import SettingsInputAntennaIcon from '@mui/icons-material/SettingsInputAntenna';
import SettingsInputHdmiIcon from '@mui/icons-material/SettingsInputHdmi';
import TopBar from 'components/TopBar';
import { useFormik } from 'formik';
import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import SensorService from 'services/SensorService';
import ColorsEnum from 'types/ColorsEnum';
import Sensor, { SensorId } from 'types/Sensor';
import { Port, Serial } from 'utils/serial';
import { ToastContext } from 'context/ToastContext';
import { Toast } from 'types/Toast';

const styles = (theme) =>
  createStyles({
    paper: {
      margin: '30px 0px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: ColorsEnum.BGLIGHT,
      padding: '30px',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
      padding: theme.spacing(6, 0, 6),
    },
    connectButton: {
      backgroundColor: ColorsEnum.GREEN,
      color: ColorsEnum.WHITE,
      marginRight: '20px',
    },
    disconnectButton: {
      backgroundColor: ColorsEnum.ERROR,
      color: ColorsEnum.WHITE,
      marginRight: '20px',
    },
  });

interface ConnectProps {
  accessToken: string;
  timeBetweenMeasurements?: number;
  wifiSSID?: string;
  wifiPassword?: string;
  maxRtcRecords?: number;
}

const ConnectSensorPage: React.FunctionComponent<
  WithStyles<typeof styles> & RouteComponentProps<{ id: string }>
> = (props) => {
  const {
    classes,
    match: {
      params: { id },
    },
  } = props;

  const toastStore = useContext(ToastContext);

  const [sensor, setSensor] = useState<Sensor>(null);

  const send = async () => {
    if (!port) return;

    const data: Uint8Array[] = [];
    const { timeBetweenMeasurements, wifiPassword, wifiSSID, accessToken, maxRtcRecords } =
      formik.values;

    const stringified = JSON.stringify({
      timeBetweenMeasurements,
      wifiPassword,
      wifiSSID,
      accessToken,
      maxRtcRecords,
    });

    data.push(new Uint8Array([...new TextEncoder().encode(stringified), 0]));

    for (const d of data) {
      try {
        await port.send(d.buffer);
        const read = await port.readLoop();

        if (read === 'success') {
          toastStore.addToast(
            new Toast({
              message: 'Successfully configured the device.',
              type: 'success',
            }),
          );
        } else if (read === 'failure') {
          toastStore.addToast(
            new Toast({
              message: 'Failed to configure the device.',
              type: 'failure',
            }),
          );
        }
        console.log('Received:');
        console.log(read);
      } catch (e) {
        console.log(e);
        setPort(null);
      }
    }
  };

  const formik = useFormik<ConnectProps>({
    initialValues: {
      accessToken: sensor?.accessToken,
      wifiSSID: '',
      wifiPassword: '',
      timeBetweenMeasurements: 10,
      maxRtcRecords: 4,
    },
    onSubmit: send,
    enableReinitialize: true,
  });

  useEffect(() => {
    const getSensor = async () => {
      const s = await SensorService.getSensor(id as unknown as SensorId);
      setSensor(s);
    };

    getSensor();
  }, [id]);

  const [port, setPort] = useState<Port>(null);

  const connect = async (pIn: Port) => {
    let p = pIn;
    if (!p) {
      p = await Serial.requestPort();
      setPort(p);
    }
    if (!p) return; // if we still don't have port defined
    try {
      await p.connect();
    } catch (e) {
      console.error(e);
    }
  };

  const disconnect = async () => {
    if (!port) return;

    try {
      await port.disconnect();
    } catch (e) {
      console.error(e);
    }
    setPort(null);
  };

  const checkIfAlreadyConnected = async () => {
    const devices = await Serial.getPorts();
    if (devices.length > 0) {
      setPort(devices[0]);
      await connect(devices[0]);
    }
  };

  useEffect(() => {
    checkIfAlreadyConnected();
  }, []);

  return (
    <>
      <TopBar alignItems="center" backEnabled>
        <Typography component="h1" variant="h5" style={{ marginRight: '30px' }}>
          Device configuration: {sensor?.name}
        </Typography>
        {!port ? (
          <Button
            variant="contained"
            className={classes.connectButton}
            startIcon={<SettingsInputHdmiIcon />}
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => connect(port)}
          >
            Connect to device
          </Button>
        ) : (
          <Button
            variant="contained"
            className={classes.disconnectButton}
            startIcon={<Close />}
            onClick={disconnect}
          >
            Disconnect
          </Button>
        )}
      </TopBar>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <SettingsInputAntennaIcon />
          </Avatar>
          <form className={classes.form} noValidate onSubmit={formik.handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="accessToken"
              name="accessToken"
              label="Sensor access token"
              disabled
              value={sensor?.accessToken || ''}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="WiFi SSID"
              value={formik.values.wifiSSID}
              id="wifiSSID"
              onChange={formik.handleChange}
              disabled={!port}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="WiFi password"
              value={formik.values.wifiPassword}
              id="wifiPassword"
              onChange={formik.handleChange}
              disabled={!port}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              name="location"
              label="Time between measurements (min)"
              type="number"
              value={formik.values.timeBetweenMeasurements}
              id="timeBetweenMeasurements"
              onChange={(e) => formik.setFieldValue('timeBetweenMeasurements', e.target.value)}
              disabled={!port}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              name="location"
              label="Max rtc records (1 for no RTC cache)"
              type="number"
              value={formik.values.maxRtcRecords}
              id="maxRtcRecords"
              onChange={(e) => formik.setFieldValue('maxRtcRecords', e.target.value)}
              disabled={!port}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              style={{ marginTop: '20px' }}
              disabled={!port}
            >
              Send to device
            </Button>
          </form>
        </div>
      </Container>
    </>
  );
};

export default withRouter(withStyles(styles)(ConnectSensorPage));
