package com.blueskyminds.nonuselection.web.actions.poll;

import com.opensymphony.xwork2.ActionSupport;
import com.blueskyminds.nonuselection.model.VoteType;
import com.blueskyminds.nonuselection.model.Countries;
import com.blueskyminds.nonuselection.service.VoteService;
import com.blueskyminds.nonuselection.service.VoteServiceException;
import com.google.inject.Inject;
import org.apache.struts2.rest.HttpHeaders;
import org.apache.struts2.rest.DefaultHttpHeaders;
import org.apache.struts2.interceptor.ServletRequestAware;
import org.apache.struts2.config.Results;
import org.apache.struts2.config.Result;
import org.apache.struts2.dispatcher.HttpHeaderResult;
import org.apache.commons.lang.StringUtils;

import javax.servlet.http.HttpServletRequest;

/**
 * Date Started: 19/10/2008
 * <p/>
 * Copyright (c) 2008 Blue Sky Minds Pty Ltd
 */
@Results({
    @Result(name = "success", type = HttpHeaderResult.class, value = "200"),
    @Result(name = "error", type = HttpHeaderResult.class, value = "400")
        })
public class VoteController extends ActionSupport implements ServletRequestAware {

    private VoteService voteService;
    private String country;
    private VoteType party;
    private HttpServletRequest request;

    public void setCountry(String country) {
        this.country = country;
    }

    public void setParty(VoteType party) {
        this.party = party;
    }

    public HttpHeaders create() {
        try {
            if (StringUtils.isNotBlank(country)) {
                if (Countries.isValid(country)) {
                    if (party != null) {
                        voteService.castVote(request.getRemoteAddr(), country, party);
                        return new DefaultHttpHeaders("success").withStatus(200);
                    }
                }
            }
            return new DefaultHttpHeaders("error");
        } catch (VoteServiceException e) {
            return new DefaultHttpHeaders("error");
        }
    }

    @Inject
    public void setVoteService(VoteService voteService) {
        this.voteService = voteService;
    }

    public void setServletRequest(HttpServletRequest request) {
        this.request = request;
    }
}
