package com.blueskyminds.nonuselection.web.actions;

import com.opensymphony.xwork2.ActionSupport;
import com.opensymphony.xwork2.ModelDriven;
import com.blueskyminds.nonuselection.service.VoteService;
import com.blueskyminds.nonuselection.model.VoteResult;
import com.blueskyminds.nonuselection.model.VoteSummary;
import com.google.inject.Inject;
import org.apache.struts2.rest.HttpHeaders;
import org.apache.struts2.rest.DefaultHttpHeaders;

import java.util.Date;

/**
 * Get the current result for a country
 * <p/>
 * Date Started: 19/10/2008
 * <p/>
 * Copyright (c) 2008 Blue Sky Minds Pty Ltd
 */
public class ResultController extends ActionSupport implements ModelDriven<VoteSummary> {

    private VoteService voteService;
    private String id;
    private VoteSummary model;

    public void setId(String id) {
        this.id = id;
    }

    public HttpHeaders index() {
        id = "all";
        return show();
    }

    public HttpHeaders show() {
        VoteResult voteResult = voteService.lookupResult(id);
        if (voteResult != null) {
            model = new VoteSummary(voteResult);
            if (voteResult.getTimestamp() != null) {
                return new DefaultHttpHeaders("success").withStatus(200).withETag(voteResult.getTimestamp().getTime());
            } else {
                return new DefaultHttpHeaders("success").withStatus(200).disableCaching();
            }
        } else {
            model = new VoteSummary(id, 0, 0, new Date());
            return new DefaultHttpHeaders("success").withStatus(200).disableCaching();
        }
    }

    public VoteSummary getModel() {
        return model;
    }

    @Inject
    public void setVoteService(VoteService voteService) {
        this.voteService = voteService;
    }
}
