import _ from "lodash";

import { createIconSet } from "react-native-vector-icons";

import Iconfont from "assets/font/iconfont/iconfont.json";

let glyphMap = {};

_.map(
    Iconfont.glyphs,
    (glyph) => (glyphMap[glyph.font_class] = glyph.unicode_decimal)
);

const iconSet = createIconSet(glyphMap, "iconfont", "iconfont.ttf");

export default iconSet;

export const Button = iconSet.Button;
export const TabBarItem = iconSet.TabBarItem;
export const TabBarItemIOS = iconSet.TabBarItemIOS;
export const ToolbarAndroid = iconSet.ToolbarAndroid;
export const getImageSource = iconSet.getImageSource;
