package com.blueskyminds.nonuselection.test;

import junit.framework.TestCase;
import org.apache.commons.lang.WordUtils;
import com.blueskyminds.homebyfive.framework.core.tools.ResourceTools;
import com.Ostermiller.util.CSVParser;

/**
 * Date Started: 20/10/2008
 * <p/>
 * Copyright (c) 2008 Blue Sky Minds Pty Ltd
 */
public class TestLowercaseCountries extends TestCase {

    public void testToLowercase() throws Exception {
        CSVParser csvParser = new CSVParser(ResourceTools.openStream("countriesUpper.csv"));

        String[] values;
        while ((values = csvParser.getLine()) != null) {
            StringBuilder result = new StringBuilder("\"");
            String name = WordUtils.capitalizeFully(values[0]);
            if (name.contains(" And ")) {
                name = name.replace(" And ", " and ");
            }

            if (name.contains(" Of ")) {
                name = name.replace(" Of ", " of ");
            }

            if (name.contains(" The ")) {
                name = name.replace(" The ", " the ");
            }

            if (name.endsWith(" Of")) {
                name = name.replace(" Of", " of ");
            }

            result.append(name);

            result.append("\",\"");
            result.append(values[1].toLowerCase());
            result.append("\"");
            System.out.println(result.toString());
        }

    }
}
