<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html><!-- InstanceBegin template="/Templates/defaultJSPPage.dwt" codeOutsideHTMLIsLocked="false" -->
<head>
  <!-- InstanceBeginEditable name="doctitle" -->
  <title>The US Presidential Election Poll for the Rest of the World: Server Error</title>
  <!-- InstanceEndEditable -->
  <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1"/>
  <meta name="Keywords" content="US Election">
  <meta name="Description" content="A real estate analysis tool">
  <meta name="Robots" content="Index,Follow">
  <meta name="Author" content="Blue Sky Minds Pty Ltd"/>
  <meta name="Copyright" content="Blue Sky Minds Pty Ltd"/>

  <link type="text/css" rel="stylesheet"
        href="http://yui.yahooapis.com/2.6.0/build/reset-fonts-grids/reset-fonts-grids.css">
  <link type="text/css" rel="stylesheet" href="/css/nonuselection-min.css">
  <script type="text/javascript"></script>
</head>

<body class="yui-skin-sam">
<div id="doc3">
  <div id="hd">
    <div id="errors" class="component hidden"></div>
  </div>
  <div id="bd">
    <!-- InstanceBeginEditable name="bd" -->
    <h1>Server Error</h1>

    <p>An error occured on the server while trying to process your request.</p>
    <ul>
      <li><a href="/index.html">Click here to return home</a></li>
    </ul>
    <!-- InstanceEndEditable -->
  </div>
  <div id="ft">
    <div id="voteTemplate" class="commands" style="display:none">
      <form id="voteForm" action="/poll/vote">
        <h2>Cast a vote in this poll</h2>

        <div class="formitem">
          <input id="firstVote" type="checkbox" name="firstVote" value="firstVote"/><label for="firstVote">I confirm
          this is my only vote</label>
        </div>
        <div class="formitem">
          <label for="party">My preferred US President:</label>
          <select id="party" name="party">
            <option value="">...</option>
            <option value="Democratic">Barak Obama (Democratic Party)</option>
            <option value="Republican">John McCain (Republican Party)</option>
          </select>
        </div>
        <div class="formitem">
          <label for="voteCountry">My country:</label>
          <select id="voteCountry" name="country">
          </select>
        </div>
        <input id="voteSubmit" class="command" type="submit" name="_submit" value="Count my Vote" disabled="disabled"/>
      </form>
    </div>
    <div class="right">Build a better widget > <a href="api.html" title="Get the results yourself">Voting API &amp;
      Results API</a> | <a href="disclaimer.html" title="View Disclaimer and Privacy Policy">Disclaimer and Privacy</a>
      | <a class="right" href="http://www.blueskyminds.com.au/">Blue Sky Minds</a></div>
  </div>
</div>

<script type="text/javascript"
        src="http://yui.yahooapis.com/combo?2.6.0/build/utilities/utilities.js&2.6.0/build/cookie/cookie-min.js&2.6.0/build/json/json-min.js"></script>
<script type="text/javascript" src="/js/nonuselection-min.js"></script>

</body>
<!-- InstanceEnd --></html>
