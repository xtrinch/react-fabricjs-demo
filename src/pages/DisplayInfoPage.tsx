import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import { createStyles, WithStyles, withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import SettingsInputAntennaIcon from "@material-ui/icons/SettingsInputAntenna";
import { DisplayContext } from "context/DisplayContext";
import { SensorContext } from "context/SensorContext";
import { format } from "date-fns";
import React, { useContext, useEffect, useState } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import DisplayService from "services/DisplayService";
import ColorsEnum from "types/ColorsEnum";
import { DisplayId } from "types/Display";
import DisplayBoardTypesEnum from "types/DisplayBoardTypesEnum";
import MeasurementTypeEnum, {
  MeasurementTypeLabelsEnum,
} from "types/MeasurementTypeEnum";
import { DATETIME_REGEX } from "utils/date.range";

const styles = (theme) =>
  createStyles({
    paper: {
      marginTop: theme.spacing(30),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      backgroundColor: ColorsEnum.BGLIGHT,
      padding: "30px",
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: "100%", // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
      padding: theme.spacing(6, 0, 6),
    },
  });

const DisplayInfoPage: React.FunctionComponent<
  WithStyles<typeof styles> & RouteComponentProps<{ id: string }>
> = (props) => {
  const {
    classes,
    match: {
      params: { id },
    },
  } = props;

  const errs: { [key: string]: string } = {};
  const [errors, setErrors] = useState(errs);
  const [data, setData] = useState({
    name: "",
    location: "",
    boardType: "" as DisplayBoardTypesEnum,
    timezone: "",
    measurementTypes: [],
    sensorIds: [],
  });

  const [displayContext, displayContextDispatch] = useContext(DisplayContext);
  const [sensorContext] = useContext(SensorContext);

  const [sensor, setDisplay] = useState(null);

  useEffect(() => {
    const getDisplay = async () => {
      const s = await DisplayService.getDisplay((id as unknown) as DisplayId);
      setDisplay(s);
      setData((d) => ({
        ...d,
        name: s.name,
        location: s.location,
        boardType: s.boardType,
        measurementTypes: s.measurementTypes,
        sensorIds: s.sensorIds,
      }));
    };

    getDisplay();
  }, [id]);

  const submitForm = async (e) => {
    e.preventDefault();

    try {
      await displayContext.updateDisplay(
        displayContextDispatch,
        (id as unknown) as DisplayId,
        data
      );
    } catch (e) {
      setErrors(e);
    }
  };

  const fieldChange = (val, fieldName) => {
    data[fieldName] = val;
    setData({ ...data });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <SettingsInputAntennaIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Display board info
        </Typography>
        <form className={classes.form} noValidate onSubmit={submitForm}>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="accessToken"
            name="accessToken"
            label="Display access token"
            disabled
            value={sensor?.sensorAccessToken || ""}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="accessToken"
            name="accessToken"
            label="Last seen at"
            disabled
            value={
              sensor?.lastSeenAt
                ? format(sensor?.lastSeenAt, DATETIME_REGEX)
                : "Never"
            }
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="name"
            label="Display name"
            name="name"
            value={data.name}
            onChange={(e) => fieldChange(e.target.value, "name")}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            name="location"
            label="Location description"
            type="location"
            id="location"
            autoComplete="current-location"
            value={data.location}
            onChange={(e) => fieldChange(e.target.value, "location")}
            error={!!errors.location}
            helperText={errors.location}
          />
          <TextField
            select
            id="select"
            label="Board type"
            variant="outlined"
            margin="normal"
            value={data.boardType}
            onChange={(e) => fieldChange(e.target.value, "boardType")}
            fullWidth
            error={!!errors.boardType}
            helperText={errors.boardType}
          >
            {Object.keys(DisplayBoardTypesEnum).map((key) => (
              <MenuItem key={key} value={key}>
                {DisplayBoardTypesEnum[key]}
              </MenuItem>
            ))}
          </TextField>
          <FormControl variant="outlined" fullWidth margin="normal">
            <InputLabel id="demo-mutiple-name-label">
              Measurement types
            </InputLabel>
            <Select
              labelId="demo-mutiple-name-label"
              id="demo-mutiple-name"
              multiple
              value={data.measurementTypes}
              onChange={(e) => fieldChange(e.target.value, "measurementTypes")}
              error={!!errors.measurementTypes}
            >
              {Object.values(MeasurementTypeEnum).map((key) => (
                <MenuItem key={key} value={key}>
                  {MeasurementTypeLabelsEnum[key]}
                </MenuItem>
              ))}
            </Select>
            {!!errors.measurementTypes && (
              <FormHelperText style={{ color: ColorsEnum.ORANGE }}>
                {errors.measurementTypes}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl variant="outlined" fullWidth margin="normal">
            <InputLabel id="demo-mutiple-name-label">Sensors</InputLabel>
            <Select
              labelId="demo-mutiple-name-label"
              id="demo-mutiple-name"
              multiple
              value={data.sensorIds}
              onChange={(e) => fieldChange(e.target.value, "sensorIds")}
              error={!!errors.sensorIds}
            >
              {sensorContext.sensors.map((sensor) => (
                <MenuItem key={sensor.id} value={sensor.id}>
                  {sensor.name}
                </MenuItem>
              ))}
            </Select>
            {!!errors.sensorIds && (
              <FormHelperText style={{ color: ColorsEnum.ORANGE }}>
                {errors.sensorIds}
              </FormHelperText>
            )}
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            style={{ marginTop: "20px" }}
          >
            Update
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default withRouter(withStyles(styles)(DisplayInfoPage));