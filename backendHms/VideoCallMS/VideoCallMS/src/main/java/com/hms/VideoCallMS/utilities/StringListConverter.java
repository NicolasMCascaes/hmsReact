package com.hms.VideoCallMS.utilities;

import java.util.List;

public class StringListConverter {
    public static String listToString(List<String> list) {
        if (list == null || list.isEmpty()) {
            return "";
        }
        return String.join(",", list);
    }

    public static List<String> stringToList(String str) {
        if (str == null || str.isEmpty()) {
            return List.of();
        }
        return List.of(str.split(","));
    }
}
