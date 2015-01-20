<?php
include 'common.php';
?>
<!DOCTYPE html>
<html lang="de">
  <!-- include the header -->
  <?php include 'header.php' ?>

 <script type="text/javascript">
    
    function goToResults(){
		var searchstring = document.getElementById('searchstring').value;
		console.log(encodeURI(searchstring));
		location.href="results.php?searchstring="+encodeURI(searchstring);
	}
	
	
   document.onkeydown = function(event) {
             if (event.keyCode == 13) {
                goToResults();
             }
   }
</script>
  
 <body>
	
	<!-- include the banner -->
	 <?php 
	  // specify the current page
	  $_SESSION['current_page'] = "home";
	  include 'banner/banner.php'; 
	 ?>
    
	<!-- specific content for the current page -->
	<div class="container-fluid" style="width:80%; padding-top: 12%; margin: 0 auto;" > 
	
	  <!-- Main hero unit for a primary marketing message or call to action -->
      <div class="hero-unit">
        <h1><?php echo $lang['STIS_HERO_HEADER']; ?></h1>
        <p><?php echo $lang['STIS_HERO_TEXT']; ?></p>
        <br>
        <p><?php echo $lang['STIS_HERO_FREE_SEARCH']; ?></p>
        <input id="searchstring" type="text" size="10" style="width: 75%" placeholder="<?php echo $lang['STIS_HERO_FREE_SEARCH_TEXT']; ?>">
		<table width="75%">
			<tr>
				<td align="center"><a class="btn btn-primary btn-large" onclick="goToResults()"><?php echo $lang['STIS_HERO_BUTTON2']; ?></a></td>
				<td align="center"><a class="btn btn-primary btn-large" href="search.php"><?php echo $lang['STIS_HERO_BUTTON1']; ?></a></td>
			</tr>
		</table>
        
      </div>
	
	  <div class="row">
        
			<div class="span4">
				<?php echo $lang['STIS_TAG_CLOUD']; ?>
			</div>
			<div class="span4">
				<?php echo $lang['STIS_ULB']; ?>

			</div>
       </div>

	
	</div>
	
	<!-- include the footer -->
	<?php include 'footer.php'; ?>  
    <!-- Le javascript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    <script src="../assets/js/jquery.js"></script>
    <script src="../assets/js/bootstrap-transition.js"></script>
    <script src="../assets/js/bootstrap-alert.js"></script>
    <script src="../assets/js/bootstrap-modal.js"></script>
    <script src="../assets/js/bootstrap-dropdown.js"></script>
    <script src="../assets/js/bootstrap-scrollspy.js"></script>
    <script src="../assets/js/bootstrap-tab.js"></script>
    <script src="../assets/js/bootstrap-tooltip.js"></script>
    <script src="../assets/js/bootstrap-popover.js"></script>
    <script src="../assets/js/bootstrap-button.js"></script>
    <script src="../assets/js/bootstrap-collapse.js"></script>
    <script src="../assets/js/bootstrap-carousel.js"></script>
    <script src="../assets/js/bootstrap-typeahead.js"></script>
    <script src="//code.jquery.com/ui/1.9.2/jquery-ui.js"></script>
    <script language="JavaScript1.2">
    $( "#searchstring" ).autocomplete(
        {
      source: function( request, response ) {
          //String.split()
          var regex = request.term.split(" ");
          var filter="";
          for(var i=0,j=regex.length; i<j; i++){
            filter+="filter regex(?c, \""+regex[i]+"\",\"i\") ";
          };
          
          var query ="prefix stis:    <http://localhost/default#> prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix gnd:     <http://d-nb.info/standards/elementset/gnd#> select distinct (?c as ?Result) where{ ?a ?b ?c . "+ filter +"} LIMIT 7";
          
        $.ajax({
          url: "http://jsonp.lodum.de/?endpoint=http://giv-stis-2012.uni-muenster.de:8080/openrdf-sesame/repositories/stis",
          dataType: "jsonp",
          beforeSend: function(xhrObj){
                 xhrObj.setRequestHeader("Accept","application/sparql-results+json");
                 console.log(query);
          },
          data: { accept : 'application/sparql-results+json' ,
                  query : query
                 },
          success: 
                function filterData( data ) {
                    response($.map(data.results.bindings, function(item) {
                        return {
                            label : item.Result.value,
                            value : item.Result.value
                        }
                    }));
                },
           error: function (request, status, error) {
                 console.log(request.responseText+ error);
                  //$("#error").html(request.responseText);
            }
        });
      },
      minLength: 2,
      delay: 200
      }
    );
  </script>

  </body>
</html>
