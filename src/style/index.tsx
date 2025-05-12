import { StyleSheet, Dimensions } from "react-native";

import Colors from "theme/colors";

import { INPUT_HEIGHT } from "config/constant";

export default StyleSheet.create({
    theme_header: {
        backgroundColor: Colors.light,
    },
    theme_content: {
        backgroundColor: Colors.white,
    },
    theme_footer: {
        backgroundColor: Colors.light,
    },
    opacity_0: {
        opacity: 0,
    },
    opacity_1: {
        opacity: 1,
    },
    flex: {
        flex: 1,
    },
    overflow_hidden: {
        overflow: "hidden",
    },
    z_index_1: {
        zIndex: 1,
    },
    z_index_2: {
        zIndex: 2,
    },
    z_index_3: {
        zIndex: 3,
    },
    z_index_4: {
        zIndex: 4,
    },
    z_index_5: {
        zIndex: 5,
    },
    z_index_1000: {
        zIndex: 1000,
    },
    position_relative: {
        position: "relative",
    },
    position_absolute: {
        position: "absolute",
        zIndex: 1,
    },
    top_offset_1: {
        top: 1,
    },
    top_offset_2: {
        top: 2,
    },
    top_offset_3: {
        top: 3,
    },
    top_offset_4: {
        top: 4,
    },
    top_offset_5: {
        top: 5,
    },
    top_offset_10: {
        top: 10,
    },
    top_offset_15: {
        top: 15,
    },
    top: {
        position: "absolute",
        top: 0,
        zIndex: 1,
    },
    right_offset_1: {
        right: 1,
    },
    right_offset_2: {
        right: 2,
    },
    right_offset_3: {
        right: 3,
    },
    right_offset_4: {
        right: 4,
    },
    right_offset_5: {
        right: 5,
    },
    right_offset_10: {
        right: 10,
    },
    right_offset_15: {
        right: 15,
    },
    right: {
        position: "absolute",
        right: 0,
        zIndex: 1,
    },
    bottom_offset_1: {
        bottom: 1,
    },
    bottom_offset_2: {
        bottom: 2,
    },
    bottom_offset_3: {
        bottom: 3,
    },
    bottom_offset_4: {
        bottom: 4,
    },
    bottom_offset_5: {
        bottom: 5,
    },
    bottom_offset_10: {
        bottom: 10,
    },
    bottom_offset_15: {
        bottom: 15,
    },
    bottom: {
        position: "absolute",
        bottom: 0,
        zIndex: 1,
    },
    left: {
        position: "absolute",
        left: 0,
        zIndex: 1,
    },
    top_left: {
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 1,
    },
    top_right: {
        position: "absolute",
        top: 0,
        right: 0,
        zIndex: 1,
    },
    bottom_left: {
        position: "absolute",
        bottom: 0,
        left: 0,
        zIndex: 1,
    },
    bottom_right: {
        position: "absolute",
        bottom: 0,
        right: 0,
        zIndex: 1,
    },
    top_horizontal: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
    },
    left_vertical: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 1,
    },
    bottom_horizontal: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1,
    },
    horizontal: {
        position: "absolute",
        left: 0,
        right: 0,
        zIndex: 1,
    },
    right_vertical: {
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
    },
    absolute_fill: {
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 1,
    },
    no_shadow: {
        shadowOffset: { width: 0, height: 0 },
    },
    shadow: {
        shadowColor: Colors.lightDark,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.7,
        shadowRadius: 3,
        elevation: 3,
    },
    shadow_top: {
        shadowColor: Colors.lightMedium,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.7,
        shadowRadius: 3,
        elevation: 3,
    },
    shadow_bottom: {
        shadowColor: Colors.lightMedium,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.7,
        shadowRadius: 3,
        elevation: 3,
    },
    elevation_0: {
        elevation: 0,
    },
    elevation_1: {
        elevation: 1,
    },
    elevation_2: {
        elevation: 2,
    },
    elevation_3: {
        elevation: 3,
    },
    elevation_4: {
        elevation: 4,
    },
    elevation_5: {
        elevation: 5,
    },
    bg_transparent: {
        backgroundColor: Colors.transparent,
    },
    bg_transparent_1: {
        backgroundColor: Colors.transparent_10,
    },
    bg_transparent_2: {
        backgroundColor: Colors.transparent_20,
    },
    bg_transparent_3: {
        backgroundColor: Colors.transparent_30,
    },
    bg_transparent_4: {
        backgroundColor: Colors.transparent_40,
    },
    bg_transparent_5: {
        backgroundColor: Colors.transparent_50,
    },
    bg_transparent_6: {
        backgroundColor: Colors.transparent_60,
    },
    bg_transparent_7: {
        backgroundColor: Colors.transparent_70,
    },
    bg_transparent_8: {
        backgroundColor: Colors.transparent_80,
    },
    bg_transparent_9: {
        backgroundColor: Colors.transparent_90,
    },
    bg_color_0: {
        backgroundColor: Colors.zero,
    },
    bg_color_1: {
        backgroundColor: Colors.one,
    },
    bg_color_2: {
        backgroundColor: Colors.two,
    },
    bg_color_3: {
        backgroundColor: Colors.three,
    },
    bg_color_4: {
        backgroundColor: Colors.four,
    },
    bg_color_5: {
        backgroundColor: Colors.five,
    },
    bg_color_6: {
        backgroundColor: Colors.six,
    },
    bg_color_7: {
        backgroundColor: Colors.seven,
    },
    bg_color_8: {
        backgroundColor: Colors.eight,
    },
    bg_color_9: {
        backgroundColor: Colors.nine,
    },
    bg_color_10: {
        backgroundColor: Colors.a,
    },
    bg_color_11: {
        backgroundColor: Colors.b,
    },
    bg_color_12: {
        backgroundColor: Colors.c,
    },
    bg_color_13: {
        backgroundColor: Colors.d,
    },
    bg_color_14: {
        backgroundColor: Colors.e,
    },
    bg_color_15: {
        backgroundColor: Colors.f,
    },
    bg_color_15_transparent_1: {
        backgroundColor: "rgba(255,255,255, 0.1)",
    },
    bg_color_15_transparent_2: {
        backgroundColor: "rgba(255,255,255, 0.2)",
    },
    bg_color_15_transparent_3: {
        backgroundColor: "rgba(255,255,255, 0.3)",
    },
    bg_color_15_transparent_4: {
        backgroundColor: "rgba(255,255,255, 0.4)",
    },
    bg_color_15_transparent_5: {
        backgroundColor: "rgba(255,255,255, 0.5)",
    },
    bg_color_15_transparent_6: {
        backgroundColor: "rgba(255,255,255, 0.6)",
    },
    bg_color_15_transparent_7: {
        backgroundColor: "rgba(255,255,255, 0.7)",
    },
    bg_color_15_transparent_8: {
        backgroundColor: "rgba(255,255,255, 0.8)",
    },
    bg_color_15_transparent_9: {
        backgroundColor: "rgba(255,255,255, 0.9)",
    },
    bg_color_light: {
        backgroundColor: Colors.light,
    },
    bg_color_light_medium: {
        backgroundColor: Colors.lightMedium,
    },
    bg_color_light_dark: {
        backgroundColor: Colors.lightDark,
    },
    bg_color_first: {
        backgroundColor: Colors.first,
    },
    bg_color_gray: {
        backgroundColor: Colors.gray,
    },
    bg_color_gray_transparent: {
        backgroundColor: "rgba(248,248,248, 0.75)",
    },
    bg_color_blue_light: {
        backgroundColor: Colors.blueLight,
    },
    bg_color_blue: {
        backgroundColor: Colors.blue,
    },
    bg_color_dark: {
        backgroundColor: Colors.dark,
    },
    bg_color_dark_light: {
        backgroundColor: Colors.darkLight,
    },
    bg_color_dark_medium: {
        backgroundColor: Colors.darkMedium,
    },
    bg_color_dark_bold: {
        backgroundColor: Colors.darkBold,
    },
    bg_color_link: {
        backgroundColor: Colors.link,
    },
    bg_color_alipay: {
        backgroundColor: Colors.alipay,
    },
    bg_color_facebook: {
        backgroundColor: Colors.facebook,
    },
    bg_color_google: {
        backgroundColor: Colors.google,
    },
    bg_color_sms_ios: {
        backgroundColor: Colors.sms_ios,
    },
    bg_color_sms_android: {
        backgroundColor: Colors.sms_android,
    },
    bg_color_primary: {
        backgroundColor: Colors.primary,
    },
    bg_color_secondary: {
        backgroundColor: Colors.secondary,
    },
    bg_color_success: {
        backgroundColor: Colors.success,
    },
    bg_color_info: {
        backgroundColor: Colors.info,
    },
    bg_color_warning: {
        backgroundColor: Colors.warning,
    },
    bg_color_danger: {
        backgroundColor: Colors.danger,
    },
    f_color_default: {
        color: Colors.default,
    },
    f_color_0: {
        color: Colors.zero,
    },
    f_color_1: {
        color: Colors.one,
    },
    f_color_2: {
        color: Colors.two,
    },
    f_color_3: {
        color: Colors.three,
    },
    f_color_4: {
        color: Colors.four,
    },
    f_color_5: {
        color: Colors.five,
    },
    f_color_6: {
        color: Colors.six,
    },
    f_color_7: {
        color: Colors.seven,
    },
    f_color_8: {
        color: Colors.eight,
    },
    f_color_9: {
        color: Colors.nine,
    },
    f_color_10: {
        color: Colors.a,
    },
    f_color_11: {
        color: Colors.b,
    },
    f_color_12: {
        color: Colors.c,
    },
    f_color_13: {
        color: Colors.d,
    },
    f_color_14: {
        color: Colors.e,
    },
    f_color_15: {
        color: Colors.f,
    },
    f_color_15_transparent_1: {
        color: "rgba(255,255,255, 0.1)",
    },
    f_color_15_transparent_2: {
        color: "rgba(255,255,255, 0.2)",
    },
    f_color_15_transparent_3: {
        color: "rgba(255,255,255, 0.3)",
    },
    f_color_15_transparent_4: {
        color: "rgba(255,255,255, 0.4)",
    },
    f_color_15_transparent_5: {
        color: "rgba(255,255,255, 0.5)",
    },
    f_color_15_transparent_6: {
        color: "rgba(255,255,255, 0.6)",
    },
    f_color_15_transparent_7: {
        color: "rgba(255,255,255, 0.7)",
    },
    f_color_15_transparent_8: {
        color: "rgba(255,255,255, 0.8)",
    },
    f_color_15_transparent_9: {
        color: "rgba(255,255,255, 0.9)",
    },
    f_color_first: {
        color: Colors.first,
    },
    f_color_gray: {
        color: Colors.gray,
    },
    f_color_gray_dark: {
        color: Colors.grayDark,
    },
    f_color_blue_light: {
        color: Colors.blueLight,
    },
    f_color_blue: {
        color: Colors.blue,
    },
    f_color_light: {
        color: Colors.light,
    },
    f_color_light_medium: {
        color: Colors.lightMedium,
    },
    f_color_light_dark: {
        color: Colors.lightDark,
    },
    f_color_dark: {
        color: Colors.dark,
    },
    f_color_dark_light: {
        color: Colors.darkLight,
    },
    f_color_dark_medium: {
        color: Colors.darkMedium,
    },
    f_color_dark_bold: {
        color: Colors.darkBold,
    },
    f_color_primary: {
        color: Colors.primary,
    },
    f_color_secondary: {
        color: Colors.secondary,
    },
    f_color_success: {
        color: Colors.success,
    },
    f_color_info: {
        color: Colors.info,
    },
    f_color_warning: {
        color: Colors.warning,
    },
    f_color_danger: {
        color: Colors.danger,
    },
    f_color_label: {
        color: Colors.label,
    },
    f_color_caption: {
        color: Colors.caption,
    },
    f_color_link: {
        color: Colors.link,
    },
    f_color_check: {
        color: Colors.check,
    },
    f_color_btn: {
        color: Colors.button,
    },
    f_color_alipay: {
        color: Colors.alipay,
    },
    f_color_facebook: {
        color: Colors.facebook,
    },
    f_color_google: {
        color: Colors.google,
    },
    f_color_feed: {
        color: "#1EA1F1",
    },
    f_color_feed_image: {
        color: "#FE0084",
    },
    f_color_feed_video: {
        color: "#FF0000",
    },
    f_color_feed_article: {
        color: "#03a87c",
    },
    f_color_feed_link: {
        color: "#F1C260",
    },
    f_size_default: {
        fontSize: 16,
    },
    f_size_5: {
        fontSize: 5,
    },
    f_size_6: {
        fontSize: 6,
    },
    f_size_7: {
        fontSize: 7,
    },
    f_size_8: {
        fontSize: 8,
    },
    f_size_9: {
        fontSize: 9,
    },
    f_size_10: {
        fontSize: 10,
    },
    f_size_11: {
        fontSize: 11,
    },
    f_size_12: {
        fontSize: 12,
    },
    f_size_13: {
        fontSize: 13,
    },
    f_size_14: {
        fontSize: 14,
    },
    f_size_15: {
        fontSize: 15,
    },
    f_size_16: {
        fontSize: 16,
    },
    f_size_17: {
        fontSize: 17,
    },
    f_size_18: {
        fontSize: 18,
    },
    f_size_19: {
        fontSize: 19,
    },
    f_size_20: {
        fontSize: 20,
    },
    f_size_21: {
        fontSize: 21,
    },
    f_size_22: {
        fontSize: 22,
    },
    f_size_23: {
        fontSize: 23,
    },
    f_size_24: {
        fontSize: 24,
    },
    f_size_25: {
        fontSize: 25,
    },
    f_size_26: {
        fontSize: 26,
    },
    f_size_27: {
        fontSize: 27,
    },
    f_size_28: {
        fontSize: 28,
    },
    f_size_29: {
        fontSize: 29,
    },
    f_size_30: {
        fontSize: 30,
    },
    f_size_35: {
        fontSize: 35,
    },
    f_size_40: {
        fontSize: 40,
    },
    f_size_45: {
        fontSize: 45,
    },
    f_size_50: {
        fontSize: 50,
    },
    f_size_55: {
        fontSize: 55,
    },
    f_size_60: {
        fontSize: 60,
    },
    f_size_70: {
        fontSize: 70,
    },
    f_size_80: {
        fontSize: 80,
    },
    f_size_90: {
        fontSize: 90,
    },
    f_size_100: {
        fontSize: 100,
    },
    f_regular: {
        fontWeight: "400",
    },
    f_bold: {
        fontWeight: "500",
    },
    f_bolder: {
        fontWeight: "600",
    },
    f_weight_default: {
        fontWeight: "400",
    },
    f_weight_400: {
        fontWeight: "400",
    },
    f_weight_500: {
        fontWeight: "500",
    },
    f_weight_600: {
        fontWeight: "600",
    },
    f_style_italic: {
        fontStyle: "italic",
    },
    l_h_default: {
        lineHeight: 20,
    },
    l_h_0: {
        lineHeight: 0,
    },
    l_h_1: {
        lineHeight: 5,
    },
    l_h_2: {
        lineHeight: 10,
    },
    l_h_3: {
        lineHeight: 15,
    },
    l_h_4: {
        lineHeight: 20,
    },
    l_h_5: {
        lineHeight: 25,
    },
    l_h_6: {
        lineHeight: 30,
    },
    l_h_7: {
        lineHeight: 35,
    },
    l_h_8: {
        lineHeight: 40,
    },
    f_ls_0: {
        letterSpacing: 0,
    },
    f_ls_27: {
        letterSpacing: 0.27,
    },
    f_ls_56: {
        letterSpacing: 0.56,
    },
    p_0: {
        padding: 0,
    },
    p_1: {
        padding: 5,
    },
    p_2: {
        padding: 10,
    },
    p_3: {
        padding: 15,
    },
    p_4: {
        padding: 20,
    },
    p_5: {
        padding: 25,
    },
    p_6: {
        padding: 30,
    },
    p_7: {
        padding: 35,
    },
    p_8: {
        padding: 40,
    },
    p_h_0: {
        paddingLeft: 0,
        paddingRight: 0,
    },
    p_h_1: {
        paddingLeft: 5,
        paddingRight: 5,
    },
    p_h_2: {
        paddingLeft: 10,
        paddingRight: 10,
    },
    p_h_3: {
        paddingLeft: 15,
        paddingRight: 15,
    },
    p_h_4: {
        paddingLeft: 20,
        paddingRight: 20,
    },
    p_h_5: {
        paddingLeft: 25,
        paddingRight: 25,
    },
    p_h_6: {
        paddingLeft: 30,
        paddingRight: 30,
    },
    p_h_7: {
        paddingLeft: 35,
        paddingRight: 35,
    },
    p_h_8: {
        paddingLeft: 40,
        paddingRight: 40,
    },
    p_v_0: {
        paddingTop: 0,
        paddingBottom: 0,
    },
    p_v_1: {
        paddingTop: 5,
        paddingBottom: 5,
    },
    p_v_2: {
        paddingTop: 10,
        paddingBottom: 10,
    },
    p_v_3: {
        paddingTop: 15,
        paddingBottom: 15,
    },
    p_v_4: {
        paddingTop: 20,
        paddingBottom: 20,
    },
    p_v_5: {
        paddingTop: 25,
        paddingBottom: 25,
    },
    p_v_6: {
        paddingTop: 30,
        paddingBottom: 30,
    },
    p_t_0: {
        paddingTop: 0,
    },
    p_t_1: {
        paddingTop: 5,
    },
    p_t_2: {
        paddingTop: 10,
    },
    p_t_3: {
        paddingTop: 15,
    },
    p_t_4: {
        paddingTop: 20,
    },
    p_t_5: {
        paddingTop: 25,
    },
    p_t_6: {
        paddingTop: 30,
    },
    p_t_7: {
        paddingTop: 35,
    },
    p_t_8: {
        paddingTop: 40,
    },
    p_r_0: {
        paddingRight: 0,
    },
    p_r_1: {
        paddingRight: 5,
    },
    p_r_2: {
        paddingRight: 10,
    },
    p_r_3: {
        paddingRight: 15,
    },
    p_r_4: {
        paddingRight: 20,
    },
    p_r_5: {
        paddingRight: 25,
    },
    p_r_6: {
        paddingRight: 30,
    },
    p_r_7: {
        paddingRight: 35,
    },
    p_r_8: {
        paddingRight: 40,
    },
    p_r_9: {
        paddingRight: 45,
    },
    p_r_10: {
        paddingRight: 50,
    },
    p_b_0: {
        paddingBottom: 0,
    },
    p_b_1: {
        paddingBottom: 5,
    },
    p_b_2: {
        paddingBottom: 10,
    },
    p_b_3: {
        paddingBottom: 15,
    },
    p_b_4: {
        paddingBottom: 20,
    },
    p_b_5: {
        paddingBottom: 25,
    },
    p_b_6: {
        paddingBottom: 30,
    },
    p_b_7: {
        paddingBottom: 35,
    },
    p_b_8: {
        paddingBottom: 40,
    },
    p_b_9: {
        paddingBottom: 45,
    },
    p_b_10: {
        paddingBottom: 50,
    },
    p_b_15: {
        paddingBottom: 75,
    },
    p_b_20: {
        paddingBottom: 100,
    },
    p_l_1: {
        paddingLeft: 5,
    },
    p_l_2: {
        paddingLeft: 10,
    },
    p_l_3: {
        paddingLeft: 15,
    },
    p_l_4: {
        paddingLeft: 20,
    },
    p_l_5: {
        paddingLeft: 25,
    },
    p_l_6: {
        paddingLeft: 30,
    },
    p_l_7: {
        paddingLeft: 35,
    },
    p_l_8: {
        paddingLeft: 40,
    },
    p_l_9: {
        paddingLeft: 45,
    },
    p_l_10: {
        paddingLeft: 50,
    },
    m_0: {
        margin: 0,
    },
    m_1: {
        margin: 5,
    },
    m_2: {
        margin: 10,
    },
    m_3: {
        margin: 15,
    },
    m_4: {
        margin: 20,
    },
    m_5: {
        margin: 25,
    },
    m_6: {
        margin: 30,
    },
    m_t_0: {
        marginTop: 0,
    },
    m_t_1: {
        marginTop: 5,
    },
    m_t_2: {
        marginTop: 10,
    },
    m_t_3: {
        marginTop: 15,
    },
    m_t_4: {
        marginTop: 20,
    },
    m_t_5: {
        marginTop: 25,
    },
    m_t_6: {
        marginTop: 30,
    },
    m_t_7: {
        marginTop: 35,
    },
    m_t_8: {
        marginTop: 40,
    },
    m_t_9: {
        marginTop: 45,
    },
    m_t_10: {
        marginTop: 50,
    },
    m_r_0: {
        marginRight: 0,
    },
    m_r_1: {
        marginRight: 5,
    },
    m_r_2: {
        marginRight: 10,
    },
    m_r_3: {
        marginRight: 15,
    },
    m_r_4: {
        marginRight: 20,
    },
    m_r_5: {
        marginRight: 25,
    },
    m_r_6: {
        marginRight: 30,
    },
    m_r_7: {
        marginRight: 35,
    },
    m_r_8: {
        marginRight: 40,
    },
    m_b_0: {
        marginBottom: 0,
    },
    m_b_1: {
        marginBottom: 5,
    },
    m_b_2: {
        marginBottom: 10,
    },
    m_b_3: {
        marginBottom: 15,
    },
    m_b_4: {
        marginBottom: 20,
    },
    m_b_5: {
        marginBottom: 25,
    },
    m_b_6: {
        marginBottom: 30,
    },
    m_b_7: {
        marginBottom: 35,
    },
    m_b_8: {
        marginBottom: 40,
    },
    m_b_9: {
        marginBottom: 45,
    },
    m_b_10: {
        marginBottom: 50,
    },
    m_l_0: {
        marginLeft: 0,
    },
    m_l_1: {
        marginLeft: 5,
    },
    m_l_2: {
        marginLeft: 10,
    },
    m_l_3: {
        marginLeft: 15,
    },
    m_l_4: {
        marginLeft: 20,
    },
    m_l_5: {
        marginLeft: 25,
    },
    m_l_6: {
        marginLeft: 30,
    },
    m_l_7: {
        marginLeft: 35,
    },
    m_l_8: {
        marginLeft: 40,
    },
    m_l_9: {
        marginLeft: 45,
    },
    m_l_10: {
        marginLeft: 50,
    },
    m_h_0: {
        marginLeft: 0,
        marginRight: 0,
    },
    m_h_1: {
        marginLeft: 5,
        marginRight: 5,
    },
    m_h_2: {
        marginLeft: 10,
        marginRight: 10,
    },
    m_h_3: {
        marginLeft: 15,
        marginRight: 15,
    },
    m_h_4: {
        marginLeft: 20,
        marginRight: 20,
    },
    m_h_5: {
        marginLeft: 25,
        marginRight: 25,
    },
    m_h_6: {
        marginLeft: 30,
        marginRight: 30,
    },
    m_v_0: {
        marginTop: 0,
        marginBottom: 0,
    },
    m_v_1: {
        marginTop: 5,
        marginBottom: 5,
    },
    m_v_2: {
        marginTop: 10,
        marginBottom: 10,
    },
    m_v_3: {
        marginTop: 15,
        marginBottom: 15,
    },
    m_v_4: {
        marginTop: 20,
        marginBottom: 20,
    },
    m_v_5: {
        marginTop: 25,
        marginBottom: 25,
    },
    m_v_6: {
        marginTop: 30,
        marginBottom: 30,
    },
    w_auto: {
        width: "auto",
    },
    w_p100: {
        width: "100%",
    },
    w_p95: {
        width: "95%",
    },
    w_p90: {
        width: "90%",
    },
    w_p85: {
        width: "85%",
    },
    w_p80: {
        width: "80%",
    },
    w_p75: {
        width: "75%",
    },
    w_p70: {
        width: "70%",
    },
    w_p65: {
        width: "65%",
    },
    w_p60: {
        width: "60%",
    },
    w_p55: {
        width: "55%",
    },
    w_p50: {
        width: "50%",
    },
    w_p47: {
        width: "47%",
    },
    w_p45: {
        width: "45%",
    },
    w_p40: {
        width: "40%",
    },
    w_p35: {
        width: "35%",
    },
    w_p30: {
        width: "30%",
    },
    w_p25: {
        width: "25%",
    },
    w_p20: {
        width: "20%",
    },
    w_p15: {
        width: "15%",
    },
    w_p10: {
        width: "10%",
    },
    w_p5: {
        width: "5%",
    },
    h_p100: {
        height: "100%",
    },
    h_p99: {
        height: "99%",
    },
    h_p98: {
        height: "98%",
    },
    h_p97: {
        height: "97%",
    },
    h_p96: {
        height: "96%",
    },
    h_p95: {
        height: "95%",
    },
    h_p90: {
        height: "90%",
    },
    h_p85: {
        height: "85%",
    },
    h_p80: {
        height: "80%",
    },
    h_p75: {
        height: "75%",
    },
    h_p70: {
        height: "70%",
    },
    h_p65: {
        height: "65%",
    },
    h_p60: {
        height: "60%",
    },
    h_p55: {
        height: "55%",
    },
    h_p50: {
        height: "50%",
    },
    h_p45: {
        height: "45%",
    },
    h_p40: {
        height: "40%",
    },
    h_p35: {
        height: "35%",
    },
    h_p30: {
        height: "30%",
    },
    h_p25: {
        height: "25%",
    },
    h_p20: {
        height: "20%",
    },
    h_p15: {
        height: "15%",
    },
    h_p10: {
        height: "10%",
    },
    h_p5: {
        height: "5%",
    },
    offset_2_5: {
        marginLeft: Dimensions.get("window").width * 0.025,
    },
    offset_5: {
        marginLeft: Dimensions.get("window").width * 0.05,
    },
    offset_10: {
        marginLeft: Dimensions.get("window").width * 0.1,
    },
    offset_15: {
        marginLeft: Dimensions.get("window").width * 0.15,
    },
    offset_20: {
        marginLeft: Dimensions.get("window").width * 0.2,
    },
    offset_25: {
        marginLeft: Dimensions.get("window").width * 0.25,
    },
    offset_30: {
        marginLeft: Dimensions.get("window").width * 0.3,
    },
    offset_35: {
        marginLeft: Dimensions.get("window").width * 0.35,
    },
    offset_40: {
        marginLeft: Dimensions.get("window").width * 0.4,
    },
    offset_45: {
        marginLeft: Dimensions.get("window").width * 0.45,
    },
    offset_50: {
        marginLeft: Dimensions.get("window").width * 0.5,
    },
    offset_55: {
        marginLeft: Dimensions.get("window").width * 0.55,
    },
    offset_60: {
        marginLeft: Dimensions.get("window").width * 0.6,
    },
    offset_65: {
        marginLeft: Dimensions.get("window").width * 0.65,
    },
    offset_70: {
        marginLeft: Dimensions.get("window").width * 0.7,
    },
    offset_75: {
        marginLeft: Dimensions.get("window").width * 0.75,
    },
    offset_80: {
        marginLeft: Dimensions.get("window").width * 0.8,
    },
    offset_85: {
        marginLeft: Dimensions.get("window").width * 0.85,
    },
    offset_90: {
        marginLeft: Dimensions.get("window").width * 0.9,
    },
    offset_95: {
        marginLeft: Dimensions.get("window").width * 0.95,
    },
    w_100: {
        width: Dimensions.get("window").width,
    },
    w_95: {
        width: Dimensions.get("window").width * 0.95,
    },
    w_90: {
        width: Dimensions.get("window").width * 0.9,
    },
    w_85: {
        width: Dimensions.get("window").width * 0.85,
    },
    w_80: {
        width: Dimensions.get("window").width * 0.8,
    },
    w_75: {
        width: Dimensions.get("window").width * 0.75,
    },
    w_70: {
        width: Dimensions.get("window").width * 0.7,
    },
    w_65: {
        width: Dimensions.get("window").width * 0.65,
    },
    w_60: {
        width: Dimensions.get("window").width * 0.6,
    },
    w_55: {
        width: Dimensions.get("window").width * 0.55,
    },
    w_50: {
        width: Dimensions.get("window").width * 0.5,
    },
    w_45: {
        width: Dimensions.get("window").width * 0.45,
    },
    w_40: {
        width: Dimensions.get("window").width * 0.4,
    },
    w_35: {
        width: Dimensions.get("window").width * 0.35,
    },
    w_30: {
        width: Dimensions.get("window").width * 0.3,
    },
    w_25: {
        width: Dimensions.get("window").width * 0.25,
    },
    w_20: {
        width: Dimensions.get("window").width * 0.2,
    },
    w_15: {
        width: Dimensions.get("window").width * 0.15,
    },
    w_10: {
        width: Dimensions.get("window").width * 0.1,
    },
    w_5: {
        width: Dimensions.get("window").width * 0.05,
    },
    w_0: {
        width: 0,
    },
    h_fill: {
        height: Dimensions.get("window").height,
    },
    h_100: {
        height: Dimensions.get("window").height,
    },
    h_95: {
        height: Dimensions.get("window").width / 1.05263158,
    },
    h_90: {
        height: Dimensions.get("window").width / 1.11111111,
    },
    h_85: {
        height: Dimensions.get("window").width / 1.17647059,
    },
    h_80: {
        height: Dimensions.get("window").width / 1.25,
    },
    h_75: {
        height: Dimensions.get("window").width / 1.33333333,
    },
    h_70: {
        height: Dimensions.get("window").width / 1.42857143,
    },
    h_65: {
        height: Dimensions.get("window").width / 1.53846154,
    },
    h_60: {
        height: Dimensions.get("window").width / 1.66666667,
    },
    h_55: {
        height: Dimensions.get("window").width / 1.81818182,
    },
    h_50: {
        height: Dimensions.get("window").width / 2,
    },
    h_45: {
        height: Dimensions.get("window").width / 2.22222222,
    },
    h_40: {
        height: Dimensions.get("window").width / 2.5,
    },
    h_35: {
        height: Dimensions.get("window").width / 2.85714286,
    },
    h_30: {
        height: Dimensions.get("window").width / 3.33333333,
    },
    h_25: {
        height: Dimensions.get("window").width / 4,
    },
    h_20: {
        height: Dimensions.get("window").width / 5,
    },
    h_15: {
        height: Dimensions.get("window").width / 6.6666667,
    },
    h_10: {
        height: Dimensions.get("window").width / 10,
    },
    h_5: {
        height: Dimensions.get("window").width / 15,
    },
    h_4: {
        height: 4,
    },
    h_3: {
        height: 3,
    },
    h_2: {
        height: 2,
    },
    h_1: {
        height: 1,
    },
    h_0: {
        height: 0,
    },
    border_round_0: {
        borderRadius: 0,
    },
    border_round_1: {
        borderRadius: 5,
    },
    border_round_2: {
        borderRadius: 10,
    },
    border_round_3: {
        borderRadius: 15,
    },
    border_round_4: {
        borderRadius: 20,
    },
    border_round_5: {
        borderRadius: 25,
    },
    border_round_6: {
        borderRadius: 30,
    },
    border_round_7: {
        borderRadius: 35,
    },
    border_round_8: {
        borderRadius: 40,
    },
    border_round_9: {
        borderRadius: 45,
    },
    border_round_10: {
        borderRadius: 50,
    },
    border_round_top_1: {
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
    },
    border_round_left_1: {
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
    },
    border_round_right_1: {
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
    },
    border_round_top_2: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    border_round_top_3: {
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    border_round_top_4: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    border_round_top_5: {
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    },
    border_round_top_6: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
    border_round_bottom_1: {
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
    },
    border_round_bottom_2: {
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    border_round_bottom_3: {
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
    },
    border_round_bottom_4: {
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    border_round_bottom_5: {
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
    },
    border_round_bottom_6: {
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    noborder: {
        borderWidth: 0,
    },
    b_15: {
        borderWidth: 1,
        borderColor: Colors.f,
        borderStyle: "solid",
    },
    b_14: {
        borderWidth: 1,
        borderColor: Colors.e,
        borderStyle: "solid",
    },
    b_13: {
        borderWidth: 1,
        borderColor: Colors.d,
        borderStyle: "solid",
    },
    b: {
        borderWidth: 1,
        borderColor: Colors.d,
        borderStyle: "solid",
    },
    b_primary: {
        borderWidth: 1,
        borderColor: Colors.primary,
        borderStyle: "solid",
    },
    b_success: {
        borderWidth: 1,
        borderColor: Colors.success,
        borderStyle: "solid",
    },
    b_warning: {
        borderWidth: 1,
        borderColor: Colors.warning,
        borderStyle: "solid",
    },
    b_gray: {
        borderWidth: 1,
        borderColor: Colors.gray,
        borderStyle: "solid",
    },
    b_half: {
        borderWidth: 0.5,
        borderColor: Colors.d,
        borderStyle: "solid",
    },
    b_3: {
        borderWidth: 1,
        borderColor: Colors.three,
        borderStyle: "solid",
    },
    b_img: {
        borderWidth: 1,
        borderColor: Colors.lightDark,
        borderStyle: "dashed",
    },
    b_feed: {
        borderWidth: 1,
        borderColor: Colors.four,
        borderStyle: "solid",
    },
    b_t_0: {
        borderTopWidth: 0,
    },
    b_v: {
        borderTopWidth: 1,
        borderTopColor: Colors.ef,
        borderBottomWidth: 1,
        borderBottomColor: Colors.ef,
        borderStyle: "solid",
    },
    b_t: {
        borderTopWidth: 1,
        borderTopColor: Colors.ef,
        borderStyle: "solid",
    },
    b_t_14: {
        borderTopWidth: 1,
        borderTopColor: Colors.e,
        borderStyle: "solid",
    },
    b_t_15: {
        borderTopWidth: 1,
        borderTopColor: Colors.f,
        borderStyle: "solid",
    },
    b_t_light: {
        borderTopWidth: 1,
        borderTopColor: Colors.light,
        borderStyle: "solid",
    },
    b_t_light_medium: {
        borderTopWidth: 1,
        borderTopColor: Colors.lightMedium,
        borderStyle: "solid",
    },
    b_light_medium_dashed: {
        borderWidth: 1,
        borderColor: Colors.lightMedium,
        borderStyle: "dashed",
    },
    b_t_light_dark: {
        borderTopWidth: 1,
        borderTopColor: Colors.lightDark,
        borderStyle: "solid",
    },
    b_l_14: {
        borderLeftWidth: 1,
        borderLeftColor: Colors.e,
        borderStyle: "solid",
    },
    b_l_13: {
        borderLeftWidth: 1,
        borderLeftColor: Colors.d,
        borderStyle: "solid",
    },
    b_l_light_medium: {
        borderLeftWidth: 1,
        borderTopColor: Colors.lightMedium,
        borderStyle: "solid",
    },
    b_r_13: {
        borderRightWidth: 1,
        borderRightColor: Colors.d,
        borderStyle: "solid",
    },
    b_r_14: {
        borderRightWidth: 1,
        borderRightColor: Colors.e,
        borderStyle: "solid",
    },
    b_r_light_medium: {
        borderRightWidth: 1,
        borderRightColor: Colors.lightMedium,
        borderStyle: "solid",
    },
    b_facebook: {
        borderWidth: 1,
        borderColor: Colors.facebook,
        borderStyle: "solid",
    },
    b_first: {
        borderWidth: 1,
        borderColor: Colors.first,
        borderStyle: "solid",
    },
    b_light: {
        borderWidth: 1,
        borderColor: Colors.light,
        borderStyle: "solid",
    },
    b_light_medium: {
        borderWidth: 1,
        borderColor: Colors.lightMedium,
        borderStyle: "solid",
    },
    b_light_dark: {
        borderWidth: 1,
        borderColor: Colors.lightDark,
        borderStyle: "solid",
    },
    b_b: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.e,
        borderStyle: "solid",
    },
    b_b_0: {
        borderBottomWidth: 0,
    },
    b_b_13: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.d,
        borderStyle: "solid",
    },
    b_b_light: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.light,
        borderStyle: "solid",
    },
    b_b_light_medium: {
        borderBottomWidth: 1,
        borderColor: Colors.lightMedium,
        borderStyle: "solid",
    },
    b_b_light_medium_dashed: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.lightMedium,
        borderStyle: "dashed",
    },
    img_cover: {
        resizeMode: "cover",
    },
    img_contain: {
        resizeMode: "contain",
    },
    hidden: {
        display: "none",
    },
    row: {
        display: "flex",
        flexDirection: "row",
    },
    row_reverse: {
        display: "flex",
        flexDirection: "row-reverse",
    },
    column: {
        display: "flex",
        flexDirection: "column",
    },
    column_reverse: {
        display: "flex",
        flexDirection: "column-reverse",
    },
    text_capital: {
        textTransform: "capitalize",
    },
    text_left: {
        textAlign: "left",
    },
    text_center: {
        textAlign: "center",
    },
    text_right: {
        textAlign: "right",
    },
    text_v_top: {
        textAlignVertical: "top",
    },
    text_v_center: {
        textAlignVertical: "center",
    },
    text_v_bottom: {
        textAlignVertical: "bottom",
    },
    row_center: {
        justifyContent: "center",
    },
    row_between: {
        justifyContent: "space-between",
    },
    row_around: {
        justifyContent: "space-around",
    },
    row_evenly: {
        justifyContent: "space-evenly",
    },
    row_start: {
        justifyContent: "flex-start",
    },
    row_end: {
        justifyContent: "flex-end",
    },
    column_center: {
        alignItems: "center",
    },
    column_start: {
        alignItems: "flex-start",
    },
    column_end: {
        alignItems: "flex-end",
    },
    column_stretch: {
        alignItems: "stretch",
    },
    h_center: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    v_center: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    wrap: {
        flexWrap: "wrap",
    },
    no_wrap: {
        flexWrap: "nowrap",
    },
    flexGrow_0: {
        flexGrow: 0,
    },
    flexGrow_1: {
        flexGrow: 1,
    },
    flexGrow_2: {
        flexGrow: 2,
    },
    swiper: {
        height: 240,
    },
    input: {
        width: "100%",
        height: INPUT_HEIGHT,
        backgroundColor: Colors.transparent,
        fontSize: 16,
        color: Colors.darkMedium,
        borderWidth: 0,
        paddingHorizontal: 10,
        paddingVertical: 5,
        margin: 0,
    },
    textarea_h: {
        height: 100,
    },
    rotate45: {
        transform: [{ rotateX: "45deg" }, { rotateZ: "0.785398rad" }],
    },
    no_underline: {
        textDecorationLine: "none",
    },
    underline: {
        textDecorationLine: "underline",
    },
    linethrough: {
        textDecorationLine: "line-through",
    },
});
