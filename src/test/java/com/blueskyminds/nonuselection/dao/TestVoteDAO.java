package com.blueskyminds.nonuselection.dao;

import com.blueskyminds.nonuselection.test.JPATestCase;
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
public class TestVoteDAO extends JPATestCase {

    private static final String PERSISTENCE_UNIT = "TestNonUSElectionDB";

    private VoteDAO voteDAO;

    public TestVoteDAO() {
        super(PERSISTENCE_UNIT);

    }

    protected void setUp() throws Exception {
        super.setUp();
        voteDAO = new VoteDAO(em);
        PersistenceTools.executeUpdate(getConnection(), ResourceTools.openStream("zeroVotes.sql"));
    }

    public void testPersistVote() throws Exception {
        Vote vote1 = new Vote("192.168.1.102", "au", VoteType.Democratic);
        voteDAO.persistVote(vote1);
        Vote vote2 = new Vote("192.168.1.102", "au", VoteType.Republican);
        voteDAO.persistVote(vote2);
        Vote vote3 = new Vote("192.168.1.102", "nz", VoteType.Democratic);
        voteDAO.persistVote(vote3);

        List<Vote> votes = voteDAO.listVotes("au");
        assertEquals(2, votes.size());

        List<Vote> votes2 = voteDAO.listVotes("nz");
        assertEquals(1, votes2.size());
    }

    public void testVoteResult() throws Exception {
        voteDAO.incDemocraticResult("au");
        voteDAO.incDemocraticResult("au");
        voteDAO.incDemocraticResult("nz");
        voteDAO.incRepublicanResult("au");

        VoteResult voteResult1 = voteDAO.lookupResult("au");
        assertEquals(2, voteResult1.getDemocratic());

        VoteResult voteResult2 = voteDAO.lookupResult("au");
        assertEquals(1, voteResult2.getRepublican());

        VoteResult voteResult3 = voteDAO.lookupResult("nz");
        assertEquals(1, voteResult3.getDemocratic());

        VoteResult voteResult4 = voteDAO.lookupResult("nz");
        assertEquals(0, voteResult4.getRepublican());
    }
}
