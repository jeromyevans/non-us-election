package com.blueskyminds.nonuselection.dao;

import com.blueskyminds.homebyfive.framework.core.persistence.jpa.dao.AbstractDAO;
import com.blueskyminds.nonuselection.model.VoteResult;
import com.blueskyminds.nonuselection.model.Vote;
import com.google.inject.Inject;

import javax.persistence.EntityManager;
import javax.persistence.Query;

import org.apache.commons.lang.StringUtils;

import java.util.List;

/**
 * Date Started: 19/10/2008
 * <p/>
 * Copyright (c) 2008 Blue Sky Minds Pty Ltd
 */
public class VoteDAO extends AbstractDAO {

    private static final String QUERY_VOTE_RESULT_BY_COUNTRY = "voteResult.byCountry";
    private static final String QUERY_INC_DEMOCRATIC_RESULT = "voteResult.incDemocratic";
    private static final String QUERY_INC_REPUBLICAN_RESULT = "voteResult.incRepublican";
    private static final String QUERY_VOTES_BY_COUNTRY = "vote.byCountry";

    private static final String PARAM_COUNTRY = "country";
    public static final String ALL_COUNTRIES = "all";


    @Inject
    public VoteDAO(EntityManager entityManager) {
        super(entityManager, VoteResult.class);
    }

    public Vote persistVote(Vote vote) {
        em.persist(vote);
        return vote;
    }

    public VoteResult lookupResult(String country) {
        Query query = em.createNamedQuery(QUERY_VOTE_RESULT_BY_COUNTRY);
        query.setParameter(PARAM_COUNTRY, country);
        return (VoteResult) query.getSingleResult();
    }

    public VoteResult lookupResult() {
        Query query = em.createNamedQuery(QUERY_VOTE_RESULT_BY_COUNTRY);
        query.setParameter(PARAM_COUNTRY, ALL_COUNTRIES);
        return (VoteResult) query.getSingleResult();
    }

    public boolean isNotUS(String country) {
        return ((!"us".equals(country)) && (!"um".equals(country)) && (!"test".equals(country)));
    }

    public void incDemocraticResult(String country) {
        Query query = em.createNamedQuery(QUERY_INC_DEMOCRATIC_RESULT);
        query.setParameter(PARAM_COUNTRY, country);
        query.executeUpdate();

        if (isNotUS(country)) {
            incTotalDemocraticResult();
        }
    }

    private void incTotalDemocraticResult() {
        Query query = em.createNamedQuery(QUERY_INC_DEMOCRATIC_RESULT);
        query.setParameter(PARAM_COUNTRY, ALL_COUNTRIES);
        query.executeUpdate();
    }

    public void incRepublicanResult(String country) {
        Query query = em.createNamedQuery(QUERY_INC_REPUBLICAN_RESULT);
        query.setParameter(PARAM_COUNTRY, country);
        query.executeUpdate();

        if (isNotUS(country)) {
            incTotalRepublicanResult();
        }
    }

    private void incTotalRepublicanResult() {
        Query query = em.createNamedQuery(QUERY_INC_REPUBLICAN_RESULT);
        query.setParameter(PARAM_COUNTRY, ALL_COUNTRIES);
        query.executeUpdate();
    }

    public List<Vote> listVotes(String country) {
        Query query = em.createNamedQuery(QUERY_VOTES_BY_COUNTRY);
        query.setParameter(PARAM_COUNTRY, country);
        return (List<Vote>) query.getResultList();
    }

}
