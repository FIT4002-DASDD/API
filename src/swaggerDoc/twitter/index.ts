import { ad } from "./ad.swagger";
import { bot } from "./bot.swagger";
import { tag } from "./tag.swagger";
import { stat } from "./stat.swagger";

const twitterSwagger = { ...ad, ...bot, ...stat, ...tag };

export { twitterSwagger };
