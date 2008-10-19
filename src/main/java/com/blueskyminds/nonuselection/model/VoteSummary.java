package com.blueskyminds.nonuselection.model;

import java.util.Date;

/**
 * Date Started: 19/10/2008
 * <p/>
 * Copyright (c) 2008 Blue Sky Minds Pty Ltd
 */
public class VoteSummary {

    private String country;
    private int democratic;
    private int republican;
    private Date timestamp;

    public VoteSummary(VoteResult voteResult) {
        this.country = voteResult.getCountry();
        this.democratic = voteResult.getDemocratic();
        this.republican  = voteResult.getRepublican();
        this.timestamp = voteResult.getTimestamp();
    }

    public VoteSummary(String country, int democratic, int republican, Date timestamp) {
        this.country = country;
        this.democratic = democratic;
        this.republican = republican;
        this.timestamp = timestamp;
    }

    public String getCountry() {
        return country;
    }

    public int getDemocratic() {
        return democratic;
    }

    public int getRepublican() {
        return republican;
    }

    public Date getTimestamp() {
        return timestamp;
    }
}
