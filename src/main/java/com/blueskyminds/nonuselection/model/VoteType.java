package com.blueskyminds.nonuselection.model;

/**
 * Date Started: 19/10/2008
 * <p/>
 * Copyright (c) 2008 Blue Sky Minds Pty Ltd
 */
public enum VoteType {
    Democratic,
    Republican;

    /** Safe conversion from string */
    public static VoteType convertValueOf(String value) {
        if (value != null) {
            for (VoteType type : VoteType.values()) {
                if (type.name().equals(value)) {
                    return type;
                }
            }
        }
        return null;
    }
}
