package com.blueskyminds.nonuselection.service;

import com.blueskyminds.nonuselection.model.VoteResult;
import com.blueskyminds.nonuselection.model.Vote;
import com.blueskyminds.nonuselection.model.VoteType;
import com.blueskyminds.nonuselection.dao.VoteDAO;
import com.google.inject.Inject;
import com.wideplay.warp.persist.Transactional;
import org.apache.commons.lang.StringUtils;

/**
 * Date Started: 19/10/2008
 * <p/>
 * Copyright (c) 2008 Blue Sky Minds Pty Ltd
 */
public class VoteServiceImpl implements VoteService {

    private VoteDAO voteDAO;

    @Inject
    public VoteServiceImpl(VoteDAO voteDAO) {
        this.voteDAO = voteDAO;
    }

    @Transactional
    public void castVote(String ipAddress, String country, VoteType voteType) throws VoteServiceException {
        voteDAO.persistVote(new Vote(ipAddress, country, voteType));
        updateVoteResult(country, voteType);
    }


    private void updateVoteResult(String country, VoteType voteType) {
        if (VoteType.Democratic.equals(voteType)) {
            voteDAO.incDemocraticResult(country);
        } else {
            if (VoteType.Republican.equals(voteType)) {
                voteDAO.incRepublicanResult(country);
            }
        }
    }

    @Transactional
    // this shouldn't be necessary: we want en EM, not a transaction, but without it some EMs are reused
    public VoteResult lookupResult(String country) {
        if (StringUtils.isNotBlank(country)) {
            return voteDAO.lookupResult(country);
        } else {
            return voteDAO.lookupResult();
        }
    }

    @Transactional
    public VoteResult lookupResult() {
        return lookupResult(null);
    }

}
