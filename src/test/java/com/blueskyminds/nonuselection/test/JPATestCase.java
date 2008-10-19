package com.blueskyminds.nonuselection.test;

import junit.framework.TestCase;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.Session;
import com.blueskyminds.homebyfive.framework.core.test.JPATestSupport;
import com.blueskyminds.homebyfive.framework.core.tools.LoggerTools;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import java.util.Properties;
import java.sql.Connection;

/**
 * Superclass for unit tests performed outside an EJB container but using an EntityManager
 *
 * The EntityManagerFactory is created created prior to executing each fixture in setUp().
 * This creates an empty HSQL database for each fixture.  An EntityManager is also created and
 * a new transaction is started.
 * After each fixture this is all closed in tearDown().
 *
 * During setup an EntityManagerFactory is used to create an EM instance and a new transaction is commenced.
 * The same PersistenceUnit must be used for all tests
 *
 * Requires JUnit3
 *
 * Date Started: 6/06/2007
 * <p/>
 * History:
 * <p/>
 * Copyright (c) 2007 Blue Sky Minds Pty Ltd<br/>
 */
public class JPATestCase extends TestCase {

    private static final Log LOG = LogFactory.getLog(JPATestCase.class);

    protected JPATestSupport env;
    protected EntityManager em;

    public JPATestCase(String persistenceUnitName) {
        LoggerTools.configure();
        env = new JPATestSupport(persistenceUnitName);
    }

     /**
     * This method allows properties to be supplied that override the properties defined by the
     * persistence unit
     *
     * @param persistenceUnitProperties   properties to override the default properties of the persistence unit */
    public void setPersistenceUnitProperties(Properties persistenceUnitProperties) {
        env.setPersistenceUnitProperties(persistenceUnitProperties);
    }

    /**
     * Creates an EntityManager and starts a transaction
     * @throws Exception
     */
    protected void setUp() throws Exception {
        super.setUp();
        env.setUp();
        this.em = env.em;
    }

    protected void newTransaction() {
        env.newTransaction();
    }


    protected void tearDown() throws Exception {
        env.tearDown();
        super.tearDown();
    }

    /**
     * Gets the JDBC connection from the hibernate session underlying the EntityManager.
     * If a hibernate persistence provider is not being used this will fail
     * */
    protected Connection getConnection() {
        Session session = (Session) em.getDelegate();
        return session.connection();
    }

    /**
     * Provides access to the EntityManagerFactory that was used to create the current EntityManager.
     * It can be used to object metadata if you can typecast it to an implementation.
     *
     * @return
     */
    protected EntityManagerFactory getEntityManagerFactory() {
        return env.getEntityManagerFactory();
    }
}