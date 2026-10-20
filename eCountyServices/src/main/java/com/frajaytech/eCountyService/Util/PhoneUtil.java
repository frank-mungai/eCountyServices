package com.frajaytech.eCountyService.Util;

public final class PhoneUtil {
    private PhoneUtil() {}

    /** 0712345678 / 254712345678 / +254712345678 -> +254712345678. Non-phone input is returned unchanged. */
    public static String normalize(String raw) {
        if (raw == null) return "";
        String s = raw.trim().replaceAll("[\\s\\-()]", "");
        if (!s.matches("^\\+?[0-9]+$")) return s;       // an email or an ID with letters, not a phone number
        if (s.startsWith("+")) return s;
        if (s.startsWith("254")) return "+" + s;
        if (s.startsWith("0")) return "+254" + s.substring(1);
        return "+254" + s;
    }
}
