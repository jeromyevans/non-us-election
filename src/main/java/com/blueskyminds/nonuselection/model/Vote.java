package com.blueskyminds.nonuselection.model;

import com.blueskyminds.homebyfive.framework.core.AbstractEntity;

import javax.persistence.*;
import java.util.Date;

/**
 *
 * A vote cast by a user
 *
 * Date Started: 19/10/2008
 * <p/>
 * Copyright (c) 2008 Blue Sky Minds Pty Ltd
 */
@Entity
@Table(name="Vote")
public class Vote extends AbstractEntity {

    private Date timestamp;
    private String ipAddress;
    private String country;
    private VoteType voteType;

    public Vote(String ipAddress, String country, VoteType voteType) {
        this.ipAddress = ipAddress;
        this.country = country;
        this.voteType = voteType;
        this.timestamp = new Date();
    }

    protected Vote() {
    }

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name="Timestamp")
    public Date getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }

    @Basic
    @Column(name="IPAddress")
    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    @Basic
    @Column(name="Country", length=3)
    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    @Enumerated
    @Column(name="VoteType")
    public VoteType getVoteType() {
        return voteType;
    }

    public void setVoteType(VoteType voteType) {
        this.voteType = voteType;
    }
}
