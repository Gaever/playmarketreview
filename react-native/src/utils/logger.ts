import {logger as rnLogger} from 'react-native-logs';
export const logger = rnLogger.createLogger({
  transportOptions: {
    colors: {
      error: 'redBright',
    },
  },
});
