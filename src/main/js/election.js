(function() {
    var Dom = YAHOO.util.Dom;

    var renderBar = function(barEl, ratio) {
        var MAX_PIXELS = 10;

        var filledHeight = (MAX_PIXELS * ratio) || 1;
        var emptyHeight = (MAX_PIXELS - filledHeight);

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

    /**
     * @description render the result on the current page
     */
    var renderResult = function(voteResult) {

        // check if the result already exists
        var resultEl = Dom.get(voteResult.country);
        var newResultEl;
        if (resultEl) {
            // purge the old one and reuse it
            YAHOO.util.Event.purgeElement(resultEl);
            blueskyminds.dom.clearHTML(resultEl);
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


        var resultsEl = Dom.get("results");

        newResultEl.setAttribute("id", voteResult.country);

        var democraticBar = Dom.getElementsByClassName("democraticBar", "div", newResultEl)[0];
        renderBar(democraticBar, d);

        var republicanBar = Dom.getElementsByClassName("republicanBar", "div", newResultEl)[0];
        renderBar(republicanBar, r);

        if (!resultEl) {
            // append the new element
            Dom.setStyle(newResultEl, "display", "block");
            resultsEl.appendChild(newResultEl);
        }
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

    var loadResults = function() {
        // issue the XHR request.  The containerId will be passed through the scope.
        YAHOO.util.Connect.asyncRequest('GET', "result.json", resultCallback);
    };

    YAHOO.util.Event.onDOMReady(loadResults);
})();