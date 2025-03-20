import { consoleTransport, logger } from "react-native-logs";

type LogLevel = "trace" | "debug" | "info" | "warn" | "error" | "fatal";

const defaultConfig = {
  levels: {
    trace: 0,
    debug: 1,
    info: 2,
    warn: 3,
    error: 4,
    fatal: 5,
  },
  severity: "debug",
  transport: consoleTransport,
  transportOptions: {
    colors: {
      trace: "whiteBright",
      debug: "cyanBright",
      info: "blueBright",
      warn: "yellowBright",
      error: "redBright",
      fatal: "magentaBright",
    },
    mapLevels: {
      debug: "log",
      info: "info",
      warn: "warn",
      err: "error",
    },
  },
  async: true,
  dateFormat: "time",
  printLevel: true,
  printDate: true,
  fixedExtLvlLength: false,
  enabled: true,
};

const log = logger.createLogger<LogLevel>(defaultConfig);

export { log };
