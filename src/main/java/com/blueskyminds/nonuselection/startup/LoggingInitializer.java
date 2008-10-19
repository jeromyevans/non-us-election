package com.blueskyminds.nonuselection.startup;

import com.blueskyminds.homebyfive.framework.core.tools.LoggerTools;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

/**
 * Date Started: 19/10/2008
 * <p/>
 * Copyright (c) 2008 Blue Sky Minds Pty Ltd
 */
public class LoggingInitializer implements ServletContextListener {

    public void contextInitialized(ServletContextEvent sce) {
        LoggerTools.configure();
    }

    public void contextDestroyed(ServletContextEvent sce) {
    }
}
