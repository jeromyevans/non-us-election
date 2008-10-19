package com.blueskyminds.nonuselection.service;

import com.blueskyminds.nonuselection.model.VoteResult;
import com.blueskyminds.nonuselection.model.VoteType;

/**
 * Date Started: 19/10/2008
 * <p/>
 * Copyright (c) 2008 Blue Sky Minds Pty Ltd
 */
public interface VoteService {

    void castVote(String ipAddress, String country, VoteType voteType) throws VoteServiceException;

    VoteResult lookupResult(String country);

    VoteResult lookupResult();
}
