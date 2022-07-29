import joi from "joi";

export interface TerminalScreenshotOptions {
  // Data to be render to the terminal.
  readonly data: string;
  // Margin to leave around the terminal area in pixels. (default: 0)
  readonly margin: number;
  // Font family to use in terminal output. (default: Monaco)
  readonly fontFamily: string;
  // Font size (default: 14)
  readonly fontSize: number;
  // Line height (default: 1)
  readonly lineHeight: number;
  // Background color of the terminal. (default: black)
  readonly backgroundColor: string;
  // Device pixel ratio. (default: 1)
  readonly pixelRatio: number;
  // Type of the screenshot to be generated. (default: png)
  readonly type: "png" | "jpeg";
}

export const TerminalScreenshotOptionsSchema = joi.object({
  data: joi.string().required().min(1),
  margin: joi.number().min(1).max(10000).default(0),
  fontFamily: joi.string().min(1).default("Monaco"),
  fontSize: joi.number().default(14),
  lineHeight: joi.number().default(1),
  backgroundColor: joi.string().min(1).default("black"),
  pixelRatio: joi.number().min(1).default(1),
  type: joi.string().valid("png", "jpeg").default("png"),
});
