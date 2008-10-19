package com.blueskyminds.nonuselection.model;

import org.apache.struts2.util.StrutsTypeConverter;

import java.util.Map;

/**
 * Date Started: 19/10/2008
 * <p/>
 * Copyright (c) 2008 Blue Sky Minds Pty Ltd
 */
public class VoteTypeConverter extends StrutsTypeConverter {

    public Object convertFromString(Map context, String[] values, Class toClass) {
        if (values != null) {
            String value;
            if (values.length > 0) {
                value = values[0];
                return VoteType.convertValueOf(value);
            }
        }
        return null;
    }

    public String convertToString(Map context, Object o) {
        if (o != null) {
            if (o instanceof VoteType) {
                return ((VoteType) o).name();
            }
        }
        return null;
    }
}
