import { AccountContext, AccountContextState } from "context/AccountContext";
import { addToast } from "context/ToastContext";
import React, { createContext, useContext, useEffect, useReducer } from "react";
import SensorService from "services/SensorService";
import Sensor, { SensorId } from "types/Sensor";
import { Toast } from "types/Toast";

export const reloadSensors = async (
  dispatch: React.Dispatch<any>,
  accountContext: AccountContextState
) => {
  try {
    let resp = await SensorService.listSensors({ page: 1, limit: 1000 });
    let sensorData = resp.items;
    let mySensorData;
    console.log(accountContext.loginState);
    if (accountContext.loginState === "LOGGED_IN") {
      sensorData.map((s) => {
        s.visible = false;
        if (s.userId === accountContext.user?.id) {
          s.visible = true;
        }
        return s;
      });
    }

    dispatch({
      type: "sensorsReady",
      payload: sensorData,
    });
  } catch (error) {
    console.log(error);
  }
};

export const reloadMySensors = async (dispatch: React.Dispatch<any>) => {
  const resp = await SensorService.listMySensors();
  resp.items.map((s) => {
    s.visible = true;
    return s;
  });
  const mySensorData = resp.items;

  dispatch({
    type: "mySensorsReady",
    payload: mySensorData,
  });
};

export const addSensor = async (
  dispatch: React.Dispatch<any>,
  sensor: Partial<Sensor>,
  toastDispatch: React.Dispatch<any>
): Promise<Sensor> => {
  const s = await SensorService.addSensor(sensor);

  dispatch({
    type: "addSensor",
    payload: s,
  });

  addToast(
    toastDispatch,
    new Toast({ message: "Successfully added a sensor", type: "success" })
  );

  return s;
};

export const updateSensor = async (
  dispatch: React.Dispatch<any>,
  id: SensorId,
  sensor: Partial<Sensor>,
  toastDispatch: React.Dispatch<any>
): Promise<Sensor> => {
  const s = await SensorService.updateSensor(id, sensor);

  dispatch({
    type: "updateSensor",
    payload: s,
  });

  addToast(
    toastDispatch,
    new Toast({ message: "Successfully updated the sensor", type: "success" })
  );

  return s;
};

export const deleteSensor = async (
  dispatch: React.Dispatch<any>,
  id: SensorId,
  toastDispatch: React.Dispatch<any>
): Promise<boolean> => {
  await SensorService.deleteSensor(id);

  dispatch({
    type: "deleteSensor",
    payload: id,
  });

  addToast(
    toastDispatch,
    new Toast({ message: "Successfully deleted the sensor", type: "success" })
  );

  return true;
};

type SensorContextState = {
  sensorsLoaded: boolean;
  sensors: Sensor[];
  mySensors: Sensor[];
};

const initialState: SensorContextState = {
  sensors: [],
  mySensors: [],
  sensorsLoaded: false,
};

export type SensorActionTypes =
  | { type: "sensorsReady"; payload: Sensor[] }
  | { type: "updateSensor"; payload: Sensor }
  | { type: "addSensor"; payload: Sensor }
  | { type: "deleteSensor"; payload: SensorId }
  | { type: "mySensorsReady"; payload: Sensor[] };

const SensorContext = createContext<[SensorContextState, React.Dispatch<any>]>(
  null
);

let reducer = (
  state: SensorContextState,
  action: SensorActionTypes
): SensorContextState => {
  switch (action.type) {
    case "sensorsReady":
      return { ...state, sensors: action.payload, sensorsLoaded: true };
    case "mySensorsReady":
      return { ...state, mySensors: action.payload, sensorsLoaded: true };
    case "updateSensor":
      const sensors = state.sensors;
      const sensorIndex = sensors.findIndex((s) => s.id === action.payload.id);
      sensors[sensorIndex] = action.payload;
      return { ...state, sensors: [...sensors] };
    case "deleteSensor":
      const deleteMySensorIndex = state.mySensors.findIndex(
        (s) => s.id === action.payload
      );
      state.mySensors.splice(deleteMySensorIndex, 1);
      const deleteSensorIndex = state.sensors.findIndex(
        (s) => s.id === action.payload
      );
      state.sensors.splice(deleteSensorIndex, 1);
      return { ...state };
    case "addSensor":
      return { ...state, sensors: [...state.sensors, action.payload] };
    default: {
      return { ...state, sensors: [] };
    }
  }
};

function SensorContextProvider(props) {
  let [state, dispatch] = useReducer(reducer, initialState);
  let [accountContext] = useContext(AccountContext);

  useEffect(() => {
    if (!state.sensorsLoaded) {
      reloadSensors(dispatch, accountContext);
      if (accountContext.loginState === "LOGGED_IN") {
        reloadMySensors(dispatch);
      }
    }
  }, [state, accountContext]); // The empty array causes this effect to only run on mount

  return (
    <SensorContext.Provider value={[state, dispatch]}>
      {props.children}
    </SensorContext.Provider>
  );
}

export { SensorContext, SensorContextProvider };
