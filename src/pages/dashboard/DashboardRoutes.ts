import { DisplayId } from 'types/Display';
import { ForwarderId } from 'types/Forwarder';
import { RadioId } from 'types/Radio';
import { SensorId } from 'types/Sensor';

export const DashboardRoutes = {
  DASHBOARD: '/dashboard',
  ADD_SENSOR: '/dashboard/add-sensor',
  CONNECT_SENSOR: '/dashboard/sensors/:id/connect',
  ADD_DISPLAY: '/dashboard/add-display',
  ADD_FORWARDER: '/dashboard/add-forwarder',
  ADD_RADIO: '/dashboard/add-radio',
  SENSOR: '/dashboard/sensors/:id',
  DISPLAY: '/dashboard/displays/:id',
  FORWARDER: '/dashboard/forwarders/:id',
  RADIO: '/dashboard/radios/:id',
  DISPLAY_LIST: '/dashboard/displays',
  FORWARDER_LIST: '/dashboard/forwarders',
  RADIO_LIST: '/dashboard/radios',
  TOPIC_BY_TAG: '/dashboard/static/:tag',
};

export const getSensorRoute = (id: SensorId) => `/dashboard/sensors/${id}`;
export const getConnectSensorRoute = (id: SensorId) => `/dashboard/sensors/${id}/connect`;
export const getDisplayRoute = (id: DisplayId) => `/dashboard/displays/${id}`;
export const getForwarderRoute = (id: ForwarderId) => `/dashboard/forwarders/${id}`;
export const getRadioRoute = (id: RadioId) => `/dashboard/radios/${id}`;
