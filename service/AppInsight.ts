import {
  ApplicationInsights,
  SeverityLevel,
} from "@microsoft/applicationinsights-web";

export const appInsights = new ApplicationInsights({
  config: {
    instrumentationKey: "98acce6e-8ee3-467a-b4f3-510bb335b9df",
  },
});

export const logDebug = (message: string, payload?: any) => {
  try {
    appInsights.trackTrace({
      properties: payload ? payload : {},
      message,
      severityLevel: SeverityLevel.Verbose,
    });
  } finally {
    if (payload) {
      console.debug(`${message}`, payload);
    } else {
      console.debug(`${message}`);
    }
  }
};

export const logError = (id: string, error: Error, payload?: any) => {
  try {
    appInsights.trackException({
      id,
      properties: payload ? payload : {},
      severityLevel: SeverityLevel.Error,
      exception: error,
    });
  } finally {
    if (payload) {
      console.error(`${id} - ${error}`, payload);
    } else {
      console.error(`${id} - ${error}`);
    }
  }
};
