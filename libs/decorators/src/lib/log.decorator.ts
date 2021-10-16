interface LoggerParams {
  type?: 'log' | 'trace' | 'warn' | 'info' | 'debug';
  inputs?: boolean;
  outputs?: boolean;
}

const defaultParams: Required<LoggerParams> = {
  type: 'debug',
  inputs: true,
  outputs: true,
};

export function Log(params?: LoggerParams) {
  const options: Required<LoggerParams> = {
    type: params?.type || defaultParams.type,
    inputs: params?.inputs === undefined ? defaultParams.inputs : params.inputs,
    outputs: params?.outputs === undefined ? defaultParams.outputs : params.outputs,
  };

  // eslint-disable-next-line @typescript-eslint/ban-types
  return function(target: Function, propertyKey: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;

    descriptor.value = function(...args: never[]) {
      if (options.inputs) {
        console[options.type]('Logged inputs:', args);
      }

      const result = original.apply(this, args);

      if (options.outputs) {
        console[options.type]('Logged outputs', result);
      }

      return result;
    };
  };
}
