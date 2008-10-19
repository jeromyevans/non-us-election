package com.blueskyminds.nonuselection.startup;

import com.blueskyminds.nonuselection.service.VoteService;
import com.blueskyminds.nonuselection.service.VoteServiceImpl;
import com.blueskyminds.nonuselection.dao.VoteDAO;
import com.blueskyminds.homebyfive.framework.core.tools.PropertiesContext;
import com.blueskyminds.homebyfive.framework.core.guice.SchemaMigrationInitializer;
import com.blueskyminds.homebyfive.framework.core.guice.ExtendedGuiceModule;
import com.blueskyminds.homebyfive.framework.core.guice.PersistenceServiceInitializer;
import com.google.inject.name.Names;
import com.wideplay.warp.persist.PersistenceService;
import com.wideplay.warp.persist.UnitOfWork;
import com.wideplay.warp.jpa.JpaUnit;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.util.Map;
import java.util.Properties;

/**
 * Date Started: 19/10/2008
 * <p/>
 * Copyright (c) 2008 Blue Sky Minds Pty Ltd
 */
public class GuiceModule extends ExtendedGuiceModule {

    private static final Log LOG = LogFactory.getLog(GuiceModule.class);

    protected void configure() {
        LOG.info("Setting up binding...");

        install(PersistenceService.usingJpa().across(UnitOfWork.TRANSACTION).buildModule());
        bindConstant().annotatedWith(JpaUnit.class).to("NonUSElectionDB");

        // setup the persistence unit when guice is initialised
        bind(PersistenceServiceInitializer.class).asEagerSingleton();

        // setup the schema migration
        bind(SchemaMigrationInitializer.class).asEagerSingleton();

        bind(VoteService.class).to(VoteServiceImpl.class) ;
        bind(VoteDAO.class);

        bindConstants();
    }

    private void bindConstants() {
        // read the properties and bind them as constants
        Properties properties = PropertiesContext.loadPropertiesFile("nonuselection.properties");
        for (Map.Entry entry : properties.entrySet()) {
            bindConstant().annotatedWith(Names.named((String) entry.getKey())).to((String) entry.getValue());
        }
    }
}
