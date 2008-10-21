(function() {
    var Dom = YAHOO.util.Dom;
    var Event = YAHOO.util.Event;
    var COOKIE_NAME = "voted";
    var SIGNATURE = "sbwm";
    var ALL_COUNTRIES = "all"
    var countryNames;

    /** @description Render a single vertical var with one section empty and one section filled using the ratio provided */
    var renderBar = function(barEl, ratio) {
        var MAX_EMs = 10;

        var filledHeight = (MAX_EMs * ratio);
        var emptyHeight = (MAX_EMs - filledHeight);

        var percent = ratio * 100.00 + "%";

        var emptyBarEl = Dom.getElementsByClassName("empty", "div", barEl)[0];
        var filledBarEl = Dom.getElementsByClassName("filled", "div", barEl)[0];

        Dom.setStyle(emptyBarEl, "height", emptyHeight + "em");
        Dom.setStyle(filledBarEl, "height", filledHeight + "em");

        if (filledHeight > 1) {
            blueskyminds.dom.insertHTML(filledBarEl, percent);
        } else {
            blueskyminds.dom.insertHTML(emptyBarEl, percent);
        }
    }

    /** Initialise the list of countries */
    var initCountryNames = function() {
        var countryLookup = Dom.get("country");
        var option;
        countryNames = {};
        for (var i = 0; i < countryLookup.options.length; i++) {
            option = countryLookup.options[i];
            if (option.value) {
                countryNames[option.value] = option.text;
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
            result = "???"
        }
        return result;
    };

    /**
     * @description render the result on the current page
     */
    var renderResult = function(voteResult) {

        var id = voteResult.country + "_";
        // check if the result already exists
        var resultEl = Dom.get(id);
        var newResultEl;
        if (resultEl) {
            // purge the old one and reuse it
            newResultEl = resultEl;
        } else {
            var templateEl = Dom.get("resultTemplate");
            newResultEl = templateEl.cloneNode(true);
        }

        var totalVotes = voteResult.democratic + voteResult.republican;
        var d;
        var r;
        if (totalVotes > 0) {
            d = voteResult.democratic / totalVotes;
            r = voteResult.republican / totalVotes;
        } else {
            d = 0;
            r = 0;
        }

        var anotherEl = Dom.get("another");

        newResultEl.setAttribute("id", id);

        var democraticBar = Dom.getElementsByClassName("democraticBar", "div", newResultEl)[0];
        renderBar(democraticBar, d);

        var republicanBar = Dom.getElementsByClassName("republicanBar", "div", newResultEl)[0];
        renderBar(republicanBar, r);

        var countryName = lookupCountryName(voteResult.country);

        var title = Dom.getElementsByClassName("country", "h2", newResultEl)[0];
        blueskyminds.dom.insertHTML(title, countryName);

        if (!resultEl) {
            // append the new element
            Dom.setStyle(newResultEl, "display", "block");
        }
        // insert/move
        Dom.get("results").appendChild(newResultEl);
        Dom.setStyle(newResultEl, "display", "block");
    };

    var resultCallback = {
        success: function(o) {
            try {
                var voteResult = YAHOO.lang.JSON.parse(o.responseText);
                if (YAHOO.lang.isObject(voteResult)) {
                    // todo: confirm that it matches the expected interface
                    renderResult(voteResult);
                } else {
                    blueskyminds.events.fire("error", "The response from the server was invalid.");
                }
            } catch(e) {
                blueskyminds.events.fire("error", "The response from the server was invalid.  The data was not valid JSON. Message: " + e.message);
            }
        },
        failure: function(o) {
            blueskyminds.events.fire("error", "An error occurred communicating with the server: " + blueskyminds.net.errorMessage(o));
        }
    };

    var loadResults = function(country) {
        if (country) {
            YAHOO.util.Connect.asyncRequest('GET', "result/" + country + ".json", resultCallback);
        } else {
            YAHOO.util.Connect.asyncRequest('GET', "result.json", resultCallback);
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
            YAHOO.util.Cookie.set(COOKIE_NAME, true);
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
            formEl.action = "vote.json";
            Connect.setForm(formEl);
            // setup a header header for future http requests that includes the token
            Connect.initHeader("X-AuthToken", SIGNATURE, true);
            Connect.asyncRequest('POST', "vote.json", {
                success: voteCallback.success,
                failure: voteCallback.failure,
                scope: formEl.country.value
            });
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

    var setupListeners = function() {
        blueskyminds.ui.forms.registerHandlerForForm("resultForm", resultFormHandler);
        Event.addListener("firstVote", "change", voteFormListener);
        Event.addListener("party", "change", voteFormListener);
        Event.addListener("voteCountry", "change", voteFormListener);
        blueskyminds.ui.forms.registerHandlerForForm("voteForm", voteFormHandler);

        blueskyminds.ui.commands.init("bd");
        blueskyminds.ui.commands.init("ft");
    };

    /**
     * @description initialise the list of countries available in the vote form. It's loaded from the list
     * of companies in the result form.
     */
    var initCountryList = function() {
        initCountryNames();
        var countryEl = Dom.get("voteCountry");

        var optionEl = document.createElement("option");
        optionEl.value = "";
        optionEl.text = "...";

        if (YAHOO.env.ie) {
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

                    if (YAHOO.env.ie) {
                        countryEl.add(optionEl);
                    } else {
                        countryEl.add(optionEl, null);
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
        _errorController = new blueskyminds.ui.ErrorController("errors", "error");
        setupListeners();
        initCountryList();
        loadResults(ALL_COUNTRIES);
        checkCookies();
    };

    YAHOO.util.Event.onDOMReady(init);
})();