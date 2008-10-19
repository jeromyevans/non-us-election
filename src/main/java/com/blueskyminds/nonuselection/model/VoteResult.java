package com.blueskyminds.nonuselection.model;

import com.blueskyminds.homebyfive.framework.core.AbstractEntity;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.PrePersist;
import java.util.Date;

/**
 * Date Started: 19/10/2008
 * <p/>
 * Copyright (c) 2008 Blue Sky Minds Pty Ltd
 */
@Entity
@Table(name="VoteResult")
public class VoteResult extends AbstractEntity {

    private Date timestamp;
    private String country;
    private int democratic;
    private int republican;

    public VoteResult() {
        democratic = 0;
        republican = 0;
    }

    public Date getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public int getDemocratic() {
        return democratic;
    }

    public void setDemocratic(int democratic) {
        this.democratic = democratic;
    }

    public int getRepublican() {
        return republican;
    }

    public void setRepublican(int republican) {
        this.republican = republican;
    }

    @PrePersist
    void prePersist() {
        timestamp = new Date();
    }
}
