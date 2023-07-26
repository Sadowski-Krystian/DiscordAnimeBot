import { Command } from "./interfaces/Command";
import * as allComands from "./reExport"
import { Hello } from "./CommandsFile/Hello";
import { Help } from "./CommandsFile/Help";

export const Commands: Command[] = [Help, Hello];