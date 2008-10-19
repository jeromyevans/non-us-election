package com.blueskyminds.nonuselection.service;

import com.blueskyminds.nonuselection.test.JPATestCase;
import com.blueskyminds.nonuselection.dao.VoteDAO;
import com.blueskyminds.nonuselection.model.Vote;
import com.blueskyminds.nonuselection.model.VoteType;
import com.blueskyminds.nonuselection.model.VoteResult;
import com.blueskyminds.homebyfive.framework.core.persistence.jdbc.PersistenceTools;
import com.blueskyminds.homebyfive.framework.core.tools.ResourceTools;

import java.util.List;

/**
 * Date Started: 19/10/2008
 * <p/>
 * Copyright (c) 2008 Blue Sky Minds Pty Ltd
 */
public class TestVoteService extends JPATestCase {

    private static final String PERSISTENCE_UNIT = "TestNonUSElectionDB";

    private VoteDAO voteDAO;
    private VoteService voteService;

    public TestVoteService() {
        super(PERSISTENCE_UNIT);

    }

    protected void setUp() throws Exception {
        super.setUp();
        voteDAO = new VoteDAO(em);
        voteService = new VoteServiceImpl(voteDAO);
        PersistenceTools.executeUpdate(getConnection(), ResourceTools.openStream("zeroVotes.sql"));
    }

    public void testPersistVote() throws Exception {
        voteService.castVote("192.168.1.102", "au", VoteType.Democratic);
        voteService.castVote("192.168.1.102", "au", VoteType.Republican);
        voteService.castVote("192.168.1.102", "nz", VoteType.Republican);
        voteService.castVote("192.168.1.102", "au", VoteType.Republican);

        VoteResult voteResult1 = voteService.lookupResult("au");

        assertEquals(1, voteResult1.getDemocratic());
        assertEquals(2, voteResult1.getRepublican());

        VoteResult voteResult2 = voteService.lookupResult("nz");

        assertEquals(0, voteResult2.getDemocratic());
        assertEquals(1, voteResult2.getRepublican());

        VoteResult voteResult3 = voteService.lookupResult();

        assertEquals(1, voteResult3.getDemocratic());
        assertEquals(3, voteResult3.getRepublican());

    }
}
