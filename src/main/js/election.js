/*global YAHOO,blueskyminds,document*/
(function() {
    var Dom = YAHOO.util.Dom;
    var Event = YAHOO.util.Event;
    var COOKIE_NAME = "voted";
    var SIGNATURE = "sbwm";
    var ALL_COUNTRIES = "all";
    var countryNames;

    /**
     * @description count of the number of results currently rendered, used for layout
     */
    var resultCount = 0;

    /** @description Render a single vertical var with one section empty and one section filled using the ratio provided */
    var renderBar = function(barEl, ratio) {
        var MAX_EMs = 10;

        var filledHeight = (MAX_EMs * ratio);
        var emptyHeight = (MAX_EMs - filledHeight);

        var percent = ("" + Math.round(ratio * 100)).substr(0, 4) + "%";

        var emptyBarEl = Dom.getElementsByClassName("empty", "div", barEl)[0];
        var filledBarEl = Dom.getElementsByClassName("filled", "div", barEl)[0];

        if (ratio > 0) {
            Dom.setStyle(emptyBarEl, "height", emptyHeight + "em");
            Dom.setStyle(filledBarEl, "height", filledHeight + "em");
            Dom.setStyle(filledBarEl, "display", "block");
        } else {
            Dom.setStyle(emptyBarEl, "height", MAX_EMs + "em");
            Dom.setStyle(filledBarEl, "display", "none");
        }

        if (filledHeight > 1) {
            blueskyminds.dom.clearHTML(emptyBarEl);
            blueskyminds.dom.insertHTML(filledBarEl, percent);
        } else {
            blueskyminds.dom.clearHTML(filledBarEl);
            blueskyminds.dom.insertHTML(emptyBarEl, percent);
        }
    };

    /** Initialise the list of countries */
    var initCountryNames = function() {
        var countryLookup = Dom.get("country");
        var option;
        countryNames = {};
        if (countryLookup) {
            for (var i = 0; i < countryLookup.options.length; i++) {
                option = countryLookup.options[i];
                if (option.value) {
                    countryNames[option.value] = option.text;
                }
            }
        }
    };

    /**
     * Lookup the country names from the options
     */
    var lookupCountryName = function(country) {
        var result;
        if (!countryNames) {
            initCountryNames();
        }

        try {
            result = countryNames[country];
            if (!result) {
                result = "???";
            }
        } catch (e) {
            result = "???";
        }
        return result;
    };


    /**
     * @description prepares the result element.  If the element already exists for the country it's resused
     * Increments the resultCount if appropriate
     */
    var prepareElement = function(voteResult) {
        var id = voteResult.country + "_";
        // check if the result already exists
        var resultEl = Dom.get(id);
        var newResultEl;
        if (resultEl) {
            // purge the old one and reuse it
            newResultEl = resultEl;
            if (Dom.getStyle(newResultEl, "display") === "none") {
                // recount the result for layout
                resultCount += 1;
            }
            // hide it for now: we don't want to count it in the layout
            Dom.setStyle(newResultEl, "display", "none");
        } else {
            var templateEl = Dom.get("resultTemplate");
            if (templateEl) {
                newResultEl = templateEl.cloneNode(true);

                // count the additional result for layout
                resultCount += 1;
            }
        }

        if (newResultEl) {
            newResultEl.setAttribute("id", id);
        }

        return newResultEl;
    };

    /**
     * @description render the result on the current page
     */
    var renderResult = function(voteResult, newResultEl) {

        var resultsEl = Dom.get("results");
        if (resultsEl) {
            var totalVotes = voteResult.democratic + voteResult.republican;
            var d;
            var r;
            if (totalVotes > 0) {
                d = Math.round(voteResult.democratic / totalVotes * 100) / 100;
                r = Math.round((1 - d) * 100) / 100;
            } else {
                d = 0;
                r = 0;
            }

            var democraticBar = Dom.getElementsByClassName("democraticBar", "div", newResultEl)[0];
            renderBar(democraticBar, d);

            var republicanBar = Dom.getElementsByClassName("republicanBar", "div", newResultEl)[0];
            renderBar(republicanBar, r);

            var countryName = lookupCountryName(voteResult.country);

            var title = Dom.getElementsByClassName("country", "h2", newResultEl)[0];
            blueskyminds.dom.insertHTML(title, countryName);
            var voteCount = Dom.getElementsByClassName("voteCount", "h3", newResultEl)[0];
            blueskyminds.dom.insertHTML(voteCount, "(" + totalVotes + " votes)");

            // insert/move into the last row
            var lastRowEl = Dom.getElementsByClassName("last-row", "div", resultsEl)[0];
            lastRowEl.appendChild(newResultEl);
            Dom.setStyle(newResultEl, "display", "block");
            resultCount += 1;
        }
    };

    /**
     * @description center aligns the results within the viewport
     */
    var layoutViewport = function() {
        var resultsEl = Dom.get("results");
        if (resultsEl) {
            var RESULT_WIDTH;
            if (YAHOO.env.ua.ie) {
                RESULT_WIDTH = 12 * 13.3333;  // 10 + 2 padding em's
            } else {
                RESULT_WIDTH = 12 * 13;  // 10 + 2 padding em's
            }
            var viewPortWidth = Dom.getViewportWidth();

            var maxResultsPerLine = (Math.floor(viewPortWidth / RESULT_WIDTH) - 1) || 1;
            var resultsRequired = (resultCount || 1);
            var resultsIncluded = 0;
            var rows = [];
            var resultsThisLine;
            var rowNo = 0;
            // calculate how many results need to be included on each line until all results
            // are accounted for
            do {
                resultsThisLine = Math.min(maxResultsPerLine, resultsRequired - resultsIncluded);
                if (resultsThisLine > 0) {
                    rows[rowNo] = resultsThisLine;
                    resultsIncluded += resultsThisLine;
                }
                rowNo += 1;
            } while (resultsIncluded < resultsRequired);


            resultCount = 0;
            // create/delete rows and move results up to the previous row if necessaru

            var rowElements = Dom.getElementsByClassName("row", "div", resultsEl);
            var resultElements;
            var gap = 0;
            for (rowNo = 0; rowNo < rowElements.length; rowNo++) {
                var visibleResults = [];
                resultElements = Dom.getElementsByClassName("result", "div", rowElements[rowNo], function(el) {
                    if (Dom.getStyle(el, "display") !== "none") {
                        visibleResults.push(el);
                    }
                });

                resultCount += visibleResults.length;

                if (gap > 0) {
                    // move results to the previous row
                    var resultNo;
                    for (resultNo = 0; resultNo < gap; resultNo++) {
                        rowElements[rowNo - 1].appendChild(resultElements[resultNo]);
                    }
                } else {
                    if (visibleResults.length < rows[rowNo]) {
                        gap = rows[rowNo] - visibleResults.length;
                    }
                }
            }

            if (rowElements.length > rows.length) {
                // purge the unnecessary row elements
                for (rowNo = rows.length; rowNo < rowElements.length; rowNo++) {
                    Event.purgeElement(rowElements[rowNo]);
                    resultsEl.removeChild(rowElements[rowNo]);
                }
            } else {
                // create new row elements
                if (rowElements.length < rows.length) {
                    for (rowNo = rowElements.length; rowNo < rows.length; rowNo++) {
                        var newRowEl = document.createElement("div");
                        newRowEl.setAttribute("id", "row" + rowNo);
                        newRowEl.setAttribute("class", "row");
                        resultsEl.appendChild(newRowEl);
                    }
                }
            }

            // set the left padding of each row to center it
            for (rowNo = 0; rowNo < rows.length; rowNo++) {
                var rowEl = Dom.get("row" + rowNo);
                Dom.setStyle(rowEl, "margin-left", Math.floor((viewPortWidth / 2 ) - (rows[rowNo] * RESULT_WIDTH / 2)) + "px");
                if (rowNo === rows.length - 1) {
                    Dom.addClass(rowEl, "last-row");
                } else {
                    Dom.removeClass(rowEl, "last-row");
                }
            }
        }
    };

    var resultCallback = {
        success: function(o) {
            var voteResult;
            try {
                voteResult = YAHOO.lang.JSON.parse(o.responseText);
            } catch(e1) {
                blueskyminds.events.fire("error", "The response from the server was invalid.  The data was not valid JSON. Message: " + e1.message);
            }
            try {
                if (YAHOO.lang.isObject(voteResult)) {
                    // todo: confirm that it matches the expected interface
                    var resultEl = prepareElement(voteResult);
                    layoutViewport();
                    renderResult(voteResult, resultEl);
                } else {
                    blueskyminds.events.fire("error", "The response from the server was invalid.");
                }
            } catch(e2) {
                blueskyminds.events.fire("error", "A client-side exception occured while updating the page. Message: " + e2.message);
            }
        },
        failure: function(o) {
            blueskyminds.events.fire("error", "An error occurred communicating with the server: " + blueskyminds.net.errorMessage(o));
        },
        cache: false
    };

    var loadResults = function(country) {
        if (country) {
            YAHOO.util.Connect.asyncRequest('GET', "poll/result/" + country + ".json", resultCallback);
        } else {
            YAHOO.util.Connect.asyncRequest('GET', "poll/result.json", resultCallback);
        }
    };

    var resultFormHandler = {
        invoke : function(event, target, formEl) {
            var country = formEl.country;
            if (YAHOO.lang.isValue(country.value)) {
                loadResults(country.value);
            }
        }
    };

    function showVoteForm() {
        Dom.setStyle("voteTemplate", "display", "block");
    }

    function hideVoteForm() {
        Dom.setStyle("voteTemplate", "display", "none");
    }

    var voteCallback = {
        /**
         * this is the country code
         * @param o
         */
        success: function(o) {
            YAHOO.util.Cookie.set(COOKIE_NAME, true, {expires: blueskyminds.calendar.inOneYear()});
            hideVoteForm();
            Dom.get("voteSubmit").disabled = false;
            if (this !== ALL_COUNTRIES) {
                loadResults(ALL_COUNTRIES);
            }
            loadResults(this);
        },
        failure: function(o) {
            blueskyminds.events.fire("error", "An error occurred communicating with the server: " + blueskyminds.net.errorMessage(o));
        }
    };

    var voteFormHandler = {
        invoke : function(event, target, formEl) {
            var Connect = YAHOO.util.Connect;
            Connect.resetFormState();
            formEl.action = "poll/vote";
            Connect.setForm(formEl);
            // setup a header for future http requests that includes the token
            Connect.initHeader("X-AuthToken", SIGNATURE, true);
            Connect.asyncRequest('POST', "poll/vote", {
                success: voteCallback.success,
                failure: voteCallback.failure,
                scope: formEl.country.value
            });
            return true;
        }
    };

    var voteFormListener = function(e) {
        var voted = YAHOO.util.Cookie.get(COOKIE_NAME);
        if (!voted) {
            var firstVoteEl = Dom.get("firstVote");
            var partyEl = Dom.get("party");
            var voteCountryEl = Dom.get("voteCountry");
            if (firstVoteEl.checked) {
                if (partyEl.selectedIndex > 0) {
                    if (voteCountryEl.selectedIndex > 0) {
                        Dom.get("voteSubmit").disabled = false;
                        return;
                    }
                }
            }
        }
        Dom.get("voteSubmit").disabled = true;
    };

    /**
     * @description replaces the default close-parent command with one the updates the resultCount
     */
    var closeResultCommand = {
        canHandle: function(event, target) {
            return Dom.hasClass(target, "close-result");
        },
        invoke : function(event, target) {
            // find the closeable ancestor and hide it
            var closeableEl = Dom.getAncestorByClassName(target, "bsm-closeable");
            if (closeableEl) {
                blueskyminds.ui.effects.hide(closeableEl);
                resultCount--;
                layoutViewport();
            }
            return true; // block other commands
        }
    };

    var onResizeListener = function(e) {
        layoutViewport();
    };

    var setupListeners = function() {
        blueskyminds.ui.forms.registerHandlerForForm("resultForm", resultFormHandler);
        Event.addListener("firstVote", "change", voteFormListener);
        Event.addListener("party", "change", voteFormListener);
        Event.addListener("voteCountry", "change", voteFormListener);
        blueskyminds.ui.forms.registerHandlerForForm("voteForm", voteFormHandler);
        blueskyminds.ui.commands.registerCommand(closeResultCommand);
        blueskyminds.ui.commands.init("bd");
        blueskyminds.ui.commands.init("ft");
        Event.addListener(window, 'resize', onResizeListener);
    };

    /**
     * @description initialise the list of countries available in the vote form. It's loaded from the list
     * of companies in the result form.
     */
    var initCountryList = function() {
        initCountryNames();
        var countryEl = Dom.get("voteCountry");

        if (countryEl) {
            var optionEl = document.createElement("option");
            optionEl.value = "";
            optionEl.text = "...";
            if (YAHOO.env.ua.ie) {
                countryEl.add(optionEl);
            } else {
                countryEl.add(optionEl, null);
            }
            var country;
            for (country in countryNames) {
                if (typeof countryNames[country] !== 'function') {
                    if (country !== ALL_COUNTRIES) {
                        optionEl = document.createElement("option");
                        optionEl.value = country;
                        optionEl.text = countryNames[country];

                        if (YAHOO.env.ua.ie) {
                            countryEl.add(optionEl);
                        } else {
                            countryEl.add(optionEl, null);
                        }
                    }
                }
            }
        }
    };

    var checkCookies = function() {
        var voted = YAHOO.util.Cookie.get(COOKIE_NAME);
        if (!voted) {
            // the marker node tells us we're on the home page
            if (Dom.get("marker")) {
                showVoteForm();
            }
        }
    };

    /**
     * @description Initialise the listeners on the forms and load initial results
     */
    var init = function() {
        var _errorController = new blueskyminds.ui.ErrorController("errors", "error");
        try {
            setupListeners();
            initCountryList();
            loadResults(ALL_COUNTRIES);
            checkCookies();
            layoutViewport();
        } catch (e) {
            blueskyminds.events.fire("error", "A client-side exception occurred during init. Message:" + e.message);
        }
    };

    YAHOO.util.Event.onDOMReady(init);
})();