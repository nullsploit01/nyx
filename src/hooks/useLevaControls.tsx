import { useControls } from 'leva';
import { useMemo } from 'react';

type Primitive = number | boolean | string;
type Vector = number[];

type LevaValue = Primitive | Vector;

type LevaControl<T extends LevaValue = LevaValue> =
  | T
  | {
      value: T;
      min?: number;
      max?: number;
      step?: number;
      options?: T extends string ? T[] : never;
    };

type ControlsConfig = Record<string, LevaControl>;

type ExtractControlValue<T> = T extends { value: infer V } ? V : T;

type ControlsValues<T extends ControlsConfig> = {
  [K in keyof T]: ExtractControlValue<T[K]>;
};

export function useLevaControls<T extends ControlsConfig>(
  folderName: string,
  controls: T,
): ControlsValues<T> {
  const schema = useMemo(() => controls, [controls]);

  return useControls(folderName, schema) as ControlsValues<T>;
}
