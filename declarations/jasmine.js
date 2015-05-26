declare var describe: (text: string, callback: Function) => void;
declare var it: (text: string, callback: Function) => void;
declare var expect: (value: any) => {
  toBe: Function,
  toEqual: Function,
  not: {
    toBe: Function,
    toEqual: Function
  }
};
